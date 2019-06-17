const express = require("express");
const User = express.Router();
const bcrypt = require("bcrypt");
const db = require("../library/db");
const SALT_ROUNDS = 5;

User.get("/:limit/:offset", async (req, res) => {
  const users = await db.query(
    "SELECT * FROM users LIMIT ?, ?",
    parseInt(req.params.limit),
    parseInt(req.params.offset)
  );
  if (users.length > 0) {
    res.status(200).json({ success: true, results: users });
  } else {
    res.status(404).json({ success: false, error: "User not found" });
  }
});

User.get("/:id", async (req, res) => {
  const users = await db.query(
    "SELECT * FROM users WHERE user_id = ?",
    parseInt(req.params.id)
  );
  if (users.length > 0) {
    res.status(200).json({ success: true, results: users });
  } else {
    res.status(404).json({ success: false, error: "User not found" });
  }
});

User.post("/", async (req, res) => {
  const { user_name, password, firstname, lastname } = req.body;

  if (user_name && password && firstname && lastname) {
    bcrypt.hash(password, SALT_ROUNDS, async (err, hash) => {
      if (err) {
        res.status(500).json({ success: false, error: err.toString() });
      }
      const sql = `INSERT INTO \`users\` (
                \`user_name\`,
                \`password\`,
                \`firstname\`,
                \`lastname\`
                ) VALUES (
                ?,
                ?,
                ?,
                ?)`;
      try {
        const ok = await db.query(sql, user_name, hash, firstname, lastname);
        if (ok.insertId) {
          res.status(200).json({ success: true, insertId: ok.insertId });
        } else {
          res.status(500).json({ success: true, error: ok.message });
        }
      } catch (e) {
        res.status(500).json({ success: false, error: e.toString() });
      }
    });
  } else {
    res.status(400).json({ success: false, error: "Bad request" });
  }
});

User.patch("/:id", async (req, res) => {
  const users = await db.query(
    "SELECT * FROM users WHERE user_id = ?",
    parseInt(req.params.id)
  );
  if (users.length > 0) {
    for (const key in users[0]) {
      if (typeof req.body[key] === "undefined") {
        req.body[key] = users[0][key];
      }
    }

    const { user_name, password, firstname, lastname } = req.body;

    const sql = `UPDATE users SET 
                user_name=?,
                \`password\`=?,
                firstname=?,
                lastname=?`;

    try {
      if (password !== users[0].password) {
        bcrypt.hash(password, SALT_ROUNDS, async (err, hash) => {
          if (err) {
            res.status(500).json({ success: false, error: err.toString() });
          }
          const ok = await db.query(sql, user_name, hash, firstname, lastname);
          if (ok.insertId) {
            res.status(200).json({ success: true, insertId: ok.insertId });
          } else {
            res.status(500).json({ success: true, error: ok.message });
          }
        });
      } else {
        const ok = await db.query(
          sql,
          user_name,
          password,
          firstname,
          lastname
        );
        if (ok.insertId) {
          res.status(200).json({ success: true, insertId: ok.insertId });
        } else {
          res.status(500).json({ success: true, error: ok.message });
        }
      }
    } catch (e) {
      res.status(500).json({ success: false, error: e.toString() });
    }
  } else {
    res.status(404).json({ success: false, error: "User not found" });
  }
});

User.delete("/:id", async (req, res) => {
  const ok = await db.query(
    "DELETE FROM users WHERE user_id = ?",
    parseInt(req.params.id)
  );
  if (ok.affectedRows === 1) {
    res.status(200).json({ success: true, results: ok });
  } else {
    res.status(404).json({ success: false, error: "User not found" });
  }
});

User.post("/login", async (req, res) => {
  const password = req.body.password;
  const users = await db.query(
    "SELECT * FROM users WHERE user_name = ?",
    req.body.user_name
  );
  if (users.length > 0) {
    bcrypt.compare(password, users[0].password, (err, match) => {
      if (err) res.status(500).json({ success: false, error: err.toString() });
      if (match) {
        res.status(200).json({ success: true, apiToken: "API_TOKEN" });
      } else {
        res.status(404).json({ success: false, error: "User not found" });
      }
    });
  } else {
    res.status(404).json({ success: false, error: "User not found" });
  }
});

User.post("/logout", async (req, res) => {
  res.status(500).json({ error: "Not implemented" });
});

module.exports = User;
