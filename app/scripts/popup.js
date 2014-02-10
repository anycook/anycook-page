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
	'FB'
], function($, FB){
	'use strict';
	return {
		show : function(headline, content){
			var $image = $('<img/>').attr('src', '/img/success_icon.png');
			var $h2 = $('<h1></h1>').text(headline);
			var $p = $('<p></p>').html(content);
			var $content = $('<div></div>').addClass('content')
				.append($h2)
				.append($p);
			var $div = $('<div></div>').addClass('fixedpopup')
				.append($image)
				.append($content);
				
			$('body').append($div);
		},
		center : function(){
			//request data for centering
			var windowWidth = document.documentElement.clientWidth;
			var windowHeight = document.documentElement.clientHeight;
			var popupHeight = $('.popup').height();
			var popupWidth = $('.popup').width();
			//centering  
			$('.popup').css({
				'position': 'absolute',
				'top': windowHeight/2-popupHeight/2,
				'left': windowWidth/2-popupWidth/2
			});
		},
		close : function(){
			$('.popup, .background_popup').fadeOut(800, function(){ $('.popup, .background_popup').remove(); });
		},
		makeFBkRegistration : function(){
			//$('#content_main').append('<div id='new_recipe_ready' class='content_message'><h5>Danke!</h5><p>Dein Rezept wird geprüft und anschließend veröffentlicht.<br /> Wir benachrichtigen dich!</p></div>');
			$('body').append('<div id="facebookpopup" class="popup"><div class="closepopup"></div><div id="fb_registration">' +
					'<fb:registration fields="name,email" redirect-uri="http://anycook.de/anycook/NewFacebookUser" width="500">'+
				'</fb:registration>' +
					'</div></div><div class="background_popup"></div>');
			
			FB.XFBML.parse(document.getElementById('registerpopup'));
			this.center();
			$('.popup, .background_popup').fadeIn(800);
			$('.background_popup, .closepopup').click($.proxy(this.close, this));
			//$('#registerpopup a').click(function(){$('#registerpopup').fadeOut(700, function(){$('#registerpopup').remove();});});
			
		}
	};
});