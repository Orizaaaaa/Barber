import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export function generateToken(payload: { id: number; email: string; name: string; role: string }): string {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN });
}

export function verifyToken(token: string): { id: number; email: string; name: string; role: string } {
  return jwt.verify(token, ENV.JWT_SECRET) as { id: number; email: string; name: string; role: string };
}
