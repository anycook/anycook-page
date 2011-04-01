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
	
	$(".tagDelete").click(deleteTagConfirm);
	
}

function deleteTagConfirm(event){
	$("#confirm_text").empty();
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
	var counter = 0;
	for(i in json){
		var uri = encodeURI("/#/recipe/"+json[i].gerichte_name);
		$("#newSuggestion").append("<li><div class='tagName'>"+json[i].tags_name+"</div>" +
				"<div class='suggGericht'><a href='"+uri+"' target='_blank'>"+json[i].gerichte_name+"</a></div>" +
				"<div class='username'>"+json[i].username+"</div>"+
		"<div class='tagDeny'>ablehnen </div><div class='tagAccept'> akzeptieren</div></li>");
		counter++;
	}
	$("#info table").append("<tr><td>Neue Vorschläge:</td><td>"+counter+"</td></tr>");
	$(".tagDeny").click(denyTagConfirm);
	$(".tagAccept").click(acceptTagConfirm);
}

function denyTagConfirm(event){
	$("#confirm_text").empty();
	var tagName = $(this).parent().children(".tagName").first().text();
	var gerName = $(this).parent().children(".suggGericht").first().text();
	$("#confirm_text").append('Möchtest du wirklich den Tag "<span id="selected_tag"></span>" aus Gericht "<span id="selected_tagGer"></span>" ablehnen?');
	$("#selected_tag").html(tagName);
	$("#selected_tagGer").html(gerName);
	$("#confirm").fadeIn(500);
	$("#confirm_no").click(function(){
		$("#confirm").fadeOut(500);
		$("#confirm_text").empty();
	});
	$("#confirm_yes").click(denyTag);
}

function acceptTagConfirm(event){
	$("#confirm_text").empty();
	var tagName = $(this).parent().children(".tagName").first().text();
	var gerName = $(this).parent().children(".suggGericht").first().text();
	$("#confirm_text").append('Möchtest du wirklich den Tag "<span id="selected_tag"></span>" aus Gericht "<span id="selected_tagGer"></span>" akzeptieren?');
	$("#selected_tag").html(tagName);
	$("#selected_tagGer").html(gerName);
	$("#confirm").fadeIn(500);
	$("#confirm_no").click(function(){
		$("#confirm").fadeOut(500);
		$("#confirm_text").empty();
	});
	$("#confirm_yes").click(acceptTag);
}

function acceptTag(){
	var tagName =$("#selected_tag").text();
	var gerName =$("#selected_tagGer").text(); 
	$.ajax({
		url:"/anycook/EditTags",
		data: "tagName="+tagName+"&gerName="+gerName+"&todo=accept",
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

function denyTag(){
	var tagName =$("#selected_tag").text();
	var gerName =$("#selected_tagGer").text(); 
	$.ajax({
		url:"/anycook/EditTags",
		data: "tagName="+tagName+"&gerName="+gerName+"&todo=deny",
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