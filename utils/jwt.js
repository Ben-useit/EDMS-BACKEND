const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/not-authorized');

/**
 * Creates a user object with id, username, email
 *
 **/
const getTokenUser = (user) => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
};
const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = ({ token }) => {
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user;
  } catch (error) {
    throw new NotAuthorizedError('Not allowed to access this recource.');
  }
};

const attachCookies = ({ res, user, refreshToken }) => {
  const accessJWT = createJWT({ payload: user });
  const refreshJWT = createJWT({ payload: { user, refreshToken } });
  const oneHour = 1000 * 60 * 60;
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('accessToken', accessJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneHour),
    secure: process.env.NODE_ENV === 'production',
    signed: false,
  });
  res.cookie('refreshToken', refreshJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: false,
  });
};

const deleteCookie = ({ res }) => {
  res.cookie(
    'token',
    { id: '0' },
    {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: false,
    }
  );
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookies,
  deleteCookie,
  getTokenUser,
};
