import { Router } from 'express';
import { topics as topicStore, tests as testStore, questions as questionStore } from '../data';

export const topicsRouter = Router();

// GET /topics/:slug
topicsRouter.get('/:slug', (req, res) => {
  const { slug } = req.params;
  const { includeProgress } = req.query as Record<string, string>;
  const topic = Array.from(topicStore.values()).find((t) => t.slug === slug);
  if (!topic) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Topic not found' } });
  if (includeProgress === 'true') {
    return res.json({
      topic,
      status: 'not-started',
      progress: 0,
      completedTests: 0,
      totalTests: topic.testCount,
      averageScore: 0,
      bestScore: 0,
      attemptsCount: 0,
      startedAt: undefined,
      completedAt: undefined,
      lastAccessedAt: undefined,
      timeSpent: 0,
      isRecommended: false,
      recommendationReason: undefined,
    });
  }
  res.json(topic);
});

// GET /topics/:slug/tests
topicsRouter.get('/:slug/tests', (req, res) => {
  const { slug } = req.params;
  const { type, difficulty } = req.query as Record<string, string>;
  const topic = Array.from(topicStore.values()).find((t) => t.slug === slug);
  if (!topic) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Topic not found' } });
  let list = topic.tests.map((id) => testStore.get(id)!).filter(Boolean);
  if (type) list = list.filter((t) => t.type === type);
  if (difficulty) list = list.filter((t) => t.difficulty === difficulty);
  res.json(list);
});
