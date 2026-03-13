/**
 * Application entry point.
 * Initializes the database and starts the Express server.
 * @module index
 */

import app from './server';
import { initDb } from './db';

const PORT = process.env.PORT || 3001;

initDb();

app.listen(PORT, () => {
  console.log(`Employee Management API running on http://localhost:${PORT}`);
});
