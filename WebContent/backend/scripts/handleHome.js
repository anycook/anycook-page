var numberdisc;

function loadHome(){
	numberdisc=5;
	loadNewDiscussions();
	$("#disc_refresh").click(loadNewDiscussions);
	$("#disc_more").click(function(){
		numberdisc+=5;
		loadNewDiscussions();
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
		$("#disc_entries").append("<div class='newDiscEntry'>" +
				"<div class='discdate'>"+json[i].eingefuegt+"</div>" +
				"<div class='discname'>"+json[i].nickname+"</div>" +
				"<div class='discgername'>"+json[i].gerichte_name+"</div>" +
				"<div class='disctext'>"+json[i].text+"</div>" +
						"</div>");
	}
}