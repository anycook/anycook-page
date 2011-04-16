function fbLogin(){
	FB.login(function(response) {
	    if (response.session) {
	    	if(user.checkLogin()){
	    		/*if($.address.pathNames().length == 0 || $.address.pathNames()[0] == "home"){
	    			user = User.init();
	    			makeUsermenuText();
	    			$("#login_dropdown").hide();
	    		}
	    		else
	    			window.location.reload();*/
	    	}
	    	else{
	    		$("#login_dropdown").hide();
	    		$("#signin_btn").removeClass("on");
	    		makeFBkRegistrationPopup();
	    	}
	    	
	    } else {
	      // TODO The user has logged out, and the cookie has been cleared
	    	//alert("false");
	    }
	  });
}

function fbSessionChange(event){
	if(event.status == "connected" && !user.checkLogin()){
		if($.address.pathNames().length == 0 || $.address.pathNames()[0] == "home"){
			user = User.init();
			makeUsermenuText();
			$("#login_dropdown").hide();
			$("#signin_btn").removeClass("on");
		}
		else
			window.location.reload();
	}
	if((event.status == "unknown" || event.status == "notConnected") && user.checkLogin()){
		user.logout();
	}
}

function loadFBRegistrationMessage(){
	var response = $.address.parameter("response");
	var headline;
	var text;
	switch(response){
	case "success":
		headline="Hey, "+user.name+"!";
		text="Vielen Dank für deine Anmeldung.";
		break;
	case "exists":
		headline="Fehler!";
		text="Dein Username oder deine Emailadresse existieren bereits in unserer Datenbank. " +
				"Solltest du dich bereits ohne Facebook angemeldet haben musst du noch ein wenig Geduld haben. " +
				"Demnächst wird es auch möglich sein einen bestehenden Account mit Facebook zu verknüpfen.";
		break;
	default:
		headline = "Fehler!";
		text = "Bei deiner Registrierung mit Facebook ist leider ein Fehler aufgetreten. " +
				"Bitte sende eine Feedbacknachricht mit dem Inhalt der Addresszeile deines Browsers an uns.";
	}
	
	$("#fbregister_message h5").text(headline);
	$("#fbregister_message p").text(text);
}