

function login(mail, pwd){	
	$.ajax({
		url:"/anycook/Login",
		data:"mail="+mail+"&pwd="+pwd,
		success:function(response){
			if(response=="false"){
				$("#login_mail, #login_pwd").addClass("wrong");
			}
			else{
				$("#login_dropdown").hide();
				$("#signin_btn").removeClass("on");
				//makeUsermenuText(response);
				
				window.location.reload();
			}
	}
	});
}

function loginChecker(){
	
	var logincheck = false;
	$.ajax({
		url: "/anycook/Login",
		async: false,
		dataType: "json",
		success: function(response){
			if(response != false){
				if(logindata == null){
					logindata = new Object();
					for(var i in response)
						logindata[i] = response[i];
				}
				logincheck = true;
			}
				
		}
	});
	return logincheck;
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


function logout(){
		$.ajax({
			url:"/anycook/Logout",
			success:function(){
				FB.getLoginStatus(function(response){
					if(response.status == "connected"){
						FB.logout(function(response) {
							  window.location.reload();
							});
					}else
						window.location.reload();
				});	
			}
		});
		
}

function checkLogin(response){
	$(document).click(clickOthers);
	$("#login_container > *").remove();
	var htmlstring = "<div id='signin_btn'></div><div id='login_dropdown'></div>";
	
	$("#login_container").append(htmlstring);
	$("#login_dropdown").hide();
	$("#login_dropdown").css("visibility", "visible");
	$("#signin_btn").click(clickSignin);
	if(response== false){
		makeLoginText();
	}
	else{
		if(logindata == null){
			logindata = new Object();
			for(var i in response)
				logindata[i] = response[i];
		}
		makeUsermenuText(response);
	}
	
}

function register(mail, pwd, username){
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
}

function makeLoginText(){
	$("#login_top>*").remove();
	$("#signin_btn").html("Sign in<div id='login_arrow'></div>");
	
	//old
	/*var htmlstring = "<form id='login_form'><input type='text' name='email' id='login_mail' value='E-mail' autocomplete='on'/><div id='email_end'></div>"+
								"<input type='password' name='password' id='login_pwd' value='Passwort' autocomplete='on'/><div id='password_end'></div><div id='register_btn' class='btn_style'>registrieren</div><div id='login_btn' class='btn_style'>anmelden</div>"+
								"</form>";*/
	
	//new facebook plugin
	var htmlstring = "<div id='fb_login'>einloggen mit <div class='fb_logo'></div></div><form id='login_form'><input type='text' name='email' id='login_mail' value='E-mail' autocomplete='on'/><div id='email_end'></div>"+
	"<input type='password' name='password' id='login_pwd' value='Passwort' autocomplete='on'/><div id='password_end'></div><div id='register_btn' class='btn_style'>registrieren</div><div id='login_btn' class='btn_style'>anmelden</div>"+
	"</form>";
	
		
	

	$("#login_dropdown").append(htmlstring);
	//FB.XFBML.parse(document.getElementById('login_top'));
	$("#login_mail, #login_pwd").focus(focusInputs);		
	$("#login_mail, #login_pwd").focusout(focusoutInputs);
	$("#login_mail, #login_pwd").keypress(keypressInputs);
	$("#login_mail, #login_pwd").keydown(keydownInputs);
	
	
	$("#login_btn").click(clickLogin);
	$("#login_form").submit(submitForm);
	
	$("#register_btn").click(clickRegister);
	$("#fb_login").click(fbLogin);
	//FB.XFBML.parse();

}

function makeUsermenuText(json){
	$("#login_top>*").remove();
	$("#signin_btn").html("Konto<div id='login_arrow'></div>");
	
	var htmlstring = "<div id='login_user'><div id='user'><img src='"+json.image+"'/><p>"+json.nickname+"</p></div><a href='#' id='settings' class='user_menu_btn'>Einstellungen</a>"+
		"<a id='cookbook' class='user_menu_btn'>Mein Kochbuch</a><a class='user_menu_btn' href='#/newrecipe'>Neues Rezept erstellen</a>";
	if(json.level == "2")
		htmlstring+="<a href='/backend/admin.html' class='user_menu_btn'>Backend</a>";
	htmlstring+="<a id='logout' class='user_menu_btn'>Abmelden</a></div>";
	$("#login_dropdown").html(htmlstring);	
	$("#logout").click(logout);
	$("#login_user > a").click(closeUserMenu);
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
	var position = target.prev().position();
	target.prev().before("<div id='error_login'><div id='error_login_left'>"+text+"</div><div id='error_login_right'></div></div>");
	var errorcontainer = target.prev().prev();
	errorcontainer.css("top", position.top+8);
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
	$("#login_dropdown").hide();
	$("#signin_btn").removeClass("on");
}

//called if #signin_btn is clicked
function clickSignin(event){
	if($("#login_username").length > 0){
		$("#login_username, #username_end").remove();
		$("#register_btn, #login_btn").removeClass("on");
	}
	$("#login_dropdown").toggle();
	$("#login_form").css("height", 81);
	$("#signin_btn").toggleClass("on");
	$("#login_btn").addClass("on");	
	return false;
}

function clickLogin(event){
	if($("#login_btn").hasClass("on"))
		$("#login_form").submit();
	else{
		$("#register_btn, #login_btn").toggleClass("on");
		$("#login_username").val("");
		$("#login_username, #username_end").animate({"height":0, "opacity":.0, "margin":0},{duration:500, complete:function(){$("#login_username, #username_end").remove();}});
		$("#login_form").animate({"height":81},500);			
	}
}

function clickRegister(event){
	//new facebookstuff
	/*var htmlstring = "<fb:registration"+
	  " fields=\"name,email\" "+ 
		  "redirect-uri=\"http://localhost:8080/anycook/NewUser\" "+
		  "width=\"300\">"+
		"</fb:registration>";
	
	$("#login_top").html(htmlstring);
	//FB.XFBML.parse(document.getElementById('login_top'));
	*/
	
	//old
	if($("#register_btn").hasClass("on")){
		$("#login_form").submit();
	}
	else{
		$("#login_mail, #login_pwd").removeClass("wrong");
		$("#register_btn, #login_btn").toggleClass("on");
		$("#password_end").after("<input type='text' name='username' id='login_username'/><div id='username_end'></div>");
		$("#login_username, #username_end").css("height",0).css("opacity",.0);
		$("#login_form").animate({"height":116},{duration:500, queue:false});
		$("#login_username, #username_end").animate({"height":25, "opacity":1},{duration:500, complete:function(){$("#login_username").val("Username");}});
		//$("#fb_login").text("r")
		
		$("#login_username").focus(focusInputs);		
		$("#login_username").focusout(focusoutInputs);
		$("#login_username").keypress(keypressInputs);
	}
}

function clickOthers(event){
	var target = event.target;
	if ($(target).parents("#login_container").length == 0 && $("#signin_btn").hasClass("on")){
		$("#login_dropdown").hide();
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
		if($("#login_username").length == 0)
			login(mail, pwd);
		else{
			var username = $("#login_username").val();
			register(mail, pwd, username);
		}
	}
	
	return false;
}
var loginerrors = new Object();
var logindata  = null;
