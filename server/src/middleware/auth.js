const jwt = require('jsonwebtoken');

const requireAuth = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.signedCookies?.access_token;
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'change-me');
      if (roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
};

module.exports = { requireAuth };
