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