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
	
	$("#formSubjectFieldFilter").click(showSubjects);
	$("#SendButton").click(sendForm);
	$("#contactform").submit(sendForm);
}


function showSubjects(){
	$("#formSubjectChoice").toggle();
	$("#formSubjectChoice").toggleClass("on");
	if($("#formSubjectChoice").hasClass("on")){
		$("#formSubjectChoice li").mouseenter(subjectOver).click(subjectClick);
		$(document).click(subjectClose);
	}
	else{
		$("#formSubjectChoice li").unbind("mouseenter", subjectOver).unbind("click", subjectClick);
		$(document).unbind("click", subjectClose);
	}
	return false;
}

function subjectOver(event){
	$("#formSubjectFieldName").empty();
	var target = $(event.target);	
	var text = target.text();
	$("#formSubjectFieldName").append(text);
}

function subjectClose(){
	$("#formSubjectChoice").hide();
	$("#formSubjectChoice").removeClass("on");
}


function subjectClick(event){
	var target = $(event.target);	
	var text = target.text();
	$("#conbetreff").val(text);
	$("#formSubjectChoice").toggle();
	$("#formSubjectChoice").toggleClass("on");
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
		$("#content").click(readyClick);
		window.setTimeout(readyClick, 4000);
	});
	
}

function formShowFail(){
	Recaptcha.reload();
	$("#fromResponseField").empty();
	$("#fromResponseField").append("CAPTCHA bitte richtig eingeben! Oder bist du ein Bot?");	
}

