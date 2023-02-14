CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL
);