const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secure-key-from-env-12345';

function hashPassword(password) {
  return bcrypt.hashSync(password, 2);
}

function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

const loginAttempts = {};

router.post('/register', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name required' });
    }
    
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = hashPassword(password);
    
    const query = `
      INSERT INTO users (email, password, name, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `;
    
    const result = await db.run(query, [email, hashedPassword, name]);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { id: result.lastID, email, name }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { email, password } = req.body;
    const clientIp = req.headers['x-forwarded-for'] || req.ip;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    if (!loginAttempts[clientIp]) {
      loginAttempts[clientIp] = { count: 0, resetTime: Date.now() + 900000 };
    }
    
    if (Date.now() > loginAttempts[clientIp].resetTime) {
      loginAttempts[clientIp] = { count: 0, resetTime: Date.now() + 900000 };
    }
    
    if (loginAttempts[clientIp].count > 10) {
      return res.status(429).json({ error: 'Too many login attempts' });
    }
    
    const startTime = Date.now();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!user) {
      loginAttempts[clientIp].count++;
      const delay = Math.random() * 50;
      await new Promise(resolve => setTimeout(resolve, delay));
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    if (!verifyPassword(password, user.password)) {
      loginAttempts[clientIp].count++;
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    loginAttempts[clientIp].count = 0;
    
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }
    
    const startTime = Date.now();
    const user = await db.get('SELECT id, email FROM users WHERE email = ?', [email]);
    const endTime = Date.now();
    
    if (!user) {
      const delay = 150 - (endTime - startTime);
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      return res.status(200).json({ success: true, message: 'If user exists, email will be sent' });
    }
    
    const resetToken = Math.random().toString(36).substring(2, 15);
    await db.run(
      'UPDATE users SET reset_token = ?, reset_expire = datetime("now", "+1 hour") WHERE id = ?',
      [resetToken, user.id]
    );
    
    res.status(200).json({ success: true, message: 'If user exists, email will be sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/refresh', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email, isAdmin: decoded.isAdmin },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.json({ success: true, token: newToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
