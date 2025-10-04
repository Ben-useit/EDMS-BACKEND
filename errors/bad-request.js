const { StatusCodes } = require('http-status-codes');
const AppError = require('./app-error');

class BadRequestError extends AppError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
