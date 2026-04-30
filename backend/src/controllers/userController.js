const pool = require('../models/db');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT id,name,email,role FROM users ORDER BY name');
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};