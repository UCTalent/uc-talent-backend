#!/bin/bash

# UC Talent Backend - Debug Migration Script
# This script runs migrations with explicit environment variables

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Load environment variables
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
    print_success "Loaded environment variables from .env"
else
    print_error ".env file not found"
    exit 1
fi

# Database configuration
DB_HOST=${DATABASE_HOST:-localhost}
DB_PORT=${DATABASE_PORT:-5432}
DB_USER=${DATABASE_USERNAME:-hoanghiep}
DB_PASS=${DATABASE_PASSWORD:-}
DB_NAME=${DATABASE_NAME:-utc_backend}

print_status "Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  User: $DB_USER"
echo "  Database: $DB_NAME"
echo "  Password: ${DB_PASS:-'(empty)'}"

# Test database connection first
print_status "Testing database connection..."
if PGPASSWORD="$DB_PASS" psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" &> /dev/null; then
    print_success "Database connection successful"
else
    print_error "Database connection failed"
    exit 1
fi

# Run migrations with explicit environment variables
print_status "Running migrations..."
DATABASE_HOST=$DB_HOST \
DATABASE_PORT=$DB_PORT \
DATABASE_USERNAME=$DB_USER \
DATABASE_PASSWORD="$DB_PASS" \
DATABASE_NAME=$DB_NAME \
npm run migration:run

print_success "Migration completed!"
