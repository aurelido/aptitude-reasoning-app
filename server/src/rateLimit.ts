import rateLimit from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';
import type { AuthedRequest } from './auth';

// One-hour window
const windowMs = 60 * 60 * 1000;

export const authedLimiter = rateLimit({
  windowMs,
  max: (req: Request) => {
    // TODO: adjust per user tier (premium vs free). Default: 100 req/hour
    return 100;
  },
  standardHeaders: true,  // adds RateLimit-* headers
  legacyHeaders: true,    // adds X-RateLimit-* headers
  keyGenerator: (req: Request): string => {
    const r = req as AuthedRequest;
    return r.user?.id || req.ip;
  },
  handler: (_req, res) => {
    return res.status(429).json({
      error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' },
    });
  },
});

export function setRateLimitResetHeader(req: Request, res: Response, next: NextFunction) {
  const rl = (req as any).rateLimit;
  if (rl?.resetTime instanceof Date) {
    res.setHeader('X-RateLimit-Reset', Math.floor(rl.resetTime.getTime() / 1000).toString());
  }
  next();
}
