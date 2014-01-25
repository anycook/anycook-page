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

function loadContact(){
	if(!user.checkLogin()){
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
	$("#SendButton").click(function(){$("#contactform").submit();});
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
	var nameString = "<div id='formUserPicture'><img src='"+user.image+"'></div>" +
			"<div id='absInfo'>"+
			"<div id='formUserName'>"+user.name+"</div>" +
			"<div id='formUserEmail'>"+user.mail+"</div>"+
					"</div><div id='formDeleteBtn'></div>"; 
	$("#conname_login").html(nameString);
	$("#conname").val(user.name);
	$("#conemail").val(user.mail);
	$("#formDeleteBtn").click(clearLoginField);
	$("#formDeleteBtn").hide();
	$("#conname_login").mouseenter(toggleDeleteBtn);
	$("#conname_login").mouseleave(toggleDeleteBtn);
}

function toggleDeleteBtn(){
	$("#formDeleteBtn").fadeToggle(300);
}

function sendForm(){
	if(!checkFeedbackForm()) return false;
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

function checkFeedbackForm(){
	if($("#conmessage").val() =="") return false;
	
	if($("#conbetreff").val() == "Thema wählen") return false;
	
	return true;
}

function formShowSuccess(){
	$("#content_main > *").fadeOut(400, function(){
		$("#content_main").empty();
		$("#content_main").append("<div id='new_recipe_ready' class='content_message'><h5>Danke!</h5><p>" +
		"Deine Nachricht wurde an uns gesendet.<br /> Wir benachrichtigen dich!</p></div>");
		$("#content_main").click(readyClick);
		window.setTimeout(readyClick, 4000);
	});
	
}

function formShowFail(){
	Recaptcha.reload();
	$("#fromResponseField").empty();
	$("#fromResponseField").append("CAPTCHA bitte richtig eingeben! Oder bist du ein Bot?");	
}

function readyClick(){
	$("#new_recipe_ready").fadeOut(400, function(){
		$("#content_main").unbind("click");
		$.address.value("");
	});
}

