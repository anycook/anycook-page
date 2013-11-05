
function buildLogin(){
	/*initMenus();
	$("#signin_btn").click(clickSignin);
	$("#login_container form").submit(submitForm);*/
	$.get("/templates/login.erb", function(template){
		$("body").append(template);
		$("#signin_btn").click(toggleLoginMenu);
		$("#login_menu form").submit(submitForm);
	});		
};

function toggleLoginMenu(){
		var $loginMenu = $("#login_menu");
		var $loginBtn = $("#signin_btn");
		if($loginMenu.hasClass("visible")){
			$loginMenu.removeClass("visible");
			$loginBtn.removeClass("focus");
		}else{
			//var buttonOffset = $loginBtn.offset();
			//$loginMenu.css({top:buttonOffset.top+27,left:buttonOffset.left-150});
			$loginMenu.addClass("visible");
			$loginBtn.addClass("focus");
		}
}

function initMenus(){
	//loginmenu
	$("#login_container form").submit(submitForm);	
	$("#facebook_login").click(fbLogin);
	$(".social").click(clickSignin);
	$("#stayloggedin div").click(function(){
		var checkbox = $("#stayloggedin input");
		checkbox.attr('checked', !checkbox.attr('checked'));
	});
}

function makeUsermenuText(){
	$("#signin_btn").hide();
	$(".user_btn").show();
	
	var $userSettings = $("#user_settings").click(toggleUserMenu);
	
	var $userMenu = $("#user_menu");
	$userMenu.find("img").attr("src", User.getUserImagePath(user.id));
	var $profileLink = $("<a></a>").text(user.name).attr("href", user.getProfileURI());
	$userMenu.find(".username").append($profileLink);
	$userMenu.find("#logout").click(function(){
		user.logout();
	});
	
	if(user.level == 2)
		$userMenu.find(".admin").show();
	
	$(document).click(hideUserMenu).scroll(hideUserMenu);
	
	// $("#signin_btn span").text("Konto");
// 	
	// $("#user img").attr("src", user.getSmallImage());
	// $("#user a+a").text(user.name);
// 	
	// if(user.level == 2){
		// $("#admin_menu").show();		
		// $("#extend_permissions").click(fbExtendPermissions);		
	// }
	
}

function toggleUserMenu(){
		var $userMenu = $("#user_menu");
		var $this = $(this);
		if($userMenu.hasClass("visible")){
			$userMenu.removeClass("visible");
			$this.removeClass("focus");
		}else{
			var buttonOffset = $this.offset();
			$userMenu.css({top:buttonOffset.top+27,left:buttonOffset.left-150});
			$userMenu.addClass("visible");
			$this.addClass("focus");
		}
}

function hideUserMenu(event){
	var $userMenu = $("#user_menu");
	var $target = $(event.target);
	if (event.type === "scroll" || !$target.parents().andSelf().is("#user_settings")|| $target.is("a")){
		$userMenu.removeClass("visible");
		$("#user_settings").removeClass("focus");
	}
	
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

//called if #signin_btn is clicked
function clickSignin(event){
	var $main = $("#main");
	if($main.hasClass("down")){
		$(document).unbind("click",clickOthers).unbind("scroll", clickOthers);
	}else{
		$(document).click(clickOthers).scroll(clickOthers);
	}
	
	$main.toggleClass("down");
	
}

function clickOthers(event){
	var $target = $(event.target);
	if (event.type == "scroll" || !$target.parents().andSelf().is("#login_container, #signin_btn")|| $target.is("a")){
		clickSignin();
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


function submitForm(event){
	event.preventDefault();
	var $this = $(this);
	var $mail = $this.find("input[type=\"text\"]");
	var $pwd = $this.find("input[type=\"password\"]");
	
	var mail = $mail.val();
	var pwd = $pwd.val();
	var stayloggedin =$("#stayloggedin input").is(":checked");
	$.anycook.graph.session.login(mail, pwd, stayloggedin, function(json){
		if(!json){
			console.log("login failed");
			return;
		}
		user = User.init();
		//TODO code Login behavior
		location.reload();
	});
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
	var dfd = $.Deferred();
	if (filter.test(mail)){
		$.anycook.registration.checkMail(mail, function(response){
			if(response === true){
				$("#reg_error_mail").addClass("wrong").text("schon vorhanden");
			}
			else{
				$("#reg_error_mail").addClass("right").text("OK!");
				checker = true;
			}
			dfd.resolve(checker);
		});
	}else if(showerror){
		$("#reg_error_mail").addClass("wrong").text("keine gültige Mailadresse");
		dfd.resolve(checker);
	}else{
		dfd.resolve(checker);
	}
	return dfd.promise();
}

function checkPassword(showerror){
	$("#reg_error_pass").removeClass("right").removeClass("wrong").text("");
	var passRegex = /((?=.*\d)(?=.*[a-zA-Z@#$%]).{6,})/
	var passwd = $("#reg_pass").val();
	if(passRegex.test(passwd)){
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
	var dfd = $.Deferred();
	if(username.length >2){
		$.anycook.registration.checkUsername(username, function(response){
			if(response === true)
				$("#reg_error_user").addClass("wrong").text("schon vorhanden");
			else{
				$("#reg_error_user").addClass("right").text("OK!");
				checker = true;
			}
			dfd.resolve(checker);
		});
	}else if(showerror){
		$("#reg_error_user").addClass("wrong").text("zu kurz");
		dfd.resolve(checker);
	}else{
		dfd.resolve(checker);
	}
	return dfd.promise();
	
}

function submitRegistration(event){
	var checker = true;
	$.when(checkEmail(true), checkUsername(true)).then(function(check1, check2){
		if(!check1 || !check2 || !checkPassword(true)) 
			checker = false;
	
		if(checker){
			var mail = $("#reg_email").val();
			var username = $("#reg_username").val();
			var password = $("#reg_pass").val();
			$.anycook.registration(mail, username, password, function(response){
				showRegistrationStep2(username,mail);
			});
			
		}
	});
	
	return false;
}

function showRegistrationStep2(username, mail){
	$("#reg_step2 h1").text("Hey "+username+"!");
	var domain = mail.split("@")[1];
	$.anycook.graph.session.getMailProvider(domain, function(json){
		if(json!=null){
			var image = json.image;
			var shortname = json.shortname;
			var fullname = json.fullname;
			var redirect = json.redirect;
			$("#reg_step2").append("<p id='register_forward'>Wir können dich auch direkt <a href='"+redirect+"' target='_blank'>weiterleiten</a>!</div><div id='register_mailprovider'><a href='"+redirect+"' target='_blank'><img src='./img/maillogos/"+image+"' alt='"+shortname+"'/></a><div id='register_copyright'>&copy; "+fullname+"</div></p>");
		}
		$("#reg_step1").animate({left:-655}, {
			step:function(now){
				$("#reg_step2").css("left",now+655);
			},
			duration:1000
		});
	});
}

var loginerrors = new Object();
var user  = new User();
