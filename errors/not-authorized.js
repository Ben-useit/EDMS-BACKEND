const { StatusCodes } = require('http-status-codes');
const AppError = require('./app-error');
class NotAuthorizedError extends AppError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = NotAuthorizedError;
