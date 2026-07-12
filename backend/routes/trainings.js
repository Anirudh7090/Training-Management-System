const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all trainings (with assigned employee count)
router.get('/', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT t.*, COUNT(a.id) AS assigned_count, COALESCE(ROUND(AVG(a.progress)), 0) AS avg_progress
    FROM trainings t
    LEFT JOIN training_assignments a ON a.training_id = t.id
    GROUP BY t.id
    ORDER BY t.start_date DESC
  `);
  res.json(rows);
});

// GET one training (for the Edit form)
router.get('/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM trainings WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// POST create (Training Course create form)
router.post('/', async (req, res) => {
  const { title, description, trainer, category, start_date, end_date, duration_hours, status } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const [result] = await pool.query(
    `INSERT INTO trainings (title, description, trainer, category, start_date, end_date, duration_hours, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, description || null, trainer || null, category || 'General', start_date || null,
     end_date || null, duration_hours || null, status || 'Active']
  );
  res.status(201).json({ id: result.insertId });
});

// PUT update (Edit form)
router.put('/:id', async (req, res) => {
  const { title, description, trainer, category, start_date, end_date, duration_hours, status } = req.body;
  await pool.query(
    `UPDATE trainings SET title = ?, description = ?, trainer = ?, category = ?, start_date = ?,
     end_date = ?, duration_hours = ?, status = ? WHERE id = ?`,
    [title, description || null, trainer || null, category || 'General', start_date || null,
     end_date || null, duration_hours || null, status || 'Active', req.params.id]
  );
  res.json({ message: 'Updated' });
});

// DELETE
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM trainings WHERE id = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;