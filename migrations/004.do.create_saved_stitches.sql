CREATE TABLE saved_stitches (
    user_id INTEGER REFERENCES embroidery_users(id)  ON DELETE CASCADE,
    stitch INTEGER REFERENCES embroidery_stitches(id) ON DELETE CASCADE
);