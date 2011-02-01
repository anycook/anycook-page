function loadContact(){
	if(logindata == null&&!loginChecker()){
		loadCaptcha();
		$("#conname_login").hide();
		$("#formDescriptionSender").hide();
	}
	else{
		$("#conname").hide();
		$("#conemail").hide();
		$("#formDescriptionName").hide();
		$("#formDescriptionEmail").hide();
		$("#conname_login").show();
		fillLoginFields();
	}
	$("#SendButton").click(sendForm);
	$("#contactform").submit(sendForm);
}

function loadCaptcha(){
	Recaptcha.create("6Ldg7sASAAAAAOz6GnBiyL-LowhB_6PXF4pPQTb8",
		    "recaptcha_div",
		    {
		      theme: "clean",
		      lang: "de"
		    }
		  );
	/*var RecaptchaOptions = {
		    theme : 'custom',
		    custom_theme_widget: 'recaptcha_div'
		 };
	
	var RecaptchaString = "<div id='recaptcha_image'></div>" +
			"<div class='recaptcha_only_if_incorrect_sol'>Bot?!?</div> " +
			"<input type='text' id='recaptcha_response_field' name='recaptcha_response_field' />"; */
}

function clearLoginField(){
	$("#conname_login").hide();
	$("#formDescriptionSender").hide();
	$("#conname").show();
	$("#conemail").show();
	$("#formDescriptionName").show();
	$("#formDescriptionEmail").show();
}

function fillLoginFields(){
	var nameString = "<div id='formUserPicture'><img src='"+logindata.image+"'></div>" +
			"<div id='absInfo'>"+
			"<div id='formUserName'>"+logindata.nickname+"</div>" +
			"<div id='formUserEmail'>"+logindata.email+"</div>"+
					"</div><div id='formDeleteBtn'></div>"; 
	$("#conname_login").html(nameString);
	$("#conname").val(logindata.nickname);
	$("#conemail").val(logindata.email);
	$("#formDeleteBtn").click(clearLoginField);
	$("#formDeleteBtn").hide();
	$("#conname_login").mouseenter(toggleDeleteBtn);
	$("#conname_login").mouseleave(toggleDeleteBtn);
}

function toggleDeleteBtn(){
	$("#formDeleteBtn").fadeToggle(300);
}

function sendForm(){
	var response = $("#recaptcha_response_field").val();
	var challenge = $("#recaptcha_challenge_field").val();
	var message = $("#conmessage").val();
	var subject = $("#conbetreff").val();
	var email = $("#conemail").val();
	var name = $("#conname").val();
	
	$.ajax({
		url:"/anycook/SendForm",
		data:"challenge="+challenge+"&response="+response+"&name="+name+"&email="+email+"&message="+message+"&subject="+subject,
		success:function(response){
			if(response=="true"){
				formShowSuccess();
			}
			else{
				formShowFail();
			}
	}
	});
	
	return false;
}

function formShowSuccess(){
	$("#content_main > *").fadeOut(400, function(){
		$("#content_main").contents().empty();
		$("#content_main").append("<div id='new_recipe_ready' class='content_message'><h5>Danke!</h5><p>" +
		"Deine Nachricht wurde an uns gesendet.<br /> Wir benachrichtigen dich!</p></div>");
	});
	
}

function formShowFail(){
	Recaptcha.reload();
	$("#fromResponseField").empty();
	$("#fromResponseField").append("CAPTCHA bitte richtig eingeben! Oder bist du ein Bot?");
	
}
