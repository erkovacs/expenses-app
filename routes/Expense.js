const express = require("express");
const db = require("../library/db");
const Expense = express.Router();

Expense.get("/:limit/:offset", async (req, res) => {
  const expenses = await db.query(
    "SELECT ex.*, ct.category_name FROM expense ex JOIN category ct ON ex.category = ct.id_category LIMIT ?, ?",
    parseInt(req.params.limit),
    parseInt(req.params.offset)
  );
  if (expenses.length > 0) {
    res.status(200).json({ success: true, results: expenses });
  } else {
    res.status(404).json({ success: false, error: "Expense not found" });
  }
});

Expense.get("/:id", async (req, res) => {
  const expenses = await db.query(
    "SELECT ex.*, ct.category_name FROM expense ex JOIN category ct ON ex.category = ct.id_category WHERE ex.id_expense = ?",
    parseInt(req.params.id)
  );
  if (expenses.length > 0) {
    res.status(200).json({ success: true, results: expenses });
  } else {
    res.status(404).json({ success: false, error: "Expense not found" });
  }
});

Expense.post("/", async (req, res) => {
  const { category, name, amount, notes, user } = req.body;
  if (category && name && amount && notes) {
    const expenseInsertSQL = `INSERT INTO expense (
            category,
            name,
            amount,
            notes
            ) VALUES (
            ?,
            ?,
            ?,
            ?)`;
    const relationInsertSQL = `INSERT INTO expense_user (user, expense) VALUES (?, ?)`;
    try {
      const ok = await db.query(
        expenseInsertSQL,
        category,
        name,
        amount,
        notes
      );
      if (ok.insertId) {
        await db.query(relationInsertSQL, user, ok.insertId);
        res.status(200).json({ success: true, insertId: ok.insertId });
      } else {
        res.status(500).json({ success: true, error: ok.message });
      }
    } catch (e) {
      res.status(500).json({ success: false, error: e.toString() });
    }
  }
});

Expense.patch("/:id", async (req, res) => {
  const expenses = await db.query(
    "SELECT * FROM expense WHERE id_expense = ?",
    parseInt(req.params.id)
  );
  if (expenses.length > 0) {
    for (const key in expenses[0]) {
      if (typeof req.body[key] === "undefined") {
        req.body[key] = expenses[0][key];
      }
    }

    const { category, name, amount, notes } = req.body;

    const sql = `UPDATE expense SET 
    category = ?,
    name = ?,
    amount = ?,
    notes = ?
    WHERE id_expense = ?`;

    try {
      const ok = await db.query(
        sql,
        category,
        name,
        amount,
        notes,
        parseInt(req.params.id)
      );
      if (ok.insertId) {
        res.status(200).json({ success: true, insertId: ok.insertId });
      } else {
        res.status(500).json({ success: true, error: ok.message });
      }
    } catch (e) {
      res.status(500).json({ success: false, error: e.toString() });
    }
  } else {
    res.status(404).json({ success: false, error: "Expense not found" });
  }
});

Expense.delete("/:id", async (req, res) => {
  const ok = await db.query(
    "DELETE FROM expense WHERE id_expense = ?",
    parseInt(req.params.id)
  );
  if (ok.affectedRows === 1) {
    res.status(200).json({ success: true, results: ok });
  } else {
    res.status(404).json({ success: false, error: "Expense not found" });
  }
});

module.exports = Expense;
