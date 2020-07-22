alter table notifications rename  column user_id to receiver;

alter table notifications add  column click_action varchar(100);
alter table notifications add  column icon varchar(100);
alter table notifications add  column title varchar(100);