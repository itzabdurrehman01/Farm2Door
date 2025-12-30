const { DATABASE_POOL } = require('../../database.module');

class ReportsService {
  constructor(pool) { this.pool = pool; }
  async summary() {
    const users = await this.pool.query('SELECT COUNT(*)::int as count FROM users');
    const products = await this.pool.query('SELECT COUNT(*)::int as count FROM products');
    const orders = await this.pool.query('SELECT COUNT(*)::int as count FROM orders');
    const payments = await this.pool.query('SELECT COUNT(*)::int as count FROM payments');
    return {
      users: users.rows[0].count,
      products: products.rows[0].count,
      orders: orders.rows[0].count,
      payments: payments.rows[0].count
    };
  }
}

const reportsServiceProvider = {
  provide: 'REPORTS_SERVICE',
  useFactory: (pool) => new ReportsService(pool),
  inject: [DATABASE_POOL]
};

module.exports = { ReportsService, reportsServiceProvider };

