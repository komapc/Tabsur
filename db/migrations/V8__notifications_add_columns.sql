SELECT * from notifications;
ALTER TABLE notifications
ADD COLUMN  message_text  varchar(250),
ADD COLUMN sender integer