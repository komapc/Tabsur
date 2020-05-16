-- images for meals and userso

CREATE TABLE images
(
	id SERIAL PRIMARY KEY,
	path varchar(300),
	status numeric
);

CREATE TABLE meal_images
(
	id SERIAL PRIMARY KEY,
	image_id numeric,
	meal_id numeric
);

CREATE TABLE user_images
(
	id SERIAL PRIMARY KEY,
	image_id numeric,
	user_id numeric
)