const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/dashboard/admin — company-wide stats
router.get('/admin', async (req, res) => {
  const [[counts]] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM employees) AS total_employees,
      (SELECT COUNT(*) FROM departments) AS total_departments,
      (SELECT COUNT(*) FROM trainings) AS total_trainings,
      (SELECT COUNT(*) FROM trainings WHERE status = 'Active') AS ongoing_trainings,
      (SELECT COUNT(*) FROM training_assignments) AS total_assignments,
      (SELECT COUNT(*) FROM training_assignments WHERE status = 'Completed') AS completed_assignments
  `);

  // Trainings per department (for a small chart/table on the dashboard)
  const [byDepartment] = await pool.query(`
    SELECT d.name AS department, COUNT(a.id) AS assignments
    FROM departments d
    LEFT JOIN employees e ON e.department_id = d.id
    LEFT JOIN training_assignments a ON a.employee_id = e.id
    GROUP BY d.id
  `);

  // Assignment status distribution (for the donut chart)
  const [statusDist] = await pool.query(`
    SELECT status, COUNT(*) AS count
    FROM training_assignments
    GROUP BY status
  `);

  res.json({ counts, byDepartment, statusDist }); 

});

// GET /api/dashboard/department/:id — stats for one department
router.get('/department/:id', async (req, res) => {
  const id = req.params.id;

  const [[counts]] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM employees WHERE department_id = ?) AS total_employees,
      (SELECT COUNT(*) FROM training_assignments a
        JOIN employees e ON e.id = a.employee_id
        WHERE e.department_id = ?) AS total_assignments,
      (SELECT COUNT(*) FROM training_assignments a
        JOIN employees e ON e.id = a.employee_id
        WHERE e.department_id = ? AND a.status = 'Completed') AS completed_assignments
  `, [id, id, id]);

  // Each employee in this department with their training count
  const [employees] = await pool.query(`
    SELECT e.name, e.designation, COUNT(a.id) AS trainings_assigned,
           SUM(a.status = 'Completed') AS trainings_completed
    FROM employees e
    LEFT JOIN training_assignments a ON a.employee_id = e.id
    WHERE e.department_id = ?
    GROUP BY e.id
  `, [id]);

  res.json({ counts, employees });
});

module.exports = router;