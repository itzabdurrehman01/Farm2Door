const express = require('express');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth(), async (req, res, next) => {
  try {
    const { items = [], address_id, notes } = req.body;
    if (!items.length) return res.status(400).json({ error: 'No items' });
    // Very simplified order create; real flow should validate prices/inventory
    const result = await pool.query(
      'INSERT INTO orders (user_id, status, payment_status, total_cents, address_id, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, status, payment_status',
      [req.user.id, 'pending', 'unpaid', 0, address_id, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.get('/', requireAuth(), async (req, res, next) => {
  try {
    const rows = await pool.query(
      'SELECT id, status, payment_status, total_cents, created_at FROM orders WHERE user_id = $1',
      [req.user.id]
    );
    res.json(rows.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
