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
	'FB',
	'classes/User',
	'popup',
	'userMenu'
], function($, FB, User, popup, userMenu){
	'use strict';
	return {
		login : function(){
			FB.login(function(response) {
				if (response.authResponse) {
					$.when(User.init()).then(function(user){
						if(user.checkLogin()){
							// if($.address.pathNames().length == 0 || $.address.pathNames()[0] == 'home'){
							// 	user = User.init();
							// 	makeUsermenuText();
							// 	$('#login_dropdown').hide();
							// }
							// else
							window.location.reload();
						}
						else{
							$('#login_dropdown').hide();
							$('#signin_btn').removeClass('on');
							popup.makeFBkRegistration();
						}
					});
				} else {
					// TODO The user has logged out, and the cookie has been cleared
					//alert('false');
				}
			});
		},
		sessionChange : function(event){
			var user = User.get();
			if(event.status === 'connected' && !user.checkLogin()){
				if($.address.pathNames().length === 0 || $.address.pathNames()[0] === 'home'){
					user = User.init();
					userMenu.makeText();
					$('#login_dropdown').hide();
					$('#signin_btn').removeClass('on');
				}
				else {
					window.location.reload();
				}
			}
			if((event.status === 'unknown' || event.status === 'notConnected') && user.checkLogin()){
				user.logout();
			}
		},
		loadRegistrationMessage : function(){
			var response = $.address.parameter('response');
			var headline;
			var text;
			var user = User.get();
			switch(response){
			case 'success':
				headline='Hey, '+user.name+'!';
				text='Vielen Dank für deine Anmeldung.';
				break;
			case 'exists':
				headline='Fehler!';
				text='Dein Username oder deine Emailadresse existieren bereits in unserer Datenbank. ' +
						'Solltest du dich bereits ohne Facebook angemeldet haben musst du noch ein wenig Geduld haben. ' +
						'Demnächst wird es auch möglich sein einen bestehenden Account mit Facebook zu verknüpfen.';
				break;
			default:
				headline = 'Fehler!';
				text = 'Bei deiner Registrierung mit Facebook ist leider ein Fehler aufgetreten. ' +
						'Bitte sende eine Feedbacknachricht mit dem Inhalt der Addresszeile deines Browsers an uns.';
			}
			
			$('#fbregister_message h5').text(headline);
			$('#fbregister_message p').text(text);
		},
		extendPermissions : function(){
			//TODO add appid
			var fbAppID = 0;
			var redirecturl = 'http://anycook.de/';
			var permissionurl = 'http://www.facebook.com/dialog/oauth?client_id=' +
				fbAppID + '&redirect_uri=' + encodeURI(redirecturl) + '&scope=email,publish_stream,offline_access';
			top.location.href=permissionurl;
			
		}
	};
});