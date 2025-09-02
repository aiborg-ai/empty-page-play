-- Knowledge Base and Content Management
-- Migration: 022_knowledge_and_content.sql

-- Knowledge bases table
CREATE TABLE IF NOT EXISTS public.knowledge_bases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  kb_type VARCHAR(100) NOT NULL, -- patent_data, legal_docs, market_intel
  source_type VARCHAR(50) NOT NULL, -- upload, api, crawled, generated
  data_sources JSONB DEFAULT '{}',
  indexing_config JSONB DEFAULT '{}',
  search_config JSONB DEFAULT '{}',
  document_count INTEGER DEFAULT 0,
  total_size_bytes BIGINT DEFAULT 0,
  last_indexed_at TIMESTAMP WITH TIME ZONE,
  access_level VARCHAR(50) DEFAULT 'private', -- private, organization, public
  status VARCHAR(50) DEFAULT 'active', -- active, indexing, error, archived
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT knowledge_bases_kb_type_check 
    CHECK (kb_type IN ('patent_data', 'legal_docs', 'market_intel', 'research_papers', 'internal_docs')),
  CONSTRAINT knowledge_bases_source_type_check 
    CHECK (source_type IN ('upload', 'api', 'crawled', 'generated')),
  CONSTRAINT knowledge_bases_access_level_check 
    CHECK (access_level IN ('private', 'organization', 'public')),
  CONSTRAINT knowledge_bases_status_check 
    CHECK (status IN ('active', 'indexing', 'error', 'archived'))
);

-- Documents table with vector embeddings
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_base_id UUID NOT NULL REFERENCES knowledge_bases(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  content TEXT,
  document_type VARCHAR(100) NOT NULL, -- patent, legal_doc, research_paper
  source_url TEXT,
  file_path TEXT,
  metadata JSONB DEFAULT '{}',
  extracted_entities JSONB DEFAULT '{}',
  embedding_vector VECTOR(1536), -- for semantic search (OpenAI ada-002 dimension)
  content_hash VARCHAR(64), -- for duplicate detection
  language VARCHAR(10) DEFAULT 'en',
  word_count INTEGER DEFAULT 0,
  confidence_score DECIMAL(3,2) DEFAULT 1.00,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT documents_document_type_check 
    CHECK (document_type IN ('patent', 'legal_doc', 'research_paper', 'market_report', 'internal_doc')),
  CONSTRAINT documents_confidence_score_check 
    CHECK (confidence_score >= 0.00 AND confidence_score <= 1.00)
);

-- Files table for asset storage
CREATE TABLE IF NOT EXISTS public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(500) NOT NULL,
  original_filename VARCHAR(500) NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_hash VARCHAR(64) NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  entity_type VARCHAR(100), -- dashboard, report, dataset, etc.
  entity_id UUID,
  access_level VARCHAR(50) DEFAULT 'private',
  storage_provider VARCHAR(50) DEFAULT 'supabase', -- supabase, s3, gcs
  cdn_url TEXT,
  metadata JSONB DEFAULT '{}',
  download_count INTEGER DEFAULT 0,
  virus_scan_status VARCHAR(50) DEFAULT 'pending', -- pending, clean, infected, failed
  encryption_status VARCHAR(50) DEFAULT 'none', -- none, client, server
  retention_policy JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT files_access_level_check 
    CHECK (access_level IN ('private', 'organization', 'public')),
  CONSTRAINT files_storage_provider_check 
    CHECK (storage_provider IN ('supabase', 's3', 'gcs', 'azure')),
  CONSTRAINT files_virus_scan_status_check 
    CHECK (virus_scan_status IN ('pending', 'clean', 'infected', 'failed')),
  CONSTRAINT files_encryption_status_check 
    CHECK (encryption_status IN ('none', 'client', 'server'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_bases_owner ON knowledge_bases(owner_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_bases_org ON knowledge_bases(organization_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_bases_type ON knowledge_bases(kb_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_bases_status ON knowledge_bases(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_bases_access ON knowledge_bases(access_level);

CREATE INDEX IF NOT EXISTS idx_documents_kb ON documents(knowledge_base_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_hash ON documents(content_hash);
CREATE INDEX IF NOT EXISTS idx_documents_language ON documents(language);
-- Vector similarity search index
CREATE INDEX IF NOT EXISTS idx_documents_vector ON documents 
  USING ivfflat (embedding_vector vector_cosine_ops) 
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_files_owner ON files(owner_id);
CREATE INDEX IF NOT EXISTS idx_files_project ON files(project_id);
CREATE INDEX IF NOT EXISTS idx_files_entity ON files(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_files_hash ON files(file_hash);
CREATE INDEX IF NOT EXISTS idx_files_mime_type ON files(mime_type);
CREATE INDEX IF NOT EXISTS idx_files_access_level ON files(access_level);

-- Function to update document count in knowledge base
CREATE OR REPLACE FUNCTION public.update_knowledge_base_stats()
RETURNS TRIGGER AS $$
DECLARE
  kb_uuid UUID;
BEGIN
  kb_uuid := COALESCE(NEW.knowledge_base_id, OLD.knowledge_base_id);
  
  UPDATE knowledge_bases 
  SET 
    document_count = (
      SELECT COUNT(*) 
      FROM documents 
      WHERE knowledge_base_id = kb_uuid
    ),
    total_size_bytes = (
      SELECT COALESCE(SUM(LENGTH(content)), 0)
      FROM documents 
      WHERE knowledge_base_id = kb_uuid
    ),
    last_indexed_at = NOW()
  WHERE id = kb_uuid;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain knowledge base stats
CREATE TRIGGER update_knowledge_base_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_knowledge_base_stats();

-- Function to calculate content hash
CREATE OR REPLACE FUNCTION public.calculate_content_hash()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.content IS NOT NULL THEN
    NEW.content_hash = encode(sha256(NEW.content::bytea), 'hex');
  END IF;
  
  IF NEW.content IS NOT NULL THEN
    NEW.word_count = array_length(string_to_array(NEW.content, ' '), 1);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to calculate content hash and word count
CREATE TRIGGER calculate_document_hash_trigger
  BEFORE INSERT OR UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION calculate_content_hash();

-- Apply updated_at triggers
CREATE TRIGGER update_knowledge_bases_updated_at
  BEFORE UPDATE ON knowledge_bases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_files_updated_at
  BEFORE UPDATE ON files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();