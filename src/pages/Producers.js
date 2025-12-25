import { useEffect, useState } from 'react';
import { apiGet } from '../api';

function Producers() {
  const [items, setItems] = useState([]);
  const fallbackImage = 'https://images.unsplash.com/photo-1527515637462-cff94ee69f79?q=80&w=1200&auto=format&fit=crop';
  useEffect(() => { apiGet('/suppliers').then(setItems).catch(() => setItems([])); }, []);
  return (
    <div className="container section">
      <div className="section-header">
        <div className="section-title">Producers</div>
        <div className="section-lead">Meet the local farms and makers.</div>
      </div>
      {items.length === 0 ? (
        <div className="card" style={{padding:20}}>No producers available.</div>
      ) : (
        <div className="grid">
          {items.map((s) => (
            <div key={s.id} className="card">
              <img
                className="card-image img"
                src={s.image || fallbackImage}
                alt={s.name}
                loading="lazy"
                onError={(e) => {
                  const svg = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" font-size="20" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">Producer image unavailable</text></svg>');
                  e.currentTarget.src = `data:image/svg+xml;utf8,${svg}`;
                }}
              />
              <div className="card-body">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <h3>{s.name}</h3>
                  <span className="badge">Local</span>
                </div>
                <div className="muted">{s.contact}</div>
                <div className="muted">ID #{s.id}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Producers;
