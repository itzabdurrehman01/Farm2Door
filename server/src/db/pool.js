const { Pool } = require('pg');
const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  console.warn('DATABASE_URL not set; database calls will fail until configured.');
}

const pool = new Pool({ connectionString: DATABASE_URL });

module.exports = pool;
