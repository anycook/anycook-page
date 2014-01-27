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
	'classes/Recipe',
	'classes/Search',
	'classes/User',
	'text!templates/emptySearchResult.erb',
	'text!templates/searchResult.erb',
	'jquery.autoellipsis'
], function($, Recipe, Search, User, emptySearchResultTemplate, searchResultTemplate){

	return {
		addResults : function(event, json){
			$("#more_results").remove();
			var recipes = json.results;

			var currentRecipes = $("#result_container").data("recipes");
			if(currentRecipes == undefined || $(".frame_big").length == 0) currentRecipes = [];

			


			// var start = $(".frame_big").length;
			var self = this;
			$.each(recipes, function(i, recipe){
				var $frame_big = self.getBigFrame();
				$frame_big = $frame_big.appendTo("#result_container");
				// $("#result_container").append($frame_big);

				$.anycook.api.recipe(recipe, function(recipe){
					if($.inArray(currentRecipes, recipes[0]) > -1)	return;

					self.fillBigFrame($frame_big, recipe);
					var $text = $frame_big.find(".recipe_text");
					var $p = $text.children("p");
					var $h3 = $text.children("h3");
					var height = $text.innerHeight()-($h3.outerHeight(true)+($p.outerHeight(true)-$p.innerHeight()));
					$p.css("height",height).ellipsis();
				});
			});

			currentRecipes = currentRecipes.concat(recipes);
			$("#result_container").data("recipes", currentRecipes);
				
			if(json.size> $(".frame_big").length)
				self.addMoreResultsButton();
		},
		searchAutocomplete: function(req,resp){
			var term = req.term;
			if(term.charAt(0) === "-"){
				if(term.length > 1)
					autocompleteExcludedIngredients(term.substr(1), resp);
			}
			else
				autocomplete(term,resp);
		},
		autocompleteExcludedIngredients : function(term, resp){
			$.anycook.api.autocomplete.ingredient(term, function(data){
				var array = [];
			 	for(var i=0;i<data.length;i++){
			 		if(i==0)
			 			array[array.length] = { label: "<div class='autocomplete-h1'>Zutaten</div><div class='autocomplete-p'>"+data[i]+"</div>", value: "-"+data[i],data:"excludedingredients"};
			 		else
			 			array[array.length] = { label: "<div class='autocomplete-p'>"+data[i]+"</div>", value: "-"+data[i],data:"excludedingredients"};
		        }
				resp(array);
			});
		},
		autocomplete : function(term, resp){
			var categorie = search.kategorie;
			var ingredients = search.zutaten;
			var tags = search.tags;
			var user = search.user;
			
			$.anycook.api.autocomplete(term, categorie, ingredients, tags, user, function(data){
				var array = [];
				if(data.gerichte!=undefined){
					for(var i=0;i<data.gerichte.length;i++){
			            if(i==0)
				 			array[array.length] = { label: "<div class='autocomplete-h1'>Gerichte</div><div class='autocomplete-p'>"+data.gerichte[i]+"</div>", value: data.gerichte[i],data:"gericht"};
				 		else
				 			array[array.length] = { label: "<div class='autocomplete-p'>"+data.gerichte[i]+"</div>", value: data.gerichte[i],data:"gericht"};
			        }
				}
				if(data.zutaten!=undefined){
				 	for(var i=0;i<data.zutaten.length;i++){
				 		if(i==0)
				 			array[array.length] = { label: "<div class='autocomplete-h1'>Zutaten</div><div class='autocomplete-p'>"+data.zutaten[i]+"</div>", value: data.zutaten[i],data:"zutaten"};
				 		else
				 			array[array.length] = { label: "<div class='autocomplete-p'>"+data.zutaten[i]+"</div>", value: data.zutaten[i],data:"zutaten"};
			        }
				}
			 	if(data.kategorien!=undefined){        			 		
				 	for(var i=0;i<data.kategorien.length;i++){
			                if(i==0)
					 			array[array.length] = { label: "<div class='autocomplete-h1'>Kategorien</div><div class='autocomplete-p'>"+data.kategorien[i]+"</div>", value: data.kategorien[i],data:"kategorie"};
					 		else
					 			array[array.length] = { label: "<div class='autocomplete-p'>"+data.kategorien[i]+"</div>", value: data.kategorien[i],data:"kategorie"};
			        }
			 	}
			 	if(data.tags!=undefined){
			        for(var i=0; i<data.tags.length; i++)
			        {
			        	if(i==0)
				 			array[array.length] = { label: "<div class='autocomplete-h1'>Tags</div><div class='autocomplete-p'>"+data.tags[i]+"</div>", value: data.tags[i], data:"tag"};
				 		else
				 			array[array.length] = { label: "<div class='autocomplete-p'>"+data.tags[i]+"</div>", value: data.tags[i], data:"tag"};
			        }
			 	}
			 	if(data.user!=undefined){
			        for(var i=0; i<data.user.length; i++)
			        {
			        	if(i==0)
				 			array[array.length] = { label: "<div class='autocomplete-h1'>User</div><div class='autocomplete-p'>"+data.user[i].name+"</div>", value: data.user[i].name, data:"user", id :data.user[i].id};
				 		else
				 			array[array.length] = { label: "<div class='autocomplete-p'>"+data.user[i].name+"</div>", value: data.user[i].name, data:"user", id :data.user[i].id};
			        }
			 	}
			 	resp(array);
			});
		},
		searchKeyDown : function(event){
			var newFocus = undefined;
			switch(event.keyCode){
				case 40: // down
					newFocus = $(this).next();
					break;
				case 38:
					newFocus = $(this).prev();
					break;
						
			}
			if(newFocus !== undefined){
				newFocus.focus();
				return false;
			}
			
		},
		addMoreResultsButton : function(){
			$("#result_container").append("<div id=\"more_results\">Mehr Rezepte laden</div><div id=\"more_results_right\"></div>");
			$("#more_results").click(search.searchMore);
			$(document).scroll($.proxy(this.moreResultsScrollListener, this));
		},
		moreResultsScrollListener : function(){
			if($.address.pathNames()[0] != "search" || $("#more_results").length == 0){
				$(document).unbind("scroll", $.proxy(this.moreResultsScrollListener, this));
				return;
			}
			
			var scrollTop = $(window).scrollTop() + $(window).height();
			var top = $("#more_results").position().top;
			if(scrollTop > top +100){
				$(document).unbind("scroll", $.proxy(this.moreResultsScrollListener, this));
				// addResults();
				var start = $(".frame_big").length;
				var search = Search.init();
				search.search(start);
			}
				
		},
		makeSearchHeader : function(){
			if($("#first_search_layout").length == 0){
				var headertext = "<div class='float_right_header'>" +
						"<div id='first_search_layout' class='small_button'><div></div></div>" +
						//"<div id='second_search_layout' class='small_button'><div></div></div>" +
						//"<div id='third_search_layout' class='small_button'><div></div></div>" +
						"</div>";
				$("#content_header").html(headertext);
				$("#recipe_general_btn").click(function(event){$.address.parameter("page", "");});
			}
		},
		handleSearchResults : function(result, terms){
			$("#search").val("");
			if(terms == "Gerichte, Zutaten, Tags, ...")
				return;
			
			if(result.gerichte!=null){
				gotoGericht(result.gerichte);
			}	
			else if(result.kategorien!=null){
				search.setKategorie(result.kategorien[0]);
				search.flush();
			}	
			else if(result.tags!= null){
				search.addTag(result.tags[0]);
				search.flush();
			}	
			else if(result.zutaten!=null){
				search.addZutat(result.zutaten[0]);
				search.flush();
			}
			else if(result.excludedingredients != null){
				search.excludeIngredient(result.excludedingredients[0]);
				search.flush();
			}
			else if(result.user!=null){
				gotoProfile(result.user[0]);
			}
			else if(terms!= ""){
				search.addTerm(terms);
				search.flush();
			}
			return false;
		},
		addTerms : function(terms){
			/*if($(".search_term").length == 0){ 
				$("#terms_text").show();
				$(".close_term").live("click", removeTerm);
			}
			
			
			for(var i in search.terms){
				if(search.terms[i]!= ""){
					$("#search_terms").append("<div class=\"search_term\"><span>"+search.terms[i]+"</span><div class=\"close_term\">x</div></div>");
				}
			}*/
			$("#search").val(terms);	
		},
		removeTerm: function(event){
			search.setTerms(null);
			search.flush();
		},
		gotoGericht : function(gericht){
			$.address.path("recipe/"+gericht);
		},
		focusoutSearch : function(){
			$("#search").val('');	
		},
		fillBigFrame : function($frame_big, json){
			var uri = encodeURI("/#/recipe/" + json.name);
			$frame_big.attr("href", uri).append("<div></div>");

			var imageURL = Recipe.getImageURL(json.name);

			var std = json.time.std.toString();
			if(std.length == 1)
				std = "0" + std;
		
			var min = json.time.min.toString();
			if(min.length == 1)
				min = "0" + min;
		
			var user = User.get();
			var schmeckt = $.inArray(json.name, user.schmeckt)>=0;

			$.extend(json, {
				imageURL : imageURL,
				time : {
					std : std,
					min : min
				},
				schmeckt : schmeckt
			});

			var template = _.template(searchResultTemplate, json);
			$frame_big.html(template);

		},
		getBigFrame : function() {
			return $("<a></a>").addClass("frame_big");
		},
		showEmptyResult : function(){
			$('#result_container').html(emptySearchResultTemplate);
		}
	}
});
