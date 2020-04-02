CREATE TABLE versions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name varchar(50) NOT NULL,
    id INTEGER NOT NULL
);
