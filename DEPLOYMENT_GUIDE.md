# Fixed Deployment Guide

## Issues Resolved

### 1. Dependency Conflicts
- Removed conflicting packages (bcryptjs, date-fns conflicts)
- Added npm overrides for date-fns version resolution
- Moved prisma to dependencies (required for production)

### 2. Simplified Build Process
- Streamlined package.json scripts
- Simplified Vercel configuration
- Used --legacy-peer-deps for npm install

### 3. Prisma Configuration
- Simplified schema without complex binary targets
- Removed directUrl (not needed for basic setup)
- Cleaner Prisma client initialization

## Deployment Steps

### Step 1: Database Setup
Choose a PostgreSQL provider:

**Neon (Recommended):**
1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string

**Supabase:**
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

### Step 2: Environment Variables
In your Vercel dashboard, add:

\`\`\`
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-super-long-secret-key-here
\`\`\`

### Step 3: Deploy
1. Push your code to GitHub
2. Connect repository to Vercel
3. Deploy will now work with the fixed dependencies

### Step 4: Database Setup
After deployment, set up your database:

\`\`\`bash
# Pull environment variables
vercel env pull .env.local

# Push database schema
npx prisma db push

# (Optional) Seed with admin user
npx prisma db seed
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
1. Test all user roles (Student, Tutor, Admin)
2. Test coin purchases and spending
3. Test phone verification flow
4. Test admin panel functionality

## Troubleshooting

### If npm install fails:
- Use \`npm install --legacy-peer-deps --force\`
- Clear npm cache: \`npm cache clean --force\`

### If Prisma fails:
- Ensure DATABASE_URL is correct
- Check database connectivity
- Run \`npx prisma generate\` manually

### If deployment fails:
- Check Vercel build logs
- Verify all environment variables
- Try redeploying after clearing cache
