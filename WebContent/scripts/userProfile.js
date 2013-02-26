function loadProfile(userid){
	if(userid == "me" && user.onlyUserAccess()){
		userid = user.id;
	}
	$.when(User.initProfileInfo(userid)).then(function(profileData){
		setTitle(profileData.name);
		var image = User.getUserImagePath(profileData.id, "large");
		$(".profile_image").attr("src", image);
		$(".profile_title h1").text(profileData.name);

		var date = getDateString(profileData.date);
		$(".profile_date span").text(date);
		

		if(user.id != userid){
			$(".profile_buttons").show();
			$("#follow").click(follow);

			if(profileData.isFollowedBy(user.id)){
				$("#stamp").show();
				$("#follow").text("- Entfolgen").addClass("on");
			}
		}		
		
		if(profileData.place != null)
			$(".profile_place").show().children("span").text(profileData.place);
		
		$(".profile_achievements .follower .count").text(profileData.follower.length);
		
		if(profileData.text!=null){
			$(".profile_text").show().text(profileData.text);
		}
		
		if(profileData.facebook_id>0){
			var fblink = $(".profile_facebook");
			fblink.attr("href", profileData.getFacebookProfileLink());
			fblink.css("display", "block");		
		}
		
		$(".profile_search").attr("href", "#!/search/user/"+encodeURIComponent(profileData.name));
		
		User.getRecipes(userid, function(recipes){
			$(".profile_achievements .recipes .count").text(recipes.total);
			
			if(recipes.total>0){
				var $recipes = $("#profile_recipes").show();
				$recipes.children("h2").text("Rezepte von "+profileData.name+" ("+recipes.total+")");
				var $p = $recipes.children("p");
				for(var i in recipes.names){
					$p.append(profileRecipe(recipes.names[i]));
				}
				if(recipes.total<=5)
					$("#profile_recipes p").css("height", 120);
				
				if(recipes.total>10)
					$("#profile_recipes .profile_more").show();
			}
		});
		
		var schmeckt = user.schmeckt;
		$(".profile_achievements .likes .count").text(schmeckt.length);
		var $schmeckt = $("#profile_schmeckt").show();
		$schmeckt.children("h2").text("Lieblingsrezepte von "+profileData.name+" ("+schmeckt.length+")");
		var $p = $schmeckt.children("p");
		for(var i in schmeckt){
			$p.append(profileRecipe(schmeckt[i]));
		}
		if(schmeckt.length<=5)
			$("#profile_schmeckt p").css("height", 120);
		
		if(schmeckt.length>10)
			$("#profile_schmeckt .profile_more").show();
		
		User.getDiscussionNum(userid, function(discussionNum){
			$(".profile_achievements .discussions .count").text(discussionNum);
		});
	});
	
	$(".profile_more").click(profileShowMore);
		
	if(userid == user.id){
		$.anycook.graph.user.recommendations (function(json){
        	if(json.length>0){
        		var $recommendation = $("#profile_recommendation").show();
        		$recommendation.children("h2").text("Diese Rezepte könnten dir auch schmecken");
        		var $p = $recommendation.children("p");
	        	for(var i = 0; i<json.length && i<20; i++){
	        		$p.append(profileRecipe(json[i]));
	        	}
	        	if($p.children("a").length<=5)
	    			$p.css("height", 120);
	    		
	    		if($p.children("a").length>10)
	    			$recommendation.children(".profile_more").show();
        	}
		});
	}
	
}

function gotoProfile(username){
	$.address.value("profile/"+encodeURIComponent(username));
}

function follow(){
	var $this = $(this);
	var userid = $.address.pathNames()[1];
	var $follower = $(".follower .count");
	var numFollowers = Number($follower.text());
	if(!$this.hasClass("on")){
		$.anycook.graph.user.follow(userid);
		$this.addClass("on").text("- Entfolgen");
		$("#stamp").fadeIn(500);
		$follower.text(numFollowers+1);
	}else{
		$.anycook.graph.user.unfollow(userid);
		$this.removeClass("on").text("+ Folgen");
		$("#stamp").fadeOut(500);

		$follower.text(numFollowers-1);
	}
}


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