function addResults(json){
	$("#more_results").remove();
	var recipes = json.recipes;
	// var start = $(".frame_big").length;					
	for(var i= 0; i<recipes.length; i++){
		var $result = getBigFrameText(recipes[i]);
		$("#result_container").append($result);
		var $text = $result.find(".recipe_text");
		var $p = $text.children("p");
		var $h3 = $text.children("h3");
		var height = $text.innerHeight()-($h3.outerHeight(true)+($p.outerHeight(true)-$p.innerHeight()));
		$p.css("height",height).ellipsis();
	}
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
	$.anycook.graph.autocomplete(term, function(data){
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

var search = null;
