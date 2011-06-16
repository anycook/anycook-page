//parses into HTML from XML-Content

function parseXML(data, name){
	var xml;
	if (typeof data == "string") {
		xml = ieAjaxBugFix(data);
	} else {
		xml = data;
	}
		
	
	var contentName;
	if(name == "success"){
	    contentName = "home"; 
	    var pathArray = $.address.pathNames();
	    if(pathArray.length > 0)
	        contentName=pathArray[0];
	}
	else
		contentName=name;
	
    $(xml).find("template#"+contentName).each(function(){
    	var obj = $(this).clone().contents();
        var div = $("<div/>").append(obj);
        $('#content_main').append(div.html());
    });
}

function ieAjaxBugFix(data) {
	var div = $("<div/>").html(data);
    return div.html();
}