//class User
function User(){
	this.level = -1;
	this.name = null;
	this.mail = null;
	this.facebook_id = null;
	this.image = null;
	this.schmeckt = null;
	this.recipes = null;
	this.text = null;
}

User.init = function(){
	var user = new User();
	$.ajax({
		url: "/anycook/Login",
		async: false,
		dataType: "json",
		success: function(response){
			if(response != false){
				user.name = response.name;
				user.level = Number(response.level);
				user.mail = response.mail;
				user.facebook_id = response.facebookID;
				user.image = response.image;
				user.text = response.text;
			}
				
		},
		error:function(jqXHR, textStatus, errorThrown){
			console.error(jqXHR);
		}
	});
	return user;
};



User.initProfileInfo = function(username){
	var profileUser = new User();
	$.ajax({
		url:"/anycook/GetProfileInfo",
		data:"username="+encodeURIComponent(username),
		async:false,
		dataType: "json",
		success:function(json){
			if(json!=null){
				profileUser.name = json.name;
				profileUser.image = json.image;
				profileUser.facebook_id = json.facebookID;
				profileUser.schmeckt = json.schmeckt;
				profileUser.recipes = json.recipes;
				profileUser.text = json.text;
				profileUser.date = json.createdate;
				profileUser.place = json.place;
				profileUser.discussionnum = json.discussionnum;
				
			}
		},
		error:function(jqXHR, textStatus, errorThrown){
			console.error(textStatus, jqXHR.responseText);
		}
	});
	
	return profileUser;
};

User.getProfileURI = function(username){
	var uri = "#!/profile/"+encodeURIComponent(username);
	return uri;
};

User.prototype.getFacebookProfileLink = function(){
	return "http://www.facebook.com/people/@/"+this.facebook_id;
};


User.prototype.checkLogin = function(){
	return this.name != null;
};

User.prototype.onlyUserAccess = function(){
	if(!this.checkLogin())
		$.address.value("");
	else
		return true;
	return false;
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

User.prototype.getSmallImage = function(){
	if(this.facebook_id != "0")
		return "http://graph.facebook.com/"+this.facebook_id+"/picture";
	
	return "/userbilder/small/"+this.image;
};

User.prototype.getLargeImage = function(){
	if(this.facebook_id != "0")
		return "http://graph.facebook.com/"+this.facebook_id+"/picture?type=large";
	
	return "/userbilder/big/"+this.image;
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


