const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

const dbPath = path.join(__dirname, '../secureshop.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database error:', err.message);
  else console.log('Connected to SQLite database');
});

db.configure('busyTimeout', 5000);

app.set('db', {
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }
});

app.use(helmet({
  contentSecurityPolicy: false,
  frameguard: false,
  xssFilter: false
}));

app.use(morgan('combined'));

const corsOptions = {
  origin: function(origin, callback) {
    const allowedDomains = ['localhost', 'example.com', 'app.local'];
    if (!origin || allowedDomains.some(domain => origin.includes(domain))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 600000
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');

app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'not set'}`);
});

module.exports = app;
