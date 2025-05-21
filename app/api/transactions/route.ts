import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import clientPromise from '@/lib/mongodb'
import { Transaction, validateWithdrawal } from '@/lib/schemas/transaction'
import { ObjectId } from 'mongodb'
import { User } from '@/lib/schemas/user'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders })
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req)
    if (!session?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      )
    }

    const client = await clientPromise
    const db = client.db('bitradex')

    const user = await db.collection<User>('users').findOne({ email: session.email })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    const transactions = await db.collection<Transaction>('transactions')
      .find({ 
        userId: user._id,
        type: 'withdrawal'
      })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(transactions, { headers: corsHeaders })

  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req)
    if (!session?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      )
    }

    const data = await req.json()
    const { valid, message } = validateWithdrawal(data)
    if (!valid) {
      return NextResponse.json(
        { error: message },
        { status: 400, headers: corsHeaders }
      )
    }

    const client = await clientPromise
    const db = client.db('bitradex')
    const users = db.collection<User>('users')
    const transactions = db.collection<Transaction>('transactions')

    const user = await users.findOne({ email: session.email })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    const sessionClient = client.startSession()
    try {
      let result: any
      
      await sessionClient.withTransaction(async () => {
        const totalAmount = data.amount + (data.networkFee || data.processingFee || 0)
        
        if (user.balance < totalAmount) {
          throw new Error('Insufficient balance')
        }

        result = await transactions.insertOne({
          userId: user._id,
          type: 'withdrawal',
          method: data.method,
          amount: data.amount,
          currency: 'USD',
          status: 'pending',
          networkFee: data.networkFee,
          processingFee: data.processingFee,
          walletAddress: data.walletAddress,
          bankDetails: data.bankDetails,
          createdAt: new Date(),
          updatedAt: new Date()
        })

        await users.updateOne(
          { _id: user._id },
          { $inc: { balance: -totalAmount } }
        )
      })

      return NextResponse.json(
        { success: true, transactionId: result.insertedId },
        { headers: corsHeaders }
      )

    } catch (error: any) {
      console.error('Transaction error:', error)
      return NextResponse.json(
        { error: error.message || 'Transaction failed' },
        { status: 400, headers: corsHeaders }
      )
    } finally {
      await sessionClient.endSession()
    }

  } catch (error: any) {
    console.error('Withdrawal error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}