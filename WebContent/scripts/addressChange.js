function loadHome(json)
{
	var headertext = "<div id='home_button' class='small_button'><div></div></div><div id='discover_button' class='big_button'>Entdecken</div>";
	$("#content_header").html(headertext);
	$("#home_button").addClass("on");
	$("#home_button").click(function(event){$.address.parameter("page", "");});
	$("#discover_button").click(function(event){$.address.parameter("page", "discover");});
	
	
	//new stuff
	$("#tagesrezept_inhalt").append(getSmallFrameText(json));
	cutSmallFrameText($("#tagesrezept_inhalt"));
	$("#tagesrezept_inhalt").attr("href", "#/recipe/"+json.name);
	
	$.ajax({
		  url: "/anycook/GetPopularTags",
		  dataType: 'json',
		  data: "num=14",
		  success: loadFamousTags
		});
	
	
	
	
	
	//liveupdatestuff
	newestid = 0;
	updateLiveAtHome();
}




function loadNewRecipe(){
	$.ajax({
		url: "/anycook/Login",
		success: function(response){
		if(response=="false")
			$.address.path("");
		else
			{
				var headertext = "<div id='nr_general_btn' class='big_button'>Generelles</div><div class='nr_dots'></div><div id='nr_schritte_btn' class='big_button inactive'>Schritte</div><div class='nr_dots'></div><div id='nr_zutaten_btn' class='big_button inactive'>Zutaten</div><div class='nr_dots'></div><div id='nr_abschluss_btn' class='big_button inactive'>Abschluss</div>";
				$("#content_header").html(headertext);
				$("#filter_headline").text("Fortschritt");
				$("#nr_general_btn").addClass("on");
				$("#filter_main").after("<div id='progress_1'><div id='nr_name'>Rezeptname</div><div id='nr_kategorie'>Keine Kategorie</div><div id='nr_upload'>Bildupload:</div><div id='upload'><div id='progressborder'><div id='progress'><div id='progress_percent'></div></div></div></div></div>");
				$("#progress_1 > *").animate({"opacity":.0}, 0);
				$("#filter_main").animate({height:0, paddingBottom:0},1000).contents().animate({"opacity":0}, {duration:1000, complete:function(){
					$("#filter_main").hide();
					$("#progress_1 > *").animate({"opacity":1}, 500);
					$("#filter_main > *").hide();
				}});
				
				$("#filter_main").css("height", "auto");
				
				
				//actionListener
				$("#recipe_name, #recipe_beschreibung").focus(function(event){
					var target = $(event.target);
					target.removeClass("wrong");
				});
				$(".step_1_right .kategorie_filter").click(function(){
					$(".step_1_right .kategorie_filter").removeClass("wrong");
				});
				
				//header
				$("#nr_general_btn").click(clickNewRecipeHeader);
				$(".next_step").click(nextStep);
				
				//step1
				$("#recipe_name").focus(focusNewRecipe);
				$("#recipe_name").focusout(focusoutNewRecipe);
				$("#recipe_name").keypress(newRecipeKeypress).keydown(newRecipeKeydown);
				
				$("#recipe_beschreibung").focus(focusNRBeschreibung);
				$("#recipe_beschreibung").focusout(focusoutNRBeschreibung);
				$("#recipe_beschreibung").keydown(beschreibungCounter);
				
				loadAllKategories($(".step_1_right ul.kategorie_filter"));
				$(".step_1_right ul.kategorie_filter").hide();
				$(".step_1_right .recipe_kategorie").click(handleNRKategories);
				
				var uploader = new qq.FileUploader({
				    // pass the dom node (ex. $(selector)[0] for jQuery users)
				    element: document.getElementById('file_uploader'),
				    onSubmit:addProgressBar,
				    onProgress:nrProgress,
				    onComplete:completeUpload,
				    // path to server-side upload script
				    action: '/anycook/UploadImage'
				});
				
				
				//step2
				$("#neuer_schritt").click(addNewSchritt);
				$(".remove_schritt").live("click", removeNewSchritt);
				$(".step_textarea").live("keydown", schrittCounter);
				
				//step3
				$(".step_3_deletebtn").live("click", deleteNewZutat);
				$(".new_zutat_name").live("keyup", keyupNewZutat);
				$("#new_zutat").click(addNewZutat);
				
				//step4
				makeTagCloud();
				$("#tagcloud span span").live("click", addNewTag);
				$("#recipe_tags").click(handleNewTagClick);
				$(".step_4_left .label_chefhats, .step_4_left .label_muffins").mouseover(function(event){
						mouseoverRadio(event.target);
            	});
				$(".label_stars, .label_chefhats, .label_muffins").mouseleave(function(event){
            			handleRadios(event.target);
            	});
				$(".step_4_left .label_chefhats, .step_4_left .label_muffins").click(checkNewOnOff);
				$("#recipe_ready").click(finishNewRecipe);
			}
	}
	});
}

function clearContent(){
	$("#content_main > *").remove();
	$("#content_header > *").remove();
}


// behandelt change bei $.address.path
function handleChange(event){
	if(lastPath != event.path){
		lastPath = event.path;
		
		
		if($.address.title() != "anycook")
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
	  		  success: loadHome
			});
			break;
		case 1:
			if(path[0]=="search"){
				setFiltersfromSession();
				fullTextSearch();
			}
			else if(path[0]=="newrecipe"){
				loadNewRecipe();
			}
			else if(path[0] == "profile"){
				loadUserProfile();
			}
			else if(path[0]=="kontakt"){
				loadContact();
			}
			break;
		case 2:
			if(path[0]== "recipe"){
				$.ajax({
		  		  url: "/anycook/LoadRecipe",
		  		  dataType: 'json',
		  		  async:false,
		  		  data: {recipe:path[1]},
		  		  success: function(json){
					loadRecipe(json);
				}
		  		});
				$("#content_footer").hide();
			}
			if(path[0] == "search"){
				setFiltersfromSession();
				$("#search").focus();
				$("#search").val(path[1]);
				fullTextSearch();
			}
			if(path[0] == "activate"){
				activateUser(path[1]);
			}
			break;	
		}
	}
	$("#content_header div").removeClass("on");
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
		if(page=="schritte"){
			$("#nr_schritte_btn").addClass("on");			
			$("#new_recipe_step2").show();
			if($("#progress_2").length == 0){
				$("#progress_1").after("<div id='progress_2'></div>");
				$("#progress_2").animate({"height": 90}, {duration:1000,complete:function(){
					$("#progress_2").append("<div class='nr_devider'></div><div id='nr_statussteps'>Du hast<br /><span id='nr_stepnumber'>00</span> Schritte eingerichtet.</div>");
					$("#progress_2 > *").animate({"opacity": .0}, 0);
					$("#progress_2 > *").animate({"opacity": 1.0}, 500);}});
				
				
			}
		}
		else if(page=="zutaten"){
			$("#nr_zutaten_btn").addClass("on");
			$("#new_recipe_step3").show();
			if($("#progress_3").length == 0){
				$("#progress_2").after("<div id='progress_3'></div>");
				$("#progress_3").animate({"height": 90}, {duration:1000,complete:function(){
					$("#progress_3").append("<div class='nr_devider'></div><div id='nr_statuszutaten'>Dein Rezept hat ganze<br /><span id='nr_zutatennumber'>00</span> Zutaten.</div>");
					$("#progress_3 > *").animate({"opacity": .0}, 0);
					$("#progress_3 > *").animate({"opacity": 1.0}, {duration:500, complete:function(){
						//setzt zähler auf den ersten Stand
						var reihen = 0;
						$(".new_zutat_name").each(function(index, value){
							if($(value).val().length > 0)
								reihen++;
						});
						if(reihen<10)
							reihen="0"+reihen;
						$("#nr_zutatennumber").text(reihen);
					}});}});
			}
			
		}
		else if(page=="abschluss"){
			$("#nr_abschluss_btn").addClass("on");
			$("#new_recipe_step4").show();
			if($("#progress_4").length == 0){
				$("#progress_3").after("<div id='progress_4'></div>");
				$("#progress_4").animate({"height": 90}, {duration:1000,complete:function(){
					$("#progress_4").append("<div class='nr_devider'></div><div id='nr_statustags'>Mit <span id='nr_tagnumber'>00</span> Tags lässt sich<br /> dein Rezept besser finden.</div>");
					$("#progress_4 > *").animate({"opacity": .0}, 0);
					$("#progress_4 > *").animate({"opacity": 1.0}, {duration: 500});
					}});
			}
		}
		else{
			$.address.queryString("");
		}
	}else{
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
var lastPath="";
$.address.change(handleChange);
