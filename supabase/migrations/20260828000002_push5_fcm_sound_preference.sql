-- 20260828000002_push5_fcm_sound_preference.sql

-- 1. Add sound_enabled column to fcm_tokens
ALTER TABLE public.fcm_tokens ADD COLUMN IF NOT EXISTS sound_enabled BOOLEAN NOT NULL DEFAULT true;

-- 2. Create RPC for updating sound preference across all devices
CREATE OR REPLACE FUNCTION public.update_fcm_sound_preference(p_sound_enabled BOOLEAN)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE public.fcm_tokens 
    SET sound_enabled = p_sound_enabled 
    WHERE user_id = auth.uid();
END;
$$;

-- 3. Update register_fcm_token to inherit existing sound preference
CREATE OR REPLACE FUNCTION public.register_fcm_token(p_token TEXT, p_device_type TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_sound_enabled BOOLEAN := true;
BEGIN
    -- Inherit the sound_enabled state from an existing token if the user has one
    SELECT sound_enabled INTO v_sound_enabled 
    FROM public.fcm_tokens 
    WHERE user_id = auth.uid() 
    LIMIT 1;

    IF v_sound_enabled IS NULL THEN
        v_sound_enabled := true;
    END IF;

    INSERT INTO public.fcm_tokens (user_id, token, device_type, sound_enabled, last_used_at)
    VALUES (auth.uid(), p_token, p_device_type, v_sound_enabled, now())
    ON CONFLICT (token) DO UPDATE 
    SET user_id = EXCLUDED.user_id,
        device_type = EXCLUDED.device_type,
        sound_enabled = EXCLUDED.sound_enabled,
        last_used_at = now();
END;
$$;
