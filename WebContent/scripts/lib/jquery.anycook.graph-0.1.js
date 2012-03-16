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
	
	$.anycook.graph._postMessage = function(graph, data){
		if(!graph) graph = "";
		if(!data) data = {};
		
		
		
		var settings = $.anycook.graph._settings();
		
		var $iframe = $("#"+settings.frameId);
		var message = {target:graph, data:data};
		$iframe.get(0).contentWindow.postMessage(JSON.stringify(message), settings.baseurl);
		
		// if(callback){
			// var callbackFunction = function(event){
				// window.removeEventListener("message", callbackFunction, false);
				// callback(event);
			// };
			// window.addEventListener("message", callbackFunction, false);
		// }
		
		// $.extend(data, {appid : settings.appid});
// 		
		// return $.ajax({
			// url:settings.baseurl+graph,
			// type:"POST",
			// crossDomain:true,
			// data:data});
	}
	
	$.anycook.graph.init = function(options){
		var settings = {
			appid: -1,
			baseurl: "http://graph.anycook.de",
			callbackName: "callback",
			frameId:"anycook-graph-frame"
		};
		
		if(options)
			$.extend(settings, options);
		
		var $div = $("<div></div>").css({height:0, width:0})
			.append("<iframe id=\""+settings.frameId+"\" src=\""+settings.baseurl+"\"></iframe>");
		$("#anycook-root").append($div);
		
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
			graph+="/"+recipe;
		if(version)
			graph+="/"+version;
		$.when($.anycook.graph._getJSON(graph)).then(function(json){
			dfd.resolve(json);
			if(callback)
				callback(json);
		});			
		
		return dfd.promise();
	};
	
	//saveRecipe(recipename, dataJSON [, callback])
	$.anycook.graph.saveRecipe = function(recipename, recipeData, tags, userid, callback){
		var dfd = $.Deferred();
		var graph = "/recipe/"+recipename;
		var data = {};
		data.recipe = JSON.stringify(recipeData);
		data.tags = JSON.stringify(tags);
		data.userid = userid;
		$.when($.anycook.graph._postMessage(graph, data)).then(function(response){
			dfd.resolve(response);
			if(callback)
				callback(response);
		});
		
		return dfd.promise();
	}
	
	$.anycook.graph.recipeImagePath = function(recipe, type){
		var settings = $.anycook.graph._settings();
		if(!type)
			type = "small";
		return settings.baseurl+"/recipe/"+recipe+"/image?type="+type+"&appid="+settings.appid;
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
	
	//follow(userid)
	$.anycook.graph.follow = function(userid){
		var graph = "/user/"+userid+"/follow";
		$.anycook.graph._postMessage(graph);
	}
	
	//unfollow(userid)
	$.anycook.graph.unfollow = function(userid){
		var graph = "/user/"+userid+"/unfollow";
		$.anycook.graph._postMessage(graph, data);
	}
	
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
	
	$.anycook.graph.suggestTags = function(recipename, tags, userid, callback){
		var graph = "/recipe/"+recipename;
		var data = {tags:JSON.stringify(tags), userid:userid};
		$.anycook.graph._postMessage(graph, data);
	}
	
	//login(username, password, stayloggedin [,callback])
	$.anycook.graph.login = function(username, password, stayloggedin, callback){
		var dfd = $.Deferred();
		var graph = "/session/login";
		var data = {username:username, password:password};
		if(stayloggedin)
			data.stayloggedin = "";
		$.when($.anycook.graph._getJSON(graph, data)).then(function(json){
			dfd.resolve(json);
			if(callback)
				callback(json);
		});
		
		return dfd.promise();
	}
	
	//logout([callback])
	$.anycook.graph.logout = function(callback){
		var dfd = $.Deferred();
		var graph = "/session/logout";
		$.when($.anycook.graph._getJSON(graph)).then(function(json){
			dfd.resolve(json);
			if(callback)
				callback(json);
		});
		
		return dfd.promise();
	}
	
	//getSession([callback])
	$.anycook.graph.getSession = function(callback){
		var dfd = $.Deferred();
		var graph = "/session";
		$.when($.anycook.graph._getJSON(graph)).then(function(json){
			dfd.resolve(json);
			if(callback)
				callback(json);
		});
		
		return dfd.promise();
	}
	
	//getNewsstream([lastdate [, callback]])
	$.anycook.graph.getNewsstream = function(){
		var lastdate;
		var callback;
		switch(arguments.length){
		case 2:
			var type2 = typeof arguments[1];
			if(type2 == "function")
				callback = arguments[1];
		
		case 1:
			var type1 = typeof arguments[0];
			if(type1 == "string" || type1 == "number")
				lastdate = Number(arguments[0]);
			else if(type1 == "function")
				callback = arguments[0];	
		}
		var dfd = $.Deferred();
		var graph = "/message";
		var data = {lastchange:lastdate};
		$.when($.anycook.graph._getJSON(graph, data)).then(function(json){
			dfd.resolve(json);
			if(callback)
				callback(json);
		});
		
		return dfd.promise();
	}
	
	//getMessageSession(sessionid [,lastid] [,callback])
	$.anycook.graph.getMessageSession = function(sessionid){
		var callback;
		var lastid = -1;
		
		switch(arguments.length){
		case 3:
			var type2 = typeof arguments[2];
			if(type2 == "function")
				callback = arguments[2];
		case 2:
			var type1 = typeof arguments[1];
			if(type1 == "number" || type1 == "string")
				lastid = Number(arguments[1]);
			else if(type1 == "function")
				callback = arguments[1];
		}
		
		var dfd = $.Deferred();
		var graph = "/message/"+sessionid;
		var data = {lastid : lastid};
		$.when($.anycook.graph._getJSON(graph, data)).then(function(json){
			dfd.resolve(json);
			if(callback)
				callback(json);
		});
		
		return dfd.promise();
	}
	
	//getMessageNum([lastnum] [,callback])
	$.anycook.graph.getMessageNum = function(){
		var lastnum = -1;
		var callback;
		
		switch(arguments.length){
		case 2:
			var type2 = typeof arguments[1];
			if(type2 == "function")
				callback = arguments[1];
		case 1:
			var type1 = typeof arguments[0];
			if(type1 == "number" || type1 == "string")
				lastnum = Number(arguments[0]);
			else if(type1 == "function")
				callback = arguments[1];
		}
		
		var dfd = $.Deferred();
		var graph = "/message/number";
		var data = {lastnum : lastnum};
		$.when($.anycook.graph._getJSON(graph, data)).then(function(json){
			dfd.resolve(json);
			if(callback)
				callback(json);
		});
		
		return dfd.promise();
	};
	
	//writeMessage(sessionid, text, [,callback])
	$.anycook.graph.writeMessage = function(sessionid, text, callback){
		var graph = "/message/"+sessionid;
		var data = {message:text};
		$.anycook.graph._postMessage(graph, data);
	}
	
	//writeNewMessage(recipients, text [, callback])
	$.anycook.graph.writeNewMessage = function(recipients, text, callback){
		var graph = "/message";
		var data = {message:text, recipients:JSON.stringify(recipients)};
		$.anycook.graph._postMessage(graph, data);
	}
	
	//readMessage(sessionid, messageid [,callback])
	$.anycook.graph.readMessage = function(sessionid, messageid, callback){
		var graph = "/message/"+sessionid+"/"+messageid;
		$.anycook.graph._postMessage(graph);
	}
	
	//getRecommendations([callback])
	$.anycook.graph.getRecommendations = function(callback){
		var graph = "/user/recommendations";
		var dfd = $.Deferred();
		$.when($.anycook.graph._getJSON(graph)).then(function(json){
			dfd.resolve(json);
			if(callback)
				callback(json);
		});		
		return dfd.promise();
	}
	
	//checkSchmeckt(recipename, [callback])
	$.anycook.graph.checkSchmeckt = function(recipename, callback){
		var graph = "/recipe/"+recipename+"/schmeckt";
		var dfd = $.Deferred();
		$.when($.anycook.graph._getJSON(graph)).then(function(json){
			dfd.resolve(json);
			if(callback)
				callback(json);
		});		
		return dfd.promise();
	}
	
	//schmeckt(recipename)
	$.anycook.graph.schmeckt = function(recipename){
		var graph = "/recipe/"+recipename+"/schmeckt";
		$.anycook.graph._postMessage(graph);
	}
	
	//schmecktnicht(recipename)
	$.anycook.graph.schmecktnicht = function(recipename){
		var graph = "/recipe/"+recipename+"/schmecktnicht";
		$.anycook.graph._postMessage(graph);
	}
	
	//discover([callback])
	$.anycook.graph.discover = function(callback){
		var graph = "/discover";
		var dfd = $.Deferred();
		$.when($.anycook.graph._getJSON(graph)).then(function(json){
			dfd.resolve(json);
			if(callback)
				callback(json);
		});		
		return dfd.promise();
	}
	
	
	//discussion
	
	//getDiscussion(recipename [, callback])
	$.anycook.graph.getDiscussion = function(recipename, lastid, callback){
		var graph = "/discussion/"+recipename;
		var data = {lastid:lastid};
		var dfd = $.Deferred();
		$.when($.anycook.graph._getJSON(graph, data)).then(function(json){
			dfd.resolve(json);
			if(callback)
				callback(json);
		});		
		return dfd.promise();
	}
	
	//discuss(recipename, text, [, parentid] [, callback])
	$.anycook.graph.discuss = function(recipename, text){
		var graph = "/discussion/"+recipename;
		var data = {comment:text};
		var callback;
		switch(arguments.length){
		case 4:
			callback = arguments[3];
		case 3:
			var type = typeof arguments[2];
			if(type == "function")
				callback = arguments[2];
			else
				data.pid = Number(arguments[2]);
		}
		
		$.anycook.graph._postMessage(graph, data);
	}
	
	//settings
	
	$.anycook.graph.getSettings = function(callback){
		var graph = "/session/settings";
		var dfd = $.Deferred();
		$.when($.anycook.graph._getJSON(graph)).then(function(json){
			dfd.resolve(json);
			if(callback)
				callback(json);
		});		
		return dfd.promise();
	}
	
})( jQuery );