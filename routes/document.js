const express = require('express');
const router = express.Router();
const { getDocumentList } = require('../controller/documents');
const queryMiddleware = require('../middleware/query-middleware');
const authMiddleware = require('../middleware/auth-middleware');
router.route('/').get(authMiddleware, queryMiddleware, getDocumentList);

module.exports = router;
