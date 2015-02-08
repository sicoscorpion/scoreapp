
$(function() {
	$("#start").click(function(){
		console.log("CLICKED START");
	});
});
function loadScores() {
	$.get("/display/scores", function(data){
	    var scoreHash = [];
	    for (var i = 0; i < data.ids.length; i++) {
	    	var row = {};
	    	row.id = data.ids[i];
	    	row.name = data.names[i];
	    	row.roundOne = Math.round(parseInt(data.scores1[i]));
	    	row.roundTwo = Math.round(parseInt(data.scores2[i]));
	    	row.rank = data.rank[i];
	    	scoreHash.push(row)
	    	
	    };
	   	var head = "<div class=\"row\"> <table><thead><tr>" +
	   	"<th width=\"200\">Team Number</th><th>Team Name</th>" +  
	   	"<th>Round One</th><th>Round Two</th></tr><tbody>"
	   	for (var i = 0; i < scoreHash.length; i++) {
	   		head += "<tr> <td>" + scoreHash[i].id + "</td>"
	    	head += "<td>" + scoreHash[i].name + "</td>"
	    	head += "<td>" + scoreHash[i].roundOne + "</td>"
	    	head += "<td>" + scoreHash[i].roundTwo + "</td>"
	    	head += "<td>" + scoreHash[i].rank + "</td></tr>"
	   	};
	    console.log(scoreHash);
		$(".data").html(head);
	});
}
$(document).ready(function(){
	var socket = io.connect(window.location.hostname);

	socket.on('time', function (data) {  
	    $('#countdown').html(data.time);
	});
	socket.on('newTitle', function (data) {  
	    $('#timerTitle').html(data.title);
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

	loadScores();
})
