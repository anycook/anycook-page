$(document).ready(function() {
	$.when($.anycook.graph.init({appid:2, baseUrl: "http://10.1.0.200"})).then(function(){
		$.anycook.graph.session(function(response){
			if(response != false){
				var urlVars = getUrlVars();
				var redirect = urlVars["redirect"];
					if(redirect !== undefined){
						redirect = decodeURIComponent(redirect);
						var oauthToken = urlVars["oauth_token"];
						
						if(oauthToken !== undefined){
							redirect += "?oauth_token="+oauthToken;
						}
						window.location = redirect;
					}
						
			}
		});
		
		$("#loginForm").submit(function(event) {
			event.preventDefault();
			var username = $("#username").val();
			var password = $("#password").val();
			var stayloggedin = true;
			$.anycook.graph.session.login(username, password, stayloggedin, function(response){
				if(response.name){
					if(getUrlVars()["redirect"])
						window.location = redirect;
						
				}
				else
					alert("login failed");
			});
		});
		
		$("#facebook").click(function() {
			fbLogin();
		});
		
		//Facebook
		FB.init({
		    appId  : '143100952399957',
		    status : true, // check login status
		    cookie : true, // enable cookies to allow the server to access the session
		    xfbml  : true //, // parse XFBML
		    //oauth  : true // enable OAuth 2.0
	  });
		FB.Event.subscribe("auth.sessionChange", fbSessionChange);
	});
});



	function getUrlVars() {
	    var vars = {};
	    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	        vars[key] = value;
	    });
	    return vars;
	}



