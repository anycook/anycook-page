function loadUsers(json){
	var usercounter = 0;
	var facebookcounter = 0;
	var inactivecounter = 0;
	
	for(var i in json){
		
		usercounter++;
		
		if(json[i].facebook_id != 0) facebookcounter++;
		var lastlogin;
		if(json[i].lastlogin == null){
			lastlogin = "noch nie";
			inactivecounter++;
		}
		else{
			var split = json[i].lastlogin.split(" ");
			lastlogin = split[1].split(".")[0]+" ";
			lastlogin+=parseDate(split[0]);
		}
		var createdate = parseDate(json[i].createdate);
		
		var versions = json[i].versions;
		if(versions == null)
			versions = 0;
		$("#usertable").append("<tr><td><input type=\"checkbox\" value=\""+json[i].name+"\"/></td><td>"+json[i].name+"</td><td>"+json[i].mail+"</td><td>"+
				createdate+"</td><td>"+lastlogin+"</td><td>"+json[i].facebook_id+"</td><td>"+json[i].level+"</td><td>"+versions+"</td></tr>");
	}
	$("#user_info table").append("<tr><td>User gesamt:</td><td>"+usercounter+"</td></tr>");
	$("#user_info table").append("<tr><td>Facebookuser:</td><td>"+facebookcounter+"</td></tr>");
	$("#user_info table").append("<tr><td>Inaktive User:</td><td>"+inactivecounter+"</td></tr>");
	
}

function parseDate(toParse){
	toParse = toParse.split("-");
	return toParse[2]+"."+toParse[1]+"."+toParse[0];	
}

function orderUserTable(event){
	
	var target = $(event.target);
	if(target.has("input") == 0){
		var oldOrder = $.address.parameter("orderBy");
		var oldDesc = $.address.parameter("desc");
		var order;
		var desc = 0;
		switch(target.text()){
		case "Username":
			order = "nickname";
			break;
		case "Mail":
			order = "email";
			break;
		case "Registrierung":
			order = "createdate";
			break;
		case "last login":
			order = "lastlogin";
			break;
		case "facebook id":
			order = "facebook_id";
			break;
		case "Rezepte":
			order = "versions";
			break;
		case "Userlevel":
			order = "fullname";
			break;
		}
		if(order==oldOrder && oldDesc == "0") desc = 1;
		$.address.value("user?orderBy="+order+"&desc="+desc);
	
	}else{
		var checked = $($("#usertable input")[0]).attr("checked");
		if(checked == false)
			$("#usertable input").removeAttr("checked");
		else
			$("#usertable input").attr("checked", "checked");
	}
	
}