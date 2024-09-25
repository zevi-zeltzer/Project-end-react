const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const mysql = require("mysql2");
const createReactProject = require("./mysql.js");
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());


var con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "7121",
  database: "project_react",
});

app.post("/register", async (req, res) => {
  console.log(req.body);
  const { address, user } = req.body;

  if (
    !user.fullName ||
    !user.username ||
    !user.password ||
    !user.email ||
    !user.phone ||
    !user.company ||
    !address.street ||
    !address.suite ||
    !address.city ||
    !address.zipcode
  ) {
    return res.status(400).json({ error: "All fields must be filled in" });
  }

  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const insertUserQuery = `INSERT INTO users (fullName, userName, password, email, phone, company) VALUES (?, ?, ?, ?, ?, ?)`;

    const userValues = [
      user.fullName,
      user.username,
      hashedPassword, // use the hashed password
      user.email,
      user.phone,
      user.company,
    ];

    con.query(insertUserQuery, userValues, function (err, result) {
      if (err) {
        return res.status(500).json({ error: "Error inserting user" });
      }

      const userId = result.insertId;

      const insertAddressQuery = `INSERT INTO addresses (userId, street, suite, city, zipcode) VALUES (?, ?, ?, ?, ?)`;

      const addressValues = [
        userId,
        address.street,
        address.suite,
        address.city,
        address.zipcode,
      ];

     
      con.query(insertAddressQuery, addressValues, function (err, result) {
        if (err) {
          return res.status(500).json({ error: "Error inserting address" });
        }

        
        console.log("Number of records inserted: " + result.affectedRows);
        res
          .status(201)
          .json({ message: "The user has successfully registered!" });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // בדיקה האם כל השדות מולאו
  if (!username || !password) {
    return res.status(400).json({ error: "All fields must be filled in" });
  }

  try {
    const query = "SELECT * FROM users WHERE userName = ?";
    const values = [username];

    con.query(query, values, async (err, result) => {
      if (err) throw err;

      if (result.length === 0) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      res.status(200).json(user);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/info", async (req, res) => {
  const { userId } = req.body;
  const query = "SELECT * FROM users WHERE id = ?";
  const addressQuery = "SELECT * FROM addresses WHERE userId = ?";
  const values = [userId];

  con.query(query, values, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = result[0];

    con.query(addressQuery, values, (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const address = result[0];
      res.status(200).json({ address, user });
    });
  });
});

app.post("/info/edit", async (req, res) => {
  const { userId, userInfo } = req.body;
  console.log(userId, userInfo);

  const queryUsers =
    "UPDATE users SET fullName = ?, userName = ?, email = ?, phone = ?, company = ? WHERE id = ?";

  const addressQuery =
    "UPDATE addresses SET street = ?, suite = ?, city = ?, zipcode = ? WHERE userId = ?";

  const valuesUsers = [
    userInfo.user.fullName,
    userInfo.user.userName,
    userInfo.user.email,
    userInfo.user.phone,
    userInfo.user.company,
    userId,
  ];

  const valuesAddress = [
    userInfo.address.street,
    userInfo.address.suite,
    userInfo.address.city,
    userInfo.address.zipcode,
    userId,
  ];

  con.query(queryUsers, valuesUsers, (err, result) => {
    if (err) throw err;

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    con.query(addressQuery, valuesAddress, (err, result) => {
      if (err) throw err;
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ message: "User info updated successfully" });
    });
  });
});

app.post("/toDos", async (req, res) => {
  const { userId } = req.body;
  const query = "SELECT * FROM toDos WHERE userId = ?";
  const values = [userId];
  con.query(query, values, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).json({ error: "ToDos not found" });
    }
    const toDos = result;
    res.status(200).json(toDos);
  });
});

app.post("/toDos/checkbox", async (req, res) => {
  const { completed, title, id } = req.body;
  const query = "UPDATE toDos SET completed = ?, title = ? WHERE id = ?";
  const values = [!completed, title, id];
  con.query(query, values, (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "ToDos not found" });
    }
    res.status(200).json(values);
  });
});

app.post("/toDos/execution", async (req, res) => {
  const { userId } = req.body;
  const query = "SELECT * FROM toDos WHERE userId = ? AND completed = ?";
  const values1 = [userId, true];
  const values2 = [userId, false];
  const toDos = [];
  con.query(query, values1, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).json({ error: "ToDos not found" });
    }
    toDos.push(...result);
  });
  con.query(query, values2, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).json({ error: "ToDos not found" });
    }
    toDos.push(...result);
    res.status(200).json(toDos);
  });
});

app.post("/toDos/alphabetical", async (req, res) => {
  const { userId } = req.body;
  const query = "SELECT * FROM toDos WHERE userId = ? ORDER BY title";
  const values = [userId];
  con.query(query, values, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).json({ error: "ToDos not found" });
    }
    const toDos = result;
    res.status(200).json(toDos);
  });
});

app.post("/toDos/search", async (req, res) => {
  const { userId } = req.body;
  const { searchValue } = req.body;
  const query =
    "SELECT * FROM toDos WHERE userId = ? AND title LIKE ? or userId = ? AND id = ?";
  const values = [userId, `${searchValue}%`, userId, searchValue];
  con.query(query, values, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).json({ error: "ToDos not found" });
    }
    const toDos = result;
    console.log(toDos);

    res.status(200).json(toDos);
  });
});

app.post("/toDos/addToDo", async (req, res) => {
  const { userId, title, completed } = req.body;
  const query =
    "INSERT INTO toDos ( userId, title, completed) VALUES ( ?, ?, ?)";
  const values = [userId, title, completed];
  con.query(query, values, (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "ToDos not found" });
    }

    res
      .status(200)
      .json({ userId: userId, title: title, completed: completed });
  });
});

app.delete("/toDos/delete", async (req, res) => {
  const { id } = req.body;
  const query = "DELETE FROM toDos WHERE id = ?";
  const values = [id];
  con.query(query, values, (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "ToDos not found" });
    }
    res.status(200).json({ message: "ToDos deleted successfully" });
  });
});

app.post("/toDos/edit", async (req, res) => {
  const { id, title } = req.body;
  const query = "UPDATE toDos SET title = ? WHERE id = ?";
  const values = [title, id];
  con.query(query, values, (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "ToDos not found" });
    }
    res.status(200).json({ id: id, title: title });
  });
});

app.post("/posts", async (req, res) => {
  const { userId } = req.body;
  console.log(userId);

  const query = "SELECT * FROM posts WHERE userId = ?";
  const values = [userId];
  con.query(query, values, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).json({ error: "Posts not found" });
    }
    const posts = result;
    res.status(200).json(posts);
  });
});

app.get("/allPosts", async (req, res) => {
  const query = "SELECT * FROM posts";
  con.query(query, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).json({ error: "Posts not found" });
    }
    const posts = result;
    res.status(200).json(posts);
  });
});

app.post("/posts/add", async (req, res) => {
  const { userId, title, body } = req.body;

  const query = "INSERT INTO posts (userId, title, body) VALUES (?, ?, ?)";
  const values = [userId, title, body];
  con.query(query, values, (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Posts not found" });
    }
    res.status(200).json({ userId: userId, title: title, body: body });
  });
});

app.post("/posts/search", async (req, res) => {
  const { userId, searchValue } = req.body;
  const query =
    "SELECT * FROM posts WHERE userId = ? AND title LIKE ? or userId = ? AND id = ?";
  const values = [userId, `${searchValue}%`, userId, searchValue];
  con.query(query, values, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).json({ error: "Posts not found" });
    }
    console.log(result);

    const posts = result;
    res.status(200).json(posts);
  });
});

app.post("/post/delete", async (req, res) => {
  const { postId } = req.body;
  console.log(postId);

  const query = "DELETE FROM posts WHERE id = ?";
  const values = [postId];
  con.query(query, values, (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Posts not found" });
    }
    res.status(200).json({ message: "Posts deleted successfully" });
  });
});

app.post("/post/edit", async (req, res) => {
  const { postId, title, body } = req.body;
  const query = "UPDATE posts SET title = ?, body = ? WHERE id = ?";
  const values = [title, body, postId];
  con.query(query, values, (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Posts not found" });
    }
    res.status(200).json({ id: postId, title: title, body: body });
  });
});

app.post("/comments", async (req, res) => {
  const { postId } = req.body;
  const query = "SELECT * FROM comments WHERE postId = ?";
  const values = [postId];
  con.query(query, values, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).json({ error: "Comments not found" });
    }
    const comments = result;
    res.status(200).json(comments);
  });
});

app.post("/comments/add", async (req, res) => {
  const { postId, name, email, body } = req.body;
  const query =
    "INSERT INTO comments (postId, name, email, body) VALUES (?, ?, ?, ?)";
  const values = [postId, name, email, body];
  con.query(query, values, (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Comments not found" });
    }
    res
      .status(200)
      .json({ postId: postId, name: name, email: email, body: body });
  });
});

app.post("/comments/edit", async (req, res) => {
  const { commentId, body } = req.body;
  const query = "UPDATE comments SET body = ? WHERE id = ?";
  const values = [body, commentId];
  con.query(query, values, (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Comments not found" });
    }
    res.status(200).json({ id: commentId, body: body });
  });
});

app.post("/comments/delete", async (req, res) => {
  const { commentId } = req.body;
  const query = "DELETE FROM comments WHERE id = ?";
  const values = [commentId];
  con.query(query, values, (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Comments not found" });
    }
    res.status(200).json({ message: "Comments deleted successfully" });
  });
});

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
