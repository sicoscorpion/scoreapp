
$(function() {
	$("#start").click(function(){
		console.log("CLICKED START");
	});
});
function addScoreToPage(data) {
	var dt = "<div class=\"data\"></div>"
	var head = "<div class=\"row\"><h1 id=\"scoreboard\">SCOREBOARD</h1></div>" + 
		   	"<div class=\"row\"> <table><thead><tr>" +
		   	"<th width=\"200\">Team Number</th><th>Team Name</th>" +  
		   	"<th>Round One</th><th>Round Two</th><th>Rank</th></tr><tbody>"
   	for (var i = 0; i < data.length; i++) {
   		head += "<tr> <td>" + data[i].id + "</td>"
    	head += "<td>" + data[i].name + "</td>"
    	head += "<td>" + data[i].roundOne + "</td>"
    	head += "<td>" + data[i].roundTwo + "</td>"
    	head += "<td>" + data[i].rank + "</td></tr>"
   	};
	console.log(head)
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
	socket.on('newScores', function (data) {  
	    loadScores();
	});
	
	$('#setTimer').click(function() {
		var t = $("#timerLength").val();
		console.log(parseInt(t))
	    socket.emit('setTimer', {set: t});
	});

	$('#setTitle').click(function() {
		var t = $("#timerTitleSet").val();
		console.log(t)
	    socket.emit('setTitle', {set: t});
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

	$('#loadScores').click(function() {
	    socket.emit('loadScores');
	});

	// loadScores();
})
