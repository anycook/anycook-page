function loadDrafts(){
	$.getJSON("/anycook/GetDrafts", function(json){
		var $draftList = $("#draft_list");
		for(var i in json){
			$draftList.append("<li>"+JSON.stringify(json[i])+"</li>");
		}
	})
}
