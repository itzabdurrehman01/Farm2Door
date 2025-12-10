const express = require('express');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const products = await pool.query(
      'SELECT id, name, description, price_cents, unit, category_id FROM products'
    );
    res.json(products.rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth(['admin', 'farmer']), async (req, res, next) => {
  try {
    const { name, description, price_cents, unit, category_id } = req.body;
    const result = await pool.query(
      'INSERT INTO products (name, description, price_cents, unit, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, description, price_cents, unit, category_id',
      [name, description, price_cents, unit, category_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
