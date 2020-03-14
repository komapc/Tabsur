CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    password VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    address VARCHAR NOT NULL
);
