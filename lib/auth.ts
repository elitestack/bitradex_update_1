// lib/auth.ts
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function generateToken(email: string): string {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' })
}

export function verifyToken(token: string): { email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { email: string }
  } catch (error) {
    return null
  }
}