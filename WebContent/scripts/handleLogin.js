
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
		var htmlstring = "<p>";
		htmlstring+="<a href='/backend/admin.html' class='user_menu_btn'>Backend</a>";
		htmlstring+="<a id=\"extend_permissions\" class=\"user_menu_btn\">Extend Permissions(test)</a>";
		htmlstring+="</p>";
		
		$("#login_user p").first().after(htmlstring);
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

function keypressInputs(event){
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
	
}


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

function showRegistration(){
	var html = "<div id='registerpopup' class='popup'><div class='closepopup'></div><div id='register_headline'>Hey "+username+"!</div><div id='register" +
	"_text'>Vielen Dank für deine Anmeldung. Damit Du gleich loslegen kannst, müsstest Du noch deine E-Mail-Adresse bestätigen.</div></div><div class='background_popup'></div>";
	
	$("body").append();
}

var loginerrors = new Object();
var user  = new User();
