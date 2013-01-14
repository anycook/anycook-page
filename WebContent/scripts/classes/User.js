//class User
function User(){
	this.level = -1;
	this.name = null;
	this.mail = null;
	this.facebook_id = null;
	this.schmeckt = null;
	this.recipes = null;
	this.text = null;
	this.following = null;
	this.follower = null;
	this.id = null;
	this.schmeckt = [];
	this.place = null;
}

User.init = function(){
	var dfd = $.Deferred();
	var user = new User();
	var dereffered = $.anycook.graph.session();
	dereffered.done(function(response){
			if(response != false){
				user.id = response.id;
				user.name = response.name;
				user.schmeckt = response.schmeckt;
				user.level = Number(response.level);
				user.mail = response.mail;
				user.facebook_id = response.facebookID;
				user.text = response.text;
				user.following = response.following;
				user.place = response.place;
			}
			dfd.resolve(user);
				
	});
	
	return dfd.promise();
};



User.initProfileInfo = function(id){
	var dfd = $.Deferred();
	
	
	$.when($.anycook.graph.user(id)).then(function(json){
		var profileUser = new User();
		profileUser.id = json.id;
		profileUser.name = json.name;
		profileUser.facebook_id = json.facebookID;
		profileUser.schmeckt = json.schmeckt;
		profileUser.text = json.text;
		profileUser.date = json.createdate;
		profileUser.place = json.place;
		profileUser.discussionnum = json.discussionnum;
		profileUser.follower = json.follower;
		profileUser.following = json.following;
		
		dfd.resolve(profileUser);
	});
	
	return dfd.promise();
};

User.getProfileURI = function(id){
	var uri = "#!/profile/"+id;
	return uri;
};

User.prototype.getProfileURI = function(){
	var uri = "#!/profile/"+this.id;
	return uri;
};

User.prototype.getFacebookProfileLink = function(){
	return "http://www.facebook.com/people/@/"+this.facebook_id;
};

User.prototype.getRecipes = function(callback){
	return User.getRecipes(this.id, callback);
}

User.getRecipes = function(userid, callback){
	var data = {userid:userid};
	return $.anycook.graph.recipe(data,callback);
}

User.prototype.getSchmecktRecipes = function(callback){
	return $User.getSchmecktRecipes(this.id, callback);
}

User.getSchmecktRecipes = function(userid, callback){
	return $.anycook.graph.user.schmeckt(userid,callback);
}

User.getDiscussionNum = function(userid, callback){
	return $.anycook.graph.user.discussionNum(userid, callback);
}



User.prototype.checkLogin = function(){
	return this.id != null;
};

User.prototype.onlyUserAccess = function(){
	if(!this.checkLogin())
		$.address.value("");
	else
		return true;
	return false;
};


User.prototype.isFollowing = function(userid){
	for(var i in this.following)
		if(this.following[i].id == userid) return true;
	return false;
}

User.prototype.isFollowedBy = function(userid){
	for(var i in this.follower)
		if(this.follower[i].id == userid) return true;
	return false;
}

User.getUserImagePath = function(userid, type){
	return $.anycook.graph.user.image(userid, type);
}

User.prototype.getUserImagePath = function(type){
	return $.anycook.graph.user.image(this.id, type);
};

User.login = function(mail, pwd, stayloggedin){
	var callback = false;
	$.anycook.graph.login(mail, pwd, stayloggedin, function(response){
			callback = response!="false";
			// checkNewMessageNum();
	});
	
	return callback;
};

User.prototype.logout = function(){
	if(this.checkLogin()){
		this.level = -1;
		this.name = null;
		this.mail = null;
		this.facebook_id = null;
		this.image = null;
		$.anycook.graph.logout(function(){
			FB.getLoginStatus(function(response){
				if(response.status == "connected"){
					FB.logout(function() {
						  window.location.reload();
						});
				}else
					window.location.reload();
			});
		});
	}
};

User.register = function(mail, pwd, username){
	
	 $.ajax({
		url:"/anycook/NewUser",
		data:"mail="+mail+"&pwd="+pwd+"&username="+username,
		success:function(response){
			if(response=="true"){
				showRegistrationStep2(username,mail);
			}
	}});
};


