var express = require('express');
var router = express.Router();
var util = require("util"); 
var fs = require("fs");

router.get('/', function(req, res, next) {
  res.render('manager', { title: 'Score Upload' });
});


module.exports = router;