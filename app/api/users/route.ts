import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: corsHeaders
  })
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('bitradex')
    const users = await db.collection('users').find({}).toArray()



    // In your GET endpoint
const sanitizedUsers = users.map(user => ({
  _id: user._id.toString(),
  firstName: user.firstName || '',
  lastName: user.lastName || '',
  email: user.email,
  balance: user.balance || 0,
  createdAt: user.createdAt.toISOString(),
  kycStatus: user.kycStatus || 'unverified'
}))

    return new NextResponse(JSON.stringify(sanitizedUsers), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    })

  } catch (error) {
    console.error('Error fetching users:', error)
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