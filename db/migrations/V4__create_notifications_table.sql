CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    meal_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL
);
