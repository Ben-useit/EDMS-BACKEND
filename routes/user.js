const express = require('express');
const { showCurrentUser } = require('../controller/user');
const authMiddleware = require('../middleware/auth-middleware');
const router = express.Router();

router.route('/showMe').get(authMiddleware, showCurrentUser);

module.exports = router;
