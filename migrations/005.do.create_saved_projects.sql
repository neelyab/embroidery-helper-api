CREATE TABLE saved_projects(
    user_id INTEGER REFERENCES embroidery_users(id) ON DELETE CASCADE,
    id INTEGER REFERENCES embroidery_projects(id) ON DELETE CASCADE
);