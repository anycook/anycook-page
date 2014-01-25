/**
 * @license This file is part of anycook. The new internet cookbook
 * Copyright (C) 2014 Jan Graßegger
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see [http://www.gnu.org/licenses/].
 * 
 * @author Jan Graßegger <jan@anycook.de>
 */
define([
	'jquery', 
	'classes/User'
], function($, User){
	'use strict';

	return {
		buildLogin : function(){
			/*initMenus();
			$("#signin_btn").click(clickSignin);
			$("#login_container form").submit(submitForm);*/
			var self = this;

			$.get("/templates/login.erb", function(template){
				$("body").append(template);
				$("#signin_btn, #login_menu .blackOverlay, #registrationBtn").click(self.toggle);
				$("#login_menu form").submit(self.submitForm);
			});		
		},
		toggle : function(){
			$("#login_menu").toggleClass("visible");
			$("#signin_btn").toggleClass("focus");
		},
		initMenus : function(){
			//loginmenu
			$("#login_container form").submit(submitForm);	
			$("#facebook_login").click(fbLogin);
			$(".social").click(clickSignin);
			$("#stayloggedin div").click(function(){
				var checkbox = $("#stayloggedin input");
				checkbox.attr('checked', !checkbox.attr('checked'));
			});
		},
		//called if #signin_btn is clicked
		clickSignin : function(event){
			var $main = $("#main");
			if($main.hasClass("down")){
				$(document).unbind("click",clickOthers).unbind("scroll", clickOthers);
			}else{
				$(document).click(clickOthers).scroll(clickOthers);
			}
			
			$main.toggleClass("down");
			
		},
		clickOthers : function(event){
			var $target = $(event.target);
			if (event.type == "scroll" || !$target.parents().andSelf().is("#login_container, #signin_btn")|| $target.is("a")){
				clickSignin();
			}
		},
		focusInputs : function(event){
			var target = $(event.target);
			$("#login_mail").removeClass("wrong").removeClass("right"); // von Max
			$("#login_pwd").removeClass("wrong").removeClass("right");
			if(target.attr("id") == "login_mail" && $("#login_mail").val() == "E-mail" || target.attr("id") == "login_pwd" && $("#login_pwd").val() == "Passwort" || target.attr("id") == "login_username" && $("#login_username").val() == "Username"){
				target.val("").css("color", "#5a5a5a");
			}
		},
		focusoutInputs : function(event){
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
		},
		submitForm : function(event){
			//event.preventDefault();
			var $this = $(this);
			var $mail = $this.find("input[type=\"text\"]");
			var $pwd = $this.find("input[type=\"password\"]");
			
			var mail = $mail.val();
			var pwd = $pwd.val();
			var stayloggedin =$("#stayloggedin input").is(":checked");
			$.anycook.api.session.login(mail, pwd, stayloggedin, function(json){
				User.init();
				//TODO code Login behavior
				location.reload();
			},
			function(error){
				$("#login_menu .errorMsg").addClass("visible");
			});
		},
		// registration
		showRegistration : function(){
			$("#showpassword").click(showPassword);
			$("#reg_email").keyup(function(){checkEmail(false);});
			$("#reg_pass").keyup(function(){checkPassword(false);});
			$("#reg_username").keyup(function(){checkUsername(false);});
			$("#reg_form").submit(submitRegistration);
		},
		showPassword : function(){
			var pass = $("#reg_pass").val();
			if($("#reg_pass").attr("type") == "password"){
				$("#reg_pass").after("<input type=\"text\" id=\"reg_pass\" value=\""+pass+"\" />");
			}else{
				$("#reg_pass").after("<input type=\"password\" id=\"reg_pass\" value=\""+pass+"\" />");
			}
			$("#reg_pass").first().remove();
		},
		checkEmail : function(showerror){
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
		},
		checkPassword : function(showerror){
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
		},
		checkUsername : function(showerror){
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
			
		},
		submitRegistration : function(event){
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
		},
		showRegistrationStep2 : function(username, mail){
			$("#reg_step2 h1").text("Hey "+username+"!");
			var domain = mail.split("@")[1];
			$.anycook.api.session.getMailProvider(domain, function(json){
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
	}
});
