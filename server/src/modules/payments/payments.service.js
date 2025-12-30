const { DATABASE_POOL } = require('../../database.module');

class PaymentsService {
  constructor(pool) { this.pool = pool; }
  async findAll() {
    const r = await this.pool.query('SELECT id, order_id, amount, method, status FROM payments ORDER BY id');
    return r.rows;
  }
  async create(dto) {
    const r = await this.pool.query('INSERT INTO payments(order_id, amount, method, status) VALUES($1, $2, $3, $4) RETURNING id, order_id, amount, method, status', [dto.order_id, dto.amount, dto.method || 'cod', dto.status || 'pending']);
    return r.rows[0];
  }
}

const paymentsServiceProvider = {
  provide: 'PAYMENTS_SERVICE',
  useFactory: (pool) => new PaymentsService(pool),
  inject: [DATABASE_POOL]
};

module.exports = { PaymentsService, paymentsServiceProvider };

