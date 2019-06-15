const express = require("express");
const db = require("../library/db");
const Category = express.Router();

Category.get("/:limit/:offset", async (req, res) => {
  const category = await db.query(
    "SELECT * FROM category LIMIT ?, ?",
    parseInt(req.params.limit),
    parseInt(req.params.offset)
  );
  if (category.length > 0) {
    res.status(200).json({ success: true, results: category });
  } else {
    res.status(404).json({ success: false, error: "Category not found" });
  }
});

Category.get("/:id", async (req, res) => {
  const category = await db.query(
    "SELECT * FROM category WHERE id_category = ?",
    parseInt(req.params.id)
  );
  if (category.length > 0) {
    res.status(200).json({ success: true, results: category });
  } else {
    res.status(404).json({ success: false, error: "Category not found" });
  }
});

Category.post("/", async (req, res) => {
  const { category_name } = req.body;
  if (category_name) {
    const categoryInsertSQL = `INSERT INTO category (
            category_name
        ) VALUES (
            ?)`;
    try {
      const ok = await db.query(categoryInsertSQL, category_name);
      if (ok.insertId) {
        res.status(200).json({ success: true, insertId: ok.insertId });
      } else {
        res.status(500).json({ success: true, error: ok.message });
      }
    } catch (e) {
      res.status(500).json({ success: false, error: e.toString() });
    }
  }
});

Category.patch("/:id", async (req, res) => {
  const categories = await db.query(
    "SELECT * FROM category WHERE id_category = ?",
    parseInt(req.params.id)
  );
  if (categories.length > 0) {
    for (const key in categories[0]) {
      if (typeof req.body[key] === "undefined") {
        req.body[key] = categories[0][key];
      }
    }

    const { category_name } = req.body;

    const sql = `UPDATE categories SET 
        category_name = ?
    WHERE id_expense = ?`;

    try {
      const ok = await db.query(sql, category_name, parseInt(req.params.id));
      if (ok.insertId) {
        res.status(200).json({ success: true, insertId: ok.insertId });
      } else {
        res.status(500).json({ success: true, error: ok.message });
      }
    } catch (e) {
      res.status(500).json({ success: false, error: e.toString() });
    }
  } else {
    res.status(404).json({ success: false, error: "Category not found" });
  }
});

Category.delete("/:id", async (req, res) => {
  const ok = await db.query(
    "DELETE FROM category WHERE id_category = ?",
    parseInt(req.params.id)
  );
  if (ok.affectedRows === 1) {
    res.status(200).json({ success: true, results: ok });
  } else {
    res.status(404).json({ success: false, error: "Category not found" });
  }
});

module.exports = Category;
