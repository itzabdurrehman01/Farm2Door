export function track(event, data = {}) {
  try {
    const payload = { event, data, ts: Date.now() };
    if (process.env.NODE_ENV === 'development') {
      console.log('analytics', payload);
    }
  } catch (_) {}
}

