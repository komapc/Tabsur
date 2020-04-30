CREATE TABLE follow (
   	follower INTEGER NOT NULL,
	followie INTEGER NOT NULL,
	created_t TIMESTAMPTZ DEFAULT NOW(),
	status INTEGER NOT NULL DEFAULT 1, --1 - active; 2 - canceled 
	UNIQUE (follower, followie)
);