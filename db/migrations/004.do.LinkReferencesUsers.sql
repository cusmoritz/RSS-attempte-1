ALTER TABLE "public"."rss_links" ADD "user_id" INT REFERENCES "public"."users"."users.id";