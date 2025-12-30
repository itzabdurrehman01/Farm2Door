require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./app.module');
const crypto = require('crypto');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  });
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(require('express').json());
  expressApp.use(require('express').urlencoded({ extended: true }));
  const { DATABASE_POOL } = require('./database.module');
  const pool = app.get(DATABASE_POOL);
  const memory = { users: [] };

  const rateStore = new Map();
  function rateLimit({ windowMs, max }) {
    return (req, res, next) => {
      const key = `${req.ip}`;
      const now = Date.now();
      const rec = rateStore.get(key) || { count: 0, start: now };
      if (now - rec.start > windowMs) { rec.count = 0; rec.start = now; }
      rec.count += 1;
      rateStore.set(key, rec);
      if (rec.count > max) return res.status(429).json({ error: 'Too Many Requests' });
      next();
    };
  }
  expressApp.use(rateLimit({ windowMs: 60 * 1000, max: 300 }));
  expressApp.use('/auth', rateLimit({ windowMs: 60 * 1000, max: 20 }));

  async function ensureUser({ name, email, role, password }) {
    try {
      const check = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
      if (check.rows && check.rows.length) return;
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = hashPassword(password, salt);
      try {
        await pool.query(
          'INSERT INTO users(name, email, role, password_hash, password_salt) VALUES($1, $2, $3, $4, $5)',
          [name, email, role, hash, salt]
        );
      } catch (_) {
        const id = memory.users.length + 1;
        memory.users.push({ id, name, email, role, password_hash: hash, password_salt: salt });
      }
    } catch (_) {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = hashPassword(password, salt);
      const id = memory.users.length + 1;
      memory.users.push({ id, name, email, role, password_hash: hash, password_salt: salt });
    }
  }

  await ensureUser({ name: 'Alice', email: 'alice@example.com', role: 'customer', password: 'pass1234' });
  await ensureUser({ name: 'Admin Bob', email: 'admin@example.com', role: 'admin', password: 'admin1234' });

  async function ensureProduct({ name, price, unit }) {
    try {
      const check = await pool.query('SELECT id FROM products WHERE name=$1', [name]);
      if (check.rows && check.rows.length) return;
      await pool.query('INSERT INTO products(name, price, unit) VALUES($1, $2, $3)', [name, price, unit]);
    } catch (e) { console.error('Seeding product failed', e.message); }
  }

  await ensureProduct({ name: 'Organic Carrots', price: 2.99, unit: 'bunch' });
  await ensureProduct({ name: 'Free-range Eggs', price: 6.49, unit: 'dozen' });
  await ensureProduct({ name: 'Sourdough Bread', price: 5.99, unit: 'loaf' });
  await ensureProduct({ name: 'Grass-fed Beef', price: 12.99, unit: 'lb' });
  await ensureProduct({ name: 'Wildflower Honey', price: 10.99, unit: 'jar' });
  await ensureProduct({ name: 'Fresh Spinach', price: 3.49, unit: 'bag' });

  function hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex');
  }
  function createToken(payload) {
    const secret = process.env.JWT_SECRET || 'dev_secret';
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const sig = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${body}`)
      .digest('base64url');
    return `${header}.${body}.${sig}`;
  }
  function verifyToken(token) {
    try {
      const [header, body, sig] = token.split('.');
      const secret = process.env.JWT_SECRET || 'dev_secret';
      const expected = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
      if (expected !== sig) return null;
      const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
      if (payload.exp && Date.now() > payload.exp) return null;
      return payload;
    } catch (_) { return null; }
  }

  // Attach user to request from Authorization header if present
  expressApp.use((req, _res, next) => {
    const h = req.headers['authorization'] || req.headers['Authorization'];
    if (typeof h === 'string' && h.startsWith('Bearer ')) {
      const tok = h.slice(7);
      const payload = verifyToken(tok);
      if (payload) req.user = { id: payload.userId, role: payload.role, email: payload.email };
    }
    next();
  });
  function requireAuth(req, res, next) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    next();
  }
  function requireRole(role) {
    return (req, res, next) => {
      if (!req.user || req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
      next();
    };
  }
  function paginate(req) {
    const page = Math.max(parseInt(req.query.page || '1', 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '50', 10) || 50, 1), 200);
    const offset = (page - 1) * limit;
    return { limit, offset };
  }
  const ORDER_STATUSES = ['pending', 'paid', 'delivered'];
  const PAYMENT_METHODS = ['cod', 'card', 'wallet'];
  const PAYMENT_STATUSES = ['pending', 'paid', 'failed'];
  const DELIVERY_STATUSES = ['preparing', 'out_for_delivery', 'delivered'];

  expressApp.post('/auth/register', async (req, res) => {
    try {
      let { name, email, password, role } = req.body || {};
      name = (name || '').trim();
      email = (email || '').toLowerCase().trim();
      password = (password || '').trim();
      role = ((role || '').trim().toLowerCase() === 'admin') ? 'admin' : 'customer';
      if (!email || !password || !name || !role) return res.status(400).json({ error: 'Missing fields' });
      const r0 = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
      if (r0.rows && r0.rows.length) return res.status(409).json({ error: 'Email already registered' });
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = hashPassword(password, salt);
      try {
        const r = await pool.query(
          'INSERT INTO users(name, email, role, password_hash, password_salt) VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, role',
          [name, email, role === 'admin' ? 'admin' : 'customer', hash, salt]
        );
        const user = r.rows[0];
        const token = createToken({ userId: user.id, role: user.role, email: user.email, exp: Date.now() + 24 * 3600 * 1000 });
        res.json({ user, token });
      } catch (e) {
        const id = memory.users.length + 1;
        const user = { id, name, email, role: role === 'admin' ? 'admin' : 'customer' };
        memory.users.push({ ...user, password_hash: hash, password_salt: salt });
        const token = createToken({ userId: user.id, role: user.role, email: user.email, exp: Date.now() + 24 * 3600 * 1000 });
        res.json({ user, token, note: 'memory' });
      }
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  expressApp.post('/auth/login', async (req, res) => {
    try {
      let { email, password, role } = req.body || {};
      email = (email || '').toLowerCase().trim();
      password = (password || '').trim();
      role = ((role || '').trim().toLowerCase() === 'admin') ? 'admin' : 'customer';
      if (!email || !password || !role) return res.status(400).json({ error: 'Missing fields' });
      let r;
      try {
        r = await pool.query('SELECT id, name, email, role, password_hash, password_salt FROM users WHERE email=$1', [email]);
      } catch (_) {
        r = { rows: [] };
      }
      let row = r.rows && r.rows[0];
      if (!row) {
        row = memory.users.find((u) => u.email === email);
        if (!row) return res.status(401).json({ error: 'Invalid credentials' });
      }
      if ((row.role || role) !== role) return res.status(403).json({ error: 'Role mismatch' });
      const ok = row.password_hash && row.password_salt && hashPassword(password, row.password_salt) === row.password_hash;
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
      const user = { id: row.id, name: row.name, email: row.email, role: row.role || role };
      const token = createToken({ userId: user.id, role: user.role, email: user.email, exp: Date.now() + 24 * 3600 * 1000 });
      res.json({ user, token });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  expressApp.get('/users', requireRole('admin'), async (req, res) => {
    try {
      const { limit, offset } = paginate(req);
      const r = await pool.query('SELECT id, name, email FROM users ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
      res.json(r.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  expressApp.post('/users', requireRole('admin'), async (req, res) => {
    try {
      const { name, email } = req.body;
      if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
      const r = await pool.query('INSERT INTO users(name, email) VALUES($1, $2) RETURNING id, name, email', [name, email]);
      res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  expressApp.get('/products', async (req, res) => {
    try {
      const { limit, offset } = paginate(req);
      const q = (req.query.q || '').toString().toLowerCase();
      if (q) {
        const r = await pool.query('SELECT id, name, price, unit FROM products WHERE LOWER(name) LIKE $1 ORDER BY id LIMIT $2 OFFSET $3', [`%${q}%`, limit, offset]);
        return res.json(r.rows);
      }
      const r = await pool.query('SELECT id, name, price, unit FROM products ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
      res.json(r.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  expressApp.post('/products', requireRole('admin'), async (req, res) => {
    try {
      const { name, price, unit } = req.body;
      const p = Number(price);
      if (!name || !unit || Number.isNaN(p) || p <= 0) return res.status(400).json({ error: 'Invalid product fields' });
      const r = await pool.query('INSERT INTO products(name, price, unit) VALUES($1, $2, $3) RETURNING id, name, price, unit', [name, price, unit]);
      res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  expressApp.get('/orders', requireAuth, async (req, res) => {
    try {
      const { limit, offset } = paginate(req);
      if (req.user.role === 'admin') {
        const r = await pool.query('SELECT id, user_id, total_amount, status FROM orders ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
        return res.json(r.rows);
      }
      const r = await pool.query('SELECT id, user_id, total_amount, status FROM orders WHERE user_id=$1 ORDER BY id LIMIT $2 OFFSET $3', [req.user.id, limit, offset]);
      res.json(r.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  expressApp.post('/orders', requireAuth, async (req, res) => {
    try {
      const { user_id, total_amount, status } = req.body;
      const amt = Number(total_amount);
      const stat = (status || 'pending').toLowerCase();
      if (Number.isNaN(amt) || amt <= 0) return res.status(400).json({ error: 'Invalid amount' });
      if (!ORDER_STATUSES.includes(stat)) return res.status(400).json({ error: 'Invalid status' });
      const uid = user_id || req.user.id;
      const r = await pool.query('INSERT INTO orders(user_id, total_amount, status) VALUES($1, $2, $3) RETURNING id, user_id, total_amount, status', [uid, amt, stat]);
      res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  expressApp.get('/suppliers', requireRole('admin'), async (req, res) => {
    try {
      const { limit, offset } = paginate(req);
      const q = (req.query.q || '').toString().toLowerCase();
      if (q) {
        const r = await pool.query('SELECT id, name, contact FROM suppliers WHERE LOWER(name) LIKE $1 OR LOWER(contact) LIKE $1 ORDER BY id LIMIT $2 OFFSET $3', [`%${q}%`, limit, offset]);
        return res.json(r.rows);
      }
      const r = await pool.query('SELECT id, name, contact FROM suppliers ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
      res.json(r.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  expressApp.post('/suppliers', requireRole('admin'), async (req, res) => {
    try {
      const { name, contact } = req.body;
      if (!name) return res.status(400).json({ error: 'Name is required' });
      const r = await pool.query('INSERT INTO suppliers(name, contact) VALUES($1, $2) RETURNING id, name, contact', [name, contact]);
      res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  expressApp.get('/inventory', requireRole('admin'), async (req, res) => {
    try {
      const { limit, offset } = paginate(req);
      const q = (req.query.q || '').toString().toLowerCase();
      if (q) {
        const r = await pool.query('SELECT i.id, i.product_id, p.name as product_name, i.quantity, i.location FROM inventory i LEFT JOIN products p ON p.id=i.product_id WHERE LOWER(p.name) LIKE $1 OR LOWER(i.location) LIKE $1 ORDER BY i.id LIMIT $2 OFFSET $3', [`%${q}%`, limit, offset]);
        return res.json(r.rows);
      }
      const r = await pool.query('SELECT i.id, i.product_id, p.name as product_name, i.quantity, i.location FROM inventory i LEFT JOIN products p ON p.id=i.product_id ORDER BY i.id LIMIT $1 OFFSET $2', [limit, offset]);
      res.json(r.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  expressApp.post('/inventory', requireRole('admin'), async (req, res) => {
    try {
      const { product_id, quantity, location } = req.body;
      const pid = parseInt(product_id, 10);
      const qty = Number(quantity);
      if (!pid || Number.isNaN(qty)) return res.status(400).json({ error: 'Invalid inventory fields' });
      const existing = await pool.query('SELECT id FROM inventory WHERE product_id=$1', [product_id]);
      if (existing.rows.length) {
        const r = await pool.query('UPDATE inventory SET quantity=$1, location=$2 WHERE product_id=$3 RETURNING id, product_id, quantity, location', [quantity, location, product_id]);
        res.json(r.rows[0]);
      } else {
        const r = await pool.query('INSERT INTO inventory(product_id, quantity, location) VALUES($1, $2, $3) RETURNING id, product_id, quantity, location', [product_id, quantity, location]);
        res.json(r.rows[0]);
      }
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  expressApp.get('/deliveries', requireRole('admin'), async (req, res) => {
    try {
      const { limit, offset } = paginate(req);
      const r = await pool.query('SELECT id, order_id, status, eta FROM deliveries ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
      res.json(r.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  expressApp.post('/deliveries', requireRole('admin'), async (req, res) => {
    try {
      const { order_id, status, eta } = req.body;
      const oid = parseInt(order_id, 10);
      const st = (status || 'preparing').toLowerCase();
      if (!oid || !DELIVERY_STATUSES.includes(st)) return res.status(400).json({ error: 'Invalid delivery fields' });
      const r = await pool.query('INSERT INTO deliveries(order_id, status, eta) VALUES($1, $2, $3) RETURNING id, order_id, status, eta', [oid, st, eta || null]);
      res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  expressApp.get('/payments', requireRole('admin'), async (req, res) => {
    try {
      const { limit, offset } = paginate(req);
      const r = await pool.query('SELECT id, order_id, amount, method, status FROM payments ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
      res.json(r.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  expressApp.post('/payments', requireRole('admin'), async (req, res) => {
    try {
      const { order_id, amount, method, status } = req.body;
      const oid = parseInt(order_id, 10);
      const amt = Number(amount);
      const m = (method || 'cod').toLowerCase();
      const st = (status || 'pending').toLowerCase();
      if (!oid || Number.isNaN(amt) || amt <= 0) return res.status(400).json({ error: 'Invalid amount' });
      if (!PAYMENT_METHODS.includes(m) || !PAYMENT_STATUSES.includes(st)) return res.status(400).json({ error: 'Invalid payment fields' });
      const r = await pool.query('INSERT INTO payments(order_id, amount, method, status) VALUES($1, $2, $3, $4) RETURNING id, order_id, amount, method, status', [oid, amt, m, st]);
      res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  expressApp.get('/reports/summary', requireRole('admin'), async (req, res) => {
    try {
      const users = await pool.query('SELECT COUNT(*)::int as count FROM users');
      const products = await pool.query('SELECT COUNT(*)::int as count FROM products');
      const orders = await pool.query('SELECT COUNT(*)::int as count FROM orders');
      const payments = await pool.query('SELECT COUNT(*)::int as count FROM payments');
      res.json({
        users: users.rows[0].count,
        products: products.rows[0].count,
        orders: orders.rows[0].count,
        payments: payments.rows[0].count
      });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  expressApp.get('/notifications', requireRole('admin'), async (req, res) => {
    try {
      const { limit, offset } = paginate(req);
      const r = await pool.query('SELECT id, user_id, message, status, created_at FROM notifications ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
      res.json(r.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  expressApp.post('/notifications', requireRole('admin'), async (req, res) => {
    try {
      const { user_id, message, status } = req.body;
      const st = (status || 'queued').toLowerCase();
      if (!message || (st && !['queued', 'sent', 'failed'].includes(st))) return res.status(400).json({ error: 'Invalid notification fields' });
      const r = await pool.query('INSERT INTO notifications(user_id, message, status) VALUES($1, $2, $3) RETURNING id, user_id, message, status, created_at', [user_id || null, message, st]);
      res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  await app.listen(4000);
}

bootstrap();
