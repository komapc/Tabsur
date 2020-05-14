ALTER TABLE meals ADD COLUMN "visibility" integer;-- 0 (default) = public; 1 = followers only

ALTER TABLE users ADD COLUMN "FB_ID"  integer default NULL;--facebook id