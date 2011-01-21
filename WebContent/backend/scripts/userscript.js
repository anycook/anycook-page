function loadUsers(json){
	for(var i in json){
		$("#usertable").append("<tr><td>"+json[i].name+"</td><td>"+json[i].mail+"</td><td>"+json[i].createdate+"</td><td>"+json[i].lastlogin+"</td><td>"+json[i].facebook_id+"</td></tr>");
	}
}