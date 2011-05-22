function loadProfile(username){
	if(username == "me" && user.checkLogin()){
		username = user.name;
	}	
	var profileData = User.initProfileInfo(username);
	var image = profileData.getLargeImage();
	$("#profile_image").attr("src", image);
	$("#profile_info h1").text(profileData.name);
	$("#profile_info").append("<p>"+profileData.recipes.length+" Rezepte</p>");
	$("#profile_info").append("<p>"+profileData.schmeckt.length+" Favoriten</p>");
	
	if(profileData.recipes.length>0){
		$("#profile_recipes").show();
		var recipes = profileData.recipes;
		$("#profile_recipes h2").text("Rezepte von "+profileData.name+" ("+recipes.length+")");
		for(var i in recipes){
			var uri = "#!/recipe/"+encodeURIComponent(recipes[i].name);
			$("#profile_recipes p").append("<a href=\""+uri+"\" class=\"profile_rezept_bild\">" +
					"<img src=\"/gerichtebilder/small/"+recipes[i].image+"\"/>" +
					"<div><span>"+recipes[i].name+"</span></div></a>");
			
		}
		if(recipes.length<=5)
			$("#profile_recipes p").css("height", 120);
		
		if(recipes.length>10)
			$("#profile_recipes .profile_more").show();
	}
	
	if(profileData.schmeckt.length>0){
		$("#profile_schmeckt").show();
		var schmeckt = profileData.schmeckt;
		$("#profile_schmeckt h2").text("Lieblingsrezepte von "+profileData.name+" ("+schmeckt.length+")");
		for(var i in schmeckt){
			var uri = "#!/recipe/"+encodeURIComponent(schmeckt[i].name);
			$("#profile_schmeckt p").append("<a href=\""+uri+"\" class=\"profile_rezept_bild\">" +
					"<img src=\"/gerichtebilder/small/"+schmeckt[i].image+"\"/>"+
					"<div><span>"+schmeckt[i].name+"</span></div></a>");
		}
		if(schmeckt.length<=5)
			$("#profile_schmeckt p").css("height", 120);
		
		if(schmeckt.length>10)
			$("#profile_schmeckt .profile_more").show();
	}
	
	$(".profile_more").click(profileShowMore);
	
	
	
}

/*function profileVerticalCenter(element){
	var span = element.children("span").first();
	var spanheight = span.css("height");
	var margintop = (102-spanheight)/2;
	span.css("marginTop", margintop);
	
}*/

function profileShowMore(event){
	var p = $(this).siblings("p").first();
	var numelements = p.children().length;
	
	
	var rest = numelements % 5;
	var newheight = ((numelements-rest)/5)*120;
	if(rest>0) newheight+=120;
	
	p.animate({height:newheight}, 1000);
	$(this).animate({height:0, opacity:0},{duration:1000, complete:function(){
		$(this).remove();
		}});
}