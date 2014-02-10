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
		load : function(){
			title.set('Über uns');
			this.setTimeSinceStart();
			this.setWebsiteData();
		},
		setWebsiteData : function(){
			var self = this;
			if($.address.pathNames()[0] === 'about_us'){
				$.when(AnycookAPI.user.number(),
					AnycookAPI.tag.number(),
					AnycookAPI.ingredient.number(),
					AnycookAPI.recipe.number())
				.then(function(numUsers, numTags, numIngredients, numRecipes){
					$('.usercounter').text(numUsers[0]);
					$('.tagcounter').text(numTags[0]);
					$('.ingredientcounter').text(numIngredients[0]);
					$('.recipecounter').text(numRecipes[0]);
					setTimeout($.proxy(self.setWebsiteData, self), 5000);
				});
			}
		},
		setTimeSinceStart : function(){
			if($.address.pathNames()[0] === 'about_us'){
				var now = new Date();
				var startDate = new Date(2011, 1, 20, 13,14);
				var difference = now - startDate;
				var oneYear = 1000*60*60*24*365;
				var oneDay = 1000*60*60*24;
				var oneHour = 1000*60*60;
				var oneMin = 1000*60;
				var oneSec = 1000;
				
				var years = Math.floor(difference/oneYear);
				difference = difference % oneYear;
				var days = Math.floor(difference/oneDay ) ;
				difference = difference % oneDay;
				var hours = Math.floor(difference/oneHour ) ;
				difference = difference % oneHour;
				var min = Math.floor(difference/oneMin );
				difference = difference % oneMin;
				var sec = Math.floor(difference/oneSec);
				
				var $onlinetime = $('#online_time');
				
				if(years>0){
					$onlinetime.children('.years').show().children('span').text(years);
				}
				$onlinetime.children('.days').text(days);
				$onlinetime.children('.hours').text(hours);
				$onlinetime.children('.minutes').text(min);
				$onlinetime.children('.seconds').text(sec);
				
				setTimeout($.proxy(this.setTimeSinceStart, this), 1000);
			}
		}
	};
});
