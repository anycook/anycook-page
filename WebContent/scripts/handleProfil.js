function userSearch(username){
	$("#result_container").empty();
	$.ajax({
		  url: "/anycook/UserRecipeSearch",
		  data:"username="+username,
		  dataType: 'json',
		  async:false,
		  success: searchResult
		});
	loadProfile(username);
}

function loadProfile(username){
	$("#profil_name").append(username);
}