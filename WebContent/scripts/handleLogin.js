
function buildLogin(){
	initMenus();
	$(document).click(clickOthers);
	$("#signin_btn").click(clickSignin);
		
};

function makeUsermenuText(){
	$("#signin_btn span").text("Konto");
	
	$("#user img").attr("src", user.image);
	$("#user a+a").text(user.name);
	
	if(user.level == 2){
		$("#admin_menu").show();		
		$("#extend_permissions").click(fbExtendPermissions);		
	}
	
}

function schmecktChecker(gericht){
	var schmecktcheck = false;
	$.ajax({
		url: "/anycook/CheckSchmeckt",
		data: "g="+gericht,
		async: false,
		success: function(response){
			if(response != "false")
				schmecktcheck = true;
		}
	});
	return schmecktcheck;
}

function initMenus(){
	//loginmenu
	$("#login_form").submit(submitForm);	
	$("#facebook_login").click(fbLogin);
	$("#social_login *").click(closeUserMenu);
	$("#stayloggedin span").click(function(){
		var checkbox = $("#stayloggedin input");
		checkbox.attr('checked', !checkbox.attr('checked'));
	});
	
	//usermenu
	if(user.checkLogin()){
		makeUsermenuText();
	}
	$("#logout").click(function(){
		user.logout();
	});	
}


function showLoginErrorPopups(event){
	var target = $(event.target);
	var text = "";
	if(!$("#register_btn").hasClass("on")){
		text = "Mail/Passwort falsch!";
	}
	else{
		if(target.attr("id")=="email_end")
			text = loginerrors["mail"];
		if(target.attr("id")=="password_end")
			text = loginerrors["password"];
		if(target.attr("id")=="username_end")
			text = loginerrors["username"];
		
	}
	var position = target.prev().offset();
	target.prev().before("<div id='error_login'><div id='error_login_left'>"+text+"</div><div id='error_login_right'></div></div>");
	var errorcontainer = target.prev().prev();
	errorcontainer.css("top", position.top);
	errorcontainer.css("left", position.left);
	errorcontainer.hide();
	errorcontainer.fadeIn(500);
}

function hideLoginErrorPopups(event){
	var target = $(event.target);
	var errorcontainer = target.prev().prev();
	errorcontainer.fadeOut(500, function(){errorcontainer.remove();});
}

function closeUserMenu(event){
	$(".login_dropdown").hide();
	$("#signin_btn").removeClass("on");
}

//called if #signin_btn is clicked
function clickSignin(event){
	if(user.checkLogin())
		$("#login_user").toggle();
	else
		$("#login_signin").toggle();
	$("#signin_btn").toggleClass("on");
	
	$("#login_signin input").removeClass("wrong");
	return false;
}

function clickOthers(event){
	var target = event.target;
	var a = $(target).is("a") || $(target).parents("a").length > 0;
	if ((a || $(target).parents("#login_container").length == 0) && $("#signin_btn").hasClass("on")){
		$(".login_dropdown").hide();
		$("#signin_btn").removeClass("on");
	}
}

function focusInputs(event){
	var target = $(event.target);
	$("#login_mail").removeClass("wrong").removeClass("right"); // von Max
	$("#login_pwd").removeClass("wrong").removeClass("right");
	if(target.attr("id") == "login_mail" && $("#login_mail").val() == "E-mail" || target.attr("id") == "login_pwd" && $("#login_pwd").val() == "Passwort" || target.attr("id") == "login_username" && $("#login_username").val() == "Username"){
		target.val("").css("color", "#5a5a5a");
	}
}

function focusoutInputs(event){
	var target = $(event.target);
	if(target.attr("id") == "login_mail" && target.val() == ""){
		target.val("E-mail").css("color", "#b5b5b5");
	}
	if(target.attr("id") == "login_pwd" && target.val() == ""){
		target.val("Passwort").css("color", "#b5b5b5");
	}
	if(target.attr("id") == "login_username" && target.val() == ""){
		target.val("Username").css("color", "#b5b5b5");
	}
}

/*function keypressInputs(event){
	var target = $(event.target);
	if(target.hasClass("wrong")){ // von Max
		$("#login_mail").removeClass("wrong").removeClass("right");
		$("#login_pwd").removeClass("wrong").removeClass("right");
	}
	if(event.keyCode==13){
		$("#login_form").submit();
	}
	else{
		if($("#login_username").length > 0){
			target.removeClass("wrong");
			target.removeClass("right");
			var val=target.val()+String.fromCharCode(event.keyCode);
			if(target.attr("id")=="login_username"){				
				if(val.length<3 || val.length>14){
					if(val.length<3)
						loginerrors["username"] = "zu kurz";
					else
						loginerrors["username"] = "zu lang";
					target.addClass("wrong");
				}
				else{
					$.ajax({
						url:"/anycook/NewUser",
						data:"username="+val,
						success:function(response){
							if(response == "false"){
								target.addClass("wrong");
								loginerrors["username"] = "schon vorhanden";
							}
							else
								target.addClass("right");
					}});
				}					
			}
			else if(target.attr("id")=="login_pwd"){				
				if(val.length<5 || val.length>16){
					loginerrors["password"] = "zu kurz";
					target.addClass("wrong");
				}
				else if(val.toLowerCase() == $("#login_username").val().toLowerCase()){
					target.addClass("wrong");
					loginerrors["password"] = "gleich Username";
				}
				else
					target.addClass("right");
			}
			else if(target.attr("id")=="login_mail"){
				var atposition = val.indexOf("@");
				var dotposition = val.indexOf(".");
				if(atposition<0 && dotposition<0){
					target.addClass("wrong");
					loginerrors["mail"] = "Keine Emailadresse";
				}
				else{
					$.ajax({
						url:"/anycook/NewUser",
						data:"mail="+val,
						success:function(response){
							if(response == "false"){
								target.addClass("wrong");
								loginerrors["mail"] = "schon vorhanden";
							}
							else
								target.addClass("right");
					}});
				}
			}
		}
	}
}

function keydownInputs(event){
	var target = $(event.target);
	if(event.keyCode == 8){
		if($("#login_username").length > 0){
			target.removeClass("wrong");
			target.removeClass("right");
			var val=target.val();
			if(val.lenght>1){
				if(target.attr("id")=="login_username"){				
					if(val.length<3 || val.lenght>14){
						target.addClass("wrong");
					}
					else{
						$.ajax({
							url:"/anycook/NewUser",
							data:"username="+val,
							success:function(response){
								if(response == "false")
									target.addClass("wrong");
								else
									target.addClass("right");
						}});
					}					
				}
				else if(target.attr("id")=="login_pwd"){
					if(val.length<5 || val.length>16){
						target.addClass("wrong");
					}
					else if(val.toLowerCase() == $("#login_username").val().toLowerCase())
						target.addClass("wrong");
					else
						target.addClass("right");
				}
				else if(target.attr("id")=="login_mail"){
					var atposition = val.indexOf("@");
					var dotposition = val.indexOf(".");
					if(atposition<0 && dotposition<0){
						target.addClass("wrong");
					}
					else{
						$.ajax({
							url:"/anycook/NewUser",
							data:"mail="+val,
							success:function(response){
								if(response == "false")
									target.addClass("wrong");
								else
									target.addClass("right");
						}});
					}
				}
			}
		}
	}
	
}*/


function submitForm(event){
	if(!$("#login_mail, #login_pwd, #login_username").hasClass("wrong")){
		var mail = $("#login_mail").val();
		var pwd = $("#login_pwd").val();
		var stayloggedin =$("#check_stayloggedin").is(":checked");
		if($("#login_username").length == 0)
			User.login(mail, pwd, stayloggedin);
	}
	
	return false;
}


// registration
function showRegistration(){
	$("#showpassword").click(showPassword);
	$("#reg_email").keyup(function(){checkEmail(false);});
	$("#reg_pass").keyup(function(){checkPassword(false);});
	$("#reg_username").keyup(function(){checkUsername(false);});
	$("#reg_form").submit(submitRegistration);
}

function showPassword(){
	var pass = $("#reg_pass").val();
	if($("#reg_pass").attr("type") == "password"){
		$("#reg_pass").after("<input type=\"text\" id=\"reg_pass\" value=\""+pass+"\" />");
	}else{
		$("#reg_pass").after("<input type=\"password\" id=\"reg_pass\" value=\""+pass+"\" />");
	}
	$("#reg_pass").first().remove();
}

function checkEmail(showerror){
	$("#reg_error_mail").removeClass("right").removeClass("wrong").text("");
	var mail = $("#reg_email").val();
	var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	var checker = false;
	if (filter.test(mail)){
		$.ajax({
			url:"/anycook/NewUser",
			data:"mail="+mail,
			async:false,
			success:function(response){
				if(response == "false"){
					$("#reg_error_mail").addClass("wrong").text("schon vorhanden");
				}
				else{
					$("#reg_error_mail").addClass("right").text("OK!");
					checker = true;
				}
			}});
	}else if(showerror){
		$("#reg_error_mail").addClass("wrong").text("keine gültige Mailadresse");
	}
	return checker;
}

function checkPassword(showerror){
	$("#reg_error_pass").removeClass("right").removeClass("wrong").text("");
	var passwd = $("#reg_pass").val();
	if(passwd.length>=5){
		$("#reg_error_pass").addClass("right").text("OK!");
		return true;
	}else if(showerror){
		$("#reg_error_pass").addClass("wrong").text("zu kurz");
	}
	return false;
}

function checkUsername(showerror){
	$("#reg_error_user").removeClass("right").removeClass("wrong").text("");
	var username = $("#reg_username").val();
	var checker = false;
	if(username.length >2){
		$.ajax({
			url:"/anycook/NewUser",
			async:false,
			data:"username="+username,
			success:function(response){
				if(response == "false")
					$("#reg_error_user").addClass("wrong").text("schon vorhanden");
				else{
					$("#reg_error_user").addClass("right").text("OK!");
					checker = true;
				}
		}});
	}else if(showerror){
		$("#reg_error_user").addClass("wrong").text("zu kurz");
	}
	return checker;
	
}

function submitRegistration(event){
	var checker = true;
	if(!checkEmail(true)) checker = false;
	if(!checkPassword(true)) checker = false;
	if(!checkUsername(true)) checker = false;
	
	if(checker){
		var mail = $("#reg_email").val();
		var username = $("#reg_username").val();
		var passwd = $("#reg_pass").val();
		User.register(mail, passwd, username);
	}
	return false;
}

function showRegistrationStep2(username, mail){
	$("#reg_step2 h1").text("Hey "+username+"!");
	var domain = mail.split("@")[1];
	$.ajax({
		url:"/anycook/CheckDomainforAnbieter",
		data:"domain="+domain,
		dataType:"json",
		async:false,
		success:function(json){
			if(json!=null){
				var image = json.image;
				var shortname = json.shortname;
				var fullname = json.fullname;
				var redirect = json.redirect;
				$("#reg_step2").append("<p id='register_forward'>Wir können dich auch direkt <a href='"+redirect+"' target='_blank'>weiterleiten</a>!</div><div id='register_mailprovider'><a href='"+redirect+"' target='_blank'><img src='./img/maillogos/"+image+"' alt='"+shortname+"'/></a><div id='register_copyright'>&copy; "+fullname+"</div></p>");
			}
		}
	});
	$("#reg_step1").animate({left:-655}, 1000);
	$("#reg_step2").animate({left:0}, 1000);
}

var loginerrors = new Object();
var user  = new User();
