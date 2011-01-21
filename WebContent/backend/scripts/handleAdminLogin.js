function checkLogin(json){
	if(json["nickname"]==undefined)
		window.navigate("top.jsp");
	else{
		$("#login").text("eingeloggt als: "+json.nickname);
	}
}