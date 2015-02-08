var express = require('express');
var router = express.Router();
var pkg = require('../package.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
  	title: 'Acadia Robotics Score App', 
  	version: pkg.version
  });
});

module.exports = router;
