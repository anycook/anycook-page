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
				user.level = Number(response.level);
				user.mail = response.mail;
				user.facebook_id = response.facebookID;
				user.text = response.text;
				user.following = response.following;
				
			}
				
		},
		error:function(jqXHR, textStatus, errorThrown){
			console.error(jqXHR);
		}
	});
	return user;
};



User.initProfileInfo = function(id){
	var profileUser = new User();
	$.ajax({
		url:"/anycook/GetProfileInfo",
		data:"userid="+id,
		async:false,
		dataType: "json",
		success:function(json){
			if(json!=null){
				profileUser.id = json.id;
				profileUser.name = json.name;
				profileUser.facebook_id = json.facebookID;
				profileUser.schmeckt = json.schmeckt;
				profileUser.recipes = json.recipes;
				profileUser.text = json.text;
				profileUser.date = json.createdate;
				profileUser.place = json.place;
				profileUser.discussionnum = json.discussionnum;
				profileUser.numfollower = json.numfollower;
				
			}
		},
		error:function(jqXHR, textStatus, errorThrown){
			console.error(textStatus, jqXHR.responseText);
		}
	});
	
	return profileUser;
};

User.getProfileURI = function(id){
	var uri = "#!/profile/"+id;
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

User.getUserImagePath = function(userid, type){
	if(type == undefined)
		type = "small";
		
	//TODO change to real graph-api path
	return "http://testgraph.anycook.de/user/"+userid+"/image?type="+type;
}

User.prototype.getUserImagePath = function(type){
	if(type == undefined)
		type = "small";
		
	//TODO change to real graph-api path
	return "http://testgraph.anycook.de/user/"+this.id+"/image?type="+type;
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
			},
			error:function(jqXHR, textStatus, errorThrown){
				alert(textStatus+": "+errorThrown);
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


