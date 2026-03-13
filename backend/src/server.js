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

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(limiter);

app.use('/api/employees', employeesRouter);

// health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

module.exports = app;
