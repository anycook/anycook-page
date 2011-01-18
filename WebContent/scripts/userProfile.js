function loadUserProfile(){
	if(loginChecker()){
		$.ajax({
			url:"/anycook/GetLoginData",
			dataType:"json",
			success:function(json){
				$("#filter_main").after("<div id='user_profile'><h2 id='profile_username'>"+json.nickname+"</h2>" +
						"<img src='/userbilder/big/"+json.image+"' /></div>");
				$("#user_profile > *").animate({"opacity":.0}, 0);
				$("#filter_main").animate({height:0, paddingBottom:0},1000).contents().animate({"opacity":0}, {duration:1000, complete:function(){
					$("#filter_main").hide();
					$("#user_profile > *").animate({"opacity":1}, 500);
					$("#filter_main > *").hide();
				}});
			}
		});		
	}else{
		$.address.value("");
	}
}