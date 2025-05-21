import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import clientPromise from '@/lib/mongodb'
import { validateUserInput } from '@/lib/schemas/user'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders })
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSessionUser(request)
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: corsHeaders }
      )
    }

    const data = await request.json()
    console.log(data);
    const { valid, message } = validateUserInput(data)
    // if (!valid) {
    //   return new NextResponse(
    //     JSON.stringify({ error: message }),
    //     { status: 400, headers: corsHeaders }
    //   )
    // }

    const client = await clientPromise
    const db = client.db('bitradex')
    
    const updateResult = await db.collection('users').updateOne(
      { email: session.email },
      {
        $set: {
          ...data,
          updatedAt: new Date()
        }
      }
    )

    if (updateResult.matchedCount === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: corsHeaders }
      )
    }

    return new NextResponse(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    )

  } catch (error) {
    console.error('Update error:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    )
  }
}