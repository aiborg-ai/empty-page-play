-- User Capability Downloads Migration
-- This migration creates tables to track user downloads of capabilities from the showcase

-- Create user_capability_downloads table
CREATE TABLE IF NOT EXISTS user_capability_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  capability_id TEXT NOT NULL,
  capability_name TEXT NOT NULL,
  capability_type TEXT NOT NULL, -- 'tool', 'dashboard', 'ai-agent', 'workflow', 'integration', 'dataset', 'report'
  capability_category TEXT NOT NULL, -- 'analysis', 'search', 'visualization', 'ai', 'automation', 'collaboration'
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_capability_downloads_user_id 
ON user_capability_downloads(user_id);

CREATE INDEX IF NOT EXISTS idx_user_capability_downloads_capability_id 
ON user_capability_downloads(capability_id);

CREATE INDEX IF NOT EXISTS idx_user_capability_downloads_category 
ON user_capability_downloads(capability_category);

CREATE INDEX IF NOT EXISTS idx_user_capability_downloads_type 
ON user_capability_downloads(capability_type);

CREATE INDEX IF NOT EXISTS idx_user_capability_downloads_user_category 
ON user_capability_downloads(user_id, capability_category);

-- Create unique constraint to prevent duplicate downloads
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_capability_downloads_unique 
ON user_capability_downloads(user_id, capability_id);

-- Enable Row Level Security
ALTER TABLE user_capability_downloads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_capability_downloads
CREATE POLICY IF NOT EXISTS "Users can view their own capability downloads"
ON user_capability_downloads
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own capability downloads"
ON user_capability_downloads
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own capability downloads"
ON user_capability_downloads
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own capability downloads"
ON user_capability_downloads
FOR DELETE
USING (auth.uid() = user_id);

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_capability_downloads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_user_capability_downloads_updated_at ON user_capability_downloads;
CREATE TRIGGER trigger_user_capability_downloads_updated_at
  BEFORE UPDATE ON user_capability_downloads
  FOR EACH ROW
  EXECUTE FUNCTION update_user_capability_downloads_updated_at();

-- Create function to get user downloads by category
CREATE OR REPLACE FUNCTION get_user_downloads_by_category(user_uuid UUID)
RETURNS TABLE (
  category TEXT,
  download_count BIGINT,
  capabilities JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ucd.capability_category,
    COUNT(*) as download_count,
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'id', ucd.capability_id,
        'name', ucd.capability_name,
        'type', ucd.capability_type,
        'downloaded_at', ucd.downloaded_at
      ) ORDER BY ucd.downloaded_at DESC
    ) as capabilities
  FROM user_capability_downloads ucd
  WHERE ucd.user_id = user_uuid
  GROUP BY ucd.capability_category
  ORDER BY download_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_user_downloads_by_category(UUID) TO authenticated;

-- Create function to add capability download
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

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION add_capability_download(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- Create function to remove capability download
CREATE OR REPLACE FUNCTION remove_capability_download(
  user_uuid UUID,
  cap_id TEXT
)
RETURNS JSON AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM user_capability_downloads
  WHERE user_id = user_uuid AND capability_id = cap_id;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN JSON_BUILD_OBJECT(
    'deleted_count', deleted_count,
    'success', deleted_count > 0
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION remove_capability_download(UUID, TEXT) TO authenticated;

-- Comments for documentation
COMMENT ON TABLE user_capability_downloads IS 'Tracks which capabilities users have downloaded from the showcase';
COMMENT ON FUNCTION get_user_downloads_by_category(UUID) IS 'Returns user downloads grouped by capability category';
COMMENT ON FUNCTION add_capability_download(UUID, TEXT, TEXT, TEXT, TEXT) IS 'Adds or updates a capability download for a user';
COMMENT ON FUNCTION remove_capability_download(UUID, TEXT) IS 'Removes a capability download for a user';