const AppError = require('../errors/app-error');
const PrismaError = require('../errors/prisma-error');

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  if (err instanceof PrismaError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res.status(500).json({ msg: 'General error' });
};

module.exports = errorHandler;
