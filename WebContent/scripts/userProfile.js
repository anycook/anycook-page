function loadProfile(username){
	if(username == "me" && user.onlyUserAccess()){
		username = user.name;
	}
	
	$.address.title(username+" | anycook");
	var profileData = User.initProfileInfo(username);
	var image = profileData.getLargeImage();
	$("#profile_image img").attr("src", image);
	$("#profile_title h1").text(profileData.name);
	$("#profile_recipe_info").text(profileData.recipes.length+" Rezepte");
	$("#profile_schmeckt_info").append(profileData.schmeckt.length+" Favoriten");
	
	if(profileData.text!=null){
		$("#profile_text").show();
		$("#profile_text h2").text("Über mich");
		$("#profile_text p").text(profileData.text);
	}
	
	if(profileData.facebook_id>0){
		var fblink = $("#profile_facebook");
		fblink.attr("href", profileData.getFacebookProfileLink());
		fblink.css("display", "block");		
	}
	
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
	
	$(".profile_search").attr("href", "#!/search/user/"+encodeURIComponent(profileData.name));
	
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
	
	if(username == user.name){
		$.ajax({
			url:"/anycook/GetRecommendation",
	        dataType: "json",
	        success:function(json){
	        	if(json.length>0){
	        		$("#profile_recommendation").show();
	        		$("#profile_recommendation h2").text("Diese Rezepte könnten dir auch schmecken");
		        	for(var i = 0; i<json.length && i<20; i++){
		        		var uri = "#!/recipe/"+encodeURIComponent(json[i]);
		    			$("#profile_recommendation p").append("<a href=\""+uri+"\" class=\"profile_rezept_bild\">" +
		    					"<img src=\"http://graph.anycook.de/recipe/"+json[i]+"/image?type=small\"/>"+
		    					"<div><span>"+json[i]+"</span></div></a>");
		        	}
		        	if($("#profile_recommendation p a").length<=5)
		    			$("#profile_recommendation p").css("height", 120);
		    		
		    		if($("#profile_recommendation p a").length>10)
		    			$("#profile_recommendation .profile_more").show();
	        	}
	        }
		});
	}
	
}

function gotoProfile(username){
	$.address.value("profile/"+encodeURIComponent(username));
}

/*function profileVerticalCenter(element){
	var span = element.children("span").first();
	var spanheight = span.css("height");
	var margintop = (102-spanheight)/2;
	span.css("marginTop", margintop);
	
}*/


function profileShowMore(event){
	var newheight;
	var p = $(this).siblings("p").first();
	if($(this).text() == "mehr anzeigen"){
		var numelements = p.children().length;	
		
		var rest = numelements % 5;
		newheight = ((numelements-rest)/5)*120;
		if(rest>0) newheight+=120;
		
		$(this).text("weniger anzeigen");
		/*$(this).animate({height:0, opacity:0},{duration:1000, complete:function(){
			$(this).remove();
			}});*/
	}else{
		newheight = 240;
		$(this).text("mehr anzeigen");
	}
	
	p.animate({height:newheight}, 1000);
}