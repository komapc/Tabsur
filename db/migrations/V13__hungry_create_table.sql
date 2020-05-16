-- Table: public.meals

-- table to claim "hungry situation"
--drop table hungry;
CREATE TABLE hungry
(
    id SERIAL PRIMARY KEY,
    name varchar(200),
    created_at timestamp with time zone DEFAULT now(),
    type character varying COLLATE pg_catalog."default",
    location point NOT NULL,
    address character varying COLLATE pg_catalog."default" NOT NULL,
    user_id integer NOT NULL,
    date timestamp with time zone DEFAULT now(),
	until timestamp with time zone DEFAULT (now() + '1 day'::interval day),
    visibility integer
)
