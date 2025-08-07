#!/bin/bash

# UC Talent Backend - Database Migration Script
# This script helps you run database migrations safely

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

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found. Please create one based on .env.example"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Installing dependencies..."
    npm install
fi

# Function to check database connection
check_db_connection() {
    print_status "Checking database connection..."
    
    # You can add a simple database connection test here
    # For now, we'll just check if the migration command works
    if npm run migration:run --dry-run > /dev/null 2>&1; then
        print_success "Database connection successful"
        return 0
    else
        print_error "Database connection failed. Please check your .env configuration"
        return 1
    fi
}

# Function to run migrations
run_migrations() {
    print_status "Running database migrations..."
    
    if npm run migration:run; then
        print_success "All migrations completed successfully!"
    else
        print_error "Migration failed. Please check the error messages above."
        exit 1
    fi
}

# Function to show migration status
show_status() {
    print_status "Showing migration status..."
    npm run typeorm -- migration:show -d src/infrastructure/database/data-source.ts
}

# Function to revert last migration
revert_migration() {
    print_warning "Reverting last migration..."
    read -p "Are you sure you want to revert the last migration? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if npm run migration:revert; then
            print_success "Last migration reverted successfully!"
        else
            print_error "Failed to revert migration."
            exit 1
        fi
    else
        print_status "Migration revert cancelled."
    fi
}

# Main script logic
case "${1:-run}" in
    "run")
        print_status "Starting database migration process..."
        check_db_connection
        run_migrations
        ;;
    "status")
        show_status
        ;;
    "revert")
        revert_migration
        ;;
    "check")
        check_db_connection
        ;;
    "help"|"-h"|"--help")
        echo "UC Talent Backend - Database Migration Script"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  run     - Run all pending migrations (default)"
        echo "  status  - Show migration status"
        echo "  revert  - Revert the last migration"
        echo "  check   - Check database connection"
        echo "  help    - Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0              # Run migrations"
        echo "  $0 run          # Run migrations"
        echo "  $0 status       # Show status"
        echo "  $0 revert       # Revert last migration"
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
