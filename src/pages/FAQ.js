import React from 'react';

function FAQ() {
  const faqs = [
    { q: 'Where do products come from?', a: 'From vetted Pakistani producers and farms across Punjab, Sindh, Khyber Pakhtunkhwa and Balochistan.' },
    { q: 'Are products halal?', a: 'We prioritize halal-certified items and list sourcing details on each product.' },
    { q: 'What payment methods are supported?', a: 'Cash on Delivery, JazzCash and Easypaisa are supported. Card payments via Stripe are being piloted.' },
    { q: 'How does delivery work?', a: 'City-based delivery windows are offered in Karachi, Lahore, Islamabad and Rawalpindi. Pickup from partner hubs is available in select areas.' },
    { q: 'Do I need an account?', a: 'Create an account to checkout, save your address, and track orders.' }
  ];
  return (
    <div className="container section py-50">
      <div className="section-header">
        <div className="section-title">Frequently Asked Questions</div>
        <div className="section-lead">Answers to common questions.</div>
      </div>
      <div className="grid">
        {faqs.map((f, i) => (
          <div key={i} className="card"><div className="card-body"><h3>{f.q}</h3><p className="muted">{f.a}</p></div></div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
