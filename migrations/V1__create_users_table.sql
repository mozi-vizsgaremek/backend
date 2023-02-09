create type ROLE as enum ('customer', 'employee', 'manager', 'admin');

create table users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role ROLE NOT NULL DEFAULT 'customer',
    totp_secret TEXT,

    CONSTRAINT username_regexp CHECK (username ~ '^([A-Za-z0-9_-]){4,32}$')
)
