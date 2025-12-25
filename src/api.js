const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export async function apiGet(path) {
  const auth = localStorage.getItem('auth');
  const token = auth ? JSON.parse(auth).token : null;
  const r = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(text || `Request failed: ${r.status}`);
  }
  return r.json();
}

export async function apiPost(path, body) {
  const auth = localStorage.getItem('auth');
  const token = auth ? JSON.parse(auth).token : null;
  const r = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: token ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } : { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(text || `Request failed: ${r.status}`);
  }
  return r.json();
}
