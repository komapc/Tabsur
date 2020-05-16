-- Table: public.meals

-- table to claim "hungry situation"
CREATE TABLE hungry
(
    id integer NOT NULL DEFAULT nextval('meals_id_seq'::regclass),
    name varchar(200),
    created_at timestamp with time zone DEFAULT now(),
    type character varying COLLATE pg_catalog."default",
    location point NOT NULL,
    address character varying COLLATE pg_catalog."default" NOT NULL,
    user_id integer NOT NULL,
    date timestamp with time zone DEFAULT now(),
    visibility integer,
    CONSTRAINT hungry_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.meals
    OWNER to coolanu;