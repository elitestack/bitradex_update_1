// app/api/register/route.ts
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import { validateUserInput, User } from '@/lib/schemas/user'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
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
    const users = db.collection<User>('users')

    const data = await request.json()

    const { valid, message } = validateUserInput(data)
    if (!valid) {
      return new NextResponse(
        JSON.stringify({ error: message }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    // Check if user exists
    const existingUser = await users.findOne({ email: data.email })
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ error: 'User already exists' }),
        {
          status: 409,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)

  
    const newUser: User = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        fiatBalance: 100.00,
        cryptoAssets: {
            BTC: 5.000,
            ETH: 10.000
        },
        kycStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        balance: 1000
    }

    const result = await users.insertOne(newUser)

    return new NextResponse(JSON.stringify({
      success: true,
      userId: result.insertedId,
      balance: newUser.balance
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
}
