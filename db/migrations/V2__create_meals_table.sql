CREATE TABLE meals (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    type VARCHAR NULL,
    location POINT NOT NULL,
    address VARCHAR NOT NULL,
    guest_count INT NOT NULL,
    host_id INTEGER NOT NULL
);
