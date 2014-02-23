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
	'AnycookAPI',
	'classes/User',
	'imageUpload',
	'loginMenu'
], function($, AnycookAPI, User, imageUpload, loginMenu){
	'use strict';
	return {
		load : function(){
			$('#account_aboutme').inputdecorator('maxlength', {
				change:function(){}
			});

			$('#mail_form').submit($.proxy(this.setNewMail, this));
            $('#pass_form').submit($.proxy(this.changePassword, this));

			var user = User.get();
			this.loadAccount(user);
			this.loadNotifaction();

			var data = {
				complete : $.proxy(this.completeUpload, this)
			};
			$('#file_upload').change(data, $.proxy(imageUpload.user, imageUpload));


			$('#upload_button').click(function(event){
				event.preventDefault();
				$('#file_upload').trigger('click');
			});


			if(user.facebookID <= 0){
				$('#showpassword').click(function() {
					var $container = $('#new_password_container');
					var $password = $container.children('#password_new');
					var $newPassword = $password.clone();
					if($password.attr('type') === 'password'){
						$newPassword.attr('type', 'text');
					}
					else{
						$newPassword.attr('type', 'password');
					}

					$password.remove();
					$(this).before($newPassword);
				});
			}
		},
		loadAccount : function(user){
			$('.profile_image img').attr('src', user.getUserImagePath('large'));
			$('#account_name').val(user.name).blur($.proxy(this.saveAccount, this));
			$('#account_mail').val(user.mail);
			$('#account_aboutme').val(user.text).blur($.proxy(this.saveAccount, this));
			$('#account_place').val(user.place).blur($.proxy(this.saveAccount, this));

			if(user.emailCandidate){
				$('#new_mail').text(user.emailCandidate);
				$('#mail_candidate').addClass('on');
			}
			// $('#account_form').submit($.anycook.user.settings.changeAccount);
		},
		loadNotifaction : function(){
			var self = this;

			AnycookAPI.setting.notification(function(json){
				var checker = false;
				for(var type in json){
					if(json[type]){
						checker=true;
						$('#'+type+' input[type="checkbox"]').attr('checked', 'checked');
					}
				}

				var $bigCheckbox = $('#mail_notification input').change($.proxy(self.toggleNotifications, self));
				if(checker){
					$bigCheckbox.attr('checked', 'checked');
					$('#settings_notification_content').show();
				}

				$('#settings_notification_content input').change($.proxy(self.saveNotifications, self));
			});
		},
		toggleNotifications : function(event){
			var self = this;
			var $content = $('#settings_notification_content');
			var $smallCheckboxes = $('#settings_notification_content input');
			if(!$(event.target).is(':checked')){
				$content.animate({height:0}, {
					duration:700,
					easing:'easeInQuad',
					complete:function(){
						$(this).hide().css('height', '');
						$smallCheckboxes.attr('checked', '');
						self.saveNotifications();
					}
				});
			}else{
				var oldHeight = $content.height();
				$content.css('height', 0).show();
				$content.animate({height:oldHeight}, {
					duration:700,
					easing:'easeOutQuad',
					complete:function(){
						$(this).show().css('height', '');
						$smallCheckboxes.attr('checked', 'checked');
						self.saveNotifications();
					}
				});
			}
		},
		saveNotifications : function(){
			var notificationSettings = {};

			$('#settings_notification_content input').each(function(){
				var $this = $(this);
				var key = $this.val();
				notificationSettings[key] = $this.is(':checked');
			});

			AnycookAPI.setting.saveNotifications(notificationSettings);
		},
		completeUpload : function(){
			var $recipeImageContainer = $('.profile_image');
			$recipeImageContainer.children('img').remove();


			$recipeImageContainer.removeClass('visible').children('#progressbar').hide();
			$recipeImageContainer.children('.image_upload').show();
			var user = User.get();
			var $largeImg = $('<img/>').attr('src', user.getUserImagePath('large'));
			var $smallImg = $('<img/>').attr('src', user.getUserImagePath('small'));
			$('.profile_image').append($largeImg);
			$('#menu_profile_image').empty().append($smallImg);
		},
		saveAccount : function(event){
			var $target = $(event.target);
			var type;
			var value = $target.val();

			var user = User.get();
			var self = this;
			var callback = function(){
				user[type] = value;
				var $container = $('#profile_saved');
				self.saved($container);
			};

			switch($target.attr('id')){
				case 'account_name':
					type = 'name';
					if(value === user.name || value.length === 0 && user.name === null){
						return;
					}
					AnycookAPI.setting.setName(value, callback);
					break;
				case 'account_place':
					type = 'place';
					if(value === user.place || value.length === 0 && user.place === null){
						return;
					}
					AnycookAPI.setting.setPlace(value, callback);
					break;
				case 'account_aboutme':
					type = 'text';
					if(value === user.text || value.length === 0 && user.text === null){
						return;
					}
					AnycookAPI.setting.setText(value, callback);
					break;
			}
		},
		setNewMail : function(event){
			event.preventDefault();
			var self = this;
			var newMail = $('#account_mail').val();
			$('#settings_mail .error_message').removeClass('on');

			var user = User.get();
			if(!this.checkMail(newMail)){ $('#mail_validation').addClass('on');	}
			else if(newMail === user.mail){	$('#identical_mail').addClass('on'); }
			else {
				AnycookAPI.setting.setMail(newMail, function(){
					self.saved($('#mail_saved'));
					$('#new_mail').text(newMail);
					$('#mail_candidate').addClass('on');
				});
			}
		},
		confirmMail : function(code){
			var user = User.get();
			if(!user.checkLogin()){
				loginMenu.toggle();
				return;
			}

			AnycookAPI.setting.confirmMail(code, function(newMail){
				$('#newMail').text(newMail);
				user.mail = newMail;
			},
			function(){
				window.alert('Deine Emailaddresse konnte nicht geändert werden');
			});
		},
        changePassword : function(event){
            event.preventDefault();
            var oldPw = $("#password_old").val();
            var newPw = $("#password_new").val();

            $('#pass_form .error_message').removeClass('on');

            if(oldPw.length > 0 || newPw.length > 0){
                var self = this;
                if(!this.checkPwd(newPw)){ $('#failed_regex').addClass('on'); }
                else{
                    AnycookAPI.setting.changePassword(oldPw, newPw,
                    //success
                    function(){
                        self.saved($('#pwd_saved'));
                    },
                    //error
                    function(){
                        $('#wrong_password').addClass('on');
                    });
                }
            }
        },
		saved : function($container){
			$container.stop(true).fadeIn(500, function(){
				$container.delay(2000).fadeOut(500);
			});
		},
		checkMail : function(mail){
			var regex = /^(([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+)?$/;
			return regex.test(mail);
		},
		checkPwd : function(pwd){
			var regex = /((?=.*\d)(?=.*[a-zA-Z@#$%]).{6,20})/;
			return regex.test(pwd);
		}
	};

});
