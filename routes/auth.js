const express = require('express');
const { login, logout } = require('../controller/auth');
const authMiddleware = require('../middleware/auth-middleware');
const router = express.Router();

router.route('/login').post(login);
router.route('/logout').get(authMiddleware, logout);

module.exports = router;
