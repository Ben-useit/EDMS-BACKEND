const { StatusCodes } = require('http-status-codes');
const AppError = require('./app-error');

class PrismaError extends AppError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = PrismaError;
