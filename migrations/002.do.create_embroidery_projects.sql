CREATE TABLE embroidery_projects (
    id SERIAL PRIMARY KEY,
    project_name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    project_description TEXT NOT NULL,
    project_url TEXT NOT NULL,
    stitches TEXT NOT NULL
);