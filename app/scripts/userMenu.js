define([
	'jquery',
	'classes/User'
], function($, User){
	'use strict';

	return {
		makeText : function(){
			$("#signin_btn").hide();
			$(".user_btn").show();
			
			var $userSettings = $("#user_settings").click($.proxy(this.toggle, this));
			
			var $userMenu = $("#user_menu");
			var user = User.get();

			$userMenu.find("img").attr("src", User.getUserImagePath(user.id));
			var $profileLink = $("<a></a>").text(user.name).attr("href", user.getProfileURI());
			$userMenu.find(".username").append($profileLink);
			$userMenu.find("#logout").click(function(){
				var user = User.get();
				user.logout();
			});
			
			if(user.level == 2)
				$userMenu.find(".admin").show();
			
			$(document).click($.proxy(this.hide, this))
				.scroll($.proxy(this.hide, this));
			
			// $("#signin_btn span").text("Konto");
		// 	
			// $("#user img").attr("src", user.getSmallImage());
			// $("#user a+a").text(user.name);
		// 	
			// if(user.level == 2){
				// $("#admin_menu").show();		
				// $("#extend_permissions").click(fbExtendPermissions);		
			// }
			
		},
		toggle : function(event){
				var $userMenu = $("#user_menu");
				var $target = $(event.target);
				if($userMenu.hasClass("visible")){
					$userMenu.removeClass("visible");
					$target.removeClass("focus");
				}else{
					var buttonOffset = $target.offset();
					$userMenu.css({top:buttonOffset.top+27,left:buttonOffset.left-150});
					$userMenu.addClass("visible");
					$target.addClass("focus");
				}
		},
		hide : function(event){
			var $userMenu = $("#user_menu");
			var $target = $(event.target);
			if (event.type === "scroll" || !$target.parents().andSelf().is("#user_settings")|| $target.is("a")){
				$userMenu.removeClass("visible");
				$("#user_settings").removeClass("focus");
			}
			
		},
	}
});