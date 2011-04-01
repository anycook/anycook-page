var numberdisc;

function loadHome(){
	numberdisc=5;
	loadNewDiscussions();
	$("#disc_refresh").click(loadNewDiscussions);
	$("#disc_more").click(function(){
		numberdisc+=5;
		loadNewDiscussions();
	});
	
	loadSystemStatus();
}

function loadSystemStatus(){
	$.ajax({
		url:"/anycook/GetSystemStatus",
		dataType:"json",
		success:function(json){
			$("#activeconn").text(json.activeconnections);
			$("#maxconn").text(json.maxactiveconnections);
			if($.address.pathNames().length == 0 || $.address.pathNames()[0] == "home")
				window.setTimeout(loadSystemStatus, 5000);
		}
	});
}

function loadNewDiscussions(){
	$.ajax({
		url:"/anycook/GetNewDiscussions",
		dataType:"json",
		data:"number="+numberdisc,
		success: showNewDiscussions
	});
}

function showNewDiscussions(json){
	$("#disc_entries").empty();
	for(i in json){
		var datetime = getDateString(json[i].eingefuegt);
		$("#disc_entries").append("<div class='newDiscEntry'>" +
				"<div class='discname'>"+json[i].nickname+"</div>" +
				"<div class='discdate'>"+datetime+"</div>" +				
				"<div class='discgername'>"+json[i].gerichte_name+"</div>" +
				"<div class='disctext'>"+json[i].text+"</div>" +
			"</div>");
	}
}