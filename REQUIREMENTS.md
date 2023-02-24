# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index
- Show
- Create [token required]
- [OPTIONAL] Top 5 most popular products
- [OPTIONAL] Products by category (args: product category)
- [ADDED] Delete: `'product/:id  [DELETE]`
- [ADDED] Update: `'product/:id  [Put] { name: 'product name', price: $$, id: product.id }`


#### Users

- Index [token required]
- Show [token required]
- Create N[token required]
- [ADDED] Delete [token required]: `'users/:id' [DELETE] (token)`

#### Orders

- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]
- [ADDED] Update order's status [token required]: `'order/<id> [PUT] (token)` body `status, id`
- [ADDED] Delete [token required]: `'order/:id [DELETE] (token)`

## Data Shapes

#### Product

- id
- name
- price
- category

#### User

- id
- firstName
- lastName
- email
- password

#### Orders

- id
- user_id
- status of order (active or complete)

#### Table: order_products

- order_id INTEGER REFERENCES orders(id)
- product_id INTEGER REFERENCES products(id)
- quantity INTEGER

