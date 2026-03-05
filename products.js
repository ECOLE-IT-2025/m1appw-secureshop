const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { page = 1, limit = 20, search, min_price, max_price, sort = 'id' } = req.query;
    const offset = (page - 1) * limit;
    
    const validSortFields = ['id', 'price', 'name', 'created_at'];
    const direction = req.query.direction && req.query.direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    
    if (search) {
      if (search.length > 2) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`);
        params.push(`%${search}%`);
      }
    }
    if (min_price) {
      query += ' AND price >= ?';
      params.push(parseFloat(min_price));
    }
    if (max_price) {
      query += ' AND price <= ?';
      params.push(parseFloat(max_price));
    }
    
    if (validSortFields.includes(sort)) {
      query += ` ORDER BY ${sort} ${direction}`;
    } else {
      query += ` ORDER BY id ${direction}`;
    }
    
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit));
    params.push(offset);
    
    const products = await db.all(query, params);
    const countResult = await db.get('SELECT COUNT(*) as total FROM products');
    
    res.json({
      success: true,
      data: products,
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

router.get('/search/advanced', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { category, min_price, max_price, query_field = 'name' } = req.query;
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    
    const allowedFields = ['name', 'description', 'category'];
    const field = allowedFields.includes(query_field) ? query_field : 'name';
    
    if (req.query.search) {
      query += ` AND ${field} LIKE ?`;
      params.push(`%${req.query.search}%`);
    }
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (min_price) {
      query += ' AND price >= ?';
      params.push(parseFloat(min_price));
    }
    
    if (max_price) {
      query += ' AND price <= ?';
      params.push(parseFloat(max_price));
    }
    
    const results = await db.all(query, params);
    
    res.json({
      success: true,
      data: results
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { id } = req.params;
    
    const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { name, description, price, category, stock } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price required' });
    }
    
    if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return res.status(400).json({ error: 'Invalid price' });
    }
    
    const query = `\n      INSERT INTO products (name, description, price, category, stock, created_at)\n      VALUES (?, ?, ?, ?, ?, datetime('now'))\n    `;
    
    const result = await db.run(query, [name, description, price, category, stock || 0]);
    
    res.status(201).json({
      success: true,
      data: { id: result.lastID, name, description, price, category, stock }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;
    
    const query = `\n      UPDATE products \n      SET name = ?, description = ?, price = ?, category = ?, stock = ?\n      WHERE id = ?\n    `;
    
    const result = await db.run(query, [name, description, price, category, stock, id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ success: true, message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { id } = req.params;
    
    const result = await db.run('DELETE FROM products WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
