const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'employees.db');

let db;

/**
 * Returns the SQLite database instance, creating it if necessary.
 * Initializes the schema on first call.
 * @returns {import('better-sqlite3').Database} The database instance
 */
function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initSchema(db);
  }
  return db;
}

/**
 * Creates the employees table if it does not already exist.
 * @param {import('better-sqlite3').Database} database - The database instance
 */
function initSchema(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      department TEXT NOT NULL,
      role TEXT NOT NULL,
      hire_date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

module.exports = { getDb };
