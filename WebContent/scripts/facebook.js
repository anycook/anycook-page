function fbLogin(){
	FB.login(function(response) {
	    if (response.session) {
	    	if(loginChecker())
	    		window.location.reload();
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
	if(event.status == "connected" && logindata == null){
		window.location.reload();
	}
	if((event.status == "unknown" || event.status == "notConnected") && logindata != null){
		logout();
	}
}