DROP TABLE IF EXISTS activity;
DROP TABLE IF EXISTS flags;
DROP TABLE IF EXISTS user_blocks;
DROP TABLE IF EXISTS user_followers;
DROP TABLE IF EXISTS list_places;
DROP TABLE IF EXISTS lists;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS ratings_reviews;
DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS users;

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255),
    timezone VARCHAR(64),
    bio TEXT,
    avatar_url VARCHAR(255),
    is_admin BOOLEAN DEFAULT false,
    is_banned BOOLEAN DEFAULT false,
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- Places Table
CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    google_places_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    address VARCHAR NOT NULL,
    loc POINT,
    recommendations INT NOT NULL DEFAULT 0,
    ratings_counts JSONB DEFAULT '{"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}',
    is_operational BOOLEAN DEFAULT true,
    is_archived BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    created_by INT REFERENCES users(id),
    approved_by INT REFERENCES users(id),
    flagged BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ
);

-- Activity Table
CREATE TABLE activity (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    activity_type VARCHAR(255) NOT NULL,
    activity_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lists Table
CREATE TABLE lists (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    is_ordered BOOLEAN DEFAULT false,
    is_private BOOLEAN DEFAULT false,
    is_flagged BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- List Places Table
CREATE TABLE list_places (
    id SERIAL PRIMARY KEY,
    list_id INT REFERENCES lists(id),
    place_id INT REFERENCES places(id),
    position INT,
    is_completed BOOLEAN DEFAULT false,
    added_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ratings Reviews Table
CREATE TABLE ratings_reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    place_id INT REFERENCES places(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_summary VARCHAR(255),
    review_text TEXT,
    recommends BOOLEAN,
    is_private BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    is_flagged BOOLEAN DEFAULT false,
    is_superseded BOOLEAN DEFAULT false,
    successor_review_id INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Photos Table
CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    photo_url VARCHAR(255),
    description TEXT,
    associated_review_id INT,
    place_id INT REFERENCES places(id),
    is_private BOOLEAN DEFAULT false,
    is_flagged BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Followers Table
CREATE TABLE user_followers (
    follower_id INT REFERENCES users(id),
    followee_id INT REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, followee_id)
);

-- User Blocks Table
CREATE TABLE user_blocks (
    blocker_id INT REFERENCES users(id),
    blocked_id INT REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (blocker_id, blocked_id)
);

-- Flags Table
CREATE TABLE flags (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) NOT NULL,
    flaggable_type VARCHAR(255) NOT NULL,
    flaggable_id INT NOT NULL,
    reason TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT false,
    resolved_by INT REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

