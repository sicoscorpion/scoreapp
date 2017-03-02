var express = require('express');
var router = express.Router();
var util = require("util");
var fs = require("fs");
var sys = require('sys');
var XLSX = require('xlsx');

var configurationFile = fs.readFileSync('./config.json', 'utf8');

var config = JSON.parse(configurationFile);


router.get('/', function(req, res, next) {
  res.render('display',
  	{
  	  title: 'Score Display'
  	}
  );
});


// router.get('/scoresHRC', function(req, res, next) {
// 	var robofestFileName = './public/uploads/' + config.score_files.ROBOFEST_SCORE_FILE;
//   var workbook = XLSX.readFile(robofestFileName);
//   var sheet_name_list = workbook.SheetNames;
//   var names = new Array();
//   var ids = new Array();
//   var scores1 = new Array();
//   var scores2 = new Array();
//   var rank = new Array();
// 	sheet_name_list.forEach(function(y) {
// 	  var worksheet = workbook.Sheets[y];
// 	  var i = 0;
// 	  for (z in worksheet) {
// 	    if(z[0] === '!') continue;
// 	    if(z[2]) {
// 	    	c = z[1]+z[2]
// 	    	num = parseInt(c)
// 	    }
// 	    else
// 	    	num = z[1]

// 	    if(num >= 5) {
// 	    	console.log(num, worksheet[z].v);
// 	    	if (z[0] === 'A')
// 		    	ids[i] = JSON.stringify(worksheet[z].v);
// 		    if (z[0] === 'B')
// 		    	names[i] = JSON.stringify(worksheet[z].v);
// 		    if (z[0] === 'F')
// 		    	scores1[i] = JSON.stringify(worksheet[z].v);
// 		    if (z[0] === 'J')
// 		    	scores2[i] = JSON.stringify(worksheet[z].v);
// 		    if (z[0] === 'L')
// 		    	rank[i] = JSON.stringify(worksheet[z].v);
// 		    else
// 		    	continue;

// 		    i++;
// 	  	}
//   	}
// 	});
// 	process.nextTick(function() {
// 		res.send({
// 			names: names,
// 			ids: ids,
// 			scores1: scores1,
// 			scores2: scores2,
// 			rank: rank
// 		})
// 	});

// });

router.get('/scoresHRC/:max', function(req, res, next) {
	console.log("REACHED FLL GETR");
	var names = new Array();
  var ids = new Array();
  var scores1 = new Array();
  var scores2 = new Array();
  var rank = new Array();
  var robofesFileName =	'./public/uploads/' + config.score_files.ROBOFEST_SCORE_FILE;
	var data = fs.readFileSync(robofesFileName,'utf-8');

	// Lines
	var l = 0;
	var m = 0
	data = data.split("\n");
	// if (data.length > 10) {
	// 	if (req.params.max == 30) {
	// 		l = data.length
	// 		m = l - 12
	// 	} else {
	// 		l = req.params.max
	// 		m = l - 10
	// 	}
	// 	console.log(l, m)
	// }
	// else {
	// 	l = data.length
	// 	m = 0
	// }
	for(var i = 0, x=0; i < data.length; i++, x++){
		if(data[i] === "" || data[i] === '\r') {
			// x--;
			continue;
		}

		// fields
		var fields = String(data[i]).split(',');
		var fieldNum = 0;


		fields.forEach(function (field){
			field = field.replace(/"/g, "");
			// console.log(field + " xx ");
			switch (fieldNum)
			{
				case 0:
					rank[x] = field
					break;

				case 1:
					ids[x] = field
					break;
				case 2:
					names[x] = field
					break;
				case 3:
					scores1[x] = field
				case 4:
					scores2[x] = field
				default:
					break;
			}
			fieldNum++;
		});
	}
 	console.log(rank)
	 process.nextTick(function() {
			res.send({
				names: names,
				ids: ids,
				scores1: scores1,
				scores2: scores2,
				rank: rank
			})
		});

});


router.get('/scoresFLL/:max', function(req, res, next) {
	console.log("REACHED FLL GETR");
	var names = new Array();
  var ids = new Array();
  var scoresHighest = new Array();
  var scores1 = new Array();
  var scores2 = new Array();
  var scores3 = new Array();
  var rank = new Array();
  var fllFileName =	'./public/uploads/' + config.score_files.FLL_SCORE_FILE;
	var data = fs.readFileSync(fllFileName,'utf-8');

	// Lines
	var l = 0;
	var m = 0
	data = data.split("\n");
	// if (data.length > 10) {
	// 	if (req.params.max == 30) {
	// 		l = data.length
	// 		m = l - 12
	// 	} else {
	// 		l = req.params.max
	// 		m = l - 10
	// 	}
	// 	console.log(l, m)
	// }
	// else {
	// 	l = data.length
	// 	m = 0
	// }
	for(var i = 0, x=0; i < data.length; i++, x++){
		if(data[i] === "" || data[i] === '\r') {
			// x--;
			continue;
		}

		// fields
		var fields = String(data[i]).split(',');
		var fieldNum = 0;


		fields.forEach(function (field){
			field = field.replace(/"/g, "");
			// console.log(field + " xx ");
			switch (fieldNum)
			{
				case 0:
					rank[x] = field
					break;

				case 1:
					ids[x] = field
					break;
				case 2:
					names[x] = field
					break;
				case 3:
					scoresHighest[x] = field
					break;
				case 4:
					scores1[x] = field
				case 5:
					scores2[x] = field
				case 6:
					scores3[x] = field
				default:
					break;
			}
			fieldNum++;
		});
	}
 	console.log(rank)
	 process.nextTick(function() {
			res.send({
				names: names,
				ids: ids,
				scores1: scores1,
				scores2: scores2,
				scores3: scores3,
				scoresHighest: scoresHighest,
				rank: rank
			})
		});

});


router.get('/scoresFLL', function(req, res, next) {
	console.log("REACHED FLL GETR");
	var names = new Array();
  var ids = new Array();
  var scoresHighest = new Array();
  var scores1 = new Array();
  var scores2 = new Array();
  var scores3 = new Array();
  var rank = new Array();
  var fllFileName =	'./public/uploads/' + config.score_files.FLL_SCORE_FILE;
	var data = fs.readFileSync(fllFileName,'utf-8');

	// Lines
	// var l = 30;
	// var m = 0
	data = data.split("\n");
 	console.log("DATA", data)
	for(var i = 0, x=0; i < data.length; i++, x++){
		if(data[i] === "" || data[i] === '\r') {
			// x--;
			continue;
		}

		// fields
		var fields = String(data[i]).split(',');
		var fieldNum = 0;


		fields.forEach(function (field){
			field = field.replace(/"/g, "");
			// console.log(field + " xx ");
			switch (fieldNum)
			{
				case 0:
					rank[x] = field
					break;

				case 1:
					ids[x] = field
					break;
				case 2:
					names[x] = field
					break;
				case 3:
					scoresHighest[x] = field
					break;
				case 4:
					scores1[x] = field
				case 5:
					scores2[x] = field
				case 6:
					scores3[x] = field
				default:
					break;
			}
			fieldNum++;
		});
	}
	output = []
	for (var i = 1; i < names.length; i++) {
		output.push({
			name: names[i],
			id: ids[i],
			round1: scores1[i],
			round2: scores2[i],
			round3: scores3[i],
			scoresHighest: scoresHighest[i],
			rank: rank[i]
		})
	}
  process.nextTick(function() {
  	res.render('fllScores',
  	{
  	  data: output
  	})
	});

});


router.get('/scoresRobofest', function(req, res, next) {
	console.log("REACHED FLL GETR");
	var names = new Array();
  var ids = new Array();
  var scores1 = new Array();
  var scores2 = new Array();
  var rank = new Array();
  var robofesFileName =	'./public/uploads/' + config.score_files.ROBOFEST_SCORE_FILE;
	var data = fs.readFileSync(robofesFileName,'utf-8');

	// Lines
	var l = 0;
	var m = 0
	data = data.split("\n");
	// if (data.length > 10) {
	// 	if (req.params.max == 30) {
	// 		l = data.length
	// 		m = l - 12
	// 	} else {
	// 		l = req.params.max
	// 		m = l - 10
	// 	}
	// 	console.log(l, m)
	// }
	// else {
	// 	l = data.length
	// 	m = 0
	// }
	for(var i = 0, x=0; i < data.length; i++, x++){
		if(data[i] === "" || data[i] === '\r') {
			// x--;
			continue;
		}

		// fields
		var fields = String(data[i]).split(',');
		var fieldNum = 0;


		fields.forEach(function (field){
			field = field.replace(/"/g, "");
			// console.log(field + " xx ");
			switch (fieldNum)
			{
				case 0:
					rank[x] = field
					break;

				case 1:
					ids[x] = field
					break;
				case 2:
					names[x] = field
					break;
				case 3:
					scores1[x] = field
				case 4:
					scores2[x] = field
				default:
					break;
			}
			fieldNum++;
		});
	}
	output = []
	for (var i = 1; i < names.length; i++) {
		output.push({
			name: names[i],
			id: ids[i],
			round1: scores1[i],
			round2: scores2[i],
			rank: rank[i]
		})
	}
  process.nextTick(function() {
  	res.render('hrcScores',
  	{
  	  data: output
  	})
	});
});

module.exports = router;
