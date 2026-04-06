/**
 * Middleware — Authentication and Role-Based Access Control
 * Separated from routes for reuse and clean architecture.
 */
import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/index.ts';

/**
 * Mock authentication middleware.
 * Validates the x-user-id header and attaches the user object to req.user.
 * Rejects inactive users.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Missing x-user-id header' });
  }
  const user = UserModel.findActiveById(userId as string);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized', message: 'User not found or inactive' });
  }
  (req as any).user = user;
  next();
};

/**
 * Role-based authorization middleware factory.
 * Returns a middleware that only allows the specified roles through.
 *
 * @example authorize('Admin')
 * @example authorize('Admin', 'Analyst')
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!roles.includes(user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `This action requires one of: [${roles.join(', ')}]. Your role: ${user.role}`
      });
    }
    next();
  };
};
