#!/bin/bash

echo "🚀 Setting up PostgreSQL database for InnoSpot Patent Search"
echo "========================================================="

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
DB_PORT="5432"

echo -e "${BLUE}[INFO]${NC} Checking PostgreSQL installation..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} PostgreSQL is not installed. Installing..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
else
    echo -e "${GREEN}[SUCCESS]${NC} PostgreSQL is installed"
fi

# Check if PostgreSQL is running
if ! sudo systemctl is-active --quiet postgresql; then
    echo -e "${BLUE}[INFO]${NC} Starting PostgreSQL service..."
    sudo systemctl start postgresql
fi

echo -e "${BLUE}[INFO]${NC} Creating database and user..."

# Create user and database
sudo -u postgres psql << EOF
-- Drop existing database and user if they exist
DROP DATABASE IF EXISTS ${DB_NAME};
DROP USER IF EXISTS ${DB_USER};

-- Create new user
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';

-- Create database
CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};

-- Connect to the new database and grant schema privileges
\c ${DB_NAME}
GRANT ALL ON SCHEMA public TO ${DB_USER};
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${DB_USER};
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${DB_USER};

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};

\q
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}[SUCCESS]${NC} Database and user created successfully"
else
    echo -e "${RED}[ERROR]${NC} Failed to create database and user"
    exit 1
fi

# Test connection
echo -e "${BLUE}[INFO]${NC} Testing database connection..."
export PGPASSWORD="${DB_PASSWORD}"
psql -h localhost -U ${DB_USER} -d ${DB_NAME} -c "SELECT version();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}[SUCCESS]${NC} Database connection successful"
else
    echo -e "${RED}[ERROR]${NC} Database connection failed"
    exit 1
fi

echo -e "${GREEN}[SUCCESS]${NC} Database setup completed!"
echo -e "${YELLOW}[INFO]${NC} Database Details:"
echo "  - Database: ${DB_NAME}"
echo "  - User: ${DB_USER}"
echo "  - Host: localhost"
echo "  - Port: ${DB_PORT}"
echo ""
echo -e "${BLUE}[NEXT]${NC} Run the schema creation script next."