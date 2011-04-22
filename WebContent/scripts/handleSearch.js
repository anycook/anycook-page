function fullTextSearch(){
	$("#result_container").empty();
	$.ajax({
		  url: "/anycook/FullTextSearch",
		  data:"resultanz=10&startnum=0",
		  dataType: 'json',
		  async:false,
		  success: searchResult
		});
}


function searchResult(json){
	if(json==null)
		$.address.path("");
	else{
		var gerichte = json.gerichte;
		$("#total_num").text(json.size);
		if(gerichte.length>0){					
			for(var i in gerichte){
				$("#result_container").append(getBigFrameText(gerichte[i]));
			}			
		}
		else
			$("#result_container").html("<div id='noresult_headline'>Uups! Nichts gefunden...</div><div id='noresult_subline'>Passe deine aktuelle Suche an oder schmier dir ein Brot.</div><a href='#/' id='noresult_reset'>Suche zurücksetzen</a>");
		
		var currentResultNum = $(".frame_big").length;
		$("#current_num").text(currentResultNum);
		if(currentResultNum < json.size){
			addMoreResultsButton();
		}
	}
	
}

function addResults(){
	$("#more_results").append("<img src=\"/icons/ajax-loader.gif\"/>");
	var currentResultsNum = $(".frame_big").length;
	$.ajax({
		  url: "/anycook/FullTextSearch",
		  data:"resultanz=10&startnum="+currentResultsNum,
		  dataType: 'json',
		  async:false,
		  success: function(json){
			if(json==null)
				$.address.path("");
			else{
				var gerichte = json.gerichte;
				if(gerichte.length>0){					
					for(var i in gerichte){
						$("#result_container").append(getBigFrameText(gerichte[i]));
					}
					
				}
	  		}
			$("#more_results, #more_results_right").remove();
			currentResultsNum = $(".frame_big").length;
			$("#current_num").text(currentResultsNum);
			
			if(currentResultsNum < json.size){
				addMoreResultsButton();
			}
		  }
	
		});
}

function addMoreResultsButton(){
	$("#result_container").append("<div id=\"more_results\">Mehr Rezepte laden</div><div id=\"more_results_right\"></div>");
	$("#more_results").click(addResults);
	$(document).scroll(moreresultsScrollListener);
}

function moreresultsScrollListener(){
	if($.address.pathNames()[0] != "search"){
		$(document).unbind("scroll", moreresultsScrollListener);
		return;
	}
	
	var scrollTop = $(window).scrollTop() + $(window).height();
	var top = $("#more_results").position().top;
	if(scrollTop > top +170){
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
		if(result.gerichte!=null)
			gotoGericht(result.gerichte);
		
		if(result.kategorien!=null)
			setKategorie(result.kategorien[0]);
		
		if(result.zutaten!=null)
			addZutat(result.zutaten);	
		
		if(result.tags!=null)
			saveTag(result.tags[0]);
		
		if(result.user!=null){
			addUsername(result.user[0]);
		}
		
	}else if(terms!= ""){
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
		if(split[i]!= ""){
			if(searchterms[split[i]]==undefined || searchterms[split[i]]==false){
				$("#search_terms").append("<div class=\"search_term\"><span>"+split[i]+"</span><div class=\"close_term\">x</div></div>");
				searchterms[split[i]] = true;
			}
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
			if(response != "false") {
				addZutatRow(response);
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
			if(response == "false")
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
			if(response == "false")
				$.address.path("");
			else
				fullTextSearch();
			}
	});
}

function focusSearch(){
	var value = $("#search").val();
	var pathName = $.address.pathNames()[0];
	var recipeName = $.address.pathNames()[1];
	if(pathName == null || pathName == undefined)
		pathName = "";
	if(pathName == "recipe" && value == recipeName || pathName != "recipe" && value=="Gerichte, Zutaten, Tags, ..."){
		$("#search").css("color","#404040");
		$("#search").css("fontStyle","normal");
		$("#search").val("");
	}
}

function focusoutSearch(){
	var value = $("#search").val();
	if(value==""){
		resetSearchBar();
		var pathName = $.address.pathNames()[0];
		var recipeName = $.address.pathNames()[1];
		if(pathName == null || pathName == undefined)
			pathName = "";
		if(pathName == "recipe")
			$("#search").val(recipeName);
	}
}

function addUsername(username){
	addtoSession("username="+username);
	setUserfilter(username);
}

function setUserfilter(username){
	$.ajax({
		  url: "/anycook/GetUserInformation",
		  data:"username="+username,
		  async:false,
		  success: function(imagepath){
			  $("#userfilter a").attr("href", "/#!/profile/"+username);
			  $("#userfilter img").attr("src", imagepath);
			  var ptext = "<a href=\"/#!/profile/"+username+"\">"+username+"</a>'s Rezepte";
			  $("#userfilter p").html(ptext);
			  $("#userfilter").show();
		  }
		});
	$("#userfilterremove").click(removeUserfilter);
}

function removeUserfilter(){
	$("#userfilter").hide();
	var username = $("#userfiltername").text();
	removefromSession("username="+userfilter);
}

var searchterms = null;
