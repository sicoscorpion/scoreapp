

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function addScoreToPageHRC(data) {
	var dt = "<div class=\"data score\"></div>"
	var table =
		   	"<div class=\"row\"> <table class=\" center\"><thead><tr>" +
		   	"<th width=\"200\">Team Number</th><th>Team Name</th>" +
		   	"<th>Round One</th><th>Round Two</th><th>Rank</th></tr></thead><tbody>"
   	for (var i = 0; i < data.length-1; i++) {
   		if (data[i].id) {
	   		table += "<tr> <td>" + data[i].id + "</td>"
	    	table += "<td>" + data[i].name + "</td>"
	    	table += "<td>" + data[i].roundOne + "</td>"
	    	table += "<td>" + data[i].roundTwo + "</td>"
	    	table += "<td>" + data[i].rank + "</td></tr>"
	    }
   	};
   	table + "</tbody></table></div>"

	$(".scores").html(dt);
	$(".data").html(table);
}

function addScoreToPageFLL(data) {
	var dt = "<div class=\"dataFLL score\"></div>"
	var table =
		   	"<div class=\"row\"> <table class=\" center\"><thead><tr>" +
		   	"<th width=\"200\">Team Number</th><th>Team Name</th>" +
		   	"<th>Round One</th><th>Round Two</th><th>Round Three<th>Highest Score</th></th><th>Rank</th></tr></thead><tbody>"
   	for (var i = 0; i < data.length-1; i++) {
   		if (data[i].id) {
	   		table += "<tr> <td>" + data[i].id + "</td>"
	    	table += "<td>" + data[i].name + "</td>"
	    	table += "<td>" + data[i].roundOne + "</td>"
	    	table += "<td>" + data[i].roundTwo + "</td>"
	    	table += "<td>" + data[i].roundThree + "</td>"
	    	table += "<td>" + data[i].highest + "</td>"
	    	table += "<td>" + data[i].rank + "</td></tr>"
	    }
   	};
   	table + "</tbody></table></div>"
	$(".scoresFLL").html(dt);
	$(".dataFLL").html(table);
}

function loadScoresHRC(num) {

	$.ajax('/display/scoresHRC/'+num, {
		type: 'get',
		success: function(res) {
			var scoreHash = [];
			if (num == 10) {
				l = res.ids.length+1
				m = 1
			}
			else {
				l = res.ids.length+1
				m = 0
			}
		    for (var i = m; i < l; i++) {
		    	var row = {};
		    	row.id = parseInt(res.ids[i]);
		    	row.name = res.names[i];
		    	row.roundOne = Math.round(parseInt(res.scores1[i])) || 0;
		    	row.roundTwo = Math.round(parseInt(res.scores2[i])) || 0;
		    	row.rank = res.rank[i];
		    	scoreHash.push(row)

		    }
		    console.log(scoreHash)
		    // scoreHash.sort(dynamicSort("rank"));
		    addScoreToPageHRC(scoreHash);

		}
	})

}
function loadScoresFLL(num) {

	$.ajax('/display/scoresFLL/'+num, {
		type: 'get',
		success: function(res) {
			var scoreHash = [];
			if (num == 10) {
				l = res.ids.length+1
				m = 1
			}
			else {
				l = res.ids.length+1
				m = 0
			}
		    for (var i = m; i < l; i++) {
		    	var row = {};
		    	row.id = parseInt(res.ids[i]);
		    	row.name = res.names[i];
		    	row.roundOne = Math.round(parseInt(res.scores1[i])) || 0;
		    	row.roundTwo = Math.round(parseInt(res.scores2[i])) || 0;
		    	row.roundThree = Math.round(parseInt(res.scores3[i])) || 0;
		    	row.highest = Math.round(parseInt(res.scoresHighest[i])) || 0;
		    	row.rank = res.rank[i];
		    	scoreHash.push(row)

		    }
		    console.log(scoreHash)
		    // scoreHash.sort(dynamicSort("rank"));
		    addScoreToPageFLL(scoreHash);

		}
	})

}
// jQuery.fn.exists = function(){return this.length>0;}

$(document).ready(function(){
	// function run(interval, frames) {
	//     var int = 1;

	//     function func() {
	//         document.body.id = "b"+int;
	//         int++;
	//         if(int === frames) { int = 1; }
	//     }

	//     var swap = window.setInterval(func, interval);
	// }

	// run(5000, 10); //milliseconds, frames
	var socket = io.connect(window.location.hostname);

	var interval1 = null;
	var interval2 = null;
	var interval3 = null;
	socket.on('time', function (data) {
		var fill = data.time;
		console.log("IN TIME", data.str)
		if (fill === "00:00:00" && data.str === "stop") {
			var audio = new Audio('../foghorn.wav');
		    audio.play();
		}

		if (fill === "01:00:00") {
			console.log($("#timerLength").val())
			var t = $("#timerLength").val();
			fill = data.str === "connection" ?  "00:00:00" : data.str;
		}

	    $('#countdown').html(fill);
	});
	socket.on('watch:started', function (data) {
	    var audio = new Audio('../charge.wav');
	    audio.play();
	});

	socket.on('newTitle', function (data) {
	    $('#timerTitle').html(data.title);
	});
	socket.on('newDisplayTitle', function (data) {
	    $('#displayTitle').html(data.title);
	});
	socket.on('newScoresHRC', function (data) {
    loadScoresHRC(10);
    interval1 = setInterval(function() {
			loadScoresHRC(10);
		}, 10000);
		interval2 = setInterval(function() {
			loadScoresHRC(20);
		}, 20000);
	});
	socket.on('newScoresFLL', function (data) {
		loadScoresFLL(11);

		interval1 = setInterval(function() {
			loadScoresFLL(11);
		}, 10000);
		interval2 = setInterval(function() {
			loadScoresFLL(21);
		}, 20000);
		interval3 = setInterval(function() {
			loadScoresFLL(31);
		}, 30000);
	});

	socket.on('newSumoBrackets', function (data) {
	    $(".sumoBrackets").html("<iframe src=\"http:\/\/challonge.com\/rpcSumo\/module?multiplier=1.4&match_width_multiplier=2.0&theme=2987\" multiplier=\"1.4\"" +
		"width=\"100%\" height=\"600\" frameborder=\"0\" scrolling=\"no\" allowtransparency=\"true\"><\/iframe>")
	// $(".hide #bottom_bar").hide();
	});

	socket.on('flushScores', function (data) {
		clearInterval(interval1);
		clearInterval(interval2);
		clearInterval(interval3);
	    $(".data").remove();
	    $(".dataFLL").remove();

	});
	socket.on('flushSumoBrackets', function (data) {
	     $(".sumoBrackets iframe").remove();
	});

	$('#setTimer').click(function() {
		var t = $("#timerLength").val();
		var h = Math.floor(t / 3600);;
	    var m = Math.floor(t % 3600 / 60);;
	    var s = Math.floor(t % 3600 % 60);;
	    var time = ((h > 0 ? h + ":" : "00:0") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
	    console.log(time)
	    socket.emit('setTimer', {set: t, str: time});

	});

	$('#setTitle').click(function() {
		var t = $("#timerTitleSet").val();
	    socket.emit('setTitle', {set: t});
	});

	$('#setDisplayTitle').click(function() {
		var t = $("#displayTitleSet").val();
	    socket.emit('setDisplayTitle', {set: t});
	});

	$('#start').click(function() {
	    socket.emit('click:start');
	    // var audio = new Audio('../charge.wav');
	    // audio.play();
	});

	$('#stop').click(function() {
	    socket.emit('click:stop');
	});

	$('#reset').click(function() {
	    socket.emit('click:reset');
	});

	// Scoreboard events
	$('#loadScoresHRC').click(function() {
	    socket.emit('loadScoresHRC');
	});

	$('#clearScoresHRC').click(function() {
	    socket.emit('clearScoresHRC');
	});

	$('#loadScoresFLL').click(function() {
	    socket.emit('loadScoresFLL');
	});

	$('#clearScoresFLL').click(function() {
	    socket.emit('clearScoresFLL');
	});

	$('#loadSumoBrackets').click(function() {
	    socket.emit('loadSumoBrackets');
	});

	$('#clearSumoBrackets').click(function() {
	    socket.emit('clearSumoBrackets');
	});
})
