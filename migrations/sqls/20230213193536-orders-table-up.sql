CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  quantity integer,
  product_id bigint REFERENCES products(id),
  user_id bigint REFERENCES users(id),
  status VARCHAR(64),
  CONSTRAINT fk_users
  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  CONSTRAINT fk_products
  FOREIGN KEY (product_id)
  REFERENCES products(id)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);