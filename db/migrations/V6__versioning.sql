CREATE TABLE versions (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name varchar(50) NOT NULL
);

insert into versions (name) values ('production-1')