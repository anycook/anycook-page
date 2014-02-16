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
	'classes/User'
], function($, AnycookAPI, User){
	'use strict';
	return {
		buildLogin : function(){
			/*initMenus();
			$('#signin_btn').click(clickSignin);
			$('#login_container form').submit(submitForm);*/
			var self = this;

			$.get('/templates/login.erb', function(template){
				$('body').append(template);
				$('#signin_btn, #login_menu .blackOverlay, #login_menu a').click(self.toggle);
				$('#login_menu form').submit(self.submitForm);
			});
		},
		toggle : function(){
			$('#login_menu').toggleClass('visible');
			$('#signin_btn').toggleClass('focus');
		},
		/*initMenus : function(){
			//loginmenu
			$('#login_container form').submit(submitForm);
			$('#facebook_login').click(fbLogin);
			$('.social').click(clickSignin);
			$('#stayloggedin div').click(function(){
				var checkbox = $('#stayloggedin input');
				checkbox.attr('checked', !checkbox.attr('checked'));
			});
		},*/
		//called if #signin_btn is clicked
		focusInputs : function(event){
			var target = $(event.target);
			$('#login_mail').removeClass('wrong').removeClass('right'); // von Max
			$('#login_pwd').removeClass('wrong').removeClass('right');
			if(target.attr('id') === 'login_mail' &&
				$('#login_mail').val() === 'E-mail' ||
				target.attr('id') === 'login_pwd' &&
				$('#login_pwd').val() === 'Passwort' ||
				target.attr('id') === 'login_username' &&
				$('#login_username').val() === 'Username'){

				target.val('').css('color', '#5a5a5a');
			}
		},
		focusoutInputs : function(event){
			var target = $(event.target);
			if(target.attr('id') === 'login_mail' && target.val() === ''){
				target.val('E-mail').css('color', '#b5b5b5');
			}
			if(target.attr('id') === 'login_pwd' && target.val() === ''){
				target.val('Passwort').css('color', '#b5b5b5');
			}
			if(target.attr('id') === 'login_username' && target.val() === ''){
				target.val('Username').css('color', '#b5b5b5');
			}
		},
		submitForm : function(){
			//event.preventDefault();
			var $this = $(this);
			var $mail = $this.find('input[type="text"]');
			var $pwd = $this.find('input[type="password"]');
			
			var mail = $mail.val();
			var pwd = $pwd.val();
			var stayloggedin =$('#stayloggedin input').is(':checked');
			AnycookAPI.session.login(mail, pwd, stayloggedin, function(){
				User.init();
				//TODO code Login behavior
				location.reload();
			},
			function(){
				$('#login_menu .errorMsg').addClass('visible');
			});
		}
	};
});
