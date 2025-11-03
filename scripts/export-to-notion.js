#!/usr/bin/env node

/*
  Manual export of ADRs to Notion with upsert and missing-parts fill.
  Requirements:
  - env NOTION_TOKEN
  - Notion Database with properties defined in docs/notion/SCHEMA.md
*/

const { Client } = require('@notionhq/client');
const fg = require('fast-glob');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const DEFAULT_CONFIG = {
  sourceGlobs: [
    'docs/adr/**/*.md',
    'docs/adrs/**/*.md',
    'docs/decisions/**/*.md',
    'docs/ADR/**/*.md',
    'docs/**/*.adr.md'
  ],
  // Fallback when no ADR directory exists
  fallbackGlobs: ['docs/**/*.md']
};

function getArg(flag, fallback = undefined) {
  const idx = process.argv.findIndex(a => a === flag || a.startsWith(`${flag}=`));
  if (idx === -1) return fallback;
  const val = process.argv[idx];
  if (val.includes('=')) return val.split('=').slice(1).join('=');
  return process.argv[idx + 1] ?? true;
}

function hasFlag(flag) {
  return process.argv.includes(flag) || process.argv.some(a => a.startsWith(`${flag}=`));
}

function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

async function readConfig() {
  const configPath = path.resolve(process.cwd(), 'scripts/notion-export.config.json');
  try {
    const raw = await fs.readFile(configPath, 'utf8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_CONFIG;
  }
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function classifyChange(text) {
  const t = text.toLowerCase();
  const breaking = /(breaking\s+change|backward[-\s]?incompat|deprecat(e|ion)|remove|rename\s+api|schema\s+change|contract\s+change)/;
  const feature = /(feature|add|introduce|implement|support|enable|new\s+capability|enhancement)/;
  if (breaking.test(t)) return 'Breaking Change';
  if (feature.test(t)) return 'Feature';
  return 'Other';
}

function extractSection(md, heading) {
  const re = new RegExp(`^##\\s+${heading}\\s*$([\n\r]+)([\s\S]*?)(?=^##\\s+|\n\r?$)`, 'im');
  const m = md.match(re);
  return m ? m[2].trim() : '';
}

function parseADR(markdown, filePath) {
  const lines = markdown.split(/\r?\n/);
  // Title
  let title = lines.find(l => /^#\s+/.test(l));
  title = title ? title.replace(/^#\s+/, '').trim() : path.basename(filePath, path.extname(filePath));

  // Status, Date, Tags (simple regex against entire doc)
  const statusMatch = markdown.match(/^Status:\s*(.+)$/im);
  const dateMatch = markdown.match(/^Date:\s*(.+)$/im);
  const tagsMatch = markdown.match(/^Tags?:\s*(.+)$/im);

  const decision = extractSection(markdown, 'Decision');
  const context = extractSection(markdown, 'Context');
  const summarySection = extractSection(markdown, 'Summary');

  // ADR ID from filename or H1
  const base = path.basename(filePath);
  let adrId = null;
  const idFromFile = base.match(/(ADR[-_\s]?(\d{1,4}))/i);
  if (idFromFile) adrId = idFromFile[1].toUpperCase().replace(/\s+/g, '-');
  if (!adrId) {
    const idFromTitle = title.match(/(ADR[-_\s]?(\d{1,4}))/i);
    if (idFromTitle) adrId = idFromTitle[1].toUpperCase().replace(/\s+/g, '-');
  }
  if (!adrId) adrId = `ADR-${slugify(title).slice(0, 32)}`;

  // Summary: prefer Summary section, else first sentence of Decision, else Context
  let summary = summarySection || '';
  if (!summary) {
    const src = decision || context || '';
    const firstPara = src.split(/\n\n+/)[0] || '';
    const firstSent = firstPara.split(/(?<=[.!?])\s+/)[0] || firstPara;
    summary = firstSent.trim();
  }

  const combined = [title, decision, context, summary].filter(Boolean).join('\n\n');
  const changeType = classifyChange(combined);

  const status = statusMatch ? statusMatch[1].trim() : undefined;
  const date = dateMatch ? dateMatch[1].trim() : undefined;
  const tags = tagsMatch ? tagsMatch[1].split(',').map(s => s.trim()).filter(Boolean) : [];

  return {
    title,
    adrId,
    status,
    date,
    tags,
    decision,
    context,
    summary,
    changeType,
    filePath
  };
}

function mdToNotionBlocks(markdown) {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  for (const line of lines) {
    if (/^###\s+/.test(line)) {
      blocks.push({ type: 'heading_3', heading_3: { rich_text: [{ type: 'text', text: { content: line.replace(/^###\s+/, '') } }] } });
    } else if (/^##\s+/.test(line)) {
      blocks.push({ type: 'heading_2', heading_2: { rich_text: [{ type: 'text', text: { content: line.replace(/^##\s+/, '') } }] } });
    } else if (/^#\s+/.test(line)) {
      blocks.push({ type: 'heading_1', heading_1: { rich_text: [{ type: 'text', text: { content: line.replace(/^#\s+/, '') } }] } });
    } else if (/^[-*]\s+/.test(line)) {
      blocks.push({ type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: line.replace(/^[-*]\s+/, '') } }] } });
    } else if (line.trim() === '') {
      // empty line -> paragraph separator; Notion doesn't need explicit empty blocks
    } else {
      blocks.push({ type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: line } }] } });
    }
  }
  return blocks;
}

async function ensureReplaceChildren(notion, pageId, blocks) {
  // Fetch existing children and archive them
  const existing = [];
  let cursor = undefined;
  do {
    const resp = await notion.blocks.children.list({ block_id: pageId, start_cursor: cursor, page_size: 100 });
    existing.push(...resp.results);
    cursor = resp.has_more ? resp.next_cursor : undefined;
  } while (cursor);

  // Archive existing blocks
  for (const b of existing) {
    await notion.blocks.update({ block_id: b.id, archived: true }).catch(() => {});
  }

  // Append new blocks
  if (blocks.length) {
    // Notion limits 100 blocks per request
    for (let i = 0; i < blocks.length; i += 100) {
      await notion.blocks.children.append({ block_id: pageId, children: blocks.slice(i, i + 100) });
    }
  }
}

function buildProperties(adr, contentHash, fillOnly = false) {
  const props = {};
  const maybe = (cond, key, val) => { if (!fillOnly || cond) props[key] = val; };

  // Name (Title)
  maybe(true, 'Name', { title: [{ type: 'text', text: { content: adr.title } }] });
  // ADR ID
  if (!fillOnly || adr.adrId) props['ADR ID'] = { rich_text: [{ type: 'text', text: { content: adr.adrId } }] };
  // Summary
  if (adr.summary) maybe(true, 'Summary', { rich_text: [{ type: 'text', text: { content: adr.summary } }] });
  // Type
  if (adr.changeType) maybe(true, 'Type', { select: { name: adr.changeType } });
  // Status
  if (adr.status) maybe(true, 'Status', { select: { name: adr.status } });
  // Date
  if (adr.date) maybe(true, 'Date', { date: { start: adr.date } });
  // Tags
  if (adr.tags && adr.tags.length) maybe(true, 'Tags', { multi_select: adr.tags.map(name => ({ name })) });
  // File Path
  maybe(true, 'File Path', { rich_text: [{ type: 'text', text: { content: adr.filePath } }] });
  // Content Hash
  maybe(true, 'Content Hash', { rich_text: [{ type: 'text', text: { content: contentHash } }] });
  return props;
}

async function findExistingPage(notion, database_id, adrId) {
  const resp = await notion.databases.query({
    database_id,
    filter: {
      property: 'ADR ID',
      rich_text: { equals: adrId }
    },
    page_size: 1
  });
  return resp.results[0];
}

function getPropertyText(page, name) {
  const p = page.properties?.[name];
  if (!p) return undefined;
  if (p.type === 'rich_text') return p.rich_text?.map(r => r.plain_text).join('') || '';
  if (p.type === 'title') return p.title?.map(r => r.plain_text).join('') || '';
  return undefined;
}

async function upsertADR(notion, databaseId, adr, markdown, opts) {
  const contentHash = sha256(markdown);
  const fillOnly = opts.fillOnly;
  const dryRun = opts.dryRun;
  const blocks = mdToNotionBlocks(`# ${adr.title}\n\n` + markdown);
  const existing = await findExistingPage(notion, databaseId, adr.adrId);

  if (existing) {
    const prevHash = getPropertyText(existing, 'Content Hash');
    const needsUpdate = prevHash !== contentHash || fillOnly;
    if (!needsUpdate) {
      return { action: 'skip', pageId: existing.id };
    }
    if (dryRun) return { action: 'update (dry-run)', pageId: existing.id };

    // Update properties
    await notion.pages.update({ page_id: existing.id, properties: buildProperties(adr, contentHash, fillOnly) });

    if (!fillOnly) {
      await ensureReplaceChildren(notion, existing.id, blocks);
    }
    return { action: fillOnly ? 'fill' : 'update', pageId: existing.id };
  } else {
    if (dryRun) return { action: 'create (dry-run)' };
    const created = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: buildProperties(adr, contentHash, false),
      children: blocks
    });
    return { action: 'create', pageId: created.id };
  }
}

async function main() {
  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const databaseId = getArg('--database') || process.env.NOTION_DATABASE_ID;
  const dryRun = hasFlag('--dry-run');
  const fillOnly = hasFlag('--fill');
  const root = getArg('--root') || process.cwd();

  if (!NOTION_TOKEN) {
    console.error('ERROR: NOTION_TOKEN env var is required.');
    process.exit(1);
  }
  if (!databaseId) {
    console.error('ERROR: --database or NOTION_DATABASE_ID is required.');
    process.exit(1);
  }

  const notion = new Client({ auth: NOTION_TOKEN });
  const cfg = await readConfig();

  // Resolve glob list
  let patterns = cfg.sourceGlobs;
  let entries = await fg(patterns, { cwd: root, dot: false, absolute: false });
  if (!entries.length) {
    entries = await fg(cfg.fallbackGlobs, { cwd: root, dot: false, absolute: false });
    // Filter to files that look like ADRs by heading keywords
    const filtered = [];
    for (const rel of entries) {
      const full = path.join(root, rel);
      const txt = await fs.readFile(full, 'utf8');
      if (/\b(ADR|Architecture Decision Record)\b/i.test(txt) || /(^|\n)#\s*ADR\b/i.test(txt)) {
        filtered.push(rel);
      }
    }
    entries = filtered;
  }

  if (!entries.length) {
    console.log('No ADR markdown files found. Adjust scripts/notion-export.config.json sourceGlobs.');
    process.exit(0);
  }

  const results = [];
  for (const rel of entries) {
    const full = path.join(root, rel);
    const md = await fs.readFile(full, 'utf8');
    const adr = parseADR(md, rel);
    const res = await upsertADR(notion, databaseId, adr, md, { dryRun, fillOnly });
    results.push({ file: rel, ...res, adrId: adr.adrId });
  }

  // Summary output
  for (const r of results) {
    if (r.pageId) {
      console.log(`${r.action}\t${r.adrId}\t${r.file}\tpage=${r.pageId}`);
    } else {
      console.log(`${r.action}\t${r.adrId}\t${r.file}`);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});