CREATE DATABASE IF NOT EXISTS training_db;
USE training_db;

CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  head VARCHAR(100),
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  designation VARCHAR(100),
  department_id INT,
  join_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE trainings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description VARCHAR(500),
  trainer VARCHAR(100),
  start_date DATE,
  end_date DATE,
  duration_hours INT,
  status ENUM('Upcoming','Ongoing','Completed') DEFAULT 'Upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE training_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  training_id INT NOT NULL,
  employee_id INT NOT NULL,
  status ENUM('Assigned','In Progress','Completed') DEFAULT 'Assigned',
  assigned_date DATE DEFAULT (CURRENT_DATE),
  UNIQUE KEY uniq_map (training_id, employee_id),
  FOREIGN KEY (training_id) REFERENCES trainings(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

INSERT INTO departments (name, head, description) VALUES
('Engineering', 'Priya Sharma', 'Software development team'),
('Human Resources', 'Amit Patil', 'HR and people operations');