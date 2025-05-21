// app/api/login/route.ts
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import { generateToken } from '@/lib/auth'

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: corsHeaders
  })
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('bitradex')
    const users = db.collection('users')

    const data = await request.json()

    // Validate input
    if (!data.email || !data.password) {
      return new NextResponse(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Find user
    const user = await users.findOne({ email: data.email })
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401, headers: corsHeaders }
      )
    }

    // Compare passwords
    const passwordValid = await bcrypt.compare(data.password, user.password)
    if (!passwordValid) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401, headers: corsHeaders }
      )
    }

    // Generate JWT
    const token = generateToken(user.email)

    // Create response with cookie
    const response = new NextResponse(
      JSON.stringify({ 
        success: true, 
        email: user.email,
        requires2FA: user.email === 'admin@bitradex.com' // Example 2FA logic
      }),
      { status: 200, headers: corsHeaders }
    )

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 2629824, // 1 hour
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    )
  }
}