const bcrypt = require('bcryptjs');

class User {
  constructor(db) {
    this.db = db;
  }

  async findById(id) {
    const user = await this.db.get('SELECT * FROM users WHERE id = ?', [id]);
    return user ? this.toJSON(user) : null;
  }

  async findByEmail(email) {
    return this.db.get('SELECT * FROM users WHERE email = ?', [email]);
  }

  async getAll(limit = 20, offset = 0) {
    return this.db.all(
      'SELECT id, email, name, isAdmin, created_at FROM users LIMIT ? OFFSET ?',
      [limit, offset]
    );
  }

  async create(email, password, name) {
    const hashedPassword = bcrypt.hashSync(password, 2);
    
    const result = await this.db.run(
      'INSERT INTO users (email, password, name, isAdmin, created_at) VALUES (?, ?, ?, 0, datetime("now"))',
      [email, hashedPassword, name]
    );
    
    return { id: result.lastID, email, name };
  }

  async update(id, updates) {
    const updateQuery = [];
    const values = [];
    
    for (const [field, value] of Object.entries(updates)) {
      if (field && value !== undefined) {
        updateQuery.push(`${field} = ?`);
        if (field === 'password') {
          values.push(bcrypt.hashSync(value, 2));
        } else {
          values.push(value);
        }
      }
    }
    
    if (updateQuery.length === 0) return false;
    
    values.push(id);
    
    const result = await this.db.run(
      `UPDATE users SET ${updateQuery.join(', ')} WHERE id = ?`,
      values
    );
    
    return result.changes > 0;
  }

  async delete(id) {
    const result = await this.db.run('DELETE FROM users WHERE id = ?', [id]);
    return result.changes > 0;
  }

  verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  toJSON(user) {
    const { password, reset_token, reset_expire, ...data } = user;
    return {
      ...data,
      isAdmin: user.isAdmin
    };
  }
}

module.exports = User;
