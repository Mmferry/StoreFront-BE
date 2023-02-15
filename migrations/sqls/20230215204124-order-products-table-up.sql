CREATE TABLE order_products (
  order_id INT NOT NULL REFERENCES orders(id),
  product_id INT NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  CONSTRAINT fk_products
  FOREIGN KEY (product_id)
  REFERENCES products(id)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);