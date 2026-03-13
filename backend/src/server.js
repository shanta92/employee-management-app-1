const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const employeesRouter = require('./routes/employees');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'] }));
app.use(express.json());
app.use(limiter);

app.use('/api/employees', employeesRouter);

/**
 * Health check endpoint.
 * @returns {{ status: string }} JSON object with status 'ok'
 */
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

module.exports = app;
