# Notion Database Schema for ADR Export

Create a Notion database with the following properties. Use this database ID with the exporter.

Required properties (names must match exactly):
- Name (Title)
- ADR ID (Text)
- Summary (Text)
- Type (Select: Feature, Breaking Change, Other)
- Status (Select: Proposed, Accepted, Rejected, Deprecated, Superseded)
- Date (Date)
- Tags (Multi-select)
- File Path (Text)
- Content Hash (Text)

Recommended database view: Table, group by Type, sort by Date desc.

Run locally:

1) Add a Notion integration and share the database with it.
2) Export NOTION_TOKEN and NOTION_DATABASE_ID as env vars.
3) Execute the exporter.

Example:

- macOS/Linux
  export NOTION_TOKEN={{NOTION_TOKEN}}
  export NOTION_DATABASE_ID={{NOTION_DATABASE_ID}}
  npm run docs:export:notion -- --dry-run
  npm run docs:export:notion

Flags:
- --dry-run    Do not write to Notion; just show actions.
- --fill       Update only missing properties; keep existing page content.
- --database   Override NOTION_DATABASE_ID.
- --root       Project root override (defaults to current working directory).

Source discovery:
- Looks for ADR markdown in: docs/adr/**, docs/adrs/**, docs/decisions/**, docs/ADR/**, *.adr.md.
- If none found, scans docs/**/*.md for files containing "ADR" or "Architecture Decision Record".

Content rules:
- Summary: Summary section if present; else first sentence of Decision; else first paragraph of Context.
- Type: Auto-classified as Feature, Breaking Change, or Other via simple keyword heuristics.
- Upsert: Pages are matched by ADR ID. If Content Hash changed, page blocks are replaced; otherwise skipped. With --fill, only missing properties are (re)populated.