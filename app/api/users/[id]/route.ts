import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

// Handle preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: corsHeaders,
  })
}

// GET user by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db('bitradex')
    const user = await db.collection('users').findOne({ _id: new ObjectId(params.id) })

    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const sanitizedUser = {
      _id: user._id.toString(),
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      balance: user.balance || 0,
      createdAt: user.createdAt.toISOString(),
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      zipCode: user.zipCode || '',
      country: user.country || '',
      bankName: user.bankName || '',
      accountNumber: user.accountNumber || '',
      routingNumber: user.routingNumber || '',
      bitcoinAddress: user.bitcoinAddress || '',
      ethereumAddress: user.ethereumAddress || '',
      kycStatus: user.kycStatus || 'unverified',
      status: user.status || 'inactive'
    }

    return new NextResponse(JSON.stringify(sanitizedUser), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    })
  } catch (error) {
    console.error('GET Error:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
}

// PUT update user by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db('bitradex')
    const body = await req.json()

    const update = await db.collection('users').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: body }
    )

    if (update.matchedCount === 0) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    })
  } catch (error) {
    console.error('PUT Error:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
}



