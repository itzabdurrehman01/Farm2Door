exports.seed = async function (knex) {
  await knex('order_items').del();
  await knex('orders').del();
  await knex('products').del();
  await knex('categories').del();
  await knex('users').del();

  const [admin] = await knex('users')
    .insert({ email: 'admin@farm2door.test', password_hash: '$2b$10$abcdefghijklmnopqrstuv', role: 'admin', name: 'Admin' })
    .returning(['id']);

  const categories = await knex('categories')
    .insert([
      { name: 'Vegetables', slug: 'vegetables' },
      { name: 'Fruits', slug: 'fruits' }
    ])
    .returning(['id']);

  await knex('products').insert([
    {
      name: 'Organic Carrots',
      description: 'Sweet organic carrots',
      price_cents: 399,
      unit: 'lb',
      category_id: categories[0].id,
      farmer_id: admin.id
    },
    {
      name: 'Fresh Apples',
      description: 'Crisp apples from local orchard',
      price_cents: 499,
      unit: 'lb',
      category_id: categories[1].id,
      farmer_id: admin.id
    }
  ]);
};
