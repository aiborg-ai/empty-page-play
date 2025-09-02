-- Migration: Create support tickets table
-- Description: Table for storing customer support tickets from AI Assistant

-- Create support_tickets table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_name TEXT,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    category TEXT DEFAULT 'general',
    status TEXT CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    assigned_to TEXT,
    resolution_notes TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_email ON public.support_tickets(user_email);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON public.support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON public.support_tickets(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for support tickets
-- Users can view their own tickets
CREATE POLICY IF NOT EXISTS "Users can view own tickets" ON public.support_tickets
    FOR SELECT
    USING (auth.jwt() ->> 'email' = user_email);

-- Users can create tickets
CREATE POLICY IF NOT EXISTS "Users can create tickets" ON public.support_tickets
    FOR INSERT
    WITH CHECK (auth.jwt() ->> 'email' = user_email);

-- Support staff (admin role) can view and update all tickets
CREATE POLICY IF NOT EXISTS "Support staff can view all tickets" ON public.support_tickets
    FOR SELECT
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY IF NOT EXISTS "Support staff can update tickets" ON public.support_tickets
    FOR UPDATE
    USING (auth.jwt() ->> 'role' = 'admin');

-- Add function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_support_ticket_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at
DROP TRIGGER IF EXISTS update_support_tickets_updated_at ON public.support_tickets;
CREATE TRIGGER update_support_tickets_updated_at
    BEFORE UPDATE ON public.support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_support_ticket_updated_at();

-- Grant permissions
GRANT ALL ON public.support_tickets TO authenticated;
GRANT SELECT ON public.support_tickets TO anon;