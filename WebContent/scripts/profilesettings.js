
function loadSettings(){
	
	fillAccountSettings();
	//var uploader = 
		new qq.FileUploader({
	    // pass the dom node (ex. $(selector)[0] for jQuery users)
	    element: $('#account_upload div')[0],
	    // path to server-side upload script
	    action: '/anycook/UploadUserImage',
	    onComplete:saveUserImage
	});
	
	fillNotificationSettings();
	// $("#settings_notification input").change(saveSettings);
// 	
	// if(user.facebook_id == 0){
		// $("#settings_password").show();
		// $("#showpassword").click(togglePasswordField);
	// }
// 	
	// $(".settings h2").click(showSettings);
}

function fillAccountSettings(){
	$(".profile_image img").attr("src", user.getUserImagePath("large"));
	$("#account_name").val(user.name);
	$("#account_mail").val(user.mail);
	$("#account_aboutme").val(user.text);
}