/**
 * Express server configuration.
 * Sets up middleware, routes, and error handling.
 * @module server
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import employeesRouter from './routes/employees';
import { errorHandler } from './middleware/errorHandler';

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'] }));
app.use(express.json());
app.use(limiter);

app.use('/api/employees', employeesRouter);

/** Health check endpoint. */
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

export default app;
