#!/bin/bash
#
# Supabase User Management Script Setup
# ====================================
# This script sets up the Python environment for user management

echo "🔧 Setting up Supabase User Management Script"
echo "=============================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.7+ first."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Check if pip is available
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip first."
    exit 1
fi

echo "✅ pip3 found: $(pip3 --version)"

# Install required packages
echo ""
echo "📦 Installing Python dependencies..."
pip3 install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.example .env
    echo "✅ Created .env file from template"
    echo ""
    echo "🔑 IMPORTANT: Please edit the .env file with your Supabase credentials:"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY (optional but recommended)"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Make the main script executable
chmod +x insert_user.py

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📚 Next steps:"
echo "   1. Edit .env file with your Supabase credentials"
echo "   2. Run: python3 insert_user.py --interactive"
echo "   3. Or see README.md for more usage examples"
echo ""
echo "🔍 Quick test:"
echo "   python3 insert_user.py --help"