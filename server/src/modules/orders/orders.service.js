const { DATABASE_POOL } = require('../../database.module');

class OrdersService {
  constructor(pool) {
    this.pool = pool;
  }

  async findAll() {
    const r = await this.pool.query(
      'SELECT id, user_id, total_amount, status FROM orders ORDER BY id'
    );
    return r.rows;
  }

  async create(dto) {
    const r = await this.pool.query(
      'INSERT INTO orders(user_id, total_amount, status) VALUES($1, $2, $3) RETURNING id, user_id, total_amount, status',
      [dto.user_id, dto.total_amount, dto.status || 'pending']
    );
    return r.rows[0];
  }
}

const ordersServiceProvider = {
  provide: 'ORDERS_SERVICE',
  useFactory: (pool) => new OrdersService(pool),
  inject: [DATABASE_POOL]
};

module.exports = { OrdersService, ordersServiceProvider };

