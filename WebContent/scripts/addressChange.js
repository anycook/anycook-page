

function loadHome(json)
{
	var headertext = "<a href=\"/#!\" id='home_button' class='small_button'><div></div></a>" +
			"<a href=\"/#!/?page=discover\" id='discover_button' class='big_button'>Entdecken</a>";
	$("#content_header").html(headertext);
	
	
	//new stuff
	$("#tagesrezept_inhalt").append(getSmallFrameText(json));
	setSmallFrameText($("#tagesrezept_inhalt"));
	$(".small_rezept p").ellipsis();
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
		search= new Search();
		
		$("#zutat_head").text("Zutaten:");
		$.address.title("anycook");
		
		//resetSearchBar();
		resetFilter();
		
		$(document).scrollTop(0);
		
		if($("#filter_main").css("opacity")==0){
			$("#filter_main").animate({"opacity":1, "paddingBottom":20}, 0);
			$("#filter_main > *").not($("ul.kategorie_filter")).show();
			$("#filter_main").css("height", "auto");
		}
		
		$("#wertung_filter").show();
		$("#content_footer").show();		
		clearContent();
		
		var path = event.pathNames;
		//$.xml.append(path.length == 0 ? "home" : path[0]);
		$("#content_main").xml("append", path[0]);
		
		blockFilter(false);
		if(path.length > 0){
			$("#search_reset, #filter_reset").addClass("on");
		}
		else{
			$("#search_reset, #filter_reset").removeClass("on");
		}
		
		
		
		switch(path.length){
		case 0:
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
				//fullTextSearch();
				search = Search.init();
				search.search();
				break;
			case "newrecipe":
				loadNewRecipe();
				break;
			/*case "profile":
				loadUserProfile();
				break;*/
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
				break;
			case "resetpassword":
				loadResetPasswordStep1();
				break;
			case "registration":
				$.address.title("Registrierung | anycook");
				showRegistration();
				break;
			case "settings":
				loadSettings();
				break;
			case "developer":
				$.address.title("Entwickler | anycook");
				break;
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
				
			/*case "search":				
				setFiltersfromSession();
				$("#search").focus();
				$("#search").val(path[1]);
				fullTextSearch();
				break;*/
				
			case "activate":
				activateUser(path[1]);
				break;
				
			case "profile":
				loadProfile(decodeURIComponent(path[1]));
				break;
				
			case "resetpassword":
				loadResetPasswordStep2();
				break;
			}
			break;
		case 3:
			switch(path[0]){
			case "recipe":
				$.ajax({
			  		  url: "/anycook/LoadRecipe",
			  		  dataType: 'json',
			  		  async:false,
			  		  data: {recipe:path[1], version:path[2]},
			  		  success: function(json){
						loadRecipewJSON(json);
					}
			  	});
				$("#content_footer").hide();
				break;
				
			case "search":
				search = new Search();
				switch(path[1]){
				case "tagged":				
					search.addTag(decodeURIComponent(path[2]));					
					break;
					
				case "user":
					search.setUsername(decodeURIComponent(path[2]));
				}
				search.search();
			};
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
			animateNewRecipe(0);
			//$(".new_recipe_steps").hide();
			//$("#new_recipe_step1").show();
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
	var firstpath = event.pathNames[0];
	switch(event.pathNames.length){
	case 0:
		switch(page){
		case "discover":
			$("#home").hide();
			if($("#discover").length==0){
				$("#content_main").xml("append", "home_discover");
				loadDiscover();
			}
			else
				$("#discover").show();
			$("#discover_button").addClass("on");
			break;
			
			default:
				$.address.queryString("");
		}
		break;
		
	default:
		switch(firstpath){
		case "recipe":
			switch(page){
			case "discussion":
				$("#recipe_container").hide();
				if($("#discussion_container").length == 0){
					$("#content_main").xml("append", "recipe_discussion");
					loadDiscussion(event.pathNames[1]);
				}
				else
					$("#discussion_container").show();
				$("#recipe_discussion_btn").addClass("on");
				break;
				
			case "addtags":
				showaddTags();
				break;
				
			default:
				$.address.queryString("");
			}
			break;
			
		case "newrecipe":
			//$(".new_recipe_steps").hide();
			switch(page){
			case "schritte":
				loadStep2();
				break;
				
			case "zutaten":
				loadStep3();
				break;
				
			case "abschluss":
				loadStep4();
				break;
				
			default:
				$.address.queryString("");
			}
			break;
				
		case "fbregistration":
			//nothing
			break;
			
		case "search":
			search = Search.init();
			search.search();
			break;
			
		default:
			$.address.queryString("");
		}
	}
}


function resetSearchBar(){
	$("#search").blur();
	$("#search").val("Gerichte, Zutaten, Tags, ...").css({color : "#b5b5b5" , fontStyle : "italic"}).removeAttr("readonly");
}

function checkBrowser(){
	return navigator.appName;
}

var lastPath="";
$.address.change(handleChange);
