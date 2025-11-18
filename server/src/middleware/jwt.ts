import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { Request, Response, NextFunction } from 'express';

const ISSUER = process.env.KEYCLOAK_ISSUER || 'http://localhost:8080/realms/aptimind';
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || 'aptimind-ui';
const JWKS = createRemoteJWKSet(new URL(`${ISSUER}/protocol/openid-connect/certs`));

export async function authJwt(req: Request, res: Response, next: NextFunction) {
  try {
    const hdr = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : '';
    if (!token) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing token' } });
    const { payload } = await jwtVerify(token, JWKS, { issuer: ISSUER, audience: CLIENT_ID });
    (req as any).user = {
      sub: payload.sub,
      email: (payload as any).email,
      roles: (payload as any).realm_access?.roles ?? [],
      subscription: (payload as any).subscription,
      country: (payload as any).country,
      progressLevel: Number((payload as any).progressLevel ?? 0),
    };
    next();
  } catch {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles: string[] = (req as any).user?.roles || [];
    if (roles.some(r => userRoles.includes(r))) return next();
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Insufficient role' } });
  };
}

export function requireAttributes(pred: (attrs: { subscription?: string; country?: string; progressLevel?: number }) => boolean) {
  return (req: Request, res: Response, next: NextFunction) => {
    const u = (req as any).user || {};
    const attrs = { subscription: u.subscription, country: u.country, progressLevel: u.progressLevel };
    if (pred(attrs)) return next();
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Attribute policy failed' } });
  };
}
