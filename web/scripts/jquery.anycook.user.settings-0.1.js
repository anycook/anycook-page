(function($){
	if(!$.anycook)
		$.anycook = {};
	if(!$.anycook.user)
		$.anycook.user = {};
	if(!$.anycook.user.settings)
		$.anycook.user.settings = {};
		
	var settings = {};
		
	$.anycook.user.settings.load = function(){

		var data = {change:function(){}};
			$("#account_aboutme").inputdecorator("maxlength", data);

		$.anycook.user.settings.loadAccount();
		
		$.anycook.graph.session.settings(function(json){
			$.extend(settings, json);
			$.anycook.user.settings.loadMail();
		});

		var conf = $.anycook.graph._settings();
		
		new qq.FileUploader({
		    // pass the dom node (ex. $(selector)[0] for jQuery users)
		    element: $("#upload_button")[0],
		    multiple:false,
		    onSubmit:addProgressBar,
		    onProgress:nrProgress,
		    onComplete:$.anycook.user.settings.completeUpload,
		    // path to server-side upload script
		    action: conf.baseUrl+'/upload/image/user'
		});

		if(user.facebook_id <= 0){
			

			$("#showpassword").click(function() {		
				var $container = $("#new_password_container");
				var $password = $container.children("#password_new");
				var $new_password = $password.clone();
				if($password.attr("type") == "password")
					$new_password.attr("type", "text");
				else
					$new_password.attr("type", "password");
				
				$password.remove();
				$(this).before($new_password);
			});
		}
		
		
		




	};
	
	$.anycook.user.settings.loadAccount = function(){
		$(".profile_image img").attr("src", user.getUserImagePath("large"));
		$("#account_name").val(user.name).blur($.anycook.user.settings.saveAccount);
		$("#account_mail").val(user.mail).blur($.anycook.user.settings.saveMail);
		$("#account_aboutme").val(user.text).blur($.anycook.user.settings.saveAccount);;
		$("#account_place").val(user.place).blur($.anycook.user.settings.saveAccount);;
		// $("#account_form").submit($.anycook.user.settings.changeAccount);
	};
	
	$.anycook.user.settings.loadMail = function(){
		if(!settings.mail) return;
		
		var mailsettings = settings.mail;	
		var checker = false;
		for(var type in mailsettings){
			if(mailsettings[type]){
				checker=true;
				$("#"+type.toLowerCase()+" input[type=\"checkbox\"]").attr("checked", "checked");
			}
		}
		
		var $bigCheckbox = $("#mail_notification input").change($.anycook.user.settings.toggleMail);
		if(checker){
			$bigCheckbox.attr("checked", "checked");
			$("#settings_notification_content").show();
		}
		
		$("#settings_notification_content input").change($.anycook.user.settings.changeMail);
	};
	
	$.anycook.user.settings.toggleMail = function(){
		var $this = $(this);
		var $content = $("#settings_notification_content");
		var checked = $this.attr("checked");
		var $smallCheckboxes = $("#settings_notification_content input");
		if(!checked){
			$content.animate({height:0}, {duration:700,easing:"easeInQuad", complete:function(){
				$(this).hide().css("height", "");
				$smallCheckboxes.attr("checked", "");
				$.anycook.user.settings.changeAllMail(false);
			}});
		}else{
			var oldHeight = $content.height();
			$content.css("height", 0).show();
			$content.animate({height:oldHeight}, {duration:700,easing:"easeOutQuad", complete:function(){
				$(this).show().css("height", "");
				$smallCheckboxes.attr("checked", "checked");
				$.anycook.user.settings.changeAllMail(true);
			}});
		}	
	};
	
	$.anycook.user.settings.completeUpload = function(){
		var $recipeImageContainer = $(".profile_image");
		$recipeImageContainer.children("img").remove();


		$recipeImageContainer.removeClass("visible").children("#progressbar").hide();
		$recipeImageContainer.children(".image_upload").show();
		var $large_img = $("<img/>").attr("src", user.getUserImagePath("large"));
		var $small_img = $("<img/>").attr("src", user.getUserImagePath("small"));
		$(".profile_image").append($large_img);
		$("#menu_profile_image").empty().append($small_img);
	};

	$.anycook.user.settings.saveAccount = function(event){
		var $this = $(this);
		var type;
		var value = $this.val();

		switch($this.attr("id")){
			case "account_name":
				type = "name";
				if(value === user.name || value.length == 0 && user.name == null) return;
				break;
			case "account_place":
				type = "place";
				if(value === user.place || value.length == 0 && user.place == null) return;
				break;
			case "account_aboutme":
				type = "text";
				if(value === user.text || value.length == 0 && user.text == null) return;
				break;
		}

		$.anycook.graph.session.setAccount(type, value, function(){
			user[type] = value;
			var $container = $("#profile_saved");		
			$.anycook.user.settings.saved($container);
		});
	}
	
	// $.anycook.user.settings.changeAccount = function(event){
	// 	event.preventDefault();
		
	// 	var newSettings = {};
		
	// 	var newPlace = $("#account_place").val();	
	// 	if(newPlace != user.place)
	// 		newSettings.place = newPlace;
			
	// 	var newName = $("#account_name").val();
	// 	if(newName != "" && newName != user.name)
	// 		newSettings.username = newName;
			
	// 	var newText = $("#account_aboutme").val();
	// 	if(newText != user.text)
	// 		newSettings.text = newText;
			
	// 	$.anycook.graph.session.setAccount(newSettings,function(){
	// 		user = User.init();
	// 		var $container = $("#profile_saved");		
	// 		$.anycook.user.settings.saved($container);
	// 	});
		
	// };
	
	$.anycook.user.settings.changeMail = function(event){
		var $this = $(this);
		if($this.is(":checked"))
			$.anycook.graph.session.addMailSettings($this.val());
		else
			$.anycook.graph.session.removeMailSettings($this.val());
		var $container = $("#notification_saved");		
		$.anycook.user.settings.saved($container);
		
	};
	
	$.anycook.user.settings.changeAllMail = function(value){
		$.anycook.graph.session.setMail("all", value);
	};
	
	$.anycook.user.settings.saved = function($container){
		$container.stop(true).fadeIn(500, function(){
			$container.delay(2000).fadeOut(500);
		});
	};
	
	$.anycook.user.settings.changeMailPwd = function(event){
		event.preventDefault();
		var mailPwd = {};
		
		
		var mail = $("#account_mail").val();
		if(!$.anycook.user.settings.checkMail(mail)){
			$("#mail_validation").animate({opacity:1}, {duration:500, complete:function(){
				$(this).delay(2000).animate({opacity:0}, 500);
			}});
		}else{
			if(user.mail != mail)
				mailPwd.mail = mail;
		}
		
		var oldPw = $("#password_old").val();
		var newPw = $("#password_new").val();
		
		if(oldPw.length > 0 || newPw.length > 0){
			if(!$.anycook.user.settings.checkPwd(newPw)){
				$("#pwd_validation").animate({opacity:1}, {duration:500, complete:function(){
					$(this).delay(2000).animate({opacity:0}, 500);
				}});
			}else{
				mailPwd.oldpw = oldPw;
				mailPwd.newpw = newPw;
			}
		}
		
		$.post("/anycook/ChangeAccountSettings", mailPwd, function(){
			var $container = $("#mail_pwd_saved");		
			$.anycook.user.settings.saved($container);
		});
	};
	
	$.anycook.user.settings.checkMail = function(mail){
		var regex = /^(([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+)?$/;
		return regex.test(mail);
	};
	
	$.anycook.user.settings.checkPwd = function(pwd){
		var regex = /((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/;
		return regex.test(pwd);
	}
	
})(jQuery);