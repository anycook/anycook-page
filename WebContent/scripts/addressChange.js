

function loadHome()
{
	// var headertext = "<a href=\"/#!\" id='home_button' class='small_button'><div></div></a>" +
			// "<a href=\"/#!/?page=discover\" id='discover_button' class='big_button'>Entdecken</a>";
	// $("#content_header").html(headertext);
// 	
// 	
	// //new stuff
	
	$("#content_header").empty()
		.append(getHeaderLink("Entdecken", "/#!/?page=discover", "recipe_btn").addClass("active"));
		//.append(getHeaderLink("Küchengeplapper", "/#!/?page=stream", "discussion_btn"));
	
	$.anycook.graph.recipeOfTheDay(function(json){
		$("#recipe_of_the_day").attr("href", Recipe.getURI(json.name))
	  		.text(json.name);
	});
	
	$.anycook.graph.recipeNumber(function(num){
		$("#num_recipes").text(num);
	});
	
	$.anycook.graph.tagNumber(function(num){
		$("#num_tags").text(num);
	});
	
	$.anycook.graph.ingredientNumber(function(num){
		$("#num_ingredients").text(num);
	});
	
	
	//liveupdatestuff
	newestid = 0;
	$("#news ul").jScrollPane().scroll(newsScrollListener);
	updateLiveAtHome();
}

function clearContent(){
	$("#content_main > *").remove();
	$("#content_header > *").remove();
	$("#btn_container").find(".user_btn").removeClass("active");
	$("#main").find(".lightbox").remove();
}

function getHeaderLink(value, href, id){
	 var $a = $("<a></a>").addClass("header_link").attr("href", href).attr("id", id)
		.append("<div class=\"background\"></div>").append("<div class=\"button\"></div>");
	$a.children(".button").text(value);
	return $a;
}


// behandelt change bei $.address.path
function handleChange(event){
	var lastAddress = $(document).data("lastAddress");
	if(lastAddress == undefined || lastAddress.path != event.path){
		$(document).data("lastAddress", event);
			
		search= new Search();
		
		setTitle("anycook");
		
		//resetSearchBar();
		resetFilter();
		
		$(document).scrollTop(0);
		
		$("#wertung_filter").show();
		$("#content_footer").show();		
		clearContent();
		
		
		var path = event.pathNames;
		//blockFilter(false);
		if(path.length > 0){
			$("#search_reset, #filter_reset").addClass("on");
		}
		else{
			$("#search_reset, #filter_reset").removeClass("on");
		}
		
		
		//$.xml.append(path.length == 0 ? "home" : path[0]);
		$("#content_main").xml("append", path[0], function(){
			switch(path.length){
			case 0:
				$("#user_home").addClass("active");
				loadHome();
				break;
			case 1:
				switch(path[0]){
				// case "search":
					// //fullTextSearch();
					// search = Search.init();
					// search.search();
					// break;
				case "recipeediting":
					setTitle("Neues Rezept erstellen");
					loadNewRecipe();
					break;
				case "feedback":
					setTitle("Feedback");
					loadContact();
					break;
				case "preview":
					loadPreview();
					break;
				case "about_us":
					setTitle("Über uns");
					loadAboutUs();
					break;
				case "impressum":
					setTitle("Impressum");
					break;
				case "fbregistration":
					loadFBRegistrationMessage();
					break;
				case "resetpassword":
					loadResetPasswordStep1();
					break;
				case "registration":
					setTitle("Registrierung");
					showRegistration();
					break;
				case "settings":
					$.anycook.user.settings.load();
					break;
				case "developer":
					setTitle("Entwickler");
					break;
				case "newsstream":
					$("#user_messages").addClass("active");
					loadNewsstream();
					break;
				case "drafts":
					$.anycook.drafts.load();
					break;
				}
				break;
			case 2:
				switch(path[0]){
				case "recipe":
					$("#content_header")
						.append(getHeaderLink("Rezept", "", "recipe_btn"))
						.append(getHeaderLink("Diskussion", "", "discussion_btn"));
					$.anycook.graph.recipe(path[1], loadRecipewJSON);
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
					$("#user_profile").addClass("active");
					loadProfile(path[1]);
					break;
					
				case "resetpassword":
					loadResetPasswordStep2();
					break;
				
				case "messagesession":
					getMessages(path[1]);
					break;
				}
				break;
			case 3:
				switch(path[0]){
				case "recipe":
					$("#content_header")
							.append(getHeaderLink("Rezept", "", "recipe_btn"))
							.append(getHeaderLink("Diskussion", "", "discussion_btn"));
					$.anycook.graph.recipe(path[1], path[2], function(json){
							loadRecipewJSON(json);
				  	});
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
					search.flush();
				};
			}
		});		
	}
	$("#content_header *").removeClass("active");
	
	if(event.pathNames[0]=="recipeediting"){
		newRecipeAdressChange(event);
	}
	else if(event.parameters["page"]!=undefined){
		changePage(event);
	}
	else{
		//wird aufgerufen wenn page=""
		if(event.pathNames.length == 0){
			$("#content_main > div").hide();
			$("#site1").show();
			$("#home_button").addClass("on");
		}else{
			switch(event.pathNames[0]){
				case "newrecipe":
					$("#nr_general_btn").addClass("active");
					animateNewRecipe(0);
					break;
					
				case "recipe":
					$("#recipe_btn").addClass("active");
					$("#discussion_container").hide();
					$("#recipe_container").show();
					break;
				case "search":
					search = Search.init();
					search.search();
					break;
			}
		}
	}
	
	setTitlePrefix();
			
	
}

function setTitle(newTitle){
	if(!newTitle)
		newTitle = $(document).data("title") || "anycook";
	else
		$(document).data("title", newTitle);
	$.address.title(getTitlePrefix()+newTitle);
}

// behandelt change bei $.address.parameters
function changePage(event){
	var page = event.parameters["page"];
	var firstpath = event.pathNames[0];
	switch(event.pathNames.length){
	case 0:
		switch(page){
		case "discover":
			$("#site1").hide();
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
				var $discussionContainer = $("#discussion_container");
				if($discussionContainer.length==0){
					$("#content_main").xml("append", "recipe_discussion");
					//discussion
					$(".center_headline").html("Diskussion zum Rezept<br/>" + decodeURIComponent(event.pathNames[1]));
					var login = user.checkLogin();
					if(login) {
						$("#discussion_footer .nologin").hide();
						$("#discussion_footer img").attr("src", user.getUserImagePath());
						$(".comment_btn").click(comment);
					} else {
						$("#discussion_footer .login").hide();
						$("#no_comment").click(clickSignin);
					}
					loadDiscussion(decodeURI(event.pathNames[1]));
					
				}
				else
					$discussionContainer.show();
				
				$("#discussion_btn").addClass("active");
				break;
			
			case "edit":
				loadRecipeEditing();
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
