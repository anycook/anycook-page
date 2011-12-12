(function( $ ){
	if(!$.anycookgraph)
		$.anycookgraph = {};
	
	$.anycookgraph._settings = function(settings){
		if(settings)
			$(document).data("anycookgraph", settings);			
		else
			return $(document).data("anycookgraph");
	}
	
	$.anycookgraph._getJSON  = function(graph, data){
		if(!graph) graph = "";
		if(!data) data = {};
		
		var settings = $.anycookgraph._settings();
		data[settings.callbackName] = "?";		
		$.extend(data, {appid : settings.appid});
		
		return $.getJSON(settings.baseurl+graph, data);
		
	}
	
	$.anycookgraph.init = function(options){
		var settings = {
			appid: -1,
			baseurl: "http://graph.anycook.de",
			callbackName: "callback"
		};
		
		if(options)
			$.extend(settings, options);
		
		$.anycookgraph._settings(settings);
	};
	
	//recipes
	$.anycookgraph.recipes = function(){
		
		var recipe;
		var callback;
		switch(arguments.length){
		case 2:
			var type2 = typeof arguments[1];
			if(type2 == "function")
				callback = arguments[1];
		
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
		$.when($.anycookgraph._getJSON(graph)).then(function(json){
			dfd.resolve(json);
			if(callback)
				callback(json);
		});			
		
		return dfd.promise();
	};
	
	$.anycookgraph.recipeImagePath = function(recipe, type){
		var settings = $.anycookgraph._settings();
		if(!type)
			type = "small";
		return settings.baseurl+"/recipe/"+encodeURIComponent(recipe)+"/image?type="+type;
	}

})( jQuery );