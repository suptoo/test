-- Create the admin user with your email
INSERT INTO users (id, email, name, role, phone_verified, coins, created_at, updated_at) 
VALUES (
  'admin-umorfaruksupto', 
  'umorfaruksupto@gmail.com', 
  'Umor Faruk Supto', 
  'ADMIN', 
  true, 
  0,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'ADMIN',
  phone_verified = true,
  updated_at = NOW();

-- Verify the admin user was created
SELECT id, email, name, role, phone_verified FROM users WHERE email = 'umorfaruksupto@gmail.com';
