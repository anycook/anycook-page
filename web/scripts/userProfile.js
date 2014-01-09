/**
 * @license This file is part of anycook. The new internet cookbook
 * Copyright (C) 2014 Jan Graßegger
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see [http://www.gnu.org/licenses/].
 * 
 * @author Jan Graßegger <jan@anycook.de>
 */

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
		
		$(".profile_buttons #showRecipes").attr("href", "#/search?user="+userid);

		if(user.checkLogin()){
			if(user.id != userid){
				$(".profile_buttons #preferences").hide();
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
			} else{
				$(".profile_buttons #follow, .profile_buttons #sendmessage").hide();
			}

			//$(".profile_buttons").show();
			
		}	


		
		if(profileData.place != null)
			$(".profile_place").show().children("span").text(profileData.place);
		
		$(".profile_achievements .follower .count").text(profileData.followers.length);
		
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
			$(".profile_achievements .recipes .count").text(recipes.length);
			if(recipes.length > 0){
				
				var headline;
				if(userid == user.id)
					headline = "Deine Rezepte ("+recipes.length+")";
				else
					headline = "Rezepte von "+profileData.name+" ("+recipes.length+")";
				$("#profile_recipes").recipeoverview(headline, recipes).show();
			}
		});
		
		$.anycook.api.user.schmeckt(userid, function(schmeckt){
			$(".profile_achievements .likes .count").text(schmeckt.length);
			if(schmeckt.length > 0){
				var headline;

				if(userid == user.id)
					headline = "Deine Lieblingsrezepte ("+schmeckt.length+")";
				else
					headline = "Lieblingsrezepte von "+profileData.name+" ("+schmeckt.length+")";
				$("#profile_schmeckt").recipeoverview(headline, schmeckt).show();
			}
		});

		
		
		User.getDiscussionNum(userid, function(discussionNum){
			$(".profile_achievements .discussions .count").text(discussionNum);
		});
	});
		
	if(userid == user.id){
		$.anycook.api.user.recommendations (function(json){
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
		$.anycook.api.user.follow(userid);
		$this.addClass("on").text("- Entfolgen");
		$("#stamp").fadeIn(500);
		$follower.text(numFollowers+1);
	}else{
		$.anycook.api.user.unfollow(userid);
		$this.removeClass("on").text("+ Folgen");
		$("#stamp").fadeOut(500);

		$follower.text(numFollowers-1);
	}
}