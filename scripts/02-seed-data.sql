-- Insert admin user (replace with your actual admin email)
INSERT INTO users (id, email, name, role, coins, phone_verified) 
VALUES (
    'admin-001', 
    'admin@luminory.com', 
    'Admin User', 
    'ADMIN', 
    1000, 
    TRUE
) ON CONFLICT (email) DO UPDATE SET
    role = 'ADMIN',
    coins = 1000;

-- Insert sample tutor
INSERT INTO users (id, email, name, role, coins, phone, phone_verified) 
VALUES (
    'tutor-001', 
    'tutor@example.com', 
    'Sample Tutor', 
    'TUTOR', 
    50, 
    '01234567890',
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Insert sample student
INSERT INTO users (id, email, name, role, phone, phone_verified) 
VALUES (
    'student-001', 
    'student@example.com', 
    'Sample Student', 
    'STUDENT', 
    '01987654321',
    TRUE
) ON CONFLICT (email) DO NOTHING;
