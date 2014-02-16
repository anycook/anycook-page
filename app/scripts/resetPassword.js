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
	'title'
], function($, AnycookAPI, title){
	'use strict';
	return {
		loadStep1 : function(){
			$.address.title('Passwort zurücksetzen | anycook');
			$('#resetpwstep2').hide();
			$('#resetpwform1').submit($.proxy(this.submitForm1, this));
		},
		submitForm1 : function(event){
			event.preventDefault();

			var $errorfield = $('#resetpwmail').parent('td').siblings('.error');
			$errorfield.text('');
			
			var mailorname = $('#resetpwmail').val();
			if(mailorname === '' || mailorname === ' ') {
				//TODO show error message
				return;
			}

			AnycookAPI.session.resetPasswordRequest(mailorname, function(){
				$('.error_message').removeClass('on');
				$('#send_mail').addClass('on');
			}, function(response){
				if(response.status === 400){
					$('#send_mail').removeClass('on');
					$('#no_user').addClass('on');
				}
				/*else if(response === 'fbuser'){
					errortext = 'Passwort eines FB-Users kann nicht geändert werden';
				}*/
			});
		},
		loadStep2: function(){
			title.set('Passwort zurücksetzen');
			$('#resetpwstep1').hide();
			$('#resetpwform2').submit($.proxy(this.submitForm2, this));
		},
		submitForm2 : function(){
			event.preventDefault();

			var errorfield = $('#resetpw1').parent('td').siblings('.error');
			errorfield.text('');
			var pw1 = $('#resetpw1').val();
			var pw2 = $('#resetpw2').val();
			
			
			if(pw1.length<5){
				errorfield.text('Passwort zu kurz! Min. 5 Stellen.');
				return false;
			}
			if(pw1 !== pw2){
				errorfield.text('Passwörter nicht gleich!');
			}
			
			var id = $.address.pathNames()[1];
			AnycookAPI.session.resetPassword(id, pw1, function(){
				$('#content_main').html('<div id="new_activation" class="content_message">' +
					'<h5>Passwort wurde geändert</h5>'+
					'<p>Dein Passwort wurde geändert. Weiterhin viel Spass!');
			}, function(){
				errorfield.text('Fehler! Bitte versuche es nocheinmal');
			});
		}
	};
});