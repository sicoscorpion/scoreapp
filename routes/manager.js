var express = require('express');
var router = express.Router();
var util = require("util"); 
var fs = require("fs");

router.get('/', function(req, res, next) {
  res.render('manager', { title: 'Score Upload' });
});

// router.post('/', function(req, res, next){ 
// 	console.log(req.files.myFile)
// 	if (req.files.myFile) { 
// 		console.log(util.inspect(req.files));
// 		if (req.files.myFile.size === 0) {
// 		  return next(new Error("Hey, first would you select a file?"));
// 		}
// 		fs.exists(req.files.myFile.path, function(exists) { 
// 			if(exists) { 
// 				req.flash('success_messages', 
// 				'<div data-alert class=\"alert-box success\">Got your file!<a href="#" class="close">&times;</a></div>');
// 				res.redirect('/manager')
// 			} else { 
// 				res.end("Well, there is no magic for those who don’t believe in it!"); 
// 			} 
// 		}); 
// 	} else {
// 		// res.redirect({message: "Hey, first would you select a file?"}, '/');
// 		req.flash('error_messages', 
// 			'<div data-alert class=\"alert-box alert\">Hey, first would you select a file?<a href="#" class="close">&times;</a></div>');
// 		res.redirect('/manager')
// 		// return next()
// 		// return next(new Error("Hey, first would you select a file?"));
// 	}
// });

module.exports = router;