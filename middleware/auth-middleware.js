const authMiddleware = (req, res, next) => {
  //fake auth
  req.user = { id: 10, name: 'Peter' };
  return next();
};

module.exports = authMiddleware;
