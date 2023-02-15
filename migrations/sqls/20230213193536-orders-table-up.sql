CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id bigint REFERENCES users(id),
  status VARCHAR(64),
  CONSTRAINT fk_orders_users
  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);