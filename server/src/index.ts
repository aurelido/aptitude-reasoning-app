import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { authRouter } from './routes/auth';
import { usersRouter } from './routes/users';
import { categoriesRouter } from './routes/categories';
import { topicsRouter } from './routes/topics';
import { testsRouter } from './routes/tests';
import { homeRouter } from './routes/home';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health
app.get('/health', (_req, res) => res.json({ ok: true }));

// Versioned API base
const api = express.Router();
app.use('/v1', api);

// Swagger (dev only)
if (process.env.NODE_ENV !== 'production') {
  const swaggerSpec = swaggerJSDoc({
    definition: {
      openapi: '3.1.0',
      info: {
        title: 'Aptitude Reasoning API',
        version: '1.0.0',
      },
      servers: [
        { url: 'http://localhost:' + (process.env.PORT || 4000) + '/v1' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    apis: ['server/src/routes/*.ts'],
  });
  api.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Routes
api.use('/auth', authRouter);
api.use('/users', usersRouter);
api.use('/categories', categoriesRouter);
api.use('/topics', topicsRouter);
api.use('/tests', testsRouter);
api.use('/home', homeRouter);

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: {
      code: err.code || (status === 400 ? 'VALIDATION_ERROR' : status === 401 ? 'UNAUTHORIZED' : 'INTERNAL_ERROR'),
      message: err.message || 'Server error',
      details: err.details || undefined,
    },
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}/v1`);
});
