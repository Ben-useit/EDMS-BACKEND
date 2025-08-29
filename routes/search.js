const express = require('express');
const router = express.Router();
const { search } = require('../controller/search');

router.route('/').get(search);

module.exports = router;
