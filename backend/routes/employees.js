const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all employees (with department name)
router.get('/', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT e.*, d.name AS department_name
    FROM employees e
    LEFT JOIN departments d ON d.id = e.department_id
    ORDER BY e.name
  `);
  res.json(rows);
});

// GET one employee (for the Edit form)
router.get('/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// POST create
router.post('/', async (req, res) => {
  const { name, email, designation, department_id, join_date, manager, status, contact, dob, rating } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
  try {
    const [result] = await pool.query(
      `INSERT INTO employees (name, email, designation, department_id, join_date, manager, status, contact, dob, rating)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, designation || null, department_id || null, join_date || null,
       manager || null, status || 'Active', contact || null, dob || null, rating || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email already exists' });
    throw err;
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  const { name, email, designation, department_id, join_date, manager, status, contact, dob, rating } = req.body;
  await pool.query(
    `UPDATE employees SET name = ?, email = ?, designation = ?, department_id = ?, join_date = ?,
     manager = ?, status = ?, contact = ?, dob = ?, rating = ? WHERE id = ?`,
    [name, email, designation || null, department_id || null, join_date || null,
     manager || null, status || 'Active', contact || null, dob || null, rating || 0, req.params.id]
  );
  res.json({ message: 'Updated' });
});

// DELETE
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM employees WHERE id = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;