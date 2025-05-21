// app/api/users/[userId]/route.ts
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('bitradex')
    const users = db.collection('users')

    // Validate user ID
    if (!ObjectId.isValid(params.userId)) {
      return new NextResponse(JSON.stringify({ error: 'Invalid user ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const updateData = await request.json()

    // Remove immutable fields and potential security risks
    const { _id, createdAt, password, ...safeUpdateData } = updateData

    // Validate update data
    if (Object.keys(safeUpdateData).length === 0) {
      return new NextResponse(JSON.stringify({ error: 'No valid update data provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Update document
    const result = await users.updateOne(
      { _id: new ObjectId(params.userId) },
      { $set: safeUpdateData }
    )

    if (result.matchedCount === 0) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new NextResponse(JSON.stringify({
      success: true,
      updatedFields: Object.keys(safeUpdateData)
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Update error:', error)
    return new NextResponse(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}



