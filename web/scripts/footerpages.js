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

function loadAboutUs(){
	setTimeSinceStart();
	setWebsiteData();
}

function setWebsiteData(){
	if($.address.pathNames()[0] == "about_us"){
		$.when($.anycook.api.user.number(),
			$.anycook.api.tag.number(),
			$.anycook.api.ingredient.number(),
			$.anycook.api.recipe.number())
		.then(function(numUsers, numTags, numIngredients, numRecipes){
			$(".usercounter").text(numUsers[0]);
		  	$(".tagcounter").text(numTags[0]);
		  	$(".ingredientcounter").text(numIngredients[0]);
		  	$(".recipecounter").text(numRecipes[0]);
		  	setTimeout(setWebsiteData,5000);
		});
		  	
	}
}

function setTimeSinceStart(){
	
	if($.address.pathNames()[0] == "about_us"){
		var now = new Date();
		var startDate = new Date(2011, 1, 20, 13,14);
		var difference = now - startDate;
		var one_year=1000*60*60*24*365;
		var one_day=1000*60*60*24;
		var one_hour=1000*60*60;
		var one_min= 1000*60;
		var one_sec= 1000;
		
		var years = Math.floor(difference/one_year);
		difference = difference % one_year;		
		var days = Math.floor(difference/one_day);
		difference = difference % one_day;
		var hours = Math.floor(difference/one_hour);
		difference = difference % one_hour;
		var min = Math.floor(difference/one_min);
		difference = difference % one_min;
		var sec = Math.floor(difference/one_sec);
		
		var $onlinetime = $("#online_time");
		
		if(years>0){
			$onlinetime.children(".years").show().children("span").text(years);			
		}
		$onlinetime.children(".days").text(days);
		$onlinetime.children(".hours").text(hours);
		$onlinetime.children(".minutes").text(min);
		$onlinetime.children(".seconds").text(sec);
		
		setTimeout("setTimeSinceStart()",1000);
	}
	
	
	
}

function loadImpressum(){
	$("#content_main").appendGitHub("anycook/anycook-content/contents/impressum.md");
}
