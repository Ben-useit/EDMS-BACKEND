const express = require('express');
const router = express.Router();
const { getDocuments } = require('../controller/documents');

router.route('/').get(getDocuments);

module.exports = router;
