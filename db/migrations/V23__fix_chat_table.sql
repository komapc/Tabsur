-- Fix chat system by creating proper chat table structure
-- The current system uses notifications table, but should have dedicated chat table

-- Drop the unused messages table if it exists
DROP TABLE IF EXISTS messages;

-- Create proper chat table matching the API expectations
CREATE TABLE IF NOT EXISTS chat (
    id SERIAL PRIMARY KEY,
    from_id INTEGER NOT NULL REFERENCES users(id),
    to_id INTEGER NOT NULL REFERENCES users(id), 
    message TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    seen BOOLEAN DEFAULT false,
    received BOOLEAN DEFAULT false
);

-- Create indexes for chat performance
CREATE INDEX IF NOT EXISTS idx_chat_from_to ON chat (from_id, to_id);
CREATE INDEX IF NOT EXISTS idx_chat_timestamp ON chat (timestamp);

-- Grant permissions
GRANT ALL ON TABLE chat TO PUBLIC;
GRANT ALL ON SEQUENCE chat_id_seq TO PUBLIC;