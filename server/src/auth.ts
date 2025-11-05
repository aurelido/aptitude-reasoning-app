import { sign, verify, type JwtPayload, type Secret, type SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { users } from './data';

const JWT_SECRET: Secret = (process.env.JWT_SECRET as string) || 'dev_secret_change_me';
const JWT_EXPIRES_IN: SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN as any) || '7d';

export function signToken(payload: object) {
  return sign(payload as object, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export interface AuthedRequest extends Request {
  user?: { id: string };
}

export function authMiddleware(req: AuthedRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing token' } });
  }
  const token = auth.slice('Bearer '.length);
  try {
    const decoded = verify(token, JWT_SECRET) as JwtPayload;
    const id = (decoded as any).id;
    if (!id || !users.has(id)) throw new Error('Invalid token');
    req.user = { id };
    next();
  } catch (e) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } });
  }
}
