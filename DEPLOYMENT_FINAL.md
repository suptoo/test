# Final Deployment Guide - Simplified

## Changes Made

### 1. Simplified Scripts
- Removed custom `vercel-build` script
- Using standard `build` script with Prisma generation
- Kept `postinstall` for automatic Prisma generation

### 2. Streamlined Configuration
- Simplified `vercel.json` with standard commands
- Removed complex custom output paths
- Using default Prisma client location

### 3. Clean Dependencies
- No conflicting packages
- Standard Prisma setup
- Minimal configuration for reliability

## Deployment Steps

### Step 1: Database Setup
Choose a PostgreSQL provider:

**Neon (Recommended):**
1. Go to https://neon.tech
2. Create new project
3. Copy connection string

**Supabase:**
1. Go to https://supabase.com
2. Create new project
3. Get connection string from Settings > Database

### Step 2: Environment Variables
In Vercel dashboard, add:

\`\`\`
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-super-long-secret-key-here
\`\`\`

### Step 3: Deploy
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Step 4: Database Migration
After successful deployment:

\`\`\`bash
# Pull environment variables
vercel env pull .env.local

# Push database schema
npx prisma db push

# Verify with health check
curl https://your-app.vercel.app/api/health
\`\`\`

### Step 5: Create Admin User
Run this SQL in your database:

\`\`\`sql
INSERT INTO users (id, email, name, role, phone_verified) 
VALUES ('admin-001', 'admin@yourdomain.com', 'Admin User', 'ADMIN', true);
\`\`\`

## Testing

### Local Testing
\`\`\`bash
npm install --legacy-peer-deps
npm run dev
\`\`\`

### Production Testing
1. Visit `/api/health` to check database connection
2. Test authentication flow
3. Test all user roles
4. Verify coin system functionality

## Troubleshooting

### Build Issues:
- Check Vercel build logs
- Ensure all environment variables are set
- Verify DATABASE_URL format

### Database Issues:
- Test connection with health endpoint
- Check SSL requirements
- Verify database permissions

### Authentication Issues:
- Ensure NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches deployment URL
- Check session configuration

## Features to Test

### Student Flow:
1. Register as student
2. Verify phone (demo: any 6 digits)
3. Create tutoring post
4. View own posts

### Tutor Flow:
1. Register as tutor
2. Purchase coins (minimum 250)
3. Browse student posts
4. Spend coins to view posts

### Admin Flow:
1. Sign in as admin
2. View admin panel
3. Add coins to tutors
4. Monitor platform statistics

## Success Indicators
- ✅ Health endpoint returns "healthy"
- ✅ Authentication works
- ✅ Database operations succeed
- ✅ All user roles function properly
- ✅ Coin system operates correctly
