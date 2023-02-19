create table shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_from TIMESTAMPTZ NOT NULL,
    shift_to TIMESTAMPTZ NOT NULL,
    required_staff INTEGER NOT NULL,
    required_managers INTEGER NOT NULL
);

create table shifts_taken (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_id UUID NOT NULL REFERENCES shifts (id),
    user_id UUID NOT NULL REFERENCES users (id)
);
