function checkLogin(json){
	if(json["nickname"]==undefined)
		window.location.replace("/");
	else{
		$("#login").text("Login: "+json.nickname);
	}
}