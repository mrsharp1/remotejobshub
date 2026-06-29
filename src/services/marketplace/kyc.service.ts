import { supabase } from '@/lib/supabase'
import { SellerVerification } from '@/types'

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
    selfieUrl: string,
    proofOfAddressUrl: string,
    documentsList: { file_url: string; file_type: string }[]
  ): Promise<SellerVerification> {
    try {
      // 1. Insert or update verification records
      const { data: sv, error } = await supabase
        .from('seller_verifications')
        .upsert([
          {
            user_id: userId,
            document_type: docType,
            selfie_url: selfieUrl,
            proof_of_address_url: proofOfAddressUrl,
            status: 'pending',
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error

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

        if (docErr) throw docErr
      }

      // 3. Log submit action to verification audit logs
      await supabase.from('verification_audit_logs').insert([
        {
          verification_id: sv.id,
          action: 'submit',
          notes:
            'KYC Verification documents uploaded and submitted for review.',
        },
      ])

      return sv as SellerVerification
    } catch (err) {
      console.error('Error in submitVerification:', err)
      throw err
    }
  },

  async updateVerificationStatus(
    verificationId: string,
    status: 'pending' | 'under_review' | 'approved' | 'rejected',
    notes: string,
    adminId: string
  ): Promise<void> {
    try {
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

      // Log action to audits
      const action =
        status === 'approved'
          ? 'approve'
          : status === 'rejected'
            ? 'reject'
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
