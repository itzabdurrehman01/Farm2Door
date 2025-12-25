import React, { useState } from 'react';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  function onSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('All fields are required');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Enter a valid email');
      return;
    }
    setSent(true);
  }
  return (
    <div className="container section py-50">
      <div className="section-header">
        <div className="section-title">Contact</div>
        <div className="section-lead">We’d love to hear from you.</div>
      </div>
      <div className="two-col">
        <div className="card">
          <form onSubmit={onSubmit} className="form">
            <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <textarea className="input" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} required />
            <button className="btn" type="submit">Send</button>
            {sent && <div className="muted">Thanks! We will get back to you.</div>}
            {error && <div className="text-error">{error}</div>}
          </form>
        </div>
        <div className="card">
          <div className="card-body">
            <h3>Get in touch</h3>
            <p className="muted">Email: support@farm2door.local</p>
            <p className="muted">Phone: +1 (555) 123-4567</p>
            <p className="muted">Address: 123 Market St, Your Town</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
