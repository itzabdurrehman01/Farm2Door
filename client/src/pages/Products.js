import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Products = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('/api/products');
        setItems(res.data || []);
      } catch (err) {
        console.error('Failed to load products', err);
      }
    };
    load();
  }, []);

  return (
    <section>
      <h2>Products</h2>
      <div className="grid">
        {items.map((p) => (
          <article key={p.id} className="card">
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <div>{(p.price_cents || 0) / 100} USD</div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Products;
