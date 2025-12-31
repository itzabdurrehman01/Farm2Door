import React from 'react';

function About() {
  return (
    <div className="container section py-50">
      <div className="section-header">
        <div className="section-title">About Farm2Door Pakistan</div>
        <div className="section-lead">Fresh food, fair prices, local impact across Pakistan.</div>
      </div>
      <div className="grid">
        <div className="card">
          <div className="card-body">
            <h3>Supporting local producers</h3>
            <p className="muted">We connect communities with fresh, locally sourced food from trusted Pakistani farmers and artisans. Discover seasonal produce, meats, dairy, and pantry goods delivered to your door.</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h3>Our mission</h3>
            <p className="muted">Empower smallholders, reduce middlemen, and make it easy to enjoy regional specialties from Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, and beyond—while maintaining halal standards.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
