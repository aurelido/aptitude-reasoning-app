import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import crypto from 'crypto';

const router = Router();

const {
  KEYCLOAK_ISSUER = 'http://localhost:8080/realms/aptimind',
  KEYCLOAK_CLIENT_ID = 'aptimind-ui',
  KEYCLOAK_REDIRECT_URI = 'http://localhost:4000/oauth/callback',
  KEYCLOAK_POST_LOGOUT_REDIRECT_URI = 'http://localhost:4000/',
  TOKEN_COOKIE_NAME = 'rt',
  COOKIE_DOMAIN,
  SECURE_COOKIES = 'false',
} = process.env as Record<string, string>;

const secure = SECURE_COOKIES === 'true';

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
router.use(authLimiter);

function b64url(buf: Buffer) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function genPkce() {
  const verifier = b64url(crypto.randomBytes(64));
  const challenge = b64url(crypto.createHash('sha256').update(verifier).digest());
  return { verifier, challenge };
}

// GET /oauth/login
router.get('/login', (req, res) => {
  const { verifier, challenge } = genPkce();
  const state = b64url(crypto.randomBytes(24));
  res.cookie('pkce_v', verifier, { httpOnly: true, sameSite: 'lax', secure, maxAge: 5 * 60 * 1000, domain: COOKIE_DOMAIN });
  res.cookie('pkce_s', state, { httpOnly: true, sameSite: 'lax', secure, maxAge: 5 * 60 * 1000, domain: COOKIE_DOMAIN });

  const auth = new URL(`${KEYCLOAK_ISSUER}/protocol/openid-connect/auth`);
  auth.searchParams.set('client_id', KEYCLOAK_CLIENT_ID);
  auth.searchParams.set('response_type', 'code');
  auth.searchParams.set('redirect_uri', KEYCLOAK_REDIRECT_URI);
  auth.searchParams.set('scope', 'openid profile email offline_access');
  auth.searchParams.set('code_challenge', challenge);
  auth.searchParams.set('code_challenge_method', 'S256');
  auth.searchParams.set('state', state);
  res.redirect(auth.toString());
});

// GET /oauth/callback
router.get('/callback', async (req, res) => {
  try {
    const code = String(req.query.code || '');
    const state = String(req.query.state || '');
    const vs = req.cookies['pkce_s'];
    const verifier = req.cookies['pkce_v'];
    res.clearCookie('pkce_s');
    res.clearCookie('pkce_v');

    if (!code || !state || !verifier || state !== vs) return res.status(400).send('Invalid PKCE state');

    const tokenUrl = `${KEYCLOAK_ISSUER}/protocol/openid-connect/token`;
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: KEYCLOAK_CLIENT_ID,
      code,
      redirect_uri: KEYCLOAK_REDIRECT_URI,
      code_verifier: verifier,
    });

    const r = await axios.post(tokenUrl, body, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    const tokens = r.data as { access_token: string; refresh_token: string; id_token: string; expires_in: number };

    res.cookie(TOKEN_COOKIE_NAME, tokens.refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      domain: COOKIE_DOMAIN,
      path: '/oauth',
      maxAge: 30 * 24 * 3600_000,
    });
    res.redirect('/');
  } catch (e) {
    res.status(401).send('Token exchange failed');
  }
});

// POST /oauth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies[TOKEN_COOKIE_NAME];
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

    const tokenUrl = `${KEYCLOAK_ISSUER}/protocol/openid-connect/token`;
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: KEYCLOAK_CLIENT_ID,
      refresh_token: refreshToken,
    });

    const r = await axios.post(tokenUrl, body, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    const tokens = r.data as { access_token: string; refresh_token?: string; id_token?: string; expires_in: number };

    if (tokens.refresh_token) {
      res.cookie(TOKEN_COOKIE_NAME, tokens.refresh_token, {
        httpOnly: true, sameSite: 'lax', secure, domain: COOKIE_DOMAIN, path: '/oauth', maxAge: 30 * 24 * 3600_000,
      });
    }
    res.json({ access_token: tokens.access_token, id_token: tokens.id_token, expires_in: tokens.expires_in });
  } catch (e) {
    res.status(401).json({ error: 'Refresh failed' });
  }
});

// POST /oauth/logout
router.post('/logout', async (req, res) => {
  try {
    const refreshToken = req.cookies[TOKEN_COOKIE_NAME];
    res.clearCookie(TOKEN_COOKIE_NAME, { path: '/oauth', domain: COOKIE_DOMAIN });

    if (refreshToken) {
      const logoutUrl = `${KEYCLOAK_ISSUER}/protocol/openid-connect/logout`;
      const body = new URLSearchParams({
        client_id: KEYCLOAK_CLIENT_ID,
        refresh_token: refreshToken,
        post_logout_redirect_uri: KEYCLOAK_POST_LOGOUT_REDIRECT_URI,
      });
      await axios.post(logoutUrl, body, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).catch(() => {});
    }
    res.status(204).end();
  } catch {
    res.status(204).end();
  }
});

export default router;
