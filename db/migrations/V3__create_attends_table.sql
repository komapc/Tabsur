CREATE TABLE attends (
    created_at TIMESTAMPTZ DEFAULT NOW(),
    meal_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    status INTEGER NOT NULL DEFAULT 0
    -- 0 - pending, 1 - approved, 2 - rejected
);
