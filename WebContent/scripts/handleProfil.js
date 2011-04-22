function userSearch(username){
	$("#result_container").empty();
	addtoSession("username="+username);
	loadProfile(username);
}

function loadProfile(username){
	$("#profil_name").append(username);
}