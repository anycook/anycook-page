
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
	var checker = false;
	for(var type in mailsettings){
		if(mailsettings[type]){
			checker=true;
			$("#"+type+" input[type=\"checkbox\"]").attr("checked", "checked");
		}
	}
	
	if(checker){
		$("#mail_notification input[type=\"checkbox\"]").attr("checked", "checked");
		$("#settings_notification_content").show();
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
