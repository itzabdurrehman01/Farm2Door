import React from 'react';

function FAQ() {
  const faqs = [
    { q: 'Where do products come from?', a: 'From vetted local producers and farms.' },
    { q: 'How does delivery work?', a: 'Choose delivery or pickup at checkout.' },
    { q: 'Do I need an account?', a: 'Create an account to checkout and track orders.' }
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
