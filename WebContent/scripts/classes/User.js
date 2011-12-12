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
}

User.init = function(){
	var user = new User();
	$.ajax({
		url: "/anycook/Login",
		async: false,
		dataType: "json",
		success: function(response){
			if(response != false){
				user.id = response.id;
				user.name = response.name;
				user.schmeckt = response.schmeckt;
				user.level = Number(response.level);
				user.mail = response.mail;
				user.facebook_id = response.facebookID;
				user.text = response.text;
				user.following = response.following;
				checkNewMessageNum();
			}
				
		}
	});
	return user;
};



User.initProfileInfo = function(id){
	var dfd = $.Deferred();
	
	
	$.when($.anycook.graph.user(id)).then(function(json){
		var profileUser = new User();
		profileUser.id = json.id;
		profileUser.name = json.name;
		profileUser.facebook_id = json.facebookID;
		profileUser.schmeckt = json.schmeckt;
		profileUser.recipes = json.recipes;
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
	return $.anycook.graph.userImagePath(userid, type);
}

User.prototype.getUserImagePath = function(type){
	return $.anycook.graph.userImagePath(this.id, type);
};

User.login = function(mail, pwd, stayloggedin){
	var callback = false;
	var data = "mail="+mail+"&pwd="+pwd;
	if(stayloggedin)
		data+="&stayloggedin";
	$.ajax({
		url:"/anycook/Login",
		data:data,
		async: false,
		success:function(response){
			callback = response!="false";
			checkNewMessageNum();
	}
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
		$.ajax({
			url:"/anycook/Logout",
			success:function(){
				FB.getLoginStatus(function(response){
					if(response.status == "connected"){
						FB.logout(function() {
							  window.location.reload();
							});
					}else
						window.location.reload();
				});
			}
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


