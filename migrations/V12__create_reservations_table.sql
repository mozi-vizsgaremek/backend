CREATE TABLE reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    screening_id UUID NOT NULL REFERENCES reservations (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    purchase_time TIMESTAMPTZ NOT NULL
);