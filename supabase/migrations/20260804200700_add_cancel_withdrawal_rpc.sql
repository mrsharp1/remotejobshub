-- Create rpc_cancel_withdrawal to allow users to cancel their own pending withdrawals
CREATE OR REPLACE FUNCTION public.rpc_cancel_withdrawal(p_request_id UUID)
RETURNS jsonb AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_request record;
    v_wallet record;
BEGIN
    -- Lock Request & check ownership
    SELECT * INTO v_request FROM public.withdrawal_requests 
    WHERE id = p_request_id AND user_id = v_user_id FOR UPDATE;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Withdrawal request not found or unauthorized');
    END IF;

    IF v_request.status != 'pending' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Withdrawal request is already processed');
    END IF;

    -- Lock Wallet
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_user_id FOR UPDATE;

    -- Return to available balance, reduce pending balance
    UPDATE public.wallets
    SET pending_balance = pending_balance - v_request.amount,
        available_balance = available_balance + v_request.amount,
        updated_at = now()
    WHERE id = v_wallet.id
    RETURNING * INTO v_wallet;

    -- Update Request status to rejected with Cancellation reason
    UPDATE public.withdrawal_requests 
    SET status = 'rejected', 
        rejection_reason = 'Cancelled by user',
        updated_at = now() 
    WHERE id = p_request_id;
    
    -- Update Wallet Transaction status to failed
    UPDATE public.wallet_transactions 
    SET status = 'failed', 
        description = 'Withdrawal request cancelled by user'
    WHERE user_id = v_user_id 
      AND type = 'withdrawal' 
      AND status = 'pending' 
      AND ABS(amount) = v_request.amount;

    RETURN jsonb_build_object('success', true, 'message', 'Withdrawal request cancelled successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
