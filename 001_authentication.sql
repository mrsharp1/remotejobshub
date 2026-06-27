-- SECTION: Setup Extensions and Tables

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    country TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending', 'deleted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SECTION: Indexes

CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS profiles_status_idx ON public.profiles(status);

-- SECTION: Row Level Security

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- SECTION: Policies

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- POLICY COMMENTED FOR FUTURE ADMIN IMPLEMENTATION
-- DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
-- CREATE POLICY "Admins can read all profiles" ON public.profiles
--     FOR SELECT
--     TO authenticated
--     USING (
--         EXISTS (
--             SELECT 1 FROM public.profiles
--             WHERE id = auth.uid() AND role = 'admin'
--         )
--     );

-- POLICY COMMENTED FOR FUTURE ADMIN IMPLEMENTATION
-- DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
-- CREATE POLICY "Admins can update all profiles" ON public.profiles
--     FOR UPDATE
--     TO authenticated
--     USING (
--         EXISTS (
--             SELECT 1 FROM public.profiles
--             WHERE id = auth.uid() AND role = 'admin'
--         )
--     )
--     WITH CHECK (
--         EXISTS (
--             SELECT 1 FROM public.profiles
--             WHERE id = auth.uid() AND role = 'admin'
--         )
--     );

-- SECTION: Functions

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role, status)
    VALUES (new.id, new.email, 'buyer', 'active')
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    new.updated_at = timezone('utc'::text, now());
    RETURN new;
END;
$$ LANGUAGE plpgsql;

-- SECTION: Triggers

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
