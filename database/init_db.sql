CREATE TABLE IF NOT EXISTS estrellas (
    id SERIAL PRIMARY KEY,
    usuario_creador TEXT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    masa REAL NOT NULL,
    color INT NOT NULL CHECK (color < 16777216),
    cord_x REAL,
    cord_y REAL
);

