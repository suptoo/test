# TeacherOn Platform

A comprehensive tutoring platform built with Next.js 14, Prisma, and PostgreSQL.

## Features

### For Students
- Register and login with email
- Phone verification via WhatsApp (demo implementation)
- Post tutoring requests with detailed descriptions
- View their own posts and see how many tutors viewed them

### For Tutors
- Register and login with email
- Purchase coins (minimum 250 coins = 250 Taka)
- Browse student posts (content hidden until coins are spent)
- Spend 1 coin to view each student post
- Track coin balance and transactions

### For Admins
- Admin panel to manage all users
- Add coins to any tutor manually
- View platform statistics
- Monitor user activity and transactions

## Tech Stack

- **Frontend**: Next.js 14 with App Router, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **UI Components**: Custom components with Radix UI primitives

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd teacheron-platform
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` with your database URL and other configurations.

4. Set up the database:
\`\`\`bash
npx prisma migrate dev --name init
npx prisma generate
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

The application uses PostgreSQL. Make sure you have a PostgreSQL database running and update the `DATABASE_URL` in your `.env` file.

Run the following commands to set up your database:

\`\`\`bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to view your data
npx prisma studio
\`\`\`

## Usage

### Demo Credentials
For testing purposes, you can use any email with the password `password123` to sign in.

### Phone Verification
The phone verification is implemented as a demo. Enter any 6-digit code to verify your phone number.

### Coin System
- 1 coin = 1 Taka
- Minimum purchase: 250 coins
- Each student post costs 1 coin to view
- Admins can manually add coins to tutors

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy!

Make sure to:
- Set up a production PostgreSQL database (recommended: Neon, Supabase, or Railway)
- Update your `DATABASE_URL` environment variable
- Set `NEXTAUTH_URL` to your production domain
- Generate a secure `NEXTAUTH_SECRET`

## Project Structure

\`\`\`
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── student/           # Student dashboard
│   ├── tutor/             # Tutor dashboard
│   ├── admin/             # Admin panel
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
└── types/                # TypeScript type definitions
\`\`\`

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/verify-phone` - Phone verification
- `GET/POST /api/posts` - Manage posts
- `POST /api/posts/[id]/view` - View a post (costs 1 coin)
- `POST /api/coins/purchase` - Purchase coins
- `POST /api/admin/add-coins` - Admin add coins
- `GET /api/admin/users` - Get all users (admin only)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
