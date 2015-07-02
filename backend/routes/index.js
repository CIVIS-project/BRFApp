'use strict';

var express = require('express');
var router = express.Router();

//router.use('/consumption', require('./consumption'));
router.use('/user', require('./user'));
router.use('/action', require('./action'));
router.use('/challenge', require('./challenge'));
router.use('/feedback', require('./feedback'));
router.use('/auth', require('./auth'));
router.use('/household', require('./household'));
router.use('/community', require('./community'));

module.exports = router;
