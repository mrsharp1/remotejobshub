-- 20260827000000_push3_rpc_fcm_token.sql

-- Creates a secure RPC to handle token upserting.
-- Bypasses RLS strictly to allow a user to claim an existing physical FCM token
-- if it was previously registered by another user in the same shared browser.

CREATE OR REPLACE FUNCTION public.register_fcm_token(p_token TEXT, p_device_type TEXT)
RETURNS void AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Get the currently authenticated user
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Validate token input
    IF p_token IS NULL OR trim(p_token) = '' THEN
        RAISE EXCEPTION 'Token cannot be empty';
    END IF;
    
    IF length(p_token) > 1024 THEN
        RAISE EXCEPTION 'Token length exceeds maximum allowed limit';
    END IF;

    -- Upsert the token, transferring ownership to the current user if it already exists
    INSERT INTO public.fcm_tokens (user_id, token, device_type, last_used_at)
    VALUES (v_user_id, p_token, p_device_type, now())
    ON CONFLICT (token) DO UPDATE
    SET user_id = EXCLUDED.user_id,
        device_type = EXCLUDED.device_type,
        last_used_at = EXCLUDED.last_used_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Security Hardening
-- Revoke execute from the default PUBLIC role
REVOKE EXECUTE ON FUNCTION public.register_fcm_token(TEXT, TEXT) FROM PUBLIC;

-- Grant execute exclusively to the authenticated role
GRANT EXECUTE ON FUNCTION public.register_fcm_token(TEXT, TEXT) TO authenticated;
