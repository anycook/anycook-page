function addResults(){
	$("#more_results").remove();
	var gerichte = $("#result_container").data("results").gerichte;
	var start = $(".frame_big").length;					
	for(var i= start; i<gerichte.length && i<start+10; i++){
		var $result = getBigFrameText(gerichte[i]);
		$("#result_container").append($result);
		$result.ellipsis("p");
	}
	if(gerichte.length > $(".frame_big").length)
		addMoreResultsButton();
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
	if($.address.pathNames()[0] != "search"){
		$(document).unbind("scroll", moreresultsScrollListener);
		return;
	}
	
	var scrollTop = $(window).scrollTop() + $(window).height();
	var top = $("#more_results").position().top;
	if(scrollTop > top +100){
		$(document).unbind("scroll", moreresultsScrollListener);
		addResults();
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
