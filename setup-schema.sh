#!/bin/bash

echo "📊 Setting up Patent Database Schema"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Database configuration
DB_NAME="local_orchestration_studio"
DB_USER="orchestration"
DB_PASSWORD="orchestration_password_2024"
DB_HOST="localhost"
DB_PORT="5432"

# Path to the DOS schema file
SCHEMA_FILE="/home/vik/dos/database/schema/001_initial_schema.sql"

echo -e "${BLUE}[INFO]${NC} Checking for schema file..."
if [ ! -f "$SCHEMA_FILE" ]; then
    echo -e "${RED}[ERROR]${NC} Schema file not found: $SCHEMA_FILE"
    echo -e "${YELLOW}[INFO]${NC} Make sure the DOS project is in the correct location"
    exit 1
fi

echo -e "${GREEN}[SUCCESS]${NC} Schema file found"

# Set password for psql
export PGPASSWORD="${DB_PASSWORD}"

echo -e "${BLUE}[INFO]${NC} Creating patent database schema..."

# Run the schema file
psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f "${SCHEMA_FILE}"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}[SUCCESS]${NC} Database schema created successfully"
else
    echo -e "${RED}[ERROR]${NC} Failed to create database schema"
    exit 1
fi

echo -e "${BLUE}[INFO]${NC} Verifying schema installation..."

# Check if main tables exist
TABLES=("patents" "inventors" "assignees" "classifications" "citations")
ALL_TABLES_EXIST=true

for table in "${TABLES[@]}"; do
    EXISTS=$(psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -tAc "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name='$table');")
    if [ "$EXISTS" = "t" ]; then
        echo -e "${GREEN}[✓]${NC} Table '$table' exists"
    else
        echo -e "${RED}[✗]${NC} Table '$table' missing"
        ALL_TABLES_EXIST=false
    fi
done

if [ "$ALL_TABLES_EXIST" = true ]; then
    echo -e "${GREEN}[SUCCESS]${NC} All required tables are present"
else
    echo -e "${RED}[ERROR]${NC} Some tables are missing"
    exit 1
fi

echo -e "${BLUE}[INFO]${NC} Adding sample data for testing..."

# Insert sample patent data
psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} << 'EOF'
-- Insert sample patents
INSERT INTO patents (id, patent_number, title, abstract_text, filing_date, grant_date, claims_count, status, full_text_available) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'US11234567B2', 'Machine Learning System for Patent Analysis', 'A system and method for analyzing patents using machine learning algorithms to identify patterns and relationships in patent data.', '2020-01-15', '2023-03-20', 20, 'active', true),
('550e8400-e29b-41d4-a716-446655440002', 'US11345678B2', 'AI-Powered Data Processing Method', 'An artificial intelligence system for processing large datasets using neural networks and deep learning techniques.', '2019-11-20', '2023-05-15', 15, 'active', true),
('550e8400-e29b-41d4-a716-446655440003', 'US11456789B2', 'Quantum Computing Circuit Design', 'A novel approach to quantum computing circuit design using optimization algorithms.', '2021-03-10', '2023-08-10', 25, 'active', true)
ON CONFLICT (patent_number) DO NOTHING;

-- Insert sample inventors
INSERT INTO inventors (id, first_name, last_name, city, state, country) VALUES
('inv-001', 'John', 'Smith', 'San Francisco', 'CA', 'US'),
('inv-002', 'Sarah', 'Johnson', 'Austin', 'TX', 'US'),
('inv-003', 'Michael', 'Chen', 'Seattle', 'WA', 'US'),
('inv-004', 'Alice', 'Brown', 'Boston', 'MA', 'US')
ON CONFLICT (first_name, last_name, city, state, country) DO NOTHING;

-- Insert sample assignees
INSERT INTO assignees (id, name, city, state, country, industry) VALUES
('asg-001', 'Tech Innovation Corp', 'Palo Alto', 'CA', 'US', 'Technology'),
('asg-002', 'Advanced AI Solutions LLC', 'Austin', 'TX', 'US', 'Artificial Intelligence'),
('asg-003', 'Quantum Systems Inc', 'Boston', 'MA', 'US', 'Quantum Computing')
ON CONFLICT (name, city, state, country) DO NOTHING;

-- Link patents with inventors
INSERT INTO patent_inventors (patent_id, inventor_id, inventor_sequence, is_first_inventor) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'inv-001', 1, true),
('550e8400-e29b-41d4-a716-446655440002', 'inv-002', 1, true),
('550e8400-e29b-41d4-a716-446655440002', 'inv-003', 2, false),
('550e8400-e29b-41d4-a716-446655440003', 'inv-004', 1, true)
ON CONFLICT (patent_id, inventor_id) DO NOTHING;

-- Link patents with assignees
INSERT INTO patent_assignees (patent_id, assignee_id, ownership_percentage) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'asg-001', 100.00),
('550e8400-e29b-41d4-a716-446655440002', 'asg-002', 100.00),
('550e8400-e29b-41d4-a716-446655440003', 'asg-003', 100.00)
ON CONFLICT (patent_id, assignee_id) DO NOTHING;

-- Insert sample classifications
INSERT INTO classifications (id, patent_id, scheme, main_class, full_code, class_title, is_primary) VALUES
('cls-001', '550e8400-e29b-41d4-a716-446655440001', 'CPC', 'G06N', 'G06N3/08', 'Neural networks', true),
('cls-002', '550e8400-e29b-41d4-a716-446655440002', 'CPC', 'G06N', 'G06N20/00', 'Machine learning', true),
('cls-003', '550e8400-e29b-41d4-a716-446655440003', 'CPC', 'G06N', 'G06N10/00', 'Quantum computing', true)
ON CONFLICT DO NOTHING;

-- Update search vectors
UPDATE patents SET search_vector = 
    setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(abstract_text, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(patent_number, '')), 'A');
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}[SUCCESS]${NC} Sample data inserted successfully"
else
    echo -e "${YELLOW}[WARNING]${NC} Some sample data may already exist (this is normal)"
fi

# Show database statistics
echo -e "${BLUE}[INFO]${NC} Database Statistics:"
psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -c "
SELECT 
    'Patents' as table_name, COUNT(*) as record_count 
FROM patents
UNION ALL
SELECT 
    'Inventors', COUNT(*) 
FROM inventors
UNION ALL
SELECT 
    'Assignees', COUNT(*) 
FROM assignees
UNION ALL
SELECT 
    'Classifications', COUNT(*) 
FROM classifications
ORDER BY table_name;"

echo ""
echo -e "${GREEN}[SUCCESS]${NC} Patent database schema and sample data setup completed!"
echo -e "${YELLOW}[INFO]${NC} You can now restart the API server to connect to the live database."