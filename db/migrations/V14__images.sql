-- images for meals and users
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

insert into images  (path, status)  (select 0,0  FROM generate_series(1,1000) );
update  images set path=CONCAT('https://i.picsum.photos/id/', id, '/200/200.jpg');
insert into meal_images (image_id, meal_id) select id, id from meals
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO production_db;
