function loadTags(json){
	for(i in json){
		$("#taglist").append("<li><div class='tagName'>"+json[i].name+"</div>" +
				"<div class='tagGerichte'>Gerichte:"+json[i].counter+"</div>" +
				"<div class='tagDelete'>löschen</div></li>");
	}
}