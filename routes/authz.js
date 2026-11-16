// Authorization helpers: identity always comes from the verified JWT (req.user),
// never from request params or body.

const currentUserId = req => (req.user ? Number(req.user.id) : NaN);

const isSelf = (req, id) => {
  const me = currentUserId(req);
  return Number.isInteger(me) && me > 0 && me === Number(id);
};

// Route guard: the :param in the path must be the authenticated user's id.
const requireSelfParam = param => (req, res, next) => {
  if (!isSelf(req, req.params[param])) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

// Admins are listed by user id in ADMIN_USER_IDS (comma separated).
// Unset or empty means nobody is an admin (fail closed).
const adminIds = () => (process.env.ADMIN_USER_IDS || '')
  .split(',')
  .map(s => Number(s.trim()))
  .filter(n => Number.isInteger(n) && n > 0);

const isAdmin = req => adminIds().includes(currentUserId(req));

module.exports = { currentUserId, isSelf, requireSelfParam, isAdmin };
