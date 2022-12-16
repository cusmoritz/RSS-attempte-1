CREATE TABLE IF NOT EXISTS rss_links (
    link_id SERIAL PRIMARY KEY,
    link_title TEXT NOT NULL,
    url TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS rss (
    id SERIAL PRIMARY KEY,
    content TEXT,
    link_id INTEGER REFERENCES rss_links(link_id),
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    date DATE,
    saved BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password VARCHAR(255),
    active BOOLEAN DEFAULT TRUE
);