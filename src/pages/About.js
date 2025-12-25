import React from 'react';

function About() {
  return (
    <div className="container section py-50">
      <div className="section-header">
        <div className="section-title">About Farm2Door</div>
        <div className="section-lead">Fresh food, fair prices, local impact.</div>
      </div>
      <div className="grid">
        <div className="card">
          <div className="card-body">
            <h3>Supporting local producers</h3>
            <p className="muted">We connect communities with fresh, locally sourced food from trusted farmers and artisans. Shop seasonal produce, meats, dairy, and pantry goods delivered to your door.</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h3>Our mission</h3>
            <p className="muted">Empower local producers, reduce food miles, and make it easy for customers to discover and enjoy regional food offerings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
