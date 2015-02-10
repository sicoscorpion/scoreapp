

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

function addScoreToPage(data) {
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
function loadScores() {
	
	$.ajax('/display/scores', {
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
		    addScoreToPage(scoreHash);
		}
	}) 
	
}
$(document).ready(function(){
	var socket = io.connect(window.location.hostname);

	socket.on('time', function (data) { 
		var fill = data.time;
		if (fill === "00:00:00") {
			var audio = new Audio('../3728.mp3');
		    audio.play();
		}
		if (fill === "01:00:00") 
			var fill = "00:00:00"

	    $('#countdown').html(fill);
	});
	socket.on('newTitle', function (data) {  
	    $('#timerTitle').html(data.title);
	});
	socket.on('newDisplayTitle', function (data) {  
	    $('#displayTitle').html(data.title);
	});
	socket.on('newScores', function (data) {  
	    loadScores();
	});
	
	socket.on('flushScores', function (data) {  
	    $(".data").remove();
	});

	$('#setTimer').click(function() {
		var t = $("#timerLength").val();
	    socket.emit('setTimer', {set: t});
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
	    var audio = new Audio('../3728.mp3');
	    audio.play();
	});

	$('#stop').click(function() {
	    socket.emit('click:stop');
	});

	$('#reset').click(function() {
	    socket.emit('click:reset');
	});

	// Scoreboard events
	$('#loadScores').click(function() {
	    socket.emit('loadScores');
	});

	$('#clearScores').click(function() {
	    socket.emit('clearScores');
	});
})
