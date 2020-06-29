CREATE TABLE user_tokens
(
    user_id     integer not null,
	token_type	integer,--0=firebase
	token		varchar(1000)	
);


GRANT ALL ON TABLE user_tokens TO PUBLIC;