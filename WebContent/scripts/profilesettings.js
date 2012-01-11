
function loadSettings(){
	
	fillAccountSettings();
	new qq.FileUploader({
	    // pass the dom node (ex. $(selector)[0] for jQuery users)
	    element: $("#upload_button")[0],
	    multiple:false,
	    onSubmit:addProgressBar,
	    onProgress:nrProgress,
	    onComplete:completeUserUpload,
	    // path to server-side upload script
	    action: '/anycook/UploadUserImage'
	});
	
	fillAccountSettings();
	$("#account_form").submit(changeAccountSettings);
	
	$.getJSON("/anycook/GetSettings", function(settings){
		fillMailSettings(settings.mail);
	});
	
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

function fillAccountSettings(){
	$(".profile_image img").attr("src", user.getUserImagePath("large"));
	$("#account_name").val(user.name);
	$("#account_mail").val(user.mail);
	$("#account_aboutme").val(user.text);
	$("#account_place").val(user.place);
	
}

function fillMailSettings(mailsettings){
	if(!mailsettings) return;
		
	$("#settings_notification").data("mailsettings", mailsettings);
		
	var checker = false;
	for(var type in mailsettings){
		if(mailsettings[type]){
			checker=true;
			$("#"+type+" input[type=\"checkbox\"]").attr("checked", "checked");
		}
	}
	
	var $bigCheckbox = $("#mail_notification input").change(toggleMailSettings);
	if(checker){
		$bigCheckbox.attr("checked", "checked");
		$("#settings_notification_content").show();
	}
	
	$("#settings_notification_content input").change(changeMailSettings);
}

function toggleMailSettings(){
	var $this = $(this);
	var $content = $("#settings_notification_content");
	var checked = $this.attr("checked");
	var $smallCheckboxes = $("#settings_notification_content input");
	if(!checked){
		$content.animate({height:0}, {duration:700,easing:"easeInQuad", complete:function(){
			$(this).hide().css("height", "");
			$smallCheckboxes.attr("checked", "");
			changeAllMailSettings(false);
		}});
	}else{
		var oldHeight = $content.height();
		$content.css("height", 0).show();
		$content.animate({height:oldHeight}, {duration:700,easing:"easeOutQuad", complete:function(){
			$(this).show().css("height", "");
			$smallCheckboxes.attr("checked", "checked");
			changeAllMailSettings(true);
		}});
	}
	
}

function completeUserUpload(){
	var $recipeImageContainer = $(".profile_image");
	$recipeImageContainer.children("img").remove();
	$recipeImageContainer.removeClass("visible").children("#progressbar").hide();
	$recipeImageContainer.children(".image_upload").show();
	var $img = $("<img/>").attr("src", user.getUserImagePath("large")+"&"+Math.random());
	$(".profile_image").append($img);
}

function changeAccountSettings(event){
	event.preventDefault();
	
	var newSettings = {};
	
	var newPlace = $("#account_place").val();
	
	if(newPlace != "" && newPlace != user.place)
		newSettings["place"] = newPlace;
		
	$.post("/anycook/ChangeAccountSettings", newSettings,function(){
		user = User.init();
	});
	
}

function changeMailSettings(){
	
	var oldSettings = $("#settings_notification").data("mailsettings");
	var newSettings = {};
	for(var type in oldSettings){
		if(type == "tagdenied") continue;
		
		var setting = $("#"+type+" input[type=\"checkbox\"]").attr("checked") ? true : false;
		if(oldSettings[type] != setting)
			newSettings[type] = setting;
	}
	
	$.extend(oldSettings, newSettings);	
	$("#settings_notification").data("mailsettings", oldSettings);
	
	$.post("/anycook/ChangeMailSettings", newSettings, function(){
		console.log("saved mailsettings");
	});
	
}

function changeAllMailSettings(property){
	var oldSettings = $("#settings_notification").data("mailsettings");
	var newSettings = {};
	for(var type in oldSettings){
		if(type == "tagdenied") continue;
		
		if(oldSettings[type] != property)
			newSettings[type] = property;
	}
	
	$.extend(oldSettings, newSettings);	
	$("#settings_notification").data("mailsettings", oldSettings);
	
	$.post("/anycook/ChangeMailSettings", newSettings, function(){
		console.log("saved mailsettings");
	});
}
