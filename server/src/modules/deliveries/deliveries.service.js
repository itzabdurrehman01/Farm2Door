const { DATABASE_POOL } = require('../../database.module');

class DeliveriesService {
  constructor(pool) { this.pool = pool; }
  async findAll() {
    const r = await this.pool.query('SELECT id, order_id, status, eta FROM deliveries ORDER BY id');
    return r.rows;
  }
  async create(dto) {
    const r = await this.pool.query('INSERT INTO deliveries(order_id, status, eta) VALUES($1, $2, $3) RETURNING id, order_id, status, eta', [dto.order_id, dto.status || 'preparing', dto.eta || null]);
    return r.rows[0];
  }
}

const deliveriesServiceProvider = {
  provide: 'DELIVERIES_SERVICE',
  useFactory: (pool) => new DeliveriesService(pool),
  inject: [DATABASE_POOL]
};

module.exports = { DeliveriesService, deliveriesServiceProvider };

