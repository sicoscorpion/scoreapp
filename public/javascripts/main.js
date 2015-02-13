

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
	var dt = "<div class=\"data\"></div>"
	var head = "<div class=\"row\"><h1 id=\"scoreboard\">SCOREBOARD</h1></div>" + 
		   	"<div class=\"row\"> <table><thead><tr>" +
		   	"<th width=\"200\">Team Number</th><th>Team Name</th>" +  
		   	"<th>Round One</th><th>Round Two</th><th>Rank</th></tr><tbody>"
   	for (var i = 0; i < data.length; i++) {
   		head += "<tr> <td>" + (data[i].id).replace(/"/g, '') + "</td>"
    	head += "<td>" + (data[i].name).replace(/"/g, '') + "</td>"
    	head += "<td>" + data[i].roundOne + "</td>"
    	head += "<td>" + data[i].roundTwo + "</td>"
    	head += "<td>" + data[i].rank + "</td></tr>"
   	};
	$(".scores").html(dt);
	$(".data").html(head);
}

function addScoreToPageFLL(data) {
	var dt = "<div class=\"dataFLL\"></div>"
	var head = "<div class=\"row\"><h1 id=\"scoreboard\">SCOREBOARD</h1></div>" + 
		   	"<div class=\"row\"> <table><thead><tr>" +
		   	"<th width=\"200\">Team Number</th><th>Team Name</th>" +  
		   	"<th>Round One</th><th>Round Two</th><th>Round Three<th>Highest Score</th></th><th>Rank</th></tr><tbody>"
   	for (var i = 0; i < data.length-1; i++) {
   		head += "<tr> <td>" + data[i].id + "</td>"
    	head += "<td>" + data[i].name + "</td>"
    	head += "<td>" + data[i].roundOne + "</td>"
    	head += "<td>" + data[i].roundTwo + "</td>"
    	head += "<td>" + data[i].roundThree + "</td>"
    	head += "<td>" + data[i].highest + "</td>"
    	head += "<td>" + data[i].rank + "</td></tr>"
   	};
	$(".scoresFLL").html(dt);
	$(".dataFLL").html(head);
}

function loadScoresHRC() {
	
	$.ajax('/display/scoresHRC', {
		type: 'get',
		success: function(res) {
			console.log(res.data)
			var scoreHash = [];
		    for (var i = 0; i < res.ids.length; i++) {
		    	var row = {};
		    	row.id = res.ids[i];
		    	row.name = res.names[i];
		    	row.roundOne = Math.round(parseInt(res.scores1[i]));
		    	row.roundTwo = Math.round(parseInt(res.scores2[i]));
		    	row.rank = res.rank[i];
		    	scoreHash.push(row)
		    	
		    }
		    scoreHash.sort(dynamicSort("rank"));
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
	
	socket.on('newTitle', function (data) {  
	    $('#timerTitle').html(data.title);
	});
	socket.on('newDisplayTitle', function (data) {  
	    $('#displayTitle').html(data.title);
	});
	socket.on('newScoresHRC', function (data) {  
	    loadScoresHRC();
	});
	socket.on('newScoresFLL', function (data) {
		interval1 = setInterval(function() {
			loadScoresFLL(10);
		}, 8000);
		interval2 = setInterval(function() {
			loadScoresFLL(20);
		}, 13000);
		interval3 = setInterval(function() {
			loadScoresFLL(30);
		}, 21000);
	});

	socket.on('newSumoBrackets', function (data) {  
	    $(".sumoBrackets").html("<iframe src=\"http:\/\/challonge.com\/rpcSumo\/module?theme=2987\"" + 
		"width=\"100%\" height=\"500\" frameborder=\"0\" scrolling=\"no\" allowtransparency=\"true\"><\/iframe>")
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
	    $('#countdown').html(JSON.stringify(time));
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
	    var audio = new Audio('../charge.wav');
	    audio.play();
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
