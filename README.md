# Book Store Backend

This is a REST backend for a book store application built using Node.js, Express.js, and MySQL. The backend supports functionalities for both buyers (users) and sellers. Sellers can manage books via CSV upload, while users can view books.

## Features

- User and seller registration and login.
- JWT-based authentication and authorization.
- Sellers can upload books via CSV file.
- CRUD operations for books by sellers.
- Users can view all books and details of specific books.

## Prerequisites

- Node.js and npm installed.
- MySQL server running.
- Git installed.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/book-store-backend.git
cd book-store-backend
```

### 2. install the dependecies 

```bash
npm install
```
### 3. Configure env
Create a .env file in the root directory and add the following environment variables:
```bash
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_mysql_password
DATABASE_NAME=book_store
JWT_SECRET=your_jwt_secret
```
### 4. Set Up the Database
Log in to your MySQL server and create the book_store database:
```bash
CREATE DATABASE book_store;
```
Run the following SQL commands to create the necessary tables:
```bash
USE book_store;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('USER', 'SELLER') NOT NULL
);

CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  price FLOAT NOT NULL,
  seller_id INT,
  FOREIGN KEY (seller_id) REFERENCES users(id)
);
```

### 5. Start the Server

```bash
npx nodemon src/app.js
```

## File Structure
```bash
/book-store-backend
|-- /node_modules
|-- /src
|   |-- /controllers
|   |   |-- authController.js
|   |   |-- bookController.js
|   |-- /middlewares
|   |   |-- authMiddleware.js
|   |-- /routes
|   |   |-- authRoutes.js
|   |   |-- bookRoutes.js
|   |-- /utils
|   |   |-- db.js
|   |-- app.js
|-- .env
|-- .gitignore
|-- package.json
|-- README.md
```


