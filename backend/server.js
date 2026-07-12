require('dotenv').config();
const express = require('express');
const cors = require('cors');
const auth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// public — login/register
app.use('/api/auth', require('./routes/auth'));

// everything below needs a valid token
app.use('/api', auth);

app.use('/api/departments', require('./routes/departments'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/trainings', require('./routes/trainings'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/needs', require('./routes/needs'));
app.use('/api/dashboard', require('./routes/dashboard'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));