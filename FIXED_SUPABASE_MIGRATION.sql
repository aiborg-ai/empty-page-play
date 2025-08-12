-- Fixed SQL for Supabase (compatible with older PostgreSQL versions)

-- Create the user_capability_downloads table
CREATE TABLE IF NOT EXISTS user_capability_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  capability_id TEXT NOT NULL,
  capability_name TEXT NOT NULL,
  capability_type TEXT NOT NULL,
  capability_category TEXT NOT NULL,
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_capability_downloads_unique UNIQUE(user_id, capability_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_capability_downloads_user_id 
ON user_capability_downloads(user_id);

CREATE INDEX IF NOT EXISTS idx_user_capability_downloads_category 
ON user_capability_downloads(capability_category);

-- Enable Row Level Security (but make it permissive for demo)
ALTER TABLE user_capability_downloads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (ignore errors)
DROP POLICY IF EXISTS "Allow all authenticated users to access downloads" ON user_capability_downloads;

-- Create permissive policy for demo users (without IF NOT EXISTS)
CREATE POLICY "Allow all authenticated users to access downloads"
ON user_capability_downloads
FOR ALL
USING (true)
WITH CHECK (true);

-- Create the helper function
CREATE OR REPLACE FUNCTION add_capability_download(
  user_uuid UUID,
  cap_id TEXT,
  cap_name TEXT,
  cap_type TEXT,
  cap_category TEXT
)
RETURNS JSON AS $$
DECLARE
  result_record user_capability_downloads;
BEGIN
  INSERT INTO user_capability_downloads (
    user_id,
    capability_id,
    capability_name,
    capability_type,
    capability_category
  ) VALUES (
    user_uuid,
    cap_id,
    cap_name,
    cap_type,
    cap_category
  )
  ON CONFLICT (user_id, capability_id) DO UPDATE SET
    downloaded_at = NOW(),
    updated_at = NOW()
  RETURNING * INTO result_record;

  RETURN JSON_BUILD_OBJECT(
    'id', result_record.id,
    'capability_id', result_record.capability_id,
    'capability_name', result_record.capability_name,
    'downloaded_at', result_record.downloaded_at,
    'success', true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to all roles for demo purposes
GRANT ALL ON TABLE user_capability_downloads TO authenticated;
GRANT ALL ON TABLE user_capability_downloads TO anon;
GRANT EXECUTE ON FUNCTION add_capability_download(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION add_capability_download(UUID, TEXT, TEXT, TEXT, TEXT) TO anon;

-- Test query to confirm it worked
SELECT 'Table and functions created successfully!' as status;