CREATE TABLE embroidery_stitches (
    id SERIAL PRIMARY KEY,
    stitch_name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    stitch_description TEXT NOT NULL
);