const { StatusCodes } = require('http-status-codes');
const NotAuthorizedError = require('../errors/not-authorized');
const prisma = require('../prisma/db');
const { isTokenValid, attachCookies } = require('../utils/jwt');

const authMiddleware = async (req, res, next) => {
  const { refreshToken, accessToken } = req.cookies;
  try {
    if (accessToken) {
      const payload = isTokenValid({ token: accessToken });

      req.user = payload;
      return next();
    }
    const payload = isTokenValid({ token: refreshToken });
    const existingToken = await prisma.node_token.findUnique({
      where: {
        userId: payload.user.id,
        refreshToken: payload.refreshToken,
      },
    });
    if (!existingToken || !existingToken?.isValid) {
      throw new NotAuthorizedError('Authentication Invalid');
    }
    attachCookies({ res, user: payload.user, refreshToken });
    req.user = payload.user;
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
  }
};

module.exports = authMiddleware;
