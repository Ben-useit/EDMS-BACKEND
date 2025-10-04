const BadRequestError = require('../errors/bad-request');
const NotAuthorizedError = require('../errors/not-authorized');
const prisma = require('../prisma/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { getTokenUser, attachCookies } = require('../utils/jwt');
const { createToken } = require('../prisma/query');
const { StatusCodes } = require('http-status-codes');

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new BadRequestError('Please provide username and password');
  }
  const user = await prisma.node_user.findUnique({
    where: {
      username: username,
    },
  });
  if (!user) {
    throw new NotAuthorizedError('Username or password not correct.');
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new NotAuthorizedError('Email or password not correct.');
  }
  const tokenUser = getTokenUser(user);
  let refreshToken = '';
  let token = await prisma.node_token.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (token) {
    const { isValid } = token;
    if (!isValid) {
      throw new NotAuthorizedError('Invalid Credentials.');
    }
    refreshToken = token.refreshToken;
    attachCookies({ res, user: tokenUser, refreshToken });
    return res.status(StatusCodes.OK).json({ user: tokenUser });
  }
  // No token in database, create one
  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const tokenData = { refreshToken, ip, userAgent, userId: user.id };

  await createToken({ data: tokenData });

  attachCookies({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  try {
    await prisma.node_token.delete({ where: { userId: req.user.id } });
  } catch (error) {}

  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'User logged out.' });
};

module.exports = { login, logout };
