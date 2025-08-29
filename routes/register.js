const express = require('express');
const router = express.Router();
const { getRegisterList } = require('../controller/register');
const queryMiddleware = require('../middleware/query-middleware');
router.route('/').get(queryMiddleware, getRegisterList);

module.exports = router;
