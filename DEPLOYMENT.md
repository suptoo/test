# Deployment Guide

## Vercel Deployment Steps

### 1. Database Setup
First, set up a PostgreSQL database. Recommended providers:
- **Neon** (recommended): https://neon.tech
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app

### 2. Environment Variables
In your Vercel dashboard, add these environment variables:

\`\`\`
DATABASE_URL=your_postgresql_connection_string
DIRECT_URL=your_postgresql_direct_connection_string (for Neon/Supabase)
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=your_secure_random_string
\`\`\`

### 3. Build Configuration
The project is configured with:
- `postinstall` script that runs `prisma generate`
- `build` script that runs `prisma generate && next build`
- `vercel.json` with proper build commands

### 4. Database Migration
After deployment, run database migrations:

\`\`\`bash
# If using Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Or use Prisma Data Platform
npx prisma db push
\`\`\`

### 5. Create Admin User
After deployment, you'll need to create an admin user manually in your database:

\`\`\`sql
INSERT INTO users (id, email, name, role, phone_verified) 
VALUES ('admin-user-id', 'admin@yourdomain.com', 'Admin User', 'ADMIN', true);
\`\`\`

## Troubleshooting

### Prisma Client Issues
If you encounter Prisma client issues:
1. Ensure `prisma generate` runs during build
2. Check that `@prisma/client` and `prisma` versions match
3. Verify environment variables are set correctly

### Database Connection Issues
1. Ensure DATABASE_URL is correct
2. For Neon/Supabase, use both DATABASE_URL and DIRECT_URL
3. Check database permissions and firewall settings

### Build Failures
1. Check Vercel build logs
2. Ensure all dependencies are in package.json
3. Verify TypeScript and ESLint configurations
