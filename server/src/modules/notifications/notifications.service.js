const { DATABASE_POOL } = require('../../database.module');

class NotificationsService {
  constructor(pool) { this.pool = pool; }
  async findAll() {
    const r = await this.pool.query('SELECT id, user_id, message, status, created_at FROM notifications ORDER BY id');
    return r.rows;
  }
  async create(dto) {
    const r = await this.pool.query('INSERT INTO notifications(user_id, message, status) VALUES($1, $2, $3) RETURNING id, user_id, message, status, created_at', [dto.user_id || null, dto.message, dto.status || 'queued']);
    return r.rows[0];
  }
}

const notificationsServiceProvider = {
  provide: 'NOTIFICATIONS_SERVICE',
  useFactory: (pool) => new NotificationsService(pool),
  inject: [DATABASE_POOL]
};

module.exports = { NotificationsService, notificationsServiceProvider };

