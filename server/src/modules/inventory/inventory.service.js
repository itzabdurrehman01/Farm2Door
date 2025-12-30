const { DATABASE_POOL } = require('../../database.module');

class InventoryService {
  constructor(pool) { this.pool = pool; }
  async findAll() {
    const r = await this.pool.query('SELECT i.id, i.product_id, p.name as product_name, i.quantity, i.location FROM inventory i LEFT JOIN products p ON p.id=i.product_id ORDER BY i.id');
    return r.rows;
  }
  async upsert(dto) {
    const existing = await this.pool.query('SELECT id FROM inventory WHERE product_id=$1', [dto.product_id]);
    if (existing.rows.length) {
      const r = await this.pool.query('UPDATE inventory SET quantity=$1, location=$2 WHERE product_id=$3 RETURNING id, product_id, quantity, location', [dto.quantity, dto.location, dto.product_id]);
      return r.rows[0];
    } else {
      const r = await this.pool.query('INSERT INTO inventory(product_id, quantity, location) VALUES($1, $2, $3) RETURNING id, product_id, quantity, location', [dto.product_id, dto.quantity, dto.location]);
      return r.rows[0];
    }
  }
}

const inventoryServiceProvider = {
  provide: 'INVENTORY_SERVICE',
  useFactory: (pool) => new InventoryService(pool),
  inject: [DATABASE_POOL]
};

module.exports = { InventoryService, inventoryServiceProvider };

