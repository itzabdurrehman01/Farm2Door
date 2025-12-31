function Terms() {
  return (
    <div className="container section py-50">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h2 className="section-title m-0">Terms & Conditions</h2>
          <p className="text-muted">The rules for using our website and services.</p>
        </div>
      </div>
      <div className="card p-4 d-grid gap-md">
        <div>
          <h3 className="mb-2">Orders</h3>
          <p className="text-muted">Place accurate orders. Pricing and availability may change.</p>
        </div>
        <div>
          <h3 className="mb-2">Payments</h3>
          <p className="text-muted">We support multiple methods. Failed payments may be cancelled.</p>
        </div>
        <div>
          <h3 className="mb-2">Deliveries</h3>
          <p className="text-muted">ETAs are estimates. Contact support for issues.</p>
        </div>
        <div>
          <h3 className="mb-2">Returns</h3>
          <p className="text-muted">Eligible items may be returned per our policy.</p>
        </div>
      </div>
    </div>
  );
}

export default Terms;
