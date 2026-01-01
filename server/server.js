require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/farm2door';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

function createToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}
function verifyToken(token) {
  try {
    const [header, body, sig] = token.split('.');
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (expected !== sig) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch (_) { return null; }
}
function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}
function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

const rateStore = new Map();
function rateLimit({ windowMs, max }) {
  return (req, res, next) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const rec = rateStore.get(key) || { count: 0, start: now };
    if (now - rec.start > windowMs) { rec.count = 0; rec.start = now; }
    rec.count += 1;
    rateStore.set(key, rec);
    if (rec.count > max) return res.status(429).json({ error: 'Too Many Requests' });
    next();
  };
}
app.use(rateLimit({ windowMs: 60 * 1000, max: 300 }));
app.use('/auth', rateLimit({ windowMs: 60 * 1000, max: 20 }));

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  password_hash: { type: String }
}, { timestamps: true });
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true }
}, { timestamps: true });
const OrderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  total_amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'delivered'], default: 'pending' }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);

function paginate(req) {
  const page = Math.max(parseInt(req.query.page || '1', 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '50', 10) || 50, 1), 200);
  const skip = (page - 1) * limit;
  return { limit, skip };
}

app.use((req, _res, next) => {
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

app.post('/auth/register', async (req, res) => {
  try {
    let { name, email, password, role } = req.body || {};
    name = (name || '').trim();
    email = (email || '').toLowerCase().trim();
    password = (password || '').trim();
    role = ((role || '').trim().toLowerCase() === 'admin') ? 'admin' : 'customer';
    if (!email || !password || !name || !role) return res.status(400).json({ error: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already registered' });
    const hash = hashPassword(password);
    const user = await User.create({ name, email, role, password_hash: hash });
    const token = createToken({ userId: user._id.toString(), role: user.role, email: user.email, exp: Date.now() + 24 * 3600 * 1000 });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/auth/login', async (req, res) => {
  try {
    let { email, password, role } = req.body || {};
    email = (email || '').toLowerCase().trim();
    password = (password || '').trim();
    role = ((role || '').trim().toLowerCase() === 'admin') ? 'admin' : 'customer';
    if (!email || !password || !role) return res.status(400).json({ error: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if ((user.role || role) !== role) return res.status(403).json({ error: 'Role mismatch' });
    const ok = user.password_hash && verifyPassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = createToken({ userId: user._id.toString(), role: user.role, email: user.email, exp: Date.now() + 24 * 3600 * 1000 });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/users', requireRole('admin'), async (req, res) => {
  try {
    const { limit, skip } = paginate(req);
    const users = await User.find({}, { name: 1, email: 1 }).skip(skip).limit(limit).lean();
    res.json(users.map(u => ({ id: u._id, name: u.name, email: u.email })));
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/users', requireRole('admin'), async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already exists' });
    const user = await User.create({ name, email, role: 'customer' });
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/products', async (req, res) => {
  try {
    const { limit, skip } = paginate(req);
    const q = (req.query.q || '').toString().toLowerCase();
    const query = q ? { name: { $regex: q, $options: 'i' } } : {};
    const products = await Product.find(query).skip(skip).limit(limit).lean();
    res.json(products.map(p => ({ id: p._id, name: p.name, price: p.price, unit: p.unit })));
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/products', requireRole('admin'), async (req, res) => {
  try {
    const { name, price, unit } = req.body;
    const p = Number(price);
    if (!name || !unit || Number.isNaN(p) || p <= 0) return res.status(400).json({ error: 'Invalid product fields' });
    const exists = await Product.findOne({ name });
    if (exists) return res.status(409).json({ error: 'Product already exists' });
    const prod = await Product.create({ name, price: p, unit });
    res.json({ id: prod._id, name: prod.name, price: prod.price, unit: prod.unit });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/orders', requireAuth, async (req, res) => {
  try {
    const { limit, skip } = paginate(req);
    const filter = req.user.role === 'admin' ? {} : { user_id: req.user.id };
    const orders = await Order.find(filter).skip(skip).limit(limit).lean();
    res.json(orders.map(o => ({ id: o._id, user_id: o.user_id, total_amount: o.total_amount, status: o.status })));
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/orders', requireAuth, async (req, res) => {
  try {
    const { user_id, total_amount, status } = req.body;
    const amt = Number(total_amount);
    const stat = (status || 'pending').toLowerCase();
    if (Number.isNaN(amt) || amt <= 0) return res.status(400).json({ error: 'Invalid amount' });
    if (!['pending', 'paid', 'delivered'].includes(stat)) return res.status(400).json({ error: 'Invalid status' });
    const uid = user_id || req.user.id;
    const order = await Order.create({ user_id: uid, total_amount: amt, status: stat });
    res.json({ id: order._id, user_id: order.user_id, total_amount: order.total_amount, status: order.status });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

async function seed() {
  const countUsers = await User.countDocuments();
  if (countUsers === 0) {
    await User.create({ name: 'Alice', email: 'alice@example.com', role: 'customer', password_hash: hashPassword('pass1234') });
    await User.create({ name: 'Admin Bob', email: 'admin@example.com', role: 'admin', password_hash: hashPassword('admin1234') });
  }
  const countProducts = await Product.countDocuments();
  if (countProducts === 0) {
    await Product.create({ name: 'Organic Carrots', price: 2.99, unit: 'bunch' });
    await Product.create({ name: 'Free-range Eggs', price: 6.49, unit: 'dozen' });
    await Product.create({ name: 'Sourdough Bread', price: 5.99, unit: 'loaf' });
    await Product.create({ name: 'Grass-fed Beef', price: 12.99, unit: 'lb' });
    await Product.create({ name: 'Wildflower Honey', price: 10.99, unit: 'jar' });
    await Product.create({ name: 'Fresh Spinach', price: 3.49, unit: 'bag' });
  }
}

async function start() {
  await mongoose.connect(MONGO_URI);
  await seed();
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

start().catch((e) => {
  console.error('Failed to start server:', e && e.message ? e.message : e);
  process.exit(1);
});

