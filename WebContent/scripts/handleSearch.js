function searchResult(json){
	if(json==null)
		$.address.path("");
	else{
		
		$("#result_container").data("results", json);
		var gerichte = json.gerichte;
		if(gerichte.length>0){					
			for(var i = 0; i<10; i++){
				$("#result_container").append(getBigFrameText(gerichte[i]));
			}
		}
		else
			$("#result_container").html("<div id='noresult_headline'>Uups! Nichts gefunden...</div><div id='noresult_subline'>Passe deine aktuelle Suche an oder schmier dir ein Brot.</div><a href='#/' id='noresult_reset'>Suche zurücksetzen</a>");
		
		var currentResultNum = $(".frame_big").length;
		if(currentResultNum < json.size){
			addMoreResultsButton();
		}
		
		$(".frame_big").first().focus();
		
		
		$(".frame_big:focus").live("keydown", searchKeyDown);
		$(".frame_big").live("mouseenter", function(){
			$(".frame_big:focus").blur();
		});
	}
	
}

function addResults(){
	$("#more_results").remove();
	var gerichte = $("#result_container").data("results").gerichte;
	var start = $(".frame_big").length;					
	for(var i= start; i<start+10; i++){
		$("#result_container").append(getBigFrameText(gerichte[i]));
	}
	if(gerichte.length > $(".frame_big").length)
		addMoreResultsButton();
}

function searchKeyDown(event){
	if(event.keyCode == 40 && $(this).next() != undefined) // down
		$(this).next().focus();
	
	if(event.keyCode == 38 && $(this).prev() != undefined) // up
		$(this).prev().focus();
		
	return false;
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
	
	if(terms == "Gerichte, Zutaten, Tags, ...")
		return;
	
	var length =0;
	if(result.gerichte!=null)
		length = result.gerichte.length;
	
	if(result.kategorien!=null)
		length += result.kategorien.length;
	
	if(result.tags!= null){
		length += result.tags.length;
	}
	
	if(result.zutaten!=null)
		length += result.zutaten.length;
	
	if(length >= 1){
		$("#search").val("");
		if(result.gerichte!=null){
			gotoGericht(result.gerichte);
			return false;
		}
		
		if(result.kategorien!=null)
			search.setKategorie(result.kategorien[0]);
		
		if(result.zutaten!=null)
			search.addZutat(result.zutaten[0]);
		
		if(result.tags!=null)
			search.addTag(result.tags[0]);			
		
		if(result.user!=null){
			search.setUsername(result.user[0]);
		}
		search.flush();
		
	}else if(terms!= ""){
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

//var searchterms = null;

var search = null;
