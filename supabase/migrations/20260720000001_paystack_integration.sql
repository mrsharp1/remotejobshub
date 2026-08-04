-- 20260720000001_paystack_integration.sql

-- 1. Enforce unique payment references for Paystack (or general) deposits to prevent duplicate processing
CREATE UNIQUE INDEX IF NOT EXISTS idx_wallet_transactions_unique_reference 
ON public.wallet_transactions (payment_reference) 
WHERE payment_reference IS NOT NULL AND status = 'success';

-- 2. Idempotent RPC to process Paystack deposits securely
CREATE OR REPLACE FUNCTION public.process_paystack_deposit(
    p_user_id UUID,
    p_amount NUMERIC,
    p_reference TEXT
) RETURNS JSONB AS $$
DECLARE
    v_wallet_id UUID;
    v_current_balance NUMERIC;
    v_transaction_id UUID;
BEGIN
    -- Input validation
    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Amount must be greater than zero';
    END IF;

    -- 1. Optimistic pre-check (avoids locking if already processed)
    IF EXISTS (
        SELECT 1 FROM public.wallet_transactions 
        WHERE payment_reference = p_reference AND status = 'success'
    ) THEN
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Transaction already processed'
        );
    END IF;

    -- 2. Lock the user's wallet
    SELECT id, available_balance INTO v_wallet_id, v_current_balance
    FROM public.wallets
    WHERE user_id = p_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found for user';
    END IF;

    -- 3. Attempt to record the transaction securely against concurrent inserts
    INSERT INTO public.wallet_transactions (
        wallet_id,
        user_id,
        type,
        amount,
        status,
        payment_gateway,
        payment_reference,
        description
    ) VALUES (
        v_wallet_id,
        p_user_id,
        'deposit',
        p_amount,
        'success',
        'Paystack',
        p_reference,
        'Wallet deposit via Paystack'
    ) 
    ON CONFLICT (payment_reference) WHERE payment_reference IS NOT NULL AND status = 'success'
    DO NOTHING
    RETURNING id INTO v_transaction_id;

    -- 4. If transaction wasn't inserted, it was already processed concurrently
    IF v_transaction_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Transaction already processed'
        );
    END IF;

    -- 5. Update wallet balance ONLY if transaction was successfully inserted
    UPDATE public.wallets
    SET 
        available_balance = available_balance + p_amount,
        updated_at = timezone('utc'::text, now())
    WHERE id = v_wallet_id;

    -- 6. Return success payload
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Wallet funded successfully',
        'transaction_id', v_transaction_id,
        'new_balance', v_current_balance + p_amount
    );
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process deposit: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
