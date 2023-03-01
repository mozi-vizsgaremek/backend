CREATE TABLE movies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    duration_mins INTEGER NOT NULL,
    thumbnail_path TEXT NOT NULL,
    banner_path TEXT NOT NULL
);