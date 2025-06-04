-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    phone_verified BOOLEAN DEFAULT FALSE,
    role TEXT DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'TUTOR', 'ADMIN')),
    coins INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the posts table
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'TUITION' CHECK (type IN ('TUITION', 'ASSIGNMENT')),
    author_id TEXT NOT NULL,
    include_phone BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the post_views table
CREATE TABLE IF NOT EXISTS post_views (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    tutor_id TEXT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(post_id, tutor_id)
);

-- Create the phone_views table
CREATE TABLE IF NOT EXISTS phone_views (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    tutor_id TEXT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(post_id, tutor_id)
);

-- Create the transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('PURCHASE', 'SPEND', 'ADMIN_ADD')),
    amount INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
