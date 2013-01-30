(function( $ ){
	
	if(!$.anycook)
		$.anycook = {};
	
	$.anycook.registration = function(mail, username, password,callback){
		var graph = "/user";
		var data = {username:username, mail:mail, password:password};
		return $.anycook.graph._put(graph,data,callback);
	}
		
	$.anycook.registration.checkMail =function(mail, callback){
		var graph = "/user/mail";
		var data = {mail:mail};
		return $.anycook.graph._get(graph, data, callback);		
	}
	
	$.anycook.registration.checkUsername =function(username, callback){
		var graph = "/user/name";
		var data = {username:username};
		return $.anycook.graph._get(graph, data, callback);		
	}
	
	$.anycook.registration.activate = function(activationKey, callback){
		var graph = "/session/activate";
		var data = {activationkey:activationKey};
		return $.anycook.graph._post(graph, data, callback);
	}
	
})(jQuery);