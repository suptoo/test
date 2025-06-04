#!/bin/bash

echo "🔄 Generating Prisma Client..."

# Ensure Prisma CLI is available
if ! command -v prisma &> /dev/null; then
    echo "Installing Prisma CLI..."
    npm install -g prisma
fi

# Generate Prisma Client
npx prisma generate

echo "✅ Prisma Client generated successfully"

# Verify the client was generated
if [ -d "node_modules/.prisma/client" ]; then
    echo "✅ Prisma Client files found"
else
    echo "❌ Prisma Client files not found"
    exit 1
fi
