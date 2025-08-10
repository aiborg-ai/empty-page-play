-- User registration triggers and functions

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (
        id,
        email,
        first_name,
        last_name,
        display_name,
        account_type,
        role,
        preferences
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(
            CONCAT(NEW.raw_user_meta_data->>'first_name', ' ', NEW.raw_user_meta_data->>'last_name'),
            NEW.email
        ),
        COALESCE(
            (NEW.raw_user_meta_data->>'account_type')::user_account_type,
            'trial'::user_account_type
        ),
        CASE 
            WHEN NEW.raw_user_meta_data->>'account_type' = 'trial' THEN 'trial'::user_role
            ELSE 'user'::user_role
        END,
        COALESCE(
            jsonb_build_object(
                'record_search_history', COALESCE((NEW.raw_user_meta_data->>'record_search_history')::boolean, true),
                'username', NEW.raw_user_meta_data->>'username'
            ),
            '{}'::jsonb
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Function to handle user deletion
CREATE OR REPLACE FUNCTION handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.users WHERE id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for user deletion
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
    AFTER DELETE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_user_delete();

-- Function to check username uniqueness
CREATE OR REPLACE FUNCTION is_username_available(username_to_check text)
RETURNS boolean AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM public.users 
        WHERE preferences->>'username' = username_to_check
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user profile
CREATE OR REPLACE FUNCTION update_user_profile(
    user_id uuid,
    profile_data jsonb
)
RETURNS void AS $$
DECLARE
    allowed_fields text[] := ARRAY[
        'first_name', 'last_name', 'display_name', 'avatar_url', 
        'organization', 'bio', 'preferences'
    ];
    field_name text;
    update_query text := 'UPDATE public.users SET updated_at = NOW()';
    field_value text;
BEGIN
    -- Only allow updates to specific fields
    FOREACH field_name IN ARRAY allowed_fields
    LOOP
        IF profile_data ? field_name THEN
            field_value := quote_literal(profile_data->>field_name);
            IF field_name = 'preferences' THEN
                update_query := update_query || ', ' || field_name || ' = ' || quote_literal(profile_data->field_name);
            ELSE
                update_query := update_query || ', ' || field_name || ' = ' || field_value;
            END IF;
        END IF;
    END LOOP;
    
    update_query := update_query || ' WHERE id = ' || quote_literal(user_id);
    
    EXECUTE update_query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Admin users can read all profiles
CREATE POLICY "Admins can read all profiles" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admin users can update all profiles
CREATE POLICY "Admins can update all profiles" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Service role can insert new users (for registration)
CREATE POLICY "Service role can insert users" ON public.users
    FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated, anon;
GRANT EXECUTE ON FUNCTION is_username_available(text) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION update_user_profile(uuid, jsonb) TO authenticated;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users USING gin((preferences->>'username'));
CREATE INDEX IF NOT EXISTS idx_users_email_confirmed ON public.users(email) WHERE email IS NOT NULL;