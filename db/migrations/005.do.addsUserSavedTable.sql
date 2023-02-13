CREATE TABLE IF NOT EXISTS user_saved (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "users"(id) NOT NULL,
    post_id INTEGER REFERENCES "rss"(id) NOT NULL
);