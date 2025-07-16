import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error('JWT_SECRET not set');

export function createToken(userId: string) {
  // 7‑day expiry keeps demo simple
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
}
