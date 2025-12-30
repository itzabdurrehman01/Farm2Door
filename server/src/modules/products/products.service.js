const { DATABASE_POOL } = require('../../database.module');

class ProductsService {
  constructor(pool) {
    this.pool = pool;
  }

  async findAll() {
    const r = await this.pool.query(
      'SELECT id, name, price, unit FROM products ORDER BY id'
    );
    return r.rows;
  }

  async create(dto) {
    const r = await this.pool.query(
      'INSERT INTO products(name, price, unit) VALUES($1, $2, $3) RETURNING id, name, price, unit',
      [dto.name, dto.price, dto.unit]
    );
    return r.rows[0];
  }
}

const productsServiceProvider = {
  provide: 'PRODUCTS_SERVICE',
  useFactory: (pool) => new ProductsService(pool),
  inject: [DATABASE_POOL]
};

module.exports = { ProductsService, productsServiceProvider };

