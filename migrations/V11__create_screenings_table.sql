CREATE TABLE screenings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    movie_id UUID NOT NULL REFERENCES movies (id) ON DELETE CASCADE,
    auditorum_id UUID NOT NULL REFERENCES auditoriums (id) ON DELETE CASCADE,
    time TIMESTAMPTZ NOT NULL
);