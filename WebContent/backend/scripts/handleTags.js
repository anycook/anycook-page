function loadTags(json){
	$("#taglist").empty();
	$("#info table").empty();
	var tagCount=0;
	for(i in json){
		$("#taglist").append("<li><div class='tagName'>"+json[i].name+"</div>" +
				"<div class='tagGerichte'>Gerichte:"+json[i].counter+"</div>" +
				"<div class='tagDelete'>löschen</div></li>");
		tagCount++;
	}
	
	$("#info table").append("<tr><td>Tags gesamt:</td><td>"+tagCount+"</td></tr>");
	$("#info table").append("<tr><td>Vorgeschlagene Tags:</td><td></td></tr>");
	
	$(".tagDelete").click(deleteTagConfirm);
	
}

function deleteTagConfirm(event){
	var tagName = $(this).parent().children(".tagName").first().text();
	$("#selected_tag").html(tagName);
	$("#confirm").fadeIn(500);
	$("#confirm_no").click(function(){
		$("#confirm").fadeOut(500);
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