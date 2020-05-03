delete * from attends; -- make sure no conflict 
ALTER TABLE attends
ADD CONSTRAINT unic 
UNIQUE (meal_id, user_id);