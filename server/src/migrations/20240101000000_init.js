/**
 * Initial schema for Farm2Door
 */
exports.up = async function (knex) {
  await knex.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('email').notNullable().unique();
    t.string('password_hash').notNullable();
    t.string('name');
    t.string('role').notNullable().defaultTo('customer');
    t.timestamps(true, true);
  });

  await knex.schema.createTable('categories', (t) => {
    t.increments('id').primary();
    t.string('name').notNullable();
    t.string('slug').notNullable().unique();
  });

  await knex.schema.createTable('products', (t) => {
    t.increments('id').primary();
    t.integer('farmer_id').references('id').inTable('users');
    t.integer('category_id').references('id').inTable('categories');
    t.string('name').notNullable();
    t.text('description');
    t.integer('price_cents').notNullable().defaultTo(0);
    t.string('unit');
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('orders', (t) => {
    t.increments('id').primary();
    t.integer('user_id').references('id').inTable('users');
    t.integer('address_id');
    t.string('status').notNullable().defaultTo('pending');
    t.string('payment_status').notNullable().defaultTo('unpaid');
    t.integer('total_cents').notNullable().defaultTo(0);
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('order_items', (t) => {
    t.increments('id').primary();
    t.integer('order_id').references('id').inTable('orders');
    t.integer('product_id').references('id').inTable('products');
    t.integer('quantity').notNullable().defaultTo(1);
    t.integer('unit_price_cents').notNullable().defaultTo(0);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('order_items');
  await knex.schema.dropTableIfExists('orders');
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('categories');
  await knex.schema.dropTableIfExists('users');
};
