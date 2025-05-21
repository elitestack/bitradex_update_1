import { User } from "./user"

export interface Transaction {
  _id?: string
  userId: string | User
  type: 'withdrawal' | 'deposit' | 'buy' | 'sell'
  method: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  networkFee?: number
  processingFee?: number
  walletAddress?: string
  bankDetails?: {
    bankName?: string
    accountName?: string
    accountNumber?: string
    routingNumber?: string
  }
  createdAt: Date
  updatedAt: Date
}

export const validateWithdrawal = (data: any) => {
  if (!data.amount || Number(data.amount) <= 0) return { valid: false, message: 'Invalid amount' }
  if (!data.method) return { valid: false, message: 'Method is required' }
  return { valid: true }
}