function Privacy() {
  return (
    <div className="container section py-50">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h2 className="section-title m-0">Privacy Policy</h2>
          <p className="text-muted">How we collect, use, and protect your data.</p>
        </div>
      </div>
      <div className="card p-4 d-grid gap-md">
        <div>
          <h3 className="mb-2">Information We Collect</h3>
          <p className="text-muted">Account details, orders, and interactions to provide services.</p>
        </div>
        <div>
          <h3 className="mb-2">Use of Information</h3>
          <p className="text-muted">Fulfill orders, support, and improve the experience.</p>
        </div>
        <div>
          <h3 className="mb-2">Sharing</h3>
          <p className="text-muted">We do not sell personal data. Limited sharing for payment and delivery.</p>
        </div>
        <div>
          <h3 className="mb-2">Your Rights</h3>
          <p className="text-muted">Access, update, or delete your data by contacting support.</p>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
