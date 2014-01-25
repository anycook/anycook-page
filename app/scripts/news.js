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

define(['jquery', 
	'classes/Recipe',
	'classes/User'], 
function($, Recipe, User){
	return {
		updateLiveAtHome : function(){
			var path = $.address.path();
			var newestid = this.getNewestId();
			
			if(path == "/"){
				var data = {newestid:newestid};
				var self = this;
				$.anycook.api.life(data,function(response){
					self.parseAndAddLiveAtHome(response);
					window.setTimeout(function(){self.updateLiveAtHome}, 5000);
				});
			}
		},
		getNewestId : function(){
			var newestid = $("#news li").first().data("id");
			if(newestid == undefined) newestid = 0;
			return Number(newestid);
		},
		parseAndAddLiveAtHome : function(json){
			var $ul = $("#news ul");
			if(json.length>0)
			{
				var newestid = this.getNewestId();
				var $container = $ul.find(".jspPane");
				if($container.length == 0)
					$container = $ul;
				
				var empty = false;
				if($ul.children().length == 0)
					empty = true;

				var newestRecipes = [];
				
				for(var i in json){
					
					var $li = this.parseLife(json[i]);
					if(Number(json[i].id) > newestid){				
						$container.prepend($li);
						if(json[i].recipe){
							newestRecipes.unshift(json[i].recipe);
						}
					} else{
						$container.append($li);
						if(json[i].recipe){
							newestRecipes.push(json[i].recipe);
						}
					}
						
					/*if(!empty){
						var oldMarginTop = $('#news_inhalt div:first').css('margin-top');
						var newMarginTop = 0 - $('#news_inhalt div:first').outerHeight();
						$ul.find("li").first().css({'margin-top': newMarginTop, 'opacity': 0})
							.animate({marginTop: oldMarginTop, opacity: 1});
					}*/
				}
				var active = $("#news .jspDrag").hasClass("jspActive");
				$ul.jScrollPane();
				if(active)
					$("#news .jspDrag").addClass("jspActive");

				var $p = $("#newestRecipes p");

				for(var i = 0; i<3 && i < newestRecipes.length; i++){
					//see jquery.recipeoverview.js
					var recipe = newestRecipes[i];
		      		var img = $.anycook.api.recipe.image(recipe);

		      		var $img = $("<img src=\""+img+"\"/>");

		      		var href = Recipe.getURI(recipe);
		      		var $a = $("<a></a>").attr("href", href)
		      			.append($img).append("<div><span>"+recipe+"</span></div>");

		      		$p.append($a);
				}
			}
		},
		parseLife : function(life){
			var text = life.syntax;
			var regex = /#[ug]/;
			var pos = text.search(regex);
			var userid = -1;
			while(pos>=0){
				if(text[pos+1]=="u"){
					var array = text.split("#u");
					text = "";
					for(var j = 0; j<array.length-1;++j){
						var uri = User.getProfileURI(life.user.id);
						userid = life.user.id;
						var link = "<a href=\""+uri+"\">"+life.user.name+"</a>";
						text+=array[j]+link;
					}
					text+=array[array.length-1];
				}
				else if(text[pos+1]=="g"){
					var array = text.split("#g");
					text = "";
					for(var j = 0; j<array.length-1;++j){
						var uri = encodeURI("/#!/recipe/"+life.recipe);
						var link = "<a href=\""+uri+"\">"+life.recipe+"</a>";
						text+=array[j]+link;
					}
					text+=array[array.length-1];
				}
					
				pos = text.search(regex);
			}

			var imagePath = User.getUserImagePath(userid, "small");
			
			var $li = $("<li></li>").append("<div class=\"left\"><img src=\""+imagePath+"\"></div><div class=\"right\"></div>").data("id", life.id);
			if(user.checkLogin() && user.isFollowing(userid))
				$li.addClass("following");
			
			$li.children(".right").html(text);
			return $li;
		},
		scrollListener : function(e){
			var $target = $(e.target);
			var $last = $target.find("li").last();
			var delta = $last.offset().top-($target.offset().top+ $target.height());
			if(delta < 40){
				$target.unbind("scroll", this.scrollListener);
				var oldestid = $last.data("id");
				var data = {oldestid:oldestid};
				var self = this;

				$.anycook.api.life(data,function(response){
						self.parseAndAddLiveAtHome(response);
						$target.scroll(function(e){self.scrollListener});
				});
			}
			return false;
		}
	}
});