-- V24: Add performance indexes for better query performance
-- This migration adds strategic indexes to improve common query patterns

-- Location-based queries (spatial indexes)
CREATE INDEX IF NOT EXISTS idx_meals_location ON meals USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_hungry_location ON hungry USING GIST (location);

-- Common query patterns
CREATE INDEX IF NOT EXISTS idx_meals_host_id ON meals (host_id);
CREATE INDEX IF NOT EXISTS idx_meals_date ON meals (date);
CREATE INDEX IF NOT EXISTS idx_meals_visibility ON meals (visibility);

CREATE INDEX IF NOT EXISTS idx_attends_meal_id ON attends (meal_id);
CREATE INDEX IF NOT EXISTS idx_attends_user_id ON attends (user_id);
CREATE INDEX IF NOT EXISTS idx_attends_status ON attends (status);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications (created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications (read);

CREATE INDEX IF NOT EXISTS idx_chat_from_to ON chat (from_id, to_id);
CREATE INDEX IF NOT EXISTS idx_chat_created_at ON chat (created_at);

CREATE INDEX IF NOT EXISTS idx_follow_follower_id ON follow (follower_id);
CREATE INDEX IF NOT EXISTS idx_follow_following_id ON follow (following_id);

-- Text search indexes for full-text search
CREATE INDEX IF NOT EXISTS idx_meals_name_description ON meals USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_users_name ON users USING GIN (to_tsvector('english', name));

-- Composite indexes for common query combinations
CREATE INDEX IF NOT EXISTS idx_meals_host_date ON meals (host_id, date);
CREATE INDEX IF NOT EXISTS idx_attends_user_meal ON attends (user_id, meal_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications (user_id, read);
