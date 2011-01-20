function centerPopup(){  
	//request data for centering  
	var windowWidth = document.documentElement.clientWidth;  
	var windowHeight = document.documentElement.clientHeight;  
	var popupHeight = $(".popup").height();  
	var popupWidth = $(".popup").width();  
	//centering  
	$(".popup").css({  
	"position": "absolute",  
	"top": windowHeight/2-popupHeight/2,  
	"left": windowWidth/2-popupWidth/2  
	});    
} 

function closePopup(){
	$(".popup, .background_popup").fadeOut(800, function(){$(".popup, .background_popup").remove();});
}

function makeRegisterPopup(username, mail){
	
	$("body").append("<div id='registerpopup' class='popup'><div class='closepopup'></div><div id='register_headline'>Hey "+username+"!</div><div id='register" +
			"_text'>Vielen Dank für deine Anmeldung. Damit Du gleich loslegen kannst, müsstest Du noch deine E-Mail-Adresse bestätigen.</div></div><div class='background_popup'></div>");
	
	var domain = mail.split("@")[1];
	$.ajax({
		url:"/anycook/CheckDomainforAnbieter",
		data:"domain="+domain,
		dataType:"json",
		success:function(json){
			if(json!=null){
				var image = json.image;
				var shortname = json.shortname;
				var fullname = json.fullname;
				var redirect = json.redirect;
				$("#registerpopup").append("<div id='register_forward'>Wir können dich auch direkt <a href='"+redirect+"' target='_blank'>weiterleiten</a>!</div><div id='register_mailprovider'><a href='"+redirect+"' target='_blank'><img src='./img/maillogos/"+image+"' alt='"+shortname+"'/></a><div id='register_copyright'>&copy; "+fullname+"</div></div>");
			}
		}
	});
	centerPopup();
	$(".popup, .background_popup").fadeIn(800);
	$(".background_popup, .closepopup").click(closePopup);
	$("#registerpopup a").click(function(){$("#registerpopup").fadeOut(700, function(){$("#registerpopup").remove();});});
	/*$(document).keypress(function(e){  
		if(e.keyCode==27)  
			closePopup();  
	});*/
}

function makeFBkRegistrationPopup(){
	//$("#content_main").append("<div id='new_recipe_ready' class='content_message'><h5>Danke!</h5><p>Dein Rezept wird geprÃ¼ft und anschlieÃŸend verÃ¶ffentlicht.<br /> Wir benachrichtigen dich!</p></div>");
	$("body").append("<div id='facebookpopup' class='popup'><div class='closepopup'></div><div id=\"fb_registration\">" +
			"<fb:registration fields=\"name,email\" redirect-uri=\"http://anycook.de/anycook/NewFacebookUser\" width=\"500\">"+
		"</fb:registration>" +
			"</div></div><div class='background_popup'></div>");
	
	FB.XFBML.parse(document.getElementById('registerpopup'));
	centerPopup();
	$(".popup, .background_popup").fadeIn(800);
	$(".background_popup, .closepopup").click(closePopup);
	//$("#registerpopup a").click(function(){$("#registerpopup").fadeOut(700, function(){$("#registerpopup").remove();});});
	
}