const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all employees assigned to one training (the Manage form's list)
router.get('/training/:trainingId', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT a.id, a.status, a.assigned_date, a.progress, a.proficiency,
           e.id AS employee_id, e.name AS employee_name, e.designation,
           d.name AS department_name
    FROM training_assignments a
    JOIN employees e ON e.id = a.employee_id
    LEFT JOIN departments d ON d.id = e.department_id
    WHERE a.training_id = ?
    ORDER BY e.name
  `, [req.params.trainingId]);
  res.json(rows);
});

// GET all trainings of one employee (useful for employee detail / dashboard)
router.get('/employee/:employeeId', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT a.id, a.status, t.title, t.start_date, t.end_date
    FROM training_assignments a
    JOIN trainings t ON t.id = a.training_id
    WHERE a.employee_id = ?
  `, [req.params.employeeId]);
  res.json(rows);
});

// POST bulk assign: { training_id: 1, employee_ids: [2, 5, 7] }
router.post('/', async (req, res) => {
  const { training_id, employee_ids } = req.body;
  if (!training_id || !Array.isArray(employee_ids) || employee_ids.length === 0) {
    return res.status(400).json({ error: 'training_id and employee_ids[] are required' });
  }
  const values = employee_ids.map(empId => [training_id, empId]);
  // INSERT IGNORE skips employees already assigned (the UNIQUE key catches them)
  await pool.query(
    'INSERT IGNORE INTO training_assignments (training_id, employee_id) VALUES ?',
    [values]
  );
  res.status(201).json({ message: 'Assigned' });
});

// PUT update one assignment's status (Assigned / In Progress / Completed)
router.put('/:id', async (req, res) => {
  const { status, progress, proficiency } = req.body;
  await pool.query(
    'UPDATE training_assignments SET status = ?, progress = ?, proficiency = ? WHERE id = ?',
    [status || 'Assigned', progress ?? 0, proficiency ?? 0, req.params.id]
  );
  res.json({ message: 'Updated' });
});

// DELETE remove an employee from a training
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM training_assignments WHERE id = ?', [req.params.id]);
  res.json({ message: 'Removed' });
});

module.exports = router;