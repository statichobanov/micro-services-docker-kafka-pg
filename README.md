# Yara API Documentation

This documentation provides information about the endpoints available in the Yara Assignment API.

# Local Deployment

## Prerequisites

### Nodejs, Docker, PostgresSQL Editor (pgAdmin, DBeaver, etc..)

## Start up

- **Run Docker compose**: In the root folder open terminal (cmd, bash, etc..). Run the command: "docker-compose up -d" and wait for full initialization of all the services. Status can be checked with "docker ps" or through docker desktop UI.
- **Create DB**: in the db_admin folder run "start-up.cmd" (windows only) or open a terminal (inside dm_admin) and run the command: "node ./src/index.js"
- **Connect to DB**: Connect to DB using:
  ```json
  {
    "host": "localhost",
    "port": 5432,
    "username": "postgres",
    "password": "postgres",
    "database": "yara_assignment"
  }
  ```
- **Populate DB products**: Run the .SQL queries inside db_admin: 'add-products.sql'

## Helpers

- **Import Postman requests**: import Postman requests from the root folder: 'Yara.postman_collection.json'. Open Postman -> File -> Import -> select file

## Troubleshoot

- **Drop docker service**: If a command in run to drop docker services (particularly Postgres service): 'docker-compose down --volumes --rmi all' the Postgres database will be dropped. After services are brough up: 'docker-compose up -d' the DB creation script need to be ran and the add-products.sql

# Database

![Yara assignment Db Shema image:](https://github.com/statichobanov/hidden-repository/blob/bf1a883f04cfdaf9430ae7aaee4eaf6ee30f13be/db_admin/db_scema/db_diagram.png "yara_assignment Db shema")

# Endpoints

## Authentication Service

### Register User

- **Description**: Registers a new user.
- **Method**: POST
- **URL**: `http://localhost:3003/authentication/register`
- **Request Body**:
  ```json
  {
    "username": "admin",
    "password": "admin",
    "first_name": "Admin",
    "last_name": "Adminov"
  }
  ```

### Login

- **Description**: Logs in a user.
- **Method**: POST
- **URL**: `http://localhost:3003/authentication/login`
- **Request Body**:
  ```json
  {
    "username": "admin",
    "password": "admin"
  }
  ```

### Logout

- **Description**: Logs out a user.
- **Method**: GET
- **URL**: `http://localhost:3003/authentication/logout`
- **Request Headers**:
  - Key: Authorization
  - Value: Bearer \<access_token>

### Get All Users

- **Description**: Returns all users
- **Method**: GET
- **URL**: `http://localhost:3003/authentication/get-all-users`
- **Request Headers**:
  - Key: Authorization
  - Value: Bearer \<access_token>

## Order Service

### Create Order

- **Description**: Creates a new order.
- **Comment**: Kafka service is utilized to adjust quantity of products in the DB by sending message to the product-service
- **Method**: POST
- **URL**: `http://localhost:3003/order/create`
- **Request Headers**:
  - Key: Authorization
  - Value: Bearer \<access_token>
- **Request Body**:
  ```json
  {
    // Get id from get all users
    "id_user": "<id_user>",
    "status": "pending",
    "products": [
      {
        "id_product": "222430c9-e424-45c9-9998-ac21874a200a",
        "quantity": 10
      },
      {
        "id_product": "4629a058-180c-4ff9-9896-6adbc0699423",
        "quantity": 3
      }
    ]
  }
  ```

### Delete Order

- **Description**: Deletes an existing order.
- **Comment**: Kafka service is utilized to adjust quantity of products in the DB by sending message to the product-service
- **Method**: POST
- **URL**: `http://localhost:3003/order/delete`
- **Request Headers**:
  - Key: Authorization
  - Value: Bearer \<access_token>
- **Request Body**:
  ```json
  {
    // Get id from create order
    "id_order": "<id_order>"
  }
  ```

## Product Catalog Service

### Create Product

- **Description**: Creates a new product in the catalog.
- **Method**: POST
- **URL**: `http://localhost:3003/product-catalog/create`
- **Request Headers**:
  - Key: Authorization
  - Value: Bearer \<access_token>
- **Request Body**:
  ```json
  {
    "name": "banitsa",
    "price": 10,
    "quantity": 10
  }
  ```

### Update Product

- **Description**: Updates an existing product in the catalog.
- **Method**: POST
- **URL**: `http://localhost:3003/product-catalog/update`
- **Request Headers**:
  - Key: Authorization
  - Value: Bearer \<access_token>
- **Request Body**:
  ```json
  {
    // Get id from create product
    "id": "<id_product",
    "name": "ayran",
    "price": 10,
    "quantity": 10
  }
  ```

### Delete Product

- **Description**: Deletes an existing product from the catalog.
- **Method**: POST
- **URL**: `http://localhost:3003/product-catalog/delete`
- **Request Headers**:
  - Key: Authorization
  - Value: Bearer \<access_token>
- **Request Body**:
  ```json
  {
    // Get id from create product
    "id": "<id_product"
  }
  ```
