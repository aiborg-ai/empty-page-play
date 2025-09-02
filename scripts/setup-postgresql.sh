#!/bin/bash

# ============================================================================
# PostgreSQL Local Setup Script for InnoSpot
# ============================================================================
# This script installs and configures a local PostgreSQL instance
# for InnoSpot development and testing.
#
# Usage: bash scripts/setup-postgresql.sh
# ============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="innospot_dev"
DB_USER="innospot_user"
DB_PASSWORD="innospot_password"
DB_HOST="localhost"
DB_PORT="5432"

echo -e "${BLUE}🚀 Setting up PostgreSQL for InnoSpot...${NC}"

# ============================================================================
# DETECT OPERATING SYSTEM
# ============================================================================
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/debian_version ]; then
            echo "debian"
        elif [ -f /etc/redhat-release ]; then
            echo "redhat"
        else
            echo "linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}

OS=$(detect_os)
echo -e "${YELLOW}📋 Detected OS: $OS${NC}"

# ============================================================================
# INSTALL POSTGRESQL
# ============================================================================
install_postgresql() {
    echo -e "${BLUE}📦 Installing PostgreSQL...${NC}"
    
    case $OS in
        "debian")
            sudo apt update
            sudo apt install -y postgresql postgresql-contrib postgresql-client
            ;;
        "redhat")
            sudo yum install -y postgresql-server postgresql-contrib postgresql
            sudo postgresql-setup initdb
            ;;
        "macos")
            if command -v brew >/dev/null 2>&1; then
                brew install postgresql
                brew services start postgresql
            else
                echo -e "${RED}❌ Homebrew not found. Please install Homebrew first.${NC}"
                exit 1
            fi
            ;;
        "windows")
            echo -e "${RED}❌ Windows detected. Please install PostgreSQL manually from https://www.postgresql.org/download/windows/${NC}"
            echo -e "${YELLOW}💡 After installation, run this script again to configure the database.${NC}"
            exit 1
            ;;
        *)
            echo -e "${RED}❌ Unsupported OS. Please install PostgreSQL manually.${NC}"
            exit 1
            ;;
    esac
    
    echo -e "${GREEN}✅ PostgreSQL installed successfully${NC}"
}

# ============================================================================
# START POSTGRESQL SERVICE
# ============================================================================
start_postgresql() {
    echo -e "${BLUE}🔄 Starting PostgreSQL service...${NC}"
    
    case $OS in
        "debian")
            sudo systemctl start postgresql
            sudo systemctl enable postgresql
            ;;
        "redhat")
            sudo systemctl start postgresql
            sudo systemctl enable postgresql
            ;;
        "macos")
            if command -v brew >/dev/null 2>&1; then
                brew services start postgresql
            else
                pg_ctl -D /usr/local/var/postgres start
            fi
            ;;
    esac
    
    echo -e "${GREEN}✅ PostgreSQL service started${NC}"
}

# ============================================================================
# CHECK IF POSTGRESQL IS RUNNING
# ============================================================================
check_postgresql() {
    echo -e "${BLUE}🔍 Checking PostgreSQL status...${NC}"
    
    if pg_isready -h $DB_HOST -p $DB_PORT >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL is running${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  PostgreSQL is not running${NC}"
        return 1
    fi
}

# ============================================================================
# CREATE DATABASE AND USER
# ============================================================================
setup_database() {
    echo -e "${BLUE}🗄️  Setting up database and user...${NC}"
    
    # Create user and database
    sudo -u postgres psql << EOF
-- Create user if not exists
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
        CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
    END IF;
END
\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;

-- Show created resources
\l
\du
EOF
    
    echo -e "${GREEN}✅ Database and user created successfully${NC}"
}

# ============================================================================
# CONFIGURE POSTGRESQL
# ============================================================================
configure_postgresql() {
    echo -e "${BLUE}⚙️  Configuring PostgreSQL...${NC}"
    
    # Find PostgreSQL config directory
    PG_CONFIG_DIR=""
    case $OS in
        "debian")
            PG_VERSION=$(sudo -u postgres psql -t -c "SELECT version();" | grep -oP '\d+\.\d+' | head -1)
            PG_CONFIG_DIR="/etc/postgresql/$PG_VERSION/main"
            ;;
        "redhat")
            PG_CONFIG_DIR="/var/lib/pgsql/data"
            ;;
        "macos")
            if command -v brew >/dev/null 2>&1; then
                PG_CONFIG_DIR=$(brew --prefix)/var/postgres
            else
                PG_CONFIG_DIR="/usr/local/var/postgres"
            fi
            ;;
    esac
    
    if [ -n "$PG_CONFIG_DIR" ] && [ -d "$PG_CONFIG_DIR" ]; then
        echo -e "${YELLOW}📍 PostgreSQL config directory: $PG_CONFIG_DIR${NC}"
        
        # Backup original configs
        sudo cp "$PG_CONFIG_DIR/postgresql.conf" "$PG_CONFIG_DIR/postgresql.conf.backup" 2>/dev/null || true
        sudo cp "$PG_CONFIG_DIR/pg_hba.conf" "$PG_CONFIG_DIR/pg_hba.conf.backup" 2>/dev/null || true
        
        # Configure for development
        echo -e "${BLUE}📝 Updating PostgreSQL configuration for development...${NC}"
        
        # Enable local connections
        if [ -f "$PG_CONFIG_DIR/pg_hba.conf" ]; then
            sudo sed -i "s/#local   all             all                                     peer/local   all             all                                     trust/g" "$PG_CONFIG_DIR/pg_hba.conf" || true
            sudo sed -i "s/local   all             all                                     peer/local   all             all                                     trust/g" "$PG_CONFIG_DIR/pg_hba.conf" || true
        fi
        
        echo -e "${GREEN}✅ PostgreSQL configured for development${NC}"
    else
        echo -e "${YELLOW}⚠️  Could not find PostgreSQL config directory${NC}"
    fi
}

# ============================================================================
# RESTART POSTGRESQL
# ============================================================================
restart_postgresql() {
    echo -e "${BLUE}🔄 Restarting PostgreSQL...${NC}"
    
    case $OS in
        "debian")
            sudo systemctl restart postgresql
            ;;
        "redhat")
            sudo systemctl restart postgresql
            ;;
        "macos")
            if command -v brew >/dev/null 2>&1; then
                brew services restart postgresql
            else
                pg_ctl -D /usr/local/var/postgres restart
            fi
            ;;
    esac
    
    # Wait for PostgreSQL to start
    sleep 3
    
    echo -e "${GREEN}✅ PostgreSQL restarted${NC}"
}

# ============================================================================
# TEST CONNECTION
# ============================================================================
test_connection() {
    echo -e "${BLUE}🧪 Testing database connection...${NC}"
    
    # Test connection as the created user
    if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT version();" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Database connection successful${NC}"
        
        # Show connection info
        echo -e "${YELLOW}📋 Database Connection Details:${NC}"
        echo -e "  Host: $DB_HOST"
        echo -e "  Port: $DB_PORT"
        echo -e "  Database: $DB_NAME"
        echo -e "  User: $DB_USER"
        echo -e "  Password: $DB_PASSWORD"
        
        return 0
    else
        echo -e "${RED}❌ Database connection failed${NC}"
        return 1
    fi
}

# ============================================================================
# CREATE ENVIRONMENT FILE
# ============================================================================
create_env_file() {
    echo -e "${BLUE}📄 Creating .env.local file...${NC}"
    
    cat > .env.local << EOF
# Local PostgreSQL Database Configuration
# Generated by setup-postgresql.sh on $(date)

# Database Configuration
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
DB_HOST="$DB_HOST"
DB_PORT="$DB_PORT"
DB_NAME="$DB_NAME"
DB_USER="$DB_USER"
DB_PASSWORD="$DB_PASSWORD"

# Development Settings
NODE_ENV="development"
DEBUG="true"

# Supabase (kept for compatibility, but PostgreSQL will be used)
VITE_SUPABASE_URL="http://localhost:3000"
VITE_SUPABASE_ANON_KEY="your-anon-key"
EOF
    
    echo -e "${GREEN}✅ .env.local file created${NC}"
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================
main() {
    echo -e "${BLUE}🎯 Starting PostgreSQL setup for InnoSpot${NC}"
    
    # Check if PostgreSQL is already installed and running
    if command -v psql >/dev/null 2>&1 && check_postgresql; then
        echo -e "${GREEN}✅ PostgreSQL is already installed and running${NC}"
    else
        echo -e "${YELLOW}📦 PostgreSQL not found or not running. Installing...${NC}"
        install_postgresql
        start_postgresql
    fi
    
    # Setup database
    setup_database
    
    # Configure PostgreSQL
    configure_postgresql
    
    # Restart to apply configurations
    restart_postgresql
    
    # Test connection
    if test_connection; then
        # Create environment file
        create_env_file
        
        echo -e "${GREEN}🎉 PostgreSQL setup completed successfully!${NC}"
        echo -e "${YELLOW}💡 Next steps:${NC}"
        echo -e "  1. Run: ${BLUE}npm install pg @types/pg${NC}"
        echo -e "  2. Run: ${BLUE}npm run db:migrate${NC}"
        echo -e "  3. Run: ${BLUE}npm run db:seed${NC}"
        echo -e "  4. Start your app: ${BLUE}npm run dev${NC}"
    else
        echo -e "${RED}❌ Setup failed. Please check the errors above.${NC}"
        exit 1
    fi
}

# Run main function
main "$@"