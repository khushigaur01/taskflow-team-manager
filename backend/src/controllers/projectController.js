const pool = require('../models/db');

exports.getAll = async (req, res) => {
  try {
    let query, params;
    if (req.user.role === 'admin') {
      query = `SELECT p.*, u.name as owner_name FROM projects p JOIN users u ON p.owner_id=u.id ORDER BY p.created_at DESC`;
      params = [];
    } else {
      query = `SELECT p.*, u.name as owner_name FROM projects p JOIN users u ON p.owner_id=u.id
               LEFT JOIN project_members pm ON pm.project_id=p.id
               WHERE p.owner_id=$1 OR pm.user_id=$1 ORDER BY p.created_at DESC`;
      params = [req.user.id];
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Project name required' });
  try {
    const result = await pool.query(
      'INSERT INTO projects (name,description,owner_id) VALUES($1,$2,$3) RETURNING *',
      [name, description, req.user.id]
    );
    await pool.query('INSERT INTO project_members (project_id,user_id,role) VALUES($1,$2,$3)',
      [result.rows[0].id, req.user.id, 'admin']);
    res.status(201).json(result.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const proj = await pool.query('SELECT p.*,u.name as owner_name FROM projects p JOIN users u ON p.owner_id=u.id WHERE p.id=$1', [req.params.id]);
    if (!proj.rows.length) return res.status(404).json({ error: 'Project not found' });
    const members = await pool.query(
      'SELECT u.id,u.name,u.email,pm.role FROM project_members pm JOIN users u ON pm.user_id=u.id WHERE pm.project_id=$1',
      [req.params.id]
    );
    res.json({ ...proj.rows[0], members: members.rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE projects SET name=$1,description=$2 WHERE id=$3 AND owner_id=$4 RETURNING *',
      [name, description, req.params.id, req.user.id]
    );
    if (!result.rows.length) return res.status(403).json({ error: 'Not authorized' });
    res.json(result.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM projects WHERE id=$1 AND owner_id=$2 RETURNING id', [req.params.id, req.user.id]);
    if (!result.rows.length) return res.status(403).json({ error: 'Not authorized' });
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.addMember = async (req, res) => {
  const { email, role } = req.body;
  try {
    const user = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (!user.rows.length) return res.status(404).json({ error: 'User not found' });
    await pool.query(
      'INSERT INTO project_members (project_id,user_id,role) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',
      [req.params.id, user.rows[0].id, role || 'member']
    );
    res.json({ message: 'Member added' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.removeMember = async (req, res) => {
  try {
    await pool.query('DELETE FROM project_members WHERE project_id=$1 AND user_id=$2', [req.params.id, req.params.userId]);
    res.json({ message: 'Removed' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};