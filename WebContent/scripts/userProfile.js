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
		


		if(user.checkLogin() && user.id != userid){
			$(".profile_buttons").show();
			$("#follow").click(follow);

			if(profileData.isFollowedBy(user.id)){
				$("#stamp").show();
				$("#follow").text("- Entfolgen").addClass("on");
			}

			//lightbox	
			$("#sendmessage").click(function(){
				var $lightbox = getNewMessageLightbox();
				var top = $(this).offset().top-313;
				showLightbox($lightbox, top, function(){
					this.find("textarea").focus();
				});
				addRecipient(profileData.name, profileData.id);


				return false;
			});
		}		
		
		if(profileData.place != null)
			$(".profile_place").show().children("span").text(profileData.place);
		
		$(".profile_achievements .follower .count").text(profileData.follower.length);
		
		if(profileData.text!=null && profileData.text.length > 0){
			$(".profile_text").show().text("»"+profileData.text+"«");
		}
		
		// if(profileData.facebook_id>0){
		// 	var fblink = $(".profile_facebook");
		// 	fblink.attr("href", profileData.getFacebookProfileLink());
		// 	fblink.css("display", "block");		
		// }
		
		$(".profile_search").attr("href", "#!/search/user/"+encodeURIComponent(profileData.name));
		
		User.getRecipes(userid, function(recipes){
			if(recipes.total > 0){
				$(".profile_achievements .recipes .count").text(recipes.total);
				var headline;
				if(userid == user.id)
					headline = "Deine Rezepte ("+recipes.total+")";
				else
					headline = "Rezepte von "+profileData.name+" ("+recipes.total+")";
				$("#profile_recipes").recipeoverview(headline, recipes.names).show();
			}else{
				$(".profile_achievements .recipes .count").text(0);
			}
		});
		
		$.anycook.graph.user.schmeckt(userid, function(schmeckt){
			if(schmeckt.length > 0){
				$(".profile_achievements .likes .count").text(schmeckt.length);

				var headline;

				if(userid == user.id)
					headline = "Deine Lieblingsrezepte ("+schmeckt.length+")";
				else
					headline = "Lieblingsrezepte von "+profileData.name+" ("+schmeckt.length+")";
				$("#profile_schmeckt").recipeoverview(headline, schmeckt).show();
			}else{
				$(".profile_achievements .likes .count").text(0);
			}
		});

		
		
		User.getDiscussionNum(userid, function(discussionNum){
			$(".profile_achievements .discussions .count").text(discussionNum);
		});
	});
		
	if(userid == user.id){
		$.anycook.graph.user.recommendations (function(json){
        	if(json.length>0){
        		var headline = "Diese Rezepte könnten dir auch schmecken";
        		$("#profile_recommendation").recipeoverview(headline, json).show();
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