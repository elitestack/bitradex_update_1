// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  const session = await getSessionUser(request)
  if (!session) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    )
  }

  const client = await clientPromise
  const db = client.db('bitradex')
  const user = await db.collection('users').findOne(
    { email: session.email }
  )

  if (!user) {
    return new NextResponse(
      JSON.stringify({ error: 'User not found' }),
      { status: 404 }
    )
  }

  return new NextResponse(JSON.stringify({
    email: user.email,
    balance: user.balance,
    firstName: user.firstName,
  lastName: user.lastName,
  password: user.password,
  phone: user.phone,
  address: user.address,
  city: user.city,
  state : user.state,
  zipCode : user.zipCode, 
  country : user.country
  }))
}