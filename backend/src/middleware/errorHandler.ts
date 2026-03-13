/**
 * Global error handling middleware for Express.
 * @module middleware/errorHandler
 */

import { Request, Response, NextFunction } from 'express';

/** Error with an optional HTTP status code. */
interface HttpError extends Error {
  status?: number;
}

/**
 * Express error-handling middleware.
 * Converts errors to a consistent JSON response format.
 *
 * @param err - The error that occurred
 * @param _req - The Express request object
 * @param res - The Express response object
 * @param _next - The next middleware function
 */
export function errorHandler(
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;

  if (status === 500) {
    console.error('Unhandled error:', err);
  }

  res.status(status).json({ error: message });
}
