function addResults(json){
	$("#more_results").remove();
	var recipes = json.results;

	var currentRecipes = $("#result_container").data("recipes");
	if(currentRecipes == undefined || $(".frame_big").length == 0) currentRecipes = [];

	


	// var start = $(".frame_big").length;

	$.each(recipes, function(i, recipe){
		var $frame_big = getBigFrame();
		$frame_big = $frame_big.appendTo("#result_container");
		// $("#result_container").append($frame_big);

		$.anycook.graph.recipe(recipe, function(recipe){
			if($.inArray(currentRecipes, recipes[0]) > -1)	return;

			fillBigFrame($frame_big, recipe);
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
		addMoreResultsButton();
}

function searchAutocomplete(req,resp){
	var term = req.term;
	if(term.charAt(0) === "-"){
		if(term.length > 1)
			autocompleteExcludedIngredients(term.substr(1), resp);
	}
	else
		autocomplete(term,resp);
}

function autocompleteIngredients(term, resp){
	
}

function autocompleteExcludedIngredients(term, resp){
	$.anycook.graph.autocomplete.ingredient(term, function(data){
		var array = [];
	 	for(var i=0;i<data.length;i++){
	 		if(i==0)
	 			array[array.length] = { label: "<div class='autocomplete-h1'>Zutaten</div><div class='autocomplete-p'>"+data[i]+"</div>", value: "-"+data[i],data:"excludedingredients"};
	 		else
	 			array[array.length] = { label: "<div class='autocomplete-p'>"+data[i]+"</div>", value: "-"+data[i],data:"excludedingredients"};
        }
		resp(array);
	});
}

function autocomplete(term, resp){
	var categorie = search.kategorie;
	var ingredients = search.zutaten;
	var tags = search.tags;
	var user = search.user;
	
	$.anycook.graph.autocomplete(term, categorie, ingredients, tags, user, function(data){
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
}

function searchKeyDown(event){
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
	
}

function addMoreResultsButton(){
	$("#result_container").append("<div id=\"more_results\">Mehr Rezepte laden</div><div id=\"more_results_right\"></div>");
	$("#more_results").click(search.searchMore);
	$(document).scroll(moreresultsScrollListener);
}

function moreresultsScrollListener(){
	if($.address.pathNames()[0] != "search" || $("#more_results").length == 0){
		$(document).unbind("scroll", moreresultsScrollListener);
		return;
	}
	
	var scrollTop = $(window).scrollTop() + $(window).height();
	var top = $("#more_results").position().top;
	if(scrollTop > top +100){
		$(document).unbind("scroll", moreresultsScrollListener);
		// addResults();
		var start = $(".frame_big").length;
		search.search(start);
	}
		
}


function makeSearchHeader(){
	if($("#first_search_layout").length == 0){
		var headertext = "<div class='float_right_header'>" +
				"<div id='first_search_layout' class='small_button'><div></div></div>" +
				//"<div id='second_search_layout' class='small_button'><div></div></div>" +
				//"<div id='third_search_layout' class='small_button'><div></div></div>" +
				"</div>";
		$("#content_header").html(headertext);
		$("#recipe_general_btn").click(function(event){$.address.parameter("page", "");});
	}
}



function handleSearchResults(result, terms){
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
		var split = terms.split(" ");
		for(var i in split){
			search.addTerm(split[i]);
		}
		search.flush();
	}
	return false;
	
}

function addTerms(terms){
	if($(".search_term").length == 0){ 
		$("#terms_text").show();
		$(".close_term").live("click", removeTerm);
	}
	
	
	for(var i in search.terms){
		if(search.terms[i]!= ""){
			$("#search_terms").append("<div class=\"search_term\"><span>"+search.terms[i]+"</span><div class=\"close_term\">x</div></div>");
		}
	}	
}

function removeTerm(event){
	var target = $(event.target);
	var term = target.prev().text();
	search.removeTerm(term);
	search.flush();
	
}

function gotoGericht(gericht){
	$.address.path("recipe/"+gericht);
}



function focusoutSearch(){
	$("#search").val("");	
}

function fillBigFrame($frame_big, json){
	var beschreibung = json.description;

	var uri = encodeURI("/#!/recipe/" + json.name);
	$frame_big.attr("href", uri).append("<div></div>");

	$frame_big.append("<div></div>").children("div").last().addClass("frame_big_left");

	var frame_big_main = $frame_big.append("<div></div>").children("div").last().addClass("frame_big_main");

	var recipe_img = frame_big_main.append("<div></div>").children("div").last().addClass("recipe_img").append("<img/>").append("<div></div>");

	recipe_img.children("img").attr("src", Recipe.getImageURL(json.name));

	if(json.timemin !== undefined && json.timestd !== undefined){
		var std = json.timestd.toString();
		if(std.length == 1)
			std = "0" + std;
	
		var min = json.timemin.toString();
		if(min.length == 1)
			min = "0" + min;
	
		recipe_img.children("div").addClass("recipe_time").text(std + ":" + min + " h");
	
	}

	var recipe_text = frame_big_main.append("<div></div>").children("div").last().addClass("recipe_text");

	recipe_text.append("<h3></h3>").children("h3").text(json.name);
	recipe_text.append("<p></p>").children("p").text(beschreibung);

	var heart = frame_big_main.append("<div></div>").children("div").last().addClass("heart");

	if($.inArray(json.name, user.schmeckt)>=0)
		heart.addClass("schmeckt");

	frame_big_main.append("<div></div>").children("div").last().addClass("schmeckt_num").text(json.schmecktNum);

	$frame_big.append("<div></div>").children("div").last().addClass("frame_big_right");
}

function getBigFrame() {
	return $("<a></a>").addClass("frame_big");
}

var search = null;
