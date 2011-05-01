

function loadHome(json)
{
	var headertext = "<a href=\"/#!\" id='home_button' class='small_button'><div></div></a>" +
			"<a href=\"/#!/?page=discover\" id='discover_button' class='big_button'>Entdecken</a>";
	$("#content_header").html(headertext);
	
	
	//new stuff
	$("#tagesrezept_inhalt").append(getSmallFrameText(json));
	cutSmallFrameText($("#tagesrezept_inhalt"));
	var uri = encodeURI("/#!/recipe/"+json.name);
	$("#tagesrezept_inhalt").attr("href", uri);
	
	$.ajax({
		  url: "/anycook/GetPopularTags",
		  dataType: 'json',
		  data: "num=15",
		  success: loadFamousTags
		});
	
	
	
	
	
	//liveupdatestuff
	newestid = 0;
	updateLiveAtHome();
}

function clearContent(){
	$("#content_main > *").remove();
	$("#content_header > *").remove();
}


// behandelt change bei $.address.path
function handleChange(event){
	if(lastPath != event.path){
		lastPath = event.path;
		
		$("#zutat_head").text("Zutaten:");
		$.address.title("anycook");
		
		resetSearchBar();
		
		
		
		if($("#filter_main").css("opacity")==0){
			$("#filter_main").animate({"opacity":1, "paddingBottom":20}, 0);
			$("#filter_main > *").not($("ul.kategorie_filter")).show();
			$("#filter_main").css("height", "auto");
		}
		
		$("#wertung_filter").show();
		$("#content_footer").show();		
		clearContent();
		
		var path = event.pathNames;
		$.ajax({
			url: "/xml/template.xml",
			dataType: "xml",
			async:false,
			success: parseXML
		});
		
		blockFilter(false);
		if(path.length > 0){
			$("#search_reset, #filter_reset").addClass("on");
		}
		else{
			$("#search_reset, #filter_reset").removeClass("on");
		}
		
		
		
		switch(path.length){
		case 0:
			resetAll();		
			$.ajax({
	  		  url: "/anycook/LoadRecipeforSmallView",
	  		  dataType: 'json',
	  		  async:false,
	  		  success: loadHome
			});
			break;
		case 1:
			switch(path[0]){
			case "search":
				setFiltersfromSession();
				fullTextSearch();
				break;
			case "newrecipe":
				loadNewRecipe();
				break;
			case "profile":
				loadUserProfile();
				break;
			case "feedback":
				$.address.title("Feedback | anycook");
				loadContact();
				break;
			case "preview":
				loadPreview();
				break;
			case "about_us":
				$.address.title("Über uns | anycook");
				break;
			case "impressum":
				$.address.title("Impressum | anycook");
				break;
			case "fbregistration":
				loadFBRegistrationMessage();
			}
			break;
		case 2:
			switch(path[0]){
			case "recipe":
				$.ajax({
		  		  url: "/anycook/LoadRecipe",
		  		  dataType: 'json',
		  		  async:false,
		  		  data: {recipe:path[1]},
		  		  success: function(json){
					loadRecipewJSON(json);
				}
		  		});
				$("#content_footer").hide();
				break;
				
			case "search":				
				setFiltersfromSession();
				$("#search").focus();
				$("#search").val(path[1]);
				fullTextSearch();
				break;
				
			case "activate":
				activateUser(path[1]);
				break;
				
			case "profile":
				userSearch(path[1]);
				break;
			
			case "tagged":
				addTag(path[1]);
				break;
			}
			break;
		case 3:
			if(path[0] == "recipe"){
				$.ajax({
			  		  url: "/anycook/LoadRecipe",
			  		  dataType: 'json',
			  		  async:false,
			  		  data: {recipe:path[1], version:path[2]},
			  		  success: function(json){
						loadRecipe(json);
					}
			  	});
				$("#content_footer").hide();
			}
		}
	}
	$("#content_header *").removeClass("on");
	if(event.parameterNames.length >0){
		changePage(event);
	}
	else{
		//wird aufgerufen wenn page=""
		if(event.pathNames.length == 0){
			$("#content_main > div").hide();
			$("#home").show();
			$("#home_button").addClass("on");
		}
		else if(event.pathNames[0] == "newrecipe"){
			$("#nr_general_btn").addClass("on");
			$(".new_recipe_steps").hide();
			$("#new_recipe_step1").show();
		}
		else if(event.pathNames[0] == "recipe"){
			$("#recipe_general_btn").addClass("on");
			$("#discussion_container").hide();
			$("#recipe_container").show();
		}
		else if(event.pathNames[0] == "search"){
			makeSearchHeader();
			$("#first_search_layout").addClass("on");
			$("#second_search_layout").addClass("inactive");
			$("#third_search_layout").addClass("inactive");
		}
	}
}

// behandelt change bei $.address.parameters
function changePage(event){
	var page = event.parameters["page"];
	if(event.pathNames.length == 0){
		if(page=="discover"){
			$("#home").hide();
			if($("#discover").length==0){
				$.ajax({
					url: "/xml/template.xml",
					dataType: "xml",
					async:false,
					success: function(xml){parseXML(xml, "home_discover");}
				});
				loadDiscover();
			}
			else
				$("#discover").show();
			$("#discover_button").addClass("on");
		}
		else{
			$.address.queryString("");
		}
	}
	else if(event.pathNames[0] == "recipe"){
		if(page=="discussion"){
			$("#recipe_container").hide();
			if($("#discussion_container").length == 0){
				$.ajax({
					url: "/xml/template.xml",
					dataType: "xml",
					async:false,
					success: function(xml){parseXML(xml, "recipe_discussion");}
				});
				loadDiscussion(event.pathNames[1]);
			}
			else
				$("#discussion_container").show();
			$("#recipe_discussion_btn").addClass("on");
			
		}
		else{
			$.address.queryString("");
		}
		
	}
	else if(event.pathNames[0] == "newrecipe"){
		$(".new_recipe_steps").hide();
		if(page=="schritte")
			loadStep2();
		else if(page=="zutaten")
			loadStep3();		
		else if(page=="abschluss")
			loadStep4();	
		else
			$.address.queryString("");
	}else if(event.pathNames[0] == "fbregistration"){
		//nothing
	}
	else{
		$.address.queryString("");
	}
}


function resetAll(){
	clearSession();
	resetFilter();
}

function resetSearchBar(){
	$("#search").blur();
	$("#search").val("Gerichte, Zutaten, Tags, ...").css({color : "#b5b5b5" , fontStyle : "italic"}).removeAttr("readonly");
}

function clearSession(){
	$.ajax({
	  	  url: "/anycook/ClearSession"
	      });
}

function checkBrowser(){
	return navigator.appName;
}

var lastPath="";
$.address.change(handleChange);
