//class User
function User(){
	this.level = -1;
	this.name = null;
	this.mail = null;
	this.facebook_id = null;
	this.image = null;
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
			}
				
		}
	});
	return user;
};



User.prototype.checkLogin = function(){
	return this.name != null;
};




User.login = function(mail, pwd, stayloggedin){
	var data = "mail="+mail+"&pwd="+pwd;
	if(stayloggedin)
		data+="&stayloggedin";
	$.ajax({
		url:"/anycook/Login",
		data:data,
		success:function(response){
			if(response=="false"){
				$("#login_mail, #login_pwd").addClass("wrong");
			}
			else{
				if($.address.pathNames().length == 0 || $.address.pathNames()[0] == "home"){
					user = User.init();
					makeUsermenuText();
					$("#login_dropdown").hide();
					$("#signin_btn").removeClass("on");
				}
				else
					window.location.reload();
			}
	}
	});
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
				$("#login_dropdown").hide();
				$("#signin_btn").removeClass("on");
				makeRegisterPopup(username, mail);
			}
	}});
};


