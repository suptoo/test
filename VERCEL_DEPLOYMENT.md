# Vercel Deployment Fix Guide

## The Problem
Vercel caches dependencies and doesn't automatically regenerate the Prisma Client, causing build failures.

## The Solution

### 1. Updated Build Process
- `postinstall`: Runs `prisma generate` after npm install
- `build`: Runs `prisma generate` before Next.js build
- `vercel-build`: Custom build command for Vercel

### 2. Vercel Configuration
The `vercel.json` file now includes:
- Custom build command that ensures Prisma generation
- Explicit install command with Prisma generation
- Proper environment variables

### 3. Enhanced Prisma Setup
- Multiple binary targets for different environments
- Improved singleton pattern for Prisma client
- Better error handling and logging

## Deployment Steps

### Step 1: Database Setup
Use a PostgreSQL provider like Neon, Supabase, or Railway:

**For Neon:**
1. Create account at https://neon.tech
2. Create a new project
3. Copy the connection string

### Step 2: Vercel Environment Variables
Add these in your Vercel dashboard:

\`\`\`
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
DIRECT_URL=postgresql://user:pass@host:5432/db?sslmode=require
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here
\`\`\`

### Step 3: Deploy
1. Push code to GitHub
2. Connect repository to Vercel
3. Vercel will automatically use the build configuration

### Step 4: Database Migration
After successful deployment:

\`\`\`bash
# Using Vercel CLI
vercel env pull .env.local
npx prisma db push

# Or directly in your database
# Run the SQL commands to create tables
\`\`\`

### Step 5: Create Admin User
Insert an admin user in your database:

\`\`\`sql
INSERT INTO users (id, email, name, role, phone_verified) 
VALUES ('admin-001', 'admin@yourdomain.com', 'Admin User', 'ADMIN', true);
\`\`\`

## Troubleshooting

### If Build Still Fails:
1. Check Vercel build logs for specific errors
2. Ensure all environment variables are set
3. Try redeploying after clearing Vercel cache

### Database Issues:
1. Verify DATABASE_URL format
2. Ensure database allows connections
3. Check SSL requirements

### Prisma Issues:
1. Verify schema.prisma syntax
2. Check binary targets match deployment environment
3. Ensure @prisma/client version matches prisma version
