const express = require('express');
const router = express.Router();
const { getDocumentList, fileUpload } = require('../controller/documents');
const queryMiddleware = require('../middleware/query-middleware');
const authMiddleware = require('../middleware/auth-middleware');
router.route('/').get(authMiddleware, queryMiddleware, getDocumentList);
router.route('/upload').post(authMiddleware, fileUpload);

module.exports = router;
