const express = require('express');
const router = express.Router();
const pool = require('../db');

// Clamp helper: keeps skill levels within the valid 0-5 range.
// The DB is the last line of defense, but we validate here too.
const clamp = (v) => Math.max(0, Math.min(5, Number(v) || 0));

// GET matrix rows for one employee (optionally filtered by year)
router.get('/employee/:employeeId', async (req, res) => {
  const year = req.query.year || new Date().getFullYear();
  const [rows] = await pool.query(
    'SELECT * FROM training_needs WHERE employee_id = ? AND year = ? ORDER BY id',
    [req.params.employeeId, year]
  );
  res.json(rows);
});

// POST add a topic row
router.post('/', async (req, res) => {
  const { employee_id, topic, required_level, self_level, hod_level, year } = req.body;
  if (!employee_id || !topic) return res.status(400).json({ error: 'employee_id and topic are required' });
  const [result] = await pool.query(
    `INSERT INTO training_needs (employee_id, topic, required_level, self_level, hod_level, year)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      employee_id,
      topic,
      clamp(required_level ?? 3),
      clamp(self_level),
      clamp(hod_level),
      year || new Date().getFullYear()
    ]
  );
  res.status(201).json({ id: result.insertId });
});

// PUT update levels of one row (inline edits in the matrix)
router.put('/:id', async (req, res) => {
  const { topic, required_level, self_level, hod_level } = req.body;
  await pool.query(
    'UPDATE training_needs SET topic = ?, required_level = ?, self_level = ?, hod_level = ? WHERE id = ?',
    [
      topic,
      clamp(required_level),
      clamp(self_level),
      clamp(hod_level),
      req.params.id
    ]
  );
  res.json({ message: 'Updated' });
});

// DELETE a row
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM training_needs WHERE id = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;