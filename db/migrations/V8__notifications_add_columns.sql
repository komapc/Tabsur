SELECT * from notifications;
ALTER TABLE notifications
ADD COLUMN  message_text  varchar(250),
ADD COLUMN sender integer;


alter table notifications add column status integer; -- 0 - sent; 1 - delivered; 2 - read 

-- 0 - system; 1 - new user; 2 - message; 3 - new meal;
-- 4 - new hungry; 5 - request approved; 6 - rejected; 7 - reminder
alter table notifications add column note_type integer;