function fullTextSearch(){
	
	$("#result_container").empty();
	$.ajax({
		  url: "/anycook/FullTextSearch",
		  dataType: 'json',
		  async:false,
		  success: function(json){
			if(json==null)
				$.address.path("");
			else{
				if(json.length>0){					
					for(var i = json.length-1; i>=0; i--){
						$("#result_container").append(getBigFrameText(json[i]));						
					}
					$("#result_container").append("<div id='result_end'></div>");
				}
				else
					$("#result_container").html("<div id='noresult_headline'>Uups! Nichts gefunden...</div><div id='noresult_subline'>Passe deine aktuelle Suche an oder schmier dir ein Brot.</div><a href='#/' id='noresult_reset'>Suche zurücksetzen</a>");
					
	  		}
			
		  }
		});
}


function makeSearchHeader(){
	if($("#first_search_layout").length == 0){
		var headertext = "<div class='float_right_header'><div id='first_search_layout' class='small_button'><div></div></div><div id='second_search_layout' class='small_button'><div></div></div><div id='third_search_layout' class='small_button'><div></div></div></div>";
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
		if(result.gerichte!=null)
			gotoGericht(result.gerichte);
		
		if(result.kategorien!=null)
			setKategorie(result.kategorien[0]);
		
		if(result.zutaten!=null)
			addZutat(result.zutaten);	
		
		if(result.tags!=null)
			saveTag(result.tags[0]);
		
	}else{
		addTerms(terms, true);
	}
	return false;
	
}

function addTerms(terms, send){
	if($(".search_term").length == 0){ 
		$("#terms_text").show();
		$(".close_term").live("click", removeTerm);
		searchterms = new Object();
	}
	
	var split = terms.split(" ");
	for(var i in split){
		if(searchterms[split[i]]==undefined || searchterms[split[i]]==false){
			$("#search_terms").append("<div class=\"search_term\"><span>"+split[i]+"</span><div class=\"close_term\">x</div></div>");
			searchterms[split[i]] = true;
		}
	}
	if(send){
		addtoSession("query="+terms);
		$("#search").val("");
		$("#search").focus();
	}
}

function removeTerm(event){
	var target = $(event.target);
	var term = target.prev().text();
	removefromSession("term="+term);
	searchterms[term]=false;
	target.parent().remove();
	if($(".search_term").length == 0){ 
		$("#terms_text").hide();
		$(".close_term").die("click", removeTerm);
	}
	
}

function addZutat(addzutat){
	$.ajax({
		url:"/anycook/AddtoSession",
		data: "zutat="+addzutat,
		success:function(response){
			if(response == "true") {
				addZutatRow(addzutat);
				var array = $.address.pathNames();
				if(array.length >0 && array[0]=="search")
					fullTextSearch();
				else
					$.address.path("search");
			}
		}
	});
}

function removeZutat(zutat){
	$.ajax({
		url:"/anycook/RemovefromSession",
		data: "zutat="+zutat,
		success:function(response){
			if(response == "false" && !checkTextSearch())
				$.address.path("");
			else
				fullTextSearch();
	}
	});
}

function gotoGericht(gericht){
	$.address.path("recipe/"+gericht);
}

function addtoSession(data){
	$.ajax({
		url:"/anycook/AddtoSession",
		async:false,
		data:data, 
		success:function(response){			
			var array = $.address.pathNames();
			if(array.length >0 && array[0]=="search")
				fullTextSearch();
			else
				$.address.path("search");
		}
	});
}

function removefromSession(data){
	$.ajax({
		url:"/anycook/RemovefromSession",
		data: data,
		success:function(response){
			if(response == "false" && !checkTextSearch())
				$.address.path("");
			else
				fullTextSearch();
			}
	});
}

function checkTextSearch(){
	var pathNames = $.address.pathNames();
	if(pathNames[0] == "search")
		return $.address.pathNames().length > 1;
	else
		return false;
}

var searchterms = null;
