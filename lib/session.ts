// lib/session.ts
import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function getSessionUser(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  if (!token) return null

  const decoded = verifyToken(token)
  if (!decoded) return null

  return { email: decoded.email }
}