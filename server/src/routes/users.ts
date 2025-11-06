import { Router } from 'express';
import { authMiddleware, AuthedRequest } from '../auth';
import { profiles, users } from '../data';

export const usersRouter = Router();

usersRouter.get('/me', authMiddleware, (req: AuthedRequest, res) => {
  const profile = profiles.get(req.user!.id);
  if (!profile) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
  return res.json(profile);
});

usersRouter.patch('/me', authMiddleware, (req: AuthedRequest, res) => {
  const id = req.user!.id;
  const profile = profiles.get(id);
  const user = users.get(id);
  if (!profile || !user) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
  const { firstName, lastName, displayName, avatar } = req.body || {};
  if (firstName) {
    profile.firstName = firstName;
    user.firstName = firstName;
  }
  if (lastName) {
    profile.lastName = lastName;
    user.lastName = lastName;
  }
  if (displayName !== undefined) user.displayName = displayName;
  if (avatar !== undefined) profile.avatar = avatar;
  profile.name = `${profile.firstName} ${profile.lastName}`;
  profiles.set(id, profile);
  users.set(id, user);
  res.json(profile);
});

usersRouter.get('/me/preferences', authMiddleware, (req: AuthedRequest, res) => {
  const user = users.get(req.user!.id);
  if (!user) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
  res.json(user.preferences);
});

usersRouter.patch('/me/preferences', authMiddleware, (req: AuthedRequest, res) => {
  const user = users.get(req.user!.id);
  if (!user) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
  user.preferences = { ...user.preferences, ...(req.body || {}) };
  user.updatedAt = new Date();
  users.set(user.id, user);
  res.json(user.preferences);
});
