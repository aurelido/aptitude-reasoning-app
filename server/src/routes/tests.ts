import { Router } from 'express';
import { tests as testStore, questions as qStore, testAttempts } from '../data';
import { authMiddleware, AuthedRequest } from '../auth';
import { v4 as uuid } from 'uuid';

export const testsRouter = Router();

// GET /tests/:testId
// Returns Test with embedded questions

testsRouter.get('/:testId', (req, res) => {
  const { testId } = req.params;
  const test = testStore.get(testId);
  if (!test) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Test not found' } });
  const qs = test.questions.map((id) => qStore.get(id)!).filter(Boolean);
  return res.json({ ...test, questions: qs });
});

// POST /tests/:testId/start
// Starts a test attempt

testsRouter.post('/:testId/start', authMiddleware, (req: AuthedRequest, res) => {
  const { testId } = req.params;
  const test = testStore.get(testId);
  if (!test) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Test not found' } });
  const id = uuid();
  const attempt = {
    id,
    testId,
    userId: req.user!.id,
    status: 'in-progress' as const,
    startedAt: new Date(),
    timeSpent: 0,
    currentQuestionIndex: 0,
    totalQuestions: test.questionCount,
    answers: [],
  };
  testAttempts.set(id, attempt as any);
  res.json(attempt);
});

// POST /tests/:testId/attempts/:attemptId/answer

testsRouter.post('/:testId/attempts/:attemptId/answer', authMiddleware, (req: AuthedRequest, res) => {
  const { attemptId } = req.params;
  const { questionId, selectedOption, timeSpent } = req.body || {};
  const attempt = testAttempts.get(attemptId);
  if (!attempt) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Attempt not found' } });
  const question = qStore.get(questionId);
  if (!question) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Question not found' } });
  const isCorrect = Array.isArray(selectedOption)
    ? selectedOption.sort().join(',') === question.correctOptionIds.sort().join(',')
    : question.correctOptionIds.includes(selectedOption);
  attempt.answers.push({
    questionId,
    selectedOption,
    isCorrect,
    timeSpent: timeSpent ?? 0,
    answeredAt: new Date(),
  } as any);
  attempt.currentQuestionIndex = Math.min(attempt.currentQuestionIndex + 1, attempt.totalQuestions - 1);
  testAttempts.set(attemptId, attempt);
  res.json({ correct: isCorrect, explanation: question.explanation });
});

// POST /tests/:testId/attempts/:attemptId/complete

testsRouter.post('/:testId/attempts/:attemptId/complete', authMiddleware, (req: AuthedRequest, res) => {
  const { attemptId, testId } = req.params;
  const attempt = testAttempts.get(attemptId);
  if (!attempt || attempt.testId !== testId) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Attempt not found' } });
  const test = testStore.get(testId)!;
  const correctAnswers = attempt.answers.filter((a) => a.isCorrect).length;
  const incorrectAnswers = attempt.answers.length - correctAnswers;
  const skippedAnswers = test.questionCount - attempt.answers.length;
  const score = Math.round((correctAnswers / test.questionCount) * 100);
  Object.assign(attempt, {
    status: 'completed' as const,
    completedAt: new Date(),
    correctAnswers,
    incorrectAnswers,
    skippedAnswers,
    score,
    isPassed: score >= test.passingScore,
  });
  testAttempts.set(attemptId, attempt);
  res.json(attempt);
});

// GET /tests/:testId/attempts/:attemptId/resume

testsRouter.get('/:testId/attempts/:attemptId/resume', authMiddleware, (req: AuthedRequest, res) => {
  const { attemptId, testId } = req.params;
  const attempt = testAttempts.get(attemptId);
  if (!attempt || attempt.testId !== testId) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Attempt not found' } });
  res.json(attempt);
});
