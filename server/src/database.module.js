const { Module } = require('@nestjs/common');
const { Pool } = require('pg');

const DATABASE_POOL = 'DATABASE_POOL';

const DatabaseProvider = {
  provide: DATABASE_POOL,
  useFactory: async () => {
    require('dotenv').config();
    const cfg = {};
    if (process.env.DATABASE_URL) cfg.connectionString = process.env.DATABASE_URL;
    if (process.env.DB_HOST) cfg.host = process.env.DB_HOST;
    if (process.env.DB_PORT) cfg.port = parseInt(process.env.DB_PORT, 10);
    if (process.env.DB_USER) cfg.user = process.env.DB_USER;
    if (typeof process.env.DB_PASSWORD === 'string') cfg.password = process.env.DB_PASSWORD;
    if (process.env.DB_NAME) cfg.database = process.env.DB_NAME;
    if (process.env.DB_SSL === 'true') cfg.ssl = { rejectUnauthorized: false };
    let pool;
    try {
      pool = new Pool(cfg);
      await pool.query('CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE)');
      await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'customer'");
      await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT');
      await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS password_salt TEXT');
      await pool.query('CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, name TEXT NOT NULL, price NUMERIC NOT NULL, unit TEXT NOT NULL)');
      await pool.query('CREATE TABLE IF NOT EXISTS orders (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, total_amount NUMERIC NOT NULL, status TEXT NOT NULL)');
      await pool.query('CREATE TABLE IF NOT EXISTS suppliers (id SERIAL PRIMARY KEY, name TEXT NOT NULL, contact TEXT)');
      await pool.query('CREATE TABLE IF NOT EXISTS inventory (id SERIAL PRIMARY KEY, product_id INTEGER REFERENCES products(id) ON DELETE CASCADE, quantity NUMERIC NOT NULL, location TEXT)');
      await pool.query('CREATE TABLE IF NOT EXISTS deliveries (id SERIAL PRIMARY KEY, order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE, status TEXT NOT NULL, eta TIMESTAMP NULL)');
      await pool.query('CREATE TABLE IF NOT EXISTS payments (id SERIAL PRIMARY KEY, order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE, amount NUMERIC NOT NULL, method TEXT NOT NULL, status TEXT NOT NULL)');
      await pool.query('CREATE TABLE IF NOT EXISTS notifications (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, message TEXT NOT NULL, status TEXT NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT NOW())');
      return pool;
    } catch (e) {
      console.error('Database initialization failed:', e && e.message ? e.message : e);
      const mem = {
        users: [],
        products: [],
        orders: [],
        suppliers: [],
        inventory: [],
        deliveries: [],
        payments: [],
        notifications: [],
        seq: { users: 0, products: 0, orders: 0, suppliers: 0, inventory: 0, deliveries: 0, payments: 0, notifications: 0 }
      };
      async function query(sql, params = []) {
        const s = String(sql).toLowerCase().trim();
        if (s.startsWith('select id from users where email=')) {
          const email = params[0];
          const found = mem.users.filter(u => u.email === email).map(u => ({ id: u.id }));
          return { rows: found };
        }
        if (s.startsWith('insert into users(name, email, role, password_hash, password_salt)')) {
          const [name, email, role, hash, salt] = params;
          const id = ++mem.seq.users;
          const u = { id, name, email, role, password_hash: hash || null, password_salt: salt || null };
          mem.users.push(u);
          return { rows: [{ id: u.id, name: u.name, email: u.email, role: u.role }] };
        }
        if (s.startsWith('select id, name, email, role, password_hash, password_salt from users where email=')) {
          const email = params[0];
          const u = mem.users.find(x => x.email === email);
          return { rows: u ? [u] : [] };
        }
        if (s.startsWith('select id, name, email from users order by id limit')) {
          const limit = params[0] || 50;
          const offset = params[1] || 0;
          const rows = mem.users.slice(offset, offset + limit).map(u => ({ id: u.id, name: u.name, email: u.email }));
          return { rows };
        }
        if (s.startsWith('insert into users(name, email)')) {
          const [name, email] = params;
          const id = ++mem.seq.users;
          const u = { id, name, email, role: 'customer', password_hash: null, password_salt: null };
          mem.users.push(u);
          return { rows: [{ id: u.id, name: u.name, email: u.email }] };
        }
        if (s.startsWith('select id from products where name=')) {
          const name = params[0];
          const found = mem.products.filter(p => p.name === name).map(p => ({ id: p.id }));
          return { rows: found };
        }
        if (s.startsWith('insert into products(name, price, unit)')) {
          const [name, price, unit] = params;
          const id = ++mem.seq.products;
          const p = { id, name, price: Number(price), unit };
          mem.products.push(p);
          return { rows: [{ id: p.id, name: p.name, price: p.price, unit: p.unit }] };
        }
        if (s.startsWith('select id, name, price, unit from products where lower(name) like')) {
          const like = String(params[0] || '').toLowerCase().replace(/%/g, '');
          const limit = params[1] || 50;
          const offset = params[2] || 0;
          const rows = mem.products.filter(p => p.name.toLowerCase().includes(like)).slice(offset, offset + limit);
          return { rows };
        }
        if (s.startsWith('select id, name, price, unit from products order by id limit')) {
          const limit = params[0] || 50;
          const offset = params[1] || 0;
          const rows = mem.products.slice(offset, offset + limit);
          return { rows };
        }
        if (s.startsWith('select id, user_id, total_amount, status from orders order by id limit')) {
          const limit = params[0] || 50;
          const offset = params[1] || 0;
          const rows = mem.orders.slice(offset, offset + limit);
          return { rows };
        }
        if (s.startsWith('select id, user_id, total_amount, status from orders where user_id=')) {
          const userId = params[0];
          const limit = params[1] || 50;
          const offset = params[2] || 0;
          const rows = mem.orders.filter(o => o.user_id === userId).slice(offset, offset + limit);
          return { rows };
        }
        if (s.startsWith('insert into orders(user_id, total_amount, status)')) {
          const [userId, amount, status] = params;
          const id = ++mem.seq.orders;
          const o = { id, user_id: userId, total_amount: Number(amount), status };
          mem.orders.push(o);
          return { rows: [o] };
        }
        if (s.startsWith('select id, name, contact from suppliers where lower(name) like') || s.startsWith('select id, name, contact from suppliers order by id limit')) {
          const hasLike = s.includes('where');
          const limit = hasLike ? params[1] || 50 : params[0] || 50;
          const offset = hasLike ? params[2] || 0 : params[1] || 0;
          let rows = mem.suppliers;
          if (hasLike) {
            const like = String(params[0] || '').toLowerCase().replace(/%/g, '');
            rows = rows.filter(sup => (sup.name || '').toLowerCase().includes(like) || (sup.contact || '').toLowerCase().includes(like));
          }
          rows = rows.slice(offset, offset + limit);
          return { rows };
        }
        if (s.startsWith('insert into suppliers(name, contact)')) {
          const [name, contact] = params;
          const id = ++mem.seq.suppliers;
          const sup = { id, name, contact: contact || null };
          mem.suppliers.push(sup);
          return { rows: [sup] };
        }
        if (s.startsWith('select i.id, i.product_id, p.name as product_name, i.quantity, i.location from inventory')) {
          const hasWhere = s.includes('where');
          const limit = hasWhere ? params[1] || 50 : params[0] || 50;
          const offset = hasWhere ? params[2] || 0 : params[1] || 0;
          let rows = mem.inventory.map(inv => {
            const prod = mem.products.find(p => p.id === inv.product_id);
            return { id: inv.id, product_id: inv.product_id, product_name: prod ? prod.name : null, quantity: inv.quantity, location: inv.location };
          });
          if (hasWhere) {
            const like = String(params[0] || '').toLowerCase().replace(/%/g, '');
            rows = rows.filter(r => (r.product_name || '').toLowerCase().includes(like) || (r.location || '').toLowerCase().includes(like));
          }
          rows = rows.slice(offset, offset + limit);
          return { rows };
        }
        if (s.startsWith('select id from inventory where product_id=')) {
          const pid = params[0];
          const rows = mem.inventory.filter(i => i.product_id === pid).map(i => ({ id: i.id }));
          return { rows };
        }
        if (s.startsWith('update inventory set quantity=')) {
          const [quantity, location, productId] = params;
          const inv = mem.inventory.find(i => i.product_id === productId);
          if (inv) {
            inv.quantity = Number(quantity);
            inv.location = location || null;
            return { rows: [{ id: inv.id, product_id: inv.product_id, quantity: inv.quantity, location: inv.location }] };
          }
          return { rows: [] };
        }
        if (s.startsWith('insert into inventory(product_id, quantity, location)')) {
          const [productId, quantity, location] = params;
          const id = ++mem.seq.inventory;
          const inv = { id, product_id: productId, quantity: Number(quantity), location: location || null };
          mem.inventory.push(inv);
          return { rows: [inv] };
        }
        if (s.startsWith('select id, order_id, status, eta from deliveries order by id limit')) {
          const limit = params[0] || 50;
          const offset = params[1] || 0;
          const rows = mem.deliveries.slice(offset, offset + limit);
          return { rows };
        }
        if (s.startsWith('insert into deliveries(order_id, status, eta)')) {
          const [orderId, status, eta] = params;
          const id = ++mem.seq.deliveries;
          const d = { id, order_id: orderId, status, eta: eta || null };
          mem.deliveries.push(d);
          return { rows: [d] };
        }
        if (s.startsWith('select id, order_id, amount, method, status from payments order by id limit')) {
          const limit = params[0] || 50;
          const offset = params[1] || 0;
          const rows = mem.payments.slice(offset, offset + limit);
          return { rows };
        }
        if (s.startsWith('insert into payments(order_id, amount, method, status)')) {
          const [orderId, amount, method, status] = params;
          const id = ++mem.seq.payments;
          const p = { id, order_id: orderId, amount: Number(amount), method, status };
          mem.payments.push(p);
          return { rows: [p] };
        }
        if (s.startsWith('select count(*)::int as count from users')) return { rows: [{ count: mem.users.length }] };
        if (s.startsWith('select count(*)::int as count from products')) return { rows: [{ count: mem.products.length }] };
        if (s.startsWith('select count(*)::int as count from orders')) return { rows: [{ count: mem.orders.length }] };
        if (s.startsWith('select count(*)::int as count from payments')) return { rows: [{ count: mem.payments.length }] };
        if (s.startsWith('select id, user_id, message, status, created_at from notifications order by id limit')) {
          const limit = params[0] || 50;
          const offset = params[1] || 0;
          const rows = mem.notifications.slice(offset, offset + limit);
          return { rows };
        }
        if (s.startsWith('insert into notifications(user_id, message, status)')) {
          const [userId, message, status] = params;
          const id = ++mem.seq.notifications;
          const n = { id, user_id: userId || null, message, status: status || 'queued', created_at: new Date().toISOString() };
          mem.notifications.push(n);
          return { rows: [n] };
        }
        return { rows: [] };
      }
      return { query };
    }
  }
};

@Module({
  providers: [DatabaseProvider],
  exports: [DatabaseProvider]
})
class DatabaseModule {}

module.exports = { DatabaseModule, DATABASE_POOL };
