import { supabase } from '@/lib/supabase'
import { SellerVerification } from '@/types'
import { notificationService } from '@/features/notifications/services'

export const kycService = {
  async getVerification(userId: string): Promise<SellerVerification | null> {
    try {
      const { data, error } = await supabase
        .from('seller_verifications')
        .select(
          '*, documents:verification_documents(*), audit_logs:verification_audit_logs(*)'
        )
        .eq('user_id', userId)
        .maybeSingle()

      if (error) throw error
      return data as SellerVerification
    } catch (err) {
      console.error('Error in getVerification:', err)
      return null
    }
  },

  async getAllVerifications(): Promise<SellerVerification[]> {
    try {
      const { data, error } = await supabase
        .from('seller_verifications')
        .select(
          '*, profile:user_id(*), documents:verification_documents(*), audit_logs:verification_audit_logs(*)'
        )
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as SellerVerification[]
    } catch (err) {
      console.error('Error in getAllVerifications:', err)
      return []
    }
  },

  async submitVerification(
    userId: string,
    docType: 'government_id' | 'passport' | 'drivers_license' | 'national_id',
    documentsList: { file_url: string; file_type: string }[],
    profileData?: {
      full_name: string
      phone: string
      country: string
      residential_address?: string
      date_of_birth?: string
    }
  ): Promise<SellerVerification> {
    try {
      // 1. Insert or update verification records
      const { data: sv, error } = await supabase
        .from('seller_verifications')
        .upsert(
          [
            {
              user_id: userId,
              document_type: docType,
              status: 'pending',
              residential_address: profileData?.residential_address,
              date_of_birth: profileData?.date_of_birth,
              updated_at: new Date().toISOString(),
            },
          ],
          {
            onConflict: 'user_id',
          }
        )
        .select()
        .single()

      if (error) {
        console.error("FULL KYC ERROR", error)
        alert(JSON.stringify(error, null, 2))
        throw error
      }

      // 2. Clear old documents and upload new ones
      await supabase
        .from('verification_documents')
        .delete()
        .eq('verification_id', sv.id)

      if (documentsList.length > 0) {
        const docs = documentsList.map((d) => ({
          verification_id: sv.id,
          file_url: d.file_url,
          file_type: d.file_type,
        }))
        const { error: docErr } = await supabase
          .from('verification_documents')
          .insert(docs)

        if (docErr) {
          console.error("FULL KYC ERROR", docErr)
          alert(JSON.stringify(docErr, null, 2))
          throw docErr
        }
      }

      // 3. Log submit action to verification audit logs
      const { error: auditErr } = await supabase.from('verification_audit_logs').insert([
        {
          verification_id: sv.id,
          action: 'submit',
          notes:
            'KYC Verification documents uploaded and submitted for review.',
        },
      ])
      
      if (auditErr) {
        console.error("FULL KYC ERROR", auditErr)
        alert(JSON.stringify(auditErr, null, 2))
        throw auditErr
      }

      // 4. Update seller profile fields
      if (profileData) {
        const { error: profileErr } = await supabase.from('profiles').update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          country: profileData.country,
        }).eq('id', userId)
        
        if (profileErr) {
          console.error("FULL KYC ERROR", profileErr)
          alert(JSON.stringify(profileErr, null, 2))
          if (import.meta.env.DEV) {
            console.warn('Failed to update seller profile during KYC submission:', profileErr)
          }
          throw profileErr
        }
      }

      return sv as SellerVerification
    } catch (err) {
      console.error('Error in submitVerification:', err)
      throw err
    }
  },

  async updateVerificationStatus(
    verificationId: string,
    status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'requires_more_info',
    notes: string,
    adminId: string
  ): Promise<void> {
    try {
      if (status === 'approved') {
        const { data: vRecord } = await supabase
          .from('seller_verifications')
          .select('*, profile:user_id(*), documents:verification_documents(*)')
          .eq('id', verificationId)
          .single()
        
        if (!vRecord) throw new Error('Verification not found')
        
        const hasDoc = vRecord.documents && vRecord.documents.length > 0
        const hasName = !!vRecord.profile?.full_name
        const hasPhone = !!vRecord.profile?.phone
        const hasCountry = !!vRecord.profile?.country
        const hasDob = !!vRecord.date_of_birth
        const hasAddress = !!vRecord.residential_address
        const hasDocType = !!vRecord.document_type
        
        if (!hasDoc || !hasName || !hasPhone || !hasCountry || !hasDob || !hasAddress || !hasDocType) {
          throw new Error('Cannot approve: Missing required KYC evidence.')
        }
      }

      // Update verification status
      const { error } = await supabase
        .from('seller_verifications')
        .update({
          status,
          notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', verificationId)

      if (error) throw error

      // Synchronize to profiles
      if (status === 'approved' || status === 'rejected' || status === 'requires_more_info') {
        const { data: vRecord } = await supabase
          .from('seller_verifications')
          .select('user_id')
          .eq('id', verificationId)
          .single()

        if (vRecord?.user_id) {
          await supabase
            .from('profiles')
            .update({
              seller_verified: status === 'approved',
              role: status === 'approved' ? 'seller' : 'buyer',
              status: status === 'approved' ? 'active' : 'pending',
            })
            .eq('id', vRecord.user_id)
            
          if (status === 'approved') {
            await notificationService.createNotification({
              user_id: vRecord.user_id,
              type: 'verification',
              title: 'Verification Approved',
              message: 'Your seller account has been approved!',
              link: '/seller'
            })
          }
        }
      }

      // Log action to audits
      const action =
        status === 'approved'
          ? 'approve'
          : status === 'rejected'
            ? 'reject'
            : status === 'requires_more_info'
              ? 'request_documents'
              : 'review'
      await supabase.from('verification_audit_logs').insert([
        {
          verification_id: verificationId,
          admin_id: adminId,
          action,
          notes,
        },
      ])
    } catch (err) {
      console.error('Error in updateVerificationStatus:', err)
      throw err
    }
  },
}
