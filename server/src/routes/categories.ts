import { Router } from 'express';
import { categories as catStore, topics as topicStore } from '../data';

export const categoriesRouter = Router();

// GET /categories
categoriesRouter.get('/', (req, res) => {
  const { includeProgress, featured, active } = req.query as Record<string, string>;
  let list = Array.from(catStore.values());
  if (featured === 'true') list = list.filter((c) => c.isFeatured);
  if (active === 'true') list = list.filter((c) => c.isActive);

  if (includeProgress === 'true') {
    const data = list.map((c) => ({
      category: c,
      completedTopics: 0,
      totalTopics: c.topicCount,
      progressPercentage: 0,
      averageScore: 0,
      lastAccessedAt: undefined,
      isWeakArea: false,
      isStrength: false,
    }));
    return res.json(data);
  }
  res.json(list);
});

// GET /categories/:slug
categoriesRouter.get('/:slug', (req, res) => {
  const { slug } = req.params;
  const category = Array.from(catStore.values()).find((c) => c.slug === slug);
  if (!category) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Category not found' } });
  const { includeProgress } = req.query as Record<string, string>;
  if (includeProgress === 'true') {
    return res.json({
      category,
      completedTopics: 0,
      totalTopics: category.topicCount,
      progressPercentage: 0,
      averageScore: 0,
      lastAccessedAt: undefined,
      isWeakArea: false,
      isStrength: false,
    });
  }
  res.json(category);
});

// GET /categories/:slug/topics
categoriesRouter.get('/:slug/topics', (req, res) => {
  const { slug } = req.params;
  const { includeProgress, difficulty, featured, new: isNew } = req.query as any;
  const category = Array.from(catStore.values()).find((c) => c.slug === slug);
  if (!category) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Category not found' } });
  let list = category.topics.map((id) => topicStore.get(id)!).filter(Boolean);
  if (difficulty) list = list.filter((t) => t.difficulty === difficulty);
  if (featured === 'true') list = list.filter((t) => t.isFeatured);
  if (isNew === 'true') list = list.filter((t) => t.isNew);

  if (includeProgress === 'true') {
    const data = list.map((t) => ({
      topic: t,
      status: 'not-started',
      progress: 0,
      completedTests: 0,
      totalTests: t.testCount,
      averageScore: 0,
      bestScore: 0,
      attemptsCount: 0,
      startedAt: undefined,
      completedAt: undefined,
      lastAccessedAt: undefined,
      timeSpent: 0,
      isRecommended: false,
      recommendationReason: undefined,
    }));
    return res.json(data);
  }
  res.json(list);
});
