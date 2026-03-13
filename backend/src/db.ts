/**
 * Database initialization and access module.
 * Uses better-sqlite3 for synchronous SQLite operations with parameterized queries.
 * @module db
 */

import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

/**
 * Initializes the SQLite database and creates the employees table if it doesn't exist.
 * Uses WAL mode for better concurrent read performance.
 *
 * @param dbPath - Optional path to the database file. Defaults to employees.db in the project root.
 * @returns The initialized database instance
 *
 * @example
 * ```typescript
 * const db = initDb();
 * const db = initDb(':memory:'); // for testing
 * ```
 */
export function initDb(dbPath?: string): Database.Database {
  const resolvedPath = dbPath || path.join(__dirname, '..', 'employees.db');
  db = new Database(resolvedPath);
  db.pragma('journal_mode = WAL');

  db.exec(`
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

  return db;
}

/**
 * Returns the current database instance.
 * Throws an error if the database has not been initialized.
 *
 * @returns The database instance
 * @throws Error if database is not initialized
 */
export function getDb(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}

/**
 * Closes the database connection.
 * Safe to call even if the database is not initialized.
 */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
