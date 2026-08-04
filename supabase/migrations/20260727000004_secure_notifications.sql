-- 20260727000004_secure_notifications.sql
-- Lock down notifications INSERT policy to prevent cross-user spoofing

-- Drop the old permissive policy
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.notifications;

-- Create the strict policy
CREATE POLICY "Users can insert own notifications" ON public.notifications
    FOR INSERT 
    WITH CHECK (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
