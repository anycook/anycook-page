(function( $ ){
	
	if(!$.anycook)
		$.anycook = {};
	
	if(!$.anycook.graph)
		$.anycook.graph = {};
	
	$.anycook.graph._settings = function(settings){
		if(settings)
			$(document).data("anycook.graph", settings);			
		else
			return $(document).data("anycook.graph");
	}
	
	$.anycook.graph._getJSON  = function(graph, data){
		if(!graph) graph = "";
		if(!data) data = {};
		
		var settings = $.anycook.graph._settings();
		//data[settings.callbackName] = "?";		
		$.extend(data, {appid : settings.appid});
		
		return $.getJSON(settings.baseurl+graph+"?callback=?", data);
		
	}
	
	$.anycook.graph.init = function(options){
		var settings = {
			appid: -1,
			baseurl: "http://graph.anycook.de",
			callbackName: "callback"
		};
		
		if(options)
			$.extend(settings, options);
		
		$.anycook.graph._settings(settings);
	};
	
	//recipe([recipename,[versionnum]], [callback])
	$.anycook.graph.recipe = function(){
		
		var recipe;
		var callback;
		var version;
		switch(arguments.length){
		case 3:
			var type3 = typeof arguments[2];
			if(type3 == "function")
				callback = arguments[2];
			
		case 2:
			var type2 = typeof arguments[1];
			if(type2 == "function")
				callback = arguments[1];
			else if(type2 == "string" || type2 == "number")
				version = arguments[1];
		
		case 1:
			var type1 = typeof arguments[0];
			if(type1 == "string")
				recipe = arguments[0];
			else if(type1 == "function")
				callback = arguments[0];	
		}
		
		
		
		var dfd = $.Deferred();
		
		var graph = "/recipe";
		if(recipe)
			graph+="/"+encodeURIComponent(recipe);
		if(version)
			graph+="/"+version;
		$.when($.anycook.graph._getJSON(graph)).then(function(json){
			dfd.resolve(json);
			if(callback)
				callback(json);
		});			
		
		return dfd.promise();
	};
	
	$.anycook.graph.recipeImagePath = function(recipe, type){
		var settings = $.anycook.graph._settings();
		if(!type)
			type = "small";
		return settings.baseurl+"/recipe/"+encodeURIComponent(recipe)+"/image?type="+type+"&appid="+settings.appid;
	};
	
	
	//user([userid], [callback])
	$.anycook.graph.user = function(){
		var userid;
		var callback;
		switch(arguments.length){
		case 2:
			var type2 = typeof arguments[1];
			if(type2 == "function")
				callback = arguments[1];
		
		case 1:
			var type1 = typeof arguments[0];
			if(type1 == "string" || type1 == "number")
				userid = arguments[0];
			else if(type1 == "function")
				callback = arguments[0];	
		}
		
		
		
		var dfd = $.Deferred();
		
		var graph = "/user";
		if(userid !== undefined)
			graph+=("/"+userid);
		$.when($.anycook.graph._getJSON(graph)).then(function(json){
			dfd.resolve(json);
			if(callback)
				callback(json);
		});			
		
		return dfd.promise();
	};
	
	$.anycook.graph.userImagePath = function(user, type){
		var settings = $.anycook.graph._settings();
		if(!type)
			type = "small";
		return settings.baseurl+"/user/"+encodeURIComponent(user)+"/image?type="+type+"&appid="+settings.appid;
	};
	
	//search(querymap, [callback])
	$.anycook.graph.search = function(data, callback){
		
		
		var dfd = $.Deferred();
		var graph = "/search";
		$.when($.anycook.graph._getJSON(graph, data)).then(function(json){
			dfd.resolve(json);
			if(callback)
				callback(json);
		});
		
		return dfd.promise();
	};
	
	
	
	//category([category], [callback])
	$.anycook.graph.category = function(){
		var category;
		var callback;
		switch(arguments.length){
		case 2:
			var type2 = typeof arguments[1];
			if(type2 == "function")
				callback = arguments[1];
		
		case 1:
			var type1 = typeof arguments[0];
			if(type1 == "string")
				category = arguments[0];
			else if(type1 == "function")
				callback = arguments[0];	
		}
		
		
		
		var dfd = $.Deferred();
		
		var graph = "/category";
		if(userid)
			graph+="/"+category;
		$.when($.anycook.graph._getJSON(graph)).then(function(json){
			dfd.resolve(json);
			if(callback)
				callback(json);
		});			
		
		return dfd.promise();
	};
	
	
	

})( jQuery );