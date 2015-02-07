var express = require('express');
var router = express.Router();
var util = require("util"); 
var fs = require("fs");
var XLSX = require('xlsx');


router.get('/', function(req, res, next) {
  res.render('display', 
  	{ 
  	  title: 'Score Display',
  	  data: 'DATA'
  	}
  );
});

router.get('/scores', function(req, res, next) {
	var workbook = XLSX.readFile('./public/uploads/amd_scoresheet_wolfvilleacadia.xlsx');
  var sheet_name_list = workbook.SheetNames;
  var names = new Array();
  var ids = new Array();
  var scores1 = new Array();
	sheet_name_list.forEach(function(y) {
	  var worksheet = workbook.Sheets[y];
	  var i = 0;
	  for (z in worksheet) {
	    if(z[0] === '!') continue;
	    if(z[2]) {
	    	c = z[1]+z[2]
	    	num = parseInt(c)
	    }
	    else 
	    	num = z[1]

	    console.log(num);
	    if(num >= 5) {
	    	console.log(num, z[0]);
	    	if (z[0] === 'A')
		    	ids[i] = JSON.stringify(worksheet[z].v);
		    if (z[0] === 'B')
		    	names[i] = JSON.stringify(worksheet[z].v);
		    if (z[0] === 'F')
		    	scores1[i] = JSON.stringify(worksheet[z].v);
		    else
		    	continue;

		    i++;
		  }
		  // names[i] = JSON.stringify(worksheet[z].v);
		   // i++;
	    
	  }

	});
	process.nextTick(function() {
		res.send({
			names: names,
			ids: ids,
			scores1: scores1
		})
	});
  
});

module.exports = router;