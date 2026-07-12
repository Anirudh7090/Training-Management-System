const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all departments (with employee count)
router.get('/', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT d.*, COUNT(e.id) AS employee_count
    FROM departments d
    LEFT JOIN employees e ON e.department_id = d.id
    GROUP BY d.id
    ORDER BY d.name
  `);
  res.json(rows);
});

// GET one department (for the Edit form)
router.get('/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM departments WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// POST create
router.post('/', async (req, res) => {
  const { name, head, description, budget } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const [result] = await pool.query(
    'INSERT INTO departments (name, head, description, budget) VALUES (?, ?, ?, ?)',
    [name, head || null, description || null, budget || 0]
  );
  res.status(201).json({ id: result.insertId });
});

// PUT update
router.put('/:id', async (req, res) => {
  const { name, head, description, budget } = req.body;
  await pool.query(
    'UPDATE departments SET name = ?, head = ?, description = ?, budget = ? WHERE id = ?',
    [name, head || null, description || null, budget || 0, req.params.id]
  );
  res.json({ message: 'Updated' });
});

// DELETE
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM departments WHERE id = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;