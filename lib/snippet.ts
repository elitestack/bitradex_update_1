// // app/api/user/route.ts
// import { NextResponse } from 'next/server'
// import { getSessionUser } from '@/lib/session'
// import clientPromise from '@/lib/mongodb'

// export async function GET(request: Request) {
//   const session = await getSessionUser(request)
//   if (!session) {
//     return new NextResponse(
//       JSON.stringify({ error: 'Unauthorized' }),
//       { status: 401 }
//     )
//   }

//   const client = await clientPromise
//   const db = client.db('bitradex')
//   const user = await db.collection('users').findOne(
//     { email: session.email },
//     { projection: { email: 1, balance: 1 } }
//   )

//   if (!user) {
//     return new NextResponse(
//       JSON.stringify({ error: 'User not found' }),
//       { status: 404 }
//     )
//   }

//   return new NextResponse(JSON.stringify({
//     email: user.email,
//     balance: user.balance
//   }))
// }