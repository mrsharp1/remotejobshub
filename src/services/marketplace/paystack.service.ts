import { supabase } from '@/lib/supabase'

export interface PaystackInitResponse {
  authorization_url: string
  reference: string
  access_code: string
}

export interface PaystackVerifyResponse {
  success: boolean
  message: string
  transaction_id?: string
  new_balance?: number
}

export const paystackService = {
  /**
   * Initialize a Paystack transaction to get the redirect URL
   */
  async initializeDeposit(amount: number, callbackUrl: string): Promise<PaystackInitResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('paystack-init', {
        body: { amount, callbackUrl },
      })

      if (error) {
        throw error
      }

      if (data.error) {
        throw new Error(data.error)
      }

      return data as PaystackInitResponse
    } catch (err) {
      console.error('Error in initializeDeposit:', err)
      throw err
    }
  },

  /**
   * Verify a Paystack transaction reference after returning from checkout
   */
  async verifyDeposit(reference: string): Promise<PaystackVerifyResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('paystack-verify', {
        body: { reference },
      })

      if (error) {
        throw error
      }

      if (data.error) {
        throw new Error(data.error)
      }

      return data as PaystackVerifyResponse
    } catch (err) {
      console.error('Error in verifyDeposit:', err)
      throw err
    }
  },
}
