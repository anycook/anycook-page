function loadTags(json){
	$("#taglist").empty();
	$("#info table").empty();
	$("#newSuggestion").empty();
	var tagCount=0;
	for(i in json){
		$("#taglist").append("<li><div class='tagName'>"+json[i].name+"</div>" +
				"<div class='tagGerichte'>Gerichte:"+json[i].counter+"</div>" +
				"<div class='tagDelete'>löschen</div></li>");
		tagCount++;
	}
	
	$.ajax({
		url:"/anycook/GetSuggestions",
		dataType:"json",
		success:loadSuggestions
	});
	
	$("#info table").append("<tr><td>Tags gesamt:</td><td>"+tagCount+"</td></tr>");
	$("#info table").append("<tr><td>Vorgeschlagene Tags:</td><td></td></tr>");
	
	$(".tagDelete").click(deleteTagConfirm);
	
}

function deleteTagConfirm(event){
	var tagName = $(this).parent().children(".tagName").first().text();
	$("#confirm_text").append('Möchtest du wirklich den Tag "<span id="selected_tag"></span>" löschen?');
	$("#selected_tag").html(tagName);
	$("#confirm").fadeIn(500);
	$("#confirm_no").click(function(){
		$("#confirm").fadeOut(500);
		$("#confirm_text").empty();
	});
	$("#confirm_yes").click(deleteTag);
}

function deleteTag(){
	var tagName =$("#selected_tag").text(); 
	$.ajax({
		url:"/anycook/DeleteTag",
		data: "name="+tagName,
		dataType:"json",
		success:function(){
			$("#confirm").fadeOut(500);
			$.ajax({
				url:"/anycook/GetTags",
				dataType:"json",
				success:loadTags
			});
		}
	});
}

function loadSuggestions(json){
	for(i in json){
		$("#newSuggestion").append("<li><div class='tagName'>"+json[i].tags_name+"</div>" +
				"<div class='suggGericht'>für: "+json[i].gerichte_name+"</div>" +
		"<div class='tagDeny'>ablehnen </div><div class='tagAccept'> akzeptieren</div></li>");
	}
	$(".tagDeny").click(denyTagConfirm);
	$(".tagAccept").click(acceptTagConfirm);
}

function denyTagConfirm(event){
	$("#confirm_text").empty();
	var tagName = $(this).parent().children(".tagName").first().text();
	$("#confirm_text").append('Möchtest du wirklich den Tag "<span id="selected_tag"></span>" ablehnen?');
	$("#selected_tag").html(tagName);
	$("#confirm").fadeIn(500);
	$("#confirm_no").click(function(){
		$("#confirm").fadeOut(500);
		$("#confirm_text").empty();
	});
}

function acceptTagConfirm(event){
	$("#confirm_text").empty();
	var tagName = $(this).parent().children(".tagName").first().text();
	$("#confirm_text").append('Möchtest du wirklich den Tag "<span id="selected_tag"></span>" akzeptieren?');
	$("#selected_tag").html(tagName);
	$("#confirm").fadeIn(500);
	$("#confirm_no").click(function(){
		$("#confirm").fadeOut(500);
		$("#confirm_text").empty();
	});
}