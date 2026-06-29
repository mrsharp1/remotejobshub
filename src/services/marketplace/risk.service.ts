import { supabase } from '@/lib/supabase'
import {
  FraudFlag,
  RiskScore,
  LoginHistory,
  SuspiciousActivity,
  BlockedDevice,
} from '@/types'

export const riskService = {
  async getRiskScores(): Promise<RiskScore[]> {
    try {
      const { data, error } = await supabase
        .from('risk_scores')
        .select('*, profile:user_id(*)')
        .order('score', { ascending: false })

      if (error) throw error
      return (data || []) as RiskScore[]
    } catch (err) {
      console.error('Error fetching risk scores:', err)
      return []
    }
  },

  async getFraudFlags(): Promise<FraudFlag[]> {
    try {
      const { data, error } = await supabase
        .from('fraud_flags')
        .select('*, profile:user_id(*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as FraudFlag[]
    } catch (err) {
      console.error('Error fetching fraud flags:', err)
      return []
    }
  },

  async getLoginHistory(userId?: string): Promise<LoginHistory[]> {
    try {
      let query = supabase.from('login_history').select('*, profile:user_id(*)')
      if (userId) {
        query = query.eq('user_id', userId)
      }
      const { data, error } = await query.order('created_at', {
        ascending: false,
      })

      if (error) throw error
      return (data || []) as LoginHistory[]
    } catch (err) {
      console.error('Error fetching login history:', err)
      return []
    }
  },

  async getSuspiciousActivities(): Promise<SuspiciousActivity[]> {
    try {
      const { data, error } = await supabase
        .from('suspicious_activities')
        .select('*, profile:user_id(*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as SuspiciousActivity[]
    } catch (err) {
      console.error('Error fetching suspicious activities:', err)
      return []
    }
  },

  async getBlockedDevices(): Promise<BlockedDevice[]> {
    try {
      const { data, error } = await supabase
        .from('blocked_devices')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as BlockedDevice[]
    } catch (err) {
      console.error('Error fetching blocked devices:', err)
      return []
    }
  },

  async recordLoginHistory(
    userId: string,
    ip: string,
    fingerprint: string,
    browser: string,
    os: string,
    country: string
  ): Promise<void> {
    try {
      // 1. Check if device is blocked
      const { data: blocked } = await supabase
        .from('blocked_devices')
        .select('id')
        .eq('device_fingerprint', fingerprint)
        .maybeSingle()

      if (blocked) {
        throw new Error(
          'This device has been blacklisted due to security violations.'
        )
      }

      // 2. Insert login history log
      await supabase.from('login_history').insert([
        {
          user_id: userId,
          ip_address: ip,
          device_fingerprint: fingerprint,
          browser,
          os,
          country,
          risk_level: country !== 'NG' && country !== 'US' ? 'medium' : 'low',
        },
      ])

      // 3. Compute Risk Score & Autoprotection checks
      await this.calculateRiskScore(userId)
    } catch (err) {
      console.error('Error logging history:', err)
      throw err
    }
  },

  async calculateRiskScore(userId: string): Promise<number> {
    try {
      // Fetch user login list & activity counts
      const { data: logins = [] } = await supabase
        .from('login_history')
        .select('ip_address, device_fingerprint, country')
        .eq('user_id', userId)

      const factors: string[] = []
      let score = 10 // starting base trust score offset

      // Factor 1: Multiple device footprints (indicating credential sharing or hijacked accounts)
      const uniqueDevices = new Set(logins.map((l) => l.device_fingerprint))
        .size
      if (uniqueDevices > 3) {
        score += 30
        factors.push('Multiple device fingerprints used')
      }

      // Factor 2: Multiple IP countries logs
      const uniqueCountries = new Set(logins.map((l) => l.country)).size
      if (uniqueCountries > 2) {
        score += 25
        factors.push('Access logged from multiple countries')
      }

      const finalScore = Math.min(100, score)

      // Upsert score logs
      await supabase.from('risk_scores').upsert(
        {
          user_id: userId,
          score: finalScore,
          factors,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

      // Trigger auto-protect if risk score exceeds threshold limits
      if (finalScore >= 60) {
        await this.autoProtectUser(userId, finalScore, factors.join(', '))
      }

      return finalScore
    } catch (err) {
      console.error('Error calculating risk score:', err)
      return 0
    }
  },

  async autoProtectUser(
    userId: string,
    score: number,
    reason: string
  ): Promise<void> {
    try {
      // 1. Create fraud flag status trigger
      await supabase.from('fraud_flags').insert([
        {
          user_id: userId,
          reason: `Auto flagged by system. Risk score: ${score}. Reasons: ${reason}`,
          risk_level: score >= 80 ? 'critical' : 'high',
          status: 'pending',
        },
      ])

      // 2. Lock suspicious seller accounts if critical score
      if (score >= 80) {
        await supabase
          .from('profiles')
          .update({
            status: 'suspended',
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId)
      }
    } catch (err) {
      console.error('Error executing auto-protect rules:', err)
    }
  },

  async updateFlagStatus(
    flagId: string,
    status: FraudFlag['status']
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('fraud_flags')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', flagId)

      if (error) throw error
    } catch (err) {
      console.error('Error resolving fraud flag:', err)
      throw err
    }
  },

  async blockDevice(
    fingerprint: string,
    reason: string,
    adminId: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('blocked_devices')
        .insert([
          { device_fingerprint: fingerprint, reason, blocked_by: adminId },
        ])

      if (error) throw error
    } catch (err) {
      console.error('Error blocking device:', err)
      throw err
    }
  },

  async unblockDevice(fingerprint: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('blocked_devices')
        .delete()
        .eq('device_fingerprint', fingerprint)

      if (error) throw error
    } catch (err) {
      console.error('Error unblocking device:', err)
      throw err
    }
  },
}
