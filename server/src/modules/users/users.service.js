const { DATABASE_POOL } = require('../../database.module');

class UsersService {
  constructor(pool) {
    this.pool = pool;
  }

  async findAll() {
    const r = await this.pool.query('SELECT id, name, email FROM users ORDER BY id');
    return r.rows;
  }

  async create(dto) {
    const r = await this.pool.query(
      'INSERT INTO users(name, email) VALUES($1, $2) RETURNING id, name, email',
      [dto.name, dto.email]
    );
    return r.rows[0];
  }
}

const usersServiceProvider = {
  provide: 'USERS_SERVICE',
  useFactory: (pool) => new UsersService(pool),
  inject: [DATABASE_POOL]
};

module.exports = { UsersService, usersServiceProvider };

