import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';

// Secure cryptographic default JWT signing key with environment fallback
const JWT_SECRET =
  process.env.JWT_SECRET ||
  'jwt-portfolio-secret-key-9f8a42b1e7c5d3a6-prod-ready-2026';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  admin?: AdminUser;
}

/**
 * Generate a signed JWT token valid for 7 days
 */
export function generateToken(user: AdminUser): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      iss: 'portfolio-api',
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role || 'superadmin',
    };
  } catch {
    return null;
  }
}

/**
 * Hash password securely with bcrypt salt rounds
 */
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

/**
 * Compare plain text password against bcrypt hash
 */
export async function comparePassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

/**
 * Middleware: Enforce JWT Bearer token authentication on protected endpoints
 */
export function requireAdminAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized: Missing or malformed JWT Bearer token in Authorization header',
    });
  }

  const token = authHeader.substring(7).trim();
  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized: Invalid or expired JWT token. Please sign in again.',
    });
  }

  req.admin = user;
  next();
}

