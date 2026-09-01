-- 20260826000000_push2_secure_notifications.sql

-- 1. FIX NOTIFICATIONS RLS SECURITY VULNERABILITY
-- Drop the insecure policy that allowed any authenticated user to insert notifications for ANY user.
DROP POLICY IF EXISTS "Users can insert notifications" ON public.notifications;

-- 2. CREATE FCM TOKENS TABLE
CREATE TABLE IF NOT EXISTS public.fcm_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    device_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_used_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS fcm_tokens_user_id_idx ON public.fcm_tokens(user_id);

ALTER TABLE public.fcm_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own fcm tokens" ON public.fcm_tokens
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. UNIFIED NOTIFICATION TRIGGERS (SINGLE SOURCE OF TRUTH)

-- A. Messages V2
CREATE OR REPLACE FUNCTION public.handle_message_v2_notifications()
RETURNS TRIGGER AS $$
DECLARE
    v_participant record;
BEGIN
    FOR v_participant IN 
        SELECT user_id FROM public.conversation_participants_v2 
        WHERE conversation_id = NEW.conversation_id AND user_id != NEW.sender_id
    LOOP
        INSERT INTO public.notifications (user_id, title, message, type, category, priority, target_url, reference_type, reference_id)
        VALUES (
            v_participant.user_id,
            'New Message 💬',
            CASE WHEN length(NEW.message_text) > 60 THEN substring(NEW.message_text from 1 for 60) || '...' ELSE NEW.message_text END,
            'message',
            'message',
            'important',
            '/dashboard/messages?conversation=' || NEW.conversation_id,
            'message',
            NEW.id
        );
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tg_message_v2_notifications ON public.messages_v2;
CREATE TRIGGER tg_message_v2_notifications
    AFTER INSERT ON public.messages_v2
    FOR EACH ROW
    WHEN (NEW.is_system = false)
    EXECUTE FUNCTION public.handle_message_v2_notifications();


-- B. Withdrawals
CREATE OR REPLACE FUNCTION public.handle_withdrawal_notifications()
RETURNS TRIGGER AS $$
DECLARE
    v_admin record;
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Notify all admins
        FOR v_admin IN SELECT id FROM public.profiles WHERE role = 'admin' LOOP
            INSERT INTO public.notifications (user_id, title, message, type, category, priority, target_url, reference_type, reference_id)
            VALUES (
                v_admin.id, 'New Withdrawal Request', 'A withdrawal request for ₦' || NEW.amount || ' requires review.',
                'wallet', 'wallet', 'important', '/admin/withdrawals', 'withdrawal', NEW.id
            );
        END LOOP;
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        IF NEW.status = 'approved' THEN
            INSERT INTO public.notifications (user_id, title, message, type, category, priority, target_url, reference_type, reference_id)
            VALUES (
                NEW.user_id, 'Withdrawal Approved ✅', 'Your withdrawal request for ₦' || NEW.amount || ' has been processed.',
                'wallet', 'wallet', 'important', '/dashboard/wallet', 'withdrawal', NEW.id
            );
        ELSIF NEW.status = 'rejected' THEN
            INSERT INTO public.notifications (user_id, title, message, type, category, priority, target_url, reference_type, reference_id)
            VALUES (
                NEW.user_id, 'Withdrawal Rejected ❌', 'Your withdrawal request was rejected: ' || COALESCE(NEW.rejection_reason, 'No reason provided'),
                'wallet', 'wallet', 'important', '/dashboard/wallet', 'withdrawal', NEW.id
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tg_withdrawal_notifications ON public.withdrawal_requests;
CREATE TRIGGER tg_withdrawal_notifications
    AFTER INSERT OR UPDATE ON public.withdrawal_requests
    FOR EACH ROW EXECUTE FUNCTION public.handle_withdrawal_notifications();


-- C. KYC / Seller Verifications
CREATE OR REPLACE FUNCTION public.handle_kyc_notifications()
RETURNS TRIGGER AS $$
DECLARE
    v_admin record;
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Notify all admins
        FOR v_admin IN SELECT id FROM public.profiles WHERE role = 'admin' LOOP
            INSERT INTO public.notifications (user_id, title, message, type, category, priority, target_url, reference_type, reference_id)
            VALUES (
                v_admin.id, 'New KYC Submission', 'A new seller verification requires review.',
                'verification', 'verification', 'important', '/admin/kyc', 'kyc', NEW.id
            );
        END LOOP;
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        IF NEW.status = 'approved' THEN
            INSERT INTO public.notifications (user_id, title, message, type, category, priority, target_url, reference_type, reference_id)
            VALUES (
                NEW.user_id, 'Verification Approved ✅', 'Your identity has been verified. You can now sell on Remote Jobs Hub.',
                'verification', 'verification', 'important', '/seller/dashboard', 'kyc', NEW.id
            );
        ELSIF NEW.status = 'rejected' THEN
            INSERT INTO public.notifications (user_id, title, message, type, category, priority, target_url, reference_type, reference_id)
            VALUES (
                NEW.user_id, 'Verification Rejected ❌', 'Your identity verification was rejected. Please review our guidelines.',
                'verification', 'verification', 'important', '/seller/kyc', 'kyc', NEW.id
            );
        ELSIF NEW.status = 'requires_more_info' THEN
            INSERT INTO public.notifications (user_id, title, message, type, category, priority, target_url, reference_type, reference_id)
            VALUES (
                NEW.user_id, 'Verification Needs Info ⚠️', 'We need more information to process your verification.',
                'verification', 'verification', 'important', '/seller/kyc', 'kyc', NEW.id
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tg_kyc_notifications ON public.seller_verifications;
CREATE TRIGGER tg_kyc_notifications
    AFTER INSERT OR UPDATE ON public.seller_verifications
    FOR EACH ROW EXECUTE FUNCTION public.handle_kyc_notifications();


-- D. Listings
CREATE OR REPLACE FUNCTION public.handle_listing_notifications()
RETURNS TRIGGER AS $$
DECLARE
    v_admin record;
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Notify admins of new listing
        FOR v_admin IN SELECT id FROM public.profiles WHERE role = 'admin' LOOP
            INSERT INTO public.notifications (user_id, title, message, type, category, priority, target_url, reference_type, reference_id)
            VALUES (
                v_admin.id, 'New Listing Submitted', 'A new listing "' || NEW.title || '" requires review.',
                'listing', 'listing', 'informational', '/admin/listings', 'listing', NEW.id
            );
        END LOOP;
    ELSIF TG_OP = 'UPDATE' AND OLD.approval_status != NEW.approval_status THEN
        IF NEW.approval_status = 'approved' THEN
            INSERT INTO public.notifications (user_id, title, message, type, category, priority, target_url, reference_type, reference_id)
            VALUES (
                NEW.seller_id, 'Listing Approved ✅', 'Your listing "' || NEW.title || '" has been approved and is now live.',
                'listing', 'listing', 'important', '/seller/listings', 'listing', NEW.id
            );
        ELSIF NEW.approval_status = 'rejected' THEN
            INSERT INTO public.notifications (user_id, title, message, type, category, priority, target_url, reference_type, reference_id)
            VALUES (
                NEW.seller_id, 'Listing Rejected ❌', 'Your listing "' || NEW.title || '" was rejected: ' || COALESCE(NEW.rejection_reason, 'No reason provided'),
                'listing', 'listing', 'important', '/seller/listings', 'listing', NEW.id
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tg_listing_notifications ON public.listings;
CREATE TRIGGER tg_listing_notifications
    AFTER INSERT OR UPDATE ON public.listings
    FOR EACH ROW EXECUTE FUNCTION public.handle_listing_notifications();

-- E. Reviews
CREATE OR REPLACE FUNCTION public.handle_review_notifications()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (user_id, title, message, type, category, priority, target_url, reference_type, reference_id)
    VALUES (
        NEW.target_id, 'New Review Received ⭐', 'You received a ' || NEW.rating || '-star review.',
        'reviews', 'order', 'informational', '/dashboard/reviews', 'order', NEW.order_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tg_review_notifications ON public.reviews;
CREATE TRIGGER tg_review_notifications
    AFTER INSERT ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.handle_review_notifications();

