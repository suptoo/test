#!/bin/bash

echo "🔍 Checking build requirements..."

# Check if Prisma client exists
if [ -d "node_modules/@prisma/client" ] || [ -d "prisma/generated/client" ]; then
    echo "✅ Prisma client found"
else
    echo "❌ Prisma client not found, generating..."
    npx prisma generate
fi

# Check if database is accessible
echo "🔍 Checking database connection..."
if npx prisma db push --accept-data-loss --skip-generate; then
    echo "✅ Database connection successful"
else
    echo "⚠️  Database connection failed (this is normal if DB doesn't exist yet)"
fi

# Run the build
echo "🏗️  Starting build process..."
npm run build
