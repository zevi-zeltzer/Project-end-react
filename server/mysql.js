const mysql = require("mysql2");
const fetch = require("node-fetch");
const bcrypt = require("bcrypt");
// Create a connection to the database
const createReactProject = () => {
  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "7121",
    multipleStatements: true,
  });

  const createDatabaseAndTables = `
CREATE DATABASE IF NOT EXISTS project_react;
USE project_react;


CREATE TABLE IF NOT EXISTS users (
   id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(255),
  userName VARCHAR(255),
  password VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS addresses (
   id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  street VARCHAR(255),
  suite VARCHAR(255),
  city VARCHAR(255),
  zipcode VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS toDos (
   id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  title VARCHAR(255),
  completed BOOLEAN,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS posts (
   id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  title VARCHAR(255),
  body TEXT,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comments (
   id INT AUTO_INCREMENT PRIMARY KEY,
  postId INT,
  name VARCHAR(255),
  email VARCHAR(255),
  body TEXT,
  FOREIGN KEY (postId) REFERENCES posts(id)
);

CREATE TABLE IF NOT EXISTS albums (
   id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  title VARCHAR(255),
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS photos (
   id INT AUTO_INCREMENT PRIMARY KEY,
  albumId INT,
  title VARCHAR(255),
  url VARCHAR(255),
  thumbnailUrl VARCHAR(255),
  FOREIGN KEY (albumId) REFERENCES albums(id)
);
`;

  // פונקציה לייבוא נתונים מה-API ל-DB
  const fetchDataAndInsert = async (url, query, valuesMapper) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      for (const item of data) {
        const values = valuesMapper(item);
        con.query(query, values, (err) => {
          if (err) throw err;
        });
      }
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
    }
  };

  const importData = async () => {
    try {
      // ייבוא של משתמשים
      const usersQuery = `
      INSERT INTO users (id, fullName, userName,password, email,phone, company)
      VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=id
    `;

      const addressQuery = `INSERT INTO addresses ( userId,street, suite, city, zipcode)VALUES (?, ?, ?,?, ?) ON DUPLICATE KEY UPDATE id=id;`;

      const users = await fetch("https://jsonplaceholder.typicode.com/users");
      const usersData = await users.json();

      for (const user of usersData) {
        const hashedPassword = await bcrypt.hash(user.website, 10);
        con.query(
          usersQuery,
          [
            user.id,
            user.name,
            user.username,
            hashedPassword, // use the hashed password
            user.email,
            user.phone,
            user.company.name,
          ],
          (err) => {
            if (err) throw err;
          }
        );

        con.query(
          addressQuery,
          [
            user.id,
            user.address.street,
            user.address.suite,
            user.address.city,
            user.address.zipcode,
          ],
          (err) => {
            if (err) throw err;
          }
        );
      }
      // ייבוא של Todos
      const todosQuery = `
      INSERT INTO todos (id, userId, title, completed)
      VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=id
    `;
      await fetchDataAndInsert(
        "https://jsonplaceholder.typicode.com/ToDos",
        todosQuery,
        (todo) => [todo.id, todo.userId, todo.title, todo.completed]
      );

      // ייבוא של פוסטים
      const postsQuery = `
      INSERT INTO posts (id, userId, title, body)
      VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=id
    `;
      await fetchDataAndInsert(
        "https://jsonplaceholder.typicode.com/posts",
        postsQuery,
        (post) => [post.id, post.userId, post.title, post.body]
      );

      // ייבוא של תגובות
      const commentsQuery = `
      INSERT INTO comments (id, postId, name, email, body)
      VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=id
    `;
      await fetchDataAndInsert(
        "https://jsonplaceholder.typicode.com/comments",
        commentsQuery,
        (comment) => [
          comment.id,
          comment.postId,
          comment.name,
          comment.email,
          comment.body,
        ]
      );

      // ייבוא של אלבומים
      const albumsQuery = `
      INSERT INTO albums (id, userId, title)
      VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id=id
    `;
      await fetchDataAndInsert(
        "https://jsonplaceholder.typicode.com/albums",
        albumsQuery,
        (album) => [album.id, album.userId, album.title]
      );

      // ייבוא של תמונות
      const photosQuery = `
      INSERT INTO photos (id, albumId, title, url, thumbnailUrl)
      VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=id
    `;
      await fetchDataAndInsert(
        "https://jsonplaceholder.typicode.com/photos",
        photosQuery,
        (photo) => [
          photo.id,
          photo.albumId,
          photo.title,
          photo.url,
          photo.thumbnailUrl,
        ]
      );

      console.log("Data imported successfully!");
    } catch (error) {
      console.error("Error importing data:", error);
    }
  };
  con.query(createDatabaseAndTables, (err) => {
    if (err) throw err;
    console.log("Database and tables created or already exist.");
    importData();
  });
};
module.exports = createReactProject;
