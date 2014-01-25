define([
	'jquery.recipeoverview', 
	'jscrollpane', 
	'classes/Recipe', 
	'header', 
	'loginMenu', 
	'news'
], 
function($, $, Recipe, header, loginMenu, news){
	return {
		load : function(){
			// var headertext = "<a href=\"/#!\" id='home_button' class='small_button'><div></div></a>" +
					// "<a href=\"/#!/?page=discover\" id='discover_button' class='big_button'>Entdecken</a>";
			// $("#content_header").html(headertext);
			// //new stuff
			
			$("#subnav").empty()
				.append(header.buildLink("Startseite", "/#", "startpage_button").addClass("active"))
				.append(header.buildLink("Entdecken", "/#?page=discover", "discover_button").addClass("active"));
				//.append(getHeaderLink("Küchengeplapper", "/#!/?page=stream", "discussion_btn"));
			
			$.anycook.api.recipe.ofTheDay(function(recipeOfTheDay){
				var recipeName = recipeOfTheDay.name;
				$("#recipe_of_the_day").attr("href", Recipe.getURI(recipeName))
			  		.text(recipeName);
			});
			
			$.anycook.api.recipe.number(function(num){
				$("#num_recipes").text(num);
			});
			
			$.anycook.api.tag.number(function(num){
				$("#num_tags").text(num);
			});
			
			$.anycook.api.ingredient.number(function(num){
				$("#num_ingredients").text(num);
			});

			if(user.checkLogin()){
				$(".login_or_register").hide();
			} else {
				$(".login_btn").click(loginMenu.toggle);
			}
			
			
			//liveupdatestuff
			newestid = 0;
			$("#news ul").jScrollPane().scroll(function(e){news.scrollListener(e)});

			news.updateLiveAtHome();
		},
		discover : function(){
			$.anycook.api.discover.recommended(function(json){
				$("#discover_recommended").recipeoverview("diese Rezepte könnten dir auch schmecken...", json);
			});
			
			$.anycook.api.discover.tasty(function(json){
				$("#discover_tasty").recipeoverview("leckerste Rezepte", json);
			});
			
			
			$.anycook.api.discover.new(function(json){
				$("#discover_new").recipeoverview("neueste Rezepte", json);
			});	
		}
	}
});