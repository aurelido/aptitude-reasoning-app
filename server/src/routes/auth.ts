import { Router } from 'express';
import { signToken, hashPassword, comparePassword } from '../auth';
import { users, profiles } from '../data';
import { v4 as uuid } from 'uuid';

export const authRouter = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, firstName, lastName]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *     responses:
 *       200:
 *         description: Registered
 *       409:
 *         description: Email already registered
 */
authRouter.post('/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body || {};
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Missing fields' } });
  }
  const exists = Array.from(users.values()).find((u) => u.email === email);
  if (exists) return res.status(409).json({ error: { code: 'CONFLICT', message: 'Email already registered' } });

  const id = uuid();
  const now = new Date();
  const passwordHash = await hashPassword(password);
  const user = {
    id,
    email,
    passwordHash,
    firstName,
    lastName,
    status: 'active' as const,
    emailVerified: false,
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      dailyChallengeReminder: true,
      defaultDifficulty: 'beginner',
      practiceMode: 'timed',
      theme: 'auto',
      language: 'en',
    },
    createdAt: now,
    updatedAt: now,
  };
  users.set(id, user as any);
  profiles.set(id, {
    id,
    email,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    initials: `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase(),
    totalTopicsStarted: 0,
    totalTopicsCompleted: 0,
    totalTestsCompleted: 0,
    totalQuestionsAnswered: 0,
    averageScore: 0,
    currentStreak: 0,
    longestStreak: 0,
    memberSince: now,
    lastActive: now,
  });

  const token = signToken({ id });
  return res.json({ user: profiles.get(id), token });
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login and get JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Authenticated
 *       401:
 *         description: Invalid credentials
 */
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const user = Array.from(users.values()).find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
  const token = signToken({ id: user.id });
  return res.json({ user: profiles.get(user.id), token });
});
