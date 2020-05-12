CREATE TABLE embroidery_users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    user_password TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL
);