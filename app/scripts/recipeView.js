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
'use strict';
define([
	'jquery',
	'plusone',
	'classes/Recipe',
	'classes/User',
	'filters',
	'lightbox',
	'loginMenu',
	'stringTools',
	'tags'
], function($, gapi, Recipe, User, filters, lightbox, loginMenu, stringTools, tags){
	return { 
		profileRecipe : function(recipe){
			var uri = "#!/recipe/"+encodeURIComponent(recipe);
			
			var $img = $("<img/>").attr("src", AnycookAPI.recipe.image(recipe));
			var $div =$("<div></div>").append("<span>"+recipe+"</span>");
			
			var $link = $("<a></a>").addClass("profile_rezept_bild").attr("href", uri)
				.append($img)
				.append($div);
			return $link;
		},
		load : function(recipeName, versionid) {
			var self = this;
			filters.reset();
			recipeName = decodeURIComponent(recipeName);

			var rezepturi = "#/recipe/"+recipeName;
			$("#subnav #recipe_btn").attr("href", rezepturi);
			$("#subnav #discussion_btn").attr("href", rezepturi + "?page=discussion");

			AnycookAPI.recipe(recipeName, versionid, function(recipe){
				$.address.title(recipe.name + " | anycook");
				$("#recipe_headline").append(recipe.name);
				$("#introduction").append(recipe.description);
				var $author = $("<a></a>").attr("href", User.getProfileURI(recipe.author.id))
					.text(recipe.author.name);
				$("#autoren").append($author);
				filters.setFromRecipe(recipe);
			});
			
			$(".recipe_image").attr("src", AnycookAPI.recipe.image(recipeName, "large"));

			AnycookAPI.recipe.ingredients(recipeName, versionid, function(ingredients){
				if(decodeURIComponent($.address.pathNames()[1]) != recipeName) return;
				self.loadIngredients(ingredients);
			});

			AnycookAPI.recipe.tags(recipeName, function(tags){
				if(decodeURIComponent($.address.pathNames()[1]) != recipeName) return;
				self.loadTags(tags);
			});

			AnycookAPI.recipe.steps(recipeName, versionid, $.proxy(this.loadSteps, this));

			//recipe_image
			

			// var steps = recipe.steps;
			// loadSteps(steps);
			// loadFilter(recipe);
			//$("#search").attr("value", recipe.name);

			//schmeckt-button
			var user = User.get();

			if(user.checkLogin()) {
				AnycookAPI.recipe.schmeckt(recipeName, function(schmeckt){
					if(!schmeckt) {
						$("#schmecktmir").click($.proxy(self.schmecktmir, self));
					} else {
						$("#schmecktmir").addClass("on");
						$("#schmecktmir").click($.proxy(self.schmecktmirnicht, self));
					}
				});	
				$("#tags").click($.proxy(this.showAddTags, this));	
			} else {
				$("#schmecktmir").click($.proxy(loginMenu.toggle, loginMenu));
				$("#tags").click($.proxy(loginMenu.toggle, loginMenu));
			}

			

			// if($.address.pathNames().length == 3 && user.level > 0){
			// addEditingHandler();
			// }

			//Autoren
			// var num_autoren = recipe.authors.length;
			// var $autoren = $("#autoren span");
		// 
			// for(var i in recipe.authors) {
				// var author = recipe.authors[i];
				// $autoren.append("<a href='#!/profile/" + author.id + "'>" + author.name + "</a>");
				// if(i <= num_autoren - 3)
					// $autoren.append(", ");
				// if(i == num_autoren - 2)
					// $autoren.append(" und ");
			// }

			//bezeichner
			//$("#zubereitung").addClass("on");
			//$("#zubereitung").attr("href", "#!/recipe/"+encodeURI(recipe.name));
			//$("#addtags").attr("href", "#!/recipe/"+encodeURI(recipe.name)+"?page=addtags");
			//$("#zubereitung").click(showZubereitung);
			//$("#addtags").click(showaddTags);

			//icons
			$("#share").click(this.showShare);

			$("#print").click(function() {
				window.print();
			});
			//addtagsbox
			// makeAddTags();
		},
		loadSteps : function(steps) {
			var $stepContainer = $("#step_container").empty();
			for(var j = 0; j < steps.length; j++) {
				var $step = this.getIngredientStep(steps[j]);
				$stepContainer.append($step);
				var stepheight = $step.children(".step").innerHeight();
				var $text = $step.find(".text");
				var newMargin = (stepheight - $text.height()) / 2;
				$text.css("marginTop", newMargin);
			}
			return true;
		},
		getIngredientStep : function(step) {
			//step-part
			var $left = $("<div></div>").addClass("left");
			var $number = $("<div></div>").addClass("number").text(step.id);
			var $numberContainer = $("<div></div>").addClass("number_container").append($number);

			var $text = $("<div></div>").addClass("text").text(step.text);
			var $mid = $("<div></div>").addClass("mid").append($numberContainer).append($text);

			var $right = $("<div></div>").addClass("right");
			var $step = $("<div></div>").addClass("step").append($left).append($mid).append($right);

			var $ingredientStep = $("<li></li>").addClass("ingredient_step").append($step);
			var ingredients = step.ingredients;

			//TODO testdaten
			// ingredients["Tomaten"] = "300g";
			// ingredients["Mehl"] = "500g";
			// ingredients["Knoblauch"] = "2 Zehen";
			// ingredients["Salz"] = "";

			var text = "";
			for(var i in ingredients) {
				if(ingredients[i].name.length == 0)
					continue;
				text += ingredients[i].menge + " " + ingredients[i].name + ", ";
			}
			text = text.substring(0, text.length - 2);

			if(text.length > 0) {
				var $ingredients = $("<div></div>").addClass("ingredients").text(text);
				$ingredientStep.append($ingredients);
			}

			//all

			return $ingredientStep;
		},
		loadIngredients : function(ingredients){
			var $ingredientList = $("#ingredient_list").empty();
			for(var i in ingredients) {
				var zutat = ingredients[i].name;
				var menge = ingredients[i].menge;
				var singular = ingredients[i].singular;
				if(singular !== undefined && singular != null && stringTools.getValuefromString(menge) == 1)
					zutat = singular;

				var $li = $("<li></li>").append("<div></div>").append("<div></div>");
				$li.children().first().addClass("ingredient").text(zutat);
				$li.children().last().addClass("amount").text(menge);
				$ingredientList.append($li);
			}
			
			if($ingredientList.children().length <6){
				var length = $ingredientList.children().length;
				for(var i = 0; i<= 6-length; i++){
					var $li = $("<li></li>");
					$ingredientList.append($li);
				}
			}	
		},
		loadTags : function(tagsList){
			var $tags_list = $(".tags_list").empty();
				
			if(tagsList === undefined) return;
			
			for(var i = 0; i < tagsList.length; i++)
				$tags_list.append(tags.get(tagsList[i], "link"));
		},
		showShare : function() {
			var recipeURI = Recipe.getURI($.address.pathNames()[1]);
			var $this = $(this).unbind("click");
			$this.children(".img").hide();
			var $left = $this.children(".left").empty();

			$left.append("<div class='fb-like' data-href='"+"http://anycook.de/" + recipeURI+"' data-colorscheme='light' data-layout='button_count' data-action='recommend'"+
				"data-show-faces='false' data-send='false'></div>");

			var anycookuricomponent = encodeURIComponent("http://anycook.de/" + recipeURI);
			var twittertarget = "https://twitter.com/share?url=" + anycookuricomponent + "";
			$left.append("<div id=\"twitter\"></div>").children("div").last().append("<a href=\"" + twittertarget + "\" target=\"_blank\"><span></span></a>");

			$left.append("<div id=\"gplus\"></div>").children("div").last().append("<g:plusone size=\"small\" count=\"false\" href=\"http://anycook.de/" + recipeURI + "\"></g:plusone>");

			$left.children("div").addClass("share_container");

			$("#twitter").click(function() {
				window.open(twittertarget, 'child', 'height=420,width=550');
				return false;
			});

			FB.XFBML.parse(document.getElementById('share'));
			gapi.plusone.go();

			$this.addClass("on");

			$("body").click(function(event) {

				if($(event.target).parents().andSelf().is("#share"))
					return;

				$this.removeClass("on").children(".img").show();

				$left.empty().text("teilen");

				$(this).unbind("click");
				$this.click(showShare);
			});
			// $(".connect_widget_summary").remove();
		},
		showAddTags : function() {
			var $lightbox = this.getAddTagsLightbox();

			var top = $("#tags").offset().top - 113;
			lightbox.show($lightbox, top);

			$lightbox.find(".tagsbox").click($.proxy(tags.makeNewTagInput, tags));

			$lightbox.find("form").submit($.proxy(tags.submitSuggestTags, tags));

			return false;
		},
		getAddTagsLightbox : function() {
			var content = '<div class="tagsbox"></div><p>Die bekanntesten Tags:</p><div id="tagcloud"></div>';

			var $lightbox = lightbox.get("Tags hinzufügen:", "Hilf den anderen beim finden, in dem du neue Tags vorschlägst.", content, "einreichen");
			tags.makeTagCloud();
			$("#main").append($lightbox);

			return $lightbox;
		},
		schmecktmir : function(){
				var gericht = $.address.pathNames()[1];
				$("#schmecktmir").unbind("click");
				AnycookAPI.recipe.makeSchmeckt(gericht, function(response){
						if(response != "false"){
							$("#schmecktmir").addClass("on");
							$("#schmecktmir").click(schmecktmirnicht);
						}				
				});
		},
		schmecktmirnicht : function(){
			var gericht = $.address.pathNames()[1];
			$("#schmecktmir").unbind("click");
			AnycookAPI.recipe.unmakeSchmeckt(gericht,function(response){
					if(response != "false"){
						$("#schmecktmir").removeClass("on");
						$("#schmecktmir").click(schmecktmir);
					}				
			});
		}
	}
});