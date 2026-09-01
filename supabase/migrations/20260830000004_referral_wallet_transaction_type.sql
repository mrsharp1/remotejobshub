-- Migration: 20260830000004_referral_wallet_transaction_type.sql
-- Description: Hotfix to allow 'referral_reward' in wallet_transactions_type_check.

DO $$ 
BEGIN
    -- Drop the existing constraint
    ALTER TABLE public.wallet_transactions 
    DROP CONSTRAINT IF EXISTS wallet_transactions_type_check;

    -- Add the updated constraint including 'referral_reward' and all previous values
    ALTER TABLE public.wallet_transactions 
    ADD CONSTRAINT wallet_transactions_type_check 
    CHECK (type IN (
        'deposit', 
        'purchase', 
        'refund', 
        'withdrawal', 
        'escrow_hold', 
        'escrow_release', 
        'bonus',
        'referral_reward'
    ));
END $$;
