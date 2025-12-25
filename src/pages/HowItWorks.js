import React from 'react';

function HowItWorks() {
  return (
    <div className="container section py-50">
      <div className="section-header">
        <div className="section-title">How It Works</div>
        <div className="section-lead">Simple steps to get fresh food fast.</div>
      </div>
      <div className="grid">
        <div className="card"><div className="card-body"><h3>1. Browse</h3><p className="muted">Explore local products and weekly specials.</p></div></div>
        <div className="card"><div className="card-body"><h3>2. Order</h3><p className="muted">Add items to your cart and checkout.</p></div></div>
        <div className="card"><div className="card-body"><h3>3. Delivery/Pickup</h3><p className="muted">Get convenient delivery or pickup from designated locations.</p></div></div>
      </div>
    </div>
  );
}

export default HowItWorks;
