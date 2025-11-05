import { Router } from 'express';
import { authMiddleware, AuthedRequest } from '../auth';
import { buildHomeData } from '../data';

export const homeRouter = Router();

/**
 * @openapi
 * /home:
 *   get:
 *     summary: Get complete Home Screen data
 *     tags: [Home]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: HomeScreenData
 *       401:
 *         description: Unauthorized
 */
// GET /home
homeRouter.get('/', authMiddleware, (req: AuthedRequest, res) => {
  const data = buildHomeData(req.user!.id);
  res.json(data);
});
