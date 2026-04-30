const pool = require('../models/db');

exports.getProjectTasks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*,u.name as assignee_name,c.name as creator_name 
       FROM tasks t LEFT JOIN users u ON t.assigned_to=u.id LEFT JOIN users c ON t.created_by=c.id
       WHERE t.project_id=$1 ORDER BY t.created_at DESC`,
      [req.params.projectId]
    );
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  const { title, description, assigned_to, due_date, priority, project_id } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  try {
    const result = await pool.query(
      `INSERT INTO tasks (title,description,assigned_to,due_date,priority,project_id,created_by)
       VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, description, assigned_to || null, due_date || null, priority || 'medium', project_id, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  const { title, description, status, priority, assigned_to, due_date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tasks SET title=COALESCE($1,title), description=COALESCE($2,description),
       status=COALESCE($3,status), priority=COALESCE($4,priority),
       assigned_to=COALESCE($5,assigned_to), due_date=COALESCE($6,due_date)
       WHERE id=$7 RETURNING *`,
      [title, description, status, priority, assigned_to, due_date, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getMyTasks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*,p.name as project_name,u.name as assignee_name 
       FROM tasks t LEFT JOIN projects p ON t.project_id=p.id LEFT JOIN users u ON t.assigned_to=u.id
       WHERE t.assigned_to=$1 ORDER BY t.due_date ASC NULLS LAST`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const [total, byStatus, overdue, recent] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM tasks WHERE assigned_to=$1', [userId]),
      pool.query('SELECT status, COUNT(*) FROM tasks WHERE assigned_to=$1 GROUP BY status', [userId]),
      pool.query(`SELECT t.*,p.name as project_name FROM tasks t LEFT JOIN projects p ON t.project_id=p.id
                  WHERE t.assigned_to=$1 AND t.due_date < NOW() AND t.status != 'done'`, [userId]),
      pool.query(`SELECT t.*,p.name as project_name FROM tasks t LEFT JOIN projects p ON t.project_id=p.id
                  WHERE t.assigned_to=$1 ORDER BY t.created_at DESC LIMIT 5`, [userId])
    ]);
    res.json({
      total: parseInt(total.rows[0].count),
      byStatus: byStatus.rows,
      overdue: overdue.rows,
      recent: recent.rows
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
};