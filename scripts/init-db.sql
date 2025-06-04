-- Create database tables
-- This will be handled by Prisma migrations
-- Run: npx prisma migrate dev --name init

-- Insert admin user (run after migration)
INSERT INTO users (id, email, name, role, phone_verified) 
VALUES ('admin-user-id', 'admin@teacheron.com', 'Admin User', 'ADMIN', true)
ON CONFLICT (email) DO NOTHING;
