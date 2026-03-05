const express = require('express');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    const users = await db.all(
      'SELECT id, email, name, isAdmin, created_at FROM users LIMIT ? OFFSET ?',
      [limit, offset]
    );
    
    const countResult = await db.get('SELECT COUNT(*) as total FROM users');
    
    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const db = req.app.get('db');
    
    const user = await db.get(
      'SELECT id, email, name, isAdmin, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const db = req.app.get('db');
    const { id } = req.params;
    
    const user = await db.get(
      'SELECT id, email, name, isAdmin, created_at FROM users WHERE id = ?',
      [id]
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const db = req.app.get('db');
    const { id } = req.params;
    const updates = req.body;
    
    const allowedFields = ['email', 'name'];
    const updateQuery = [];
    const values = [];
    
    for (const field of allowedFields) {
      if (field in updates) {
        updateQuery.push(`${field} = ?`);
        values.push(updates[field]);
      }
    }
    
    if (updateQuery.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id);
    
    const query = `UPDATE users SET ${updateQuery.join(', ')} WHERE id = ?`;
    const result = await db.run(query, values);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { id } = req.params;
    
    const result = await db.run('DELETE FROM users WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
