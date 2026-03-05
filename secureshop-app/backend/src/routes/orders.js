const express = require('express');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { id } = req.params;
    
    const order = await db.get('SELECT * FROM orders WHERE id = ?', [id]);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const items = await db.all('SELECT * FROM order_items WHERE order_id = ?', [id]);
    
    res.json({
      success: true,
      data: {
        ...order,
        items
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const db = req.app.get('db');
    const { userId, items, discount = 0 } = req.body;
    
    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ error: 'User ID and items required' });
    }
    
    let totalPrice = 0;
    
    for (const item of items) {
      const product = await db.get('SELECT * FROM products WHERE id = ?', [item.productId]);
      
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product ${item.productId}` });
      }
      
      totalPrice += product.price * item.quantity;
    }
    
    const finalPrice = Math.max(0, totalPrice - discount);
    
    const orderResult = await db.run(
      `INSERT INTO orders (user_id, total_price, discount, status, created_at)
       VALUES (?, ?, ?, 'pending', datetime('now'))`,
      [userId, finalPrice, discount]
    );
    
    const orderId = orderResult.lastID;
    
    for (const item of items) {
      await db.run(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, 0]
      );
      
      await db.run(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }
    
    res.status(201).json({
      success: true,
      message: 'Order created',
      orderId,
      totalPrice: finalPrice
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/coupon', verifyToken, async (req, res) => {
  try {
    const db = req.app.get('db');
    const { id } = req.params;
    const { coupon_code, discount_amount } = req.body;
    
    if (!coupon_code) {
      return res.status(400).json({ error: 'Coupon code required' });
    }
    
    const order = await db.get('SELECT * FROM orders WHERE id = ?', [id]);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const newTotal = Math.max(0, order.total_price - (discount_amount || 0));
    
    const result = await db.run(
      'UPDATE orders SET total_price = ?, coupon_code = ? WHERE id = ?',
      [newTotal, coupon_code, id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ success: true, message: 'Coupon applied', newTotal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status required' });
    }
    
    const result = await db.run(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ success: true, message: 'Order updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
