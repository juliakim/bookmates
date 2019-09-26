DROP DATABASE IF EXISTS bookmates;

CREATE DATABASE bookmates;

USE bookmates;

CREATE TABLE books (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  authors VARCHAR(100) NOT NULL,
  publishedDate VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  pageCount SMALLINT NOT NULL,
  imageLinks VARCHAR(200),
  previewLink VARCHAR(200),
  isbn VARCHAR(13),
  PRIMARY KEY (ID)
);

CREATE TABLE favorites (
  id INT NOT NULL AUTO_INCREMENT,
  book_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE current (
  id INT NOT NULL AUTO_INCREMENT,
  book_id INT,
  PRIMARY KEY(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE wishlist (
  id INT NOT NULL AUTO_INCREMENT,
  book_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);

/*  Execute this file from the command line by typing:
 *    mysql -u root -p < database-mysql/schema.sql
 *  to create the database and the tables.*/