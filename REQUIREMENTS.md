# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index (GET `/api/product` )
- Show (GET `/api/product/:id`)
- Create [token required] (POST `/api/products`)
- [ADDED] Delete [token required] `'product/ [token required]id  [DELETE] (token)`
- [ADDED] Update [token required] (PUT `/api/product/:id`) body `{ name: 'product name', price: $$, id: product.id }`

#### Users

- Index [token required] (GET `/api/users`)
- Show [token required] (GET `/api/users/:id`)
- Create (POST `/api/users`) body `{
  first_name: 'FN',
  last_name: 'LN',
  email: '@gmail.com',
  password: 'pass123'
}`
- [ADDED] Delete [token required]: `'users/:id' [DELETE]`
- [ADDED] Update [token required]: (PUT `/api/users/:id`) body `{
  first_name: 'FN',
  last_name: 'LN',
  id: id
}`

#### Orders

- Current Order by user (args: user id)[token required]
  Index [token required] (GET `/api/order`)
- Show [token required] (GET `/api/order/:id`)
- Create [token required] (POST `/api/order`)
- Update [token required] (PUT `/api/order/:id`) body `{
    status: 'completed',
    id: orderId
  }`
- Delete [token required] (DELETE `/api/order/:id`)

## Data Shapes

#### Product

- id
- name
- price
- category

The SQL schema for this table is as follows:

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  price integer NOT NULL,
  category VARCHAR(64)
);
```

#### User

- id
- firstName
- lastName
- email
- password

The SQL schema for this table is as follows:

```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

#### Orders

- id
- user_id
- status of order (active or complete)

The SQL schema for this table is as follows:

```sql
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
```

#### Table: order_products

- order_id INTEGER REFERENCES orders(id)
- product_id INTEGER REFERENCES products(id)
- quantity INTEGER

The SQL schema for this table is as follows:

```sql
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
```
