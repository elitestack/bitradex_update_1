// lib/schemas/user.ts

  
  // Update validation if needed

  export interface User {
   _id?: string
  balance: any
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  fiatBalance: number
  cryptoAssets: {
    BTC: number
    ETH: number
    [currency: string]: number
  }
  kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected'
  createdAt: Date
  updatedAt: Date
}




  
  export function validateUserInput(data: any): { valid: boolean, message?: string } {
    if (!data.email || !data.password) {
      return { valid: false, message: 'Email and password are required' }
    }
    if (!data.firstName || !data.lastName) {
      return { valid: false, message: 'First and last name are required' }
    }
    return { valid: true }
  }
  