const PrismaError = require('../errors/prisma-error');

const errorHandler = (err, req, res, next) => {
  if (err instanceof PrismaError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  console.log(err.message);
  return res.status(500).json({ msg: 'General error' });
};

module.exports = errorHandler;
