const { StatusCodes } = require('http-status-codes');

const notFoundMiddleware = (req, res) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .json({ msg: 'Content does not exist.' });
};

module.exports = notFoundMiddleware;
