
$(function() {
	$("#start").click(function(){
		console.log("CLICKED START");
	});
});
$(document).ready(function(){
	var socket = io.connect(window.location.hostname);

	socket.on('time', function (data) {  
	    $('#countdown').html(data.time);
	});
	
	$('#set').click(function() {
		var t = $("#timerLength").val();
		console.log(parseInt(t))
	    socket.emit('setTimer', {set: t});
	});

	$('#start').click(function() {
	    socket.emit('click:start');
	});

	$('#stop').click(function() {
	    socket.emit('click:stop');
	});

	$('#reset').click(function() {
	    socket.emit('click:reset');
	});

	$.get("/display/scores", function(data){
		var head = "<div class=\"row\"> <table><thead><tr><th width=\"200\">Team Number</th><th>Team Name</th> <th>Round One</th></tr><tbody>"
    for (var i = 0; i < data.ids.length; i++) {
    	head += "<tr> <td>" + data.ids[i] + "</td>"
    	head += "<td>" + data.names[i] + "</td>"
    	head += "<td>" + data.scores1[i] + "</td></tr>"
    };

		$(".data").html(head);
	});
})
