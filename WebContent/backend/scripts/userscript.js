function loadUsers(json){
	var usercounter = 0;
	var facebookcounter = 0;
	
	for(var i in json){
		
		usercounter++;
		
		if(json[i].facebook_id != 0) facebookcounter++;
		var lastlogin;
		if(json[i].lastlogin == null)
			lastlogin = "noch nie";
		else{
			var split = json[i].lastlogin.split(" ");
			lastlogin = split[1].split(".")[0]+" ";
			lastlogin+=parseDate(split[0]);
		}
		var createdate = parseDate(json[i].createdate);
		
		var versions = json[i].versions;
		if(versions == null)
			versions = 0;
		$("#usertable").append("<tr><td>"+json[i].name+"</td><td>"+json[i].mail+"</td><td>"+
				createdate+"</td><td>"+lastlogin+"</td><td>"+json[i].facebook_id+"</td><td>"+json[i].level+"</td><td>"+versions+"</td></tr>");
	}
	$("#user_info").append("<li>Anzahl User: "+usercounter+"</li>");
	$("#user_info").append("<li>Anzahl Facebookuser: "+facebookcounter+"</li>");
	
}

function parseDate(toParse){
	toParse = toParse.split("-");
	return toParse[2]+"."+toParse[1]+"."+toParse[0];	
}