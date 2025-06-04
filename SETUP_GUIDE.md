# TeacherOn Setup with Your Database

## Database Integration

### 1. Existing Database Schema
Your Neon database has a `neon_auth.users_sync` table that we've integrated into the Prisma schema.

### 2. Admin User Setup
Your admin email `umorfaruksupto@gmail.com` is configured with:
- **Role**: ADMIN
- **Password**: `admin123` (for demo)
- **Auto phone verification**: Enabled

### 3. Firebase Integration
Your Firebase config is integrated for:
- Analytics tracking
- Future authentication enhancements
- Real-time features

## Deployment Steps

### Step 1: Database Setup
Run the admin setup script:
\`\`\`bash
# This will create your admin user
npm run db:push
\`\`\`

### Step 2: Environment Variables
Set in Vercel:
\`\`\`
DATABASE_URL=your_neon_database_url
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key
\`\`\`

### Step 3: Deploy
Push to GitHub and deploy via Vercel.

### Step 4: Admin Access
1. Go to `/auth/signin`
2. Email: `umorfaruksupto@gmail.com`
3. Password: `admin123`
4. Access admin panel at `/admin`

## Features

### Admin Panel Features
- **User Sync**: Import users from `neon_auth.users_sync`
- **Coin Management**: Add coins to tutors
- **User Management**: View all users and statistics
- **Analytics**: Monitor platform usage

### User Sync
The admin panel includes a "Sync Users" button that:
- Imports users from your existing `neon_auth.users_sync` table
- Automatically sets your email as ADMIN
- Skips existing users to avoid duplicates

### Firebase Integration
- Analytics tracking enabled
- Ready for future Firebase Auth integration
- Firestore available for real-time features

## Testing

### Admin Login
- Email: `umorfaruksupto@gmail.com`
- Password: `admin123`

### Regular Users
- Any email with password: `password123`
- Or register new users through `/auth/signup`

## Next Steps

1. **Deploy** the application
2. **Run admin setup** script
3. **Test admin login**
4. **Sync existing users** from Neon auth
5. **Configure Firebase** features as needed
