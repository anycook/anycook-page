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
	'AnycookAPI'
], function($, AnycookAPI){
	'use strict';
	return {
		show : function(){
			$('#showpassword').click($.proxy(this.showPassword, this));
			$('#reg_email').keyup($.proxy(this.checkEmail, this));
			$('#reg_pass').keyup($.proxy(this.checkPassword, this));
			$('#reg_username').keyup($.proxy(this.checkUsername, this));
			$('#reg_form').submit($.proxy(this.submit, this));
		},
		showPassword : function(){
			var pass = $('#reg_pass').val();
			if($('#reg_pass').attr('type') === 'password'){
				$('#reg_pass').after('<input type="text" id="reg_pass" value="'+pass+'" />');
			}else{
				$('#reg_pass').after('<input type="password" id="reg_pass" value="'+pass+'" />');
			}
			$('#reg_pass').first().remove();
		},
		checkEmail : function(showerror){
			$('#reg_error_mail').removeClass('right').removeClass('wrong').text('');
			var mail = $('#reg_email').val();
			var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			var checker = false;
			var dfd = $.Deferred();
			if (filter.test(mail)){
				AnycookAPI.registration.checkMail(mail, function(response){
					if(response === true){
						$('#reg_error_mail').addClass('wrong').text('schon vorhanden');
					}
					else{
						$('#reg_error_mail').addClass('right').text('OK!');
						checker = true;
					}
					dfd.resolve(checker);
				});
			}else if(showerror){
				$('#reg_error_mail').addClass('wrong').text('keine gültige Mailadresse');
				dfd.resolve(checker);
			}else{
				dfd.resolve(checker);
			}
			return dfd.promise();
		},
		checkPassword : function(showerror){
			$('#reg_error_pass').removeClass('right').removeClass('wrong').text('');
			var passRegex = /((?=.*\d)(?=.*[a-zA-Z@#$%]).{6,})/;
			var passwd = $('#reg_pass').val();
			if(passRegex.test(passwd)){
				$('#reg_error_pass').addClass('right').text('OK!');
				return true;
			}else if(showerror){
                if (passwd.length < 6) {
				    $('#reg_error_pass').addClass('wrong').text('zu kurz');
                } else {
                    $('#reg_error_pass').addClass('wrong').text('muss Zahlen und Buchstaben enthalten');
                }
			}
			return false;
		},
		checkUsername : function(showerror){
			$('#reg_error_user').removeClass('right').removeClass('wrong').text('');
			var username = $('#reg_username').val();
			var checker = false;
			var dfd = $.Deferred();
			if(username.length >2){
				AnycookAPI.registration.checkUsername(username, function(response){
					if(response === true){
						$('#reg_error_user').addClass('wrong').text('schon vorhanden');
					}
					else{
						$('#reg_error_user').addClass('right').text('OK!');
						checker = true;
					}
					dfd.resolve(checker);
				});
			}else if(showerror){
				$('#reg_error_user').addClass('wrong').text('zu kurz');
				dfd.resolve(checker);
			}else{
				dfd.resolve(checker);
			}
			return dfd.promise();

		},
		submit : function(event){
			event.preventDefault();

			var checker = true;
			var self = this;
			$.when(this.checkEmail(true), this.checkUsername(true)).then(function(check1, check2){
				if(!check1 || !check2 || !self.checkPassword(true)){
					checker = false;
				}

				if(checker){
					var mail = $('#reg_email').val();
					var username = $('#reg_username').val();
					var password = $('#reg_pass').val();
					AnycookAPI.registration(mail, username, password, function(){
						self.showStep2(username,mail);
					});

				}
			});
		},
		showStep2 : function(username, mail){
			$('#reg_step2 h1').text('Hey '+username+'!');
			var domain = mail.split('@')[1];
			AnycookAPI.session.getMailProvider(domain, function(json){
				if(json){
					var image = json.image;
					var shortname = json.shortname;
					var fullname = json.fullName;
					var redirect = json.redirect;
					$('#reg_step2').append('<p id="register_forward">Wir können dich auch direkt <a href="'+redirect+'" target="_blank">weiterleiten</a>!</div><div id="register_mailprovider"><a href="'+redirect+'" target="_blank"><img src="./img/maillogos/'+image+'" alt="'+shortname+'"/></a><div id="register_copyright">&copy; '+fullname+'</div></p>');
				}
				$('#reg_step1').animate({left:-655}, {
					step:function(now){
						$('#reg_step2').css('left',now+655);
					},
					duration:1000
				});
			});
		}
	};
});
