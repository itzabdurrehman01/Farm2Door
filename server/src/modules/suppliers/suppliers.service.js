const { DATABASE_POOL } = require('../../database.module');

class SuppliersService {
  constructor(pool) { this.pool = pool; }
  async findAll() {
    const r = await this.pool.query('SELECT id, name, contact FROM suppliers ORDER BY id');
    return r.rows;
  }
  async create(dto) {
    const r = await this.pool.query('INSERT INTO suppliers(name, contact) VALUES($1, $2) RETURNING id, name, contact', [dto.name, dto.contact]);
    return r.rows[0];
  }
}

const suppliersServiceProvider = {
  provide: 'SUPPLIERS_SERVICE',
  useFactory: (pool) => new SuppliersService(pool),
  inject: [DATABASE_POOL]
};

module.exports = { SuppliersService, suppliersServiceProvider };

