//<div class="frame_main_small"></div><div class="frame_right"></div>

/*var position = new Object();
var length = new Object();*/


function loadDiscover(){
	/*$("#neuste_container > *, #leckerste_container > *, #beliebte_container > *").remove();*/
	fillDiscover();
	$(".entdecken_next").click(showNextDiscover);
	//$(".entdecken_back").click(showBackDiscover);
	checkButtons();
	/*$(".entdecken_back").click(function(event){
		var target = event.target;
		var type = $(target.parentNode).attr("id");
		zurueckDiscover(type);
		});
	$(".entdecken_next").click(function(event){
		var target = event.target;
		var type = $(target.parentNode).attr("id");
		weiterDiscover(type);
		});*/
	
}


function fillDiscover(){
		$.ajax({
			  url: "/anycook/GetDiscoverRecipes",
			  dataType: 'json',
			  async:false,
			  success: function(json){
				  for(var type in json){
					  var recipes = json[type];
					  var counter = 0;
					  for(var i in recipes){
							var uri = "#!/recipe/"+encodeURIComponent(recipes[i].name);
							$("#"+type+" .discover_container").append("<a href=\""+uri+"\" class=\"discover_rezept_bild\">" +
									"<img src=\"/gerichtebilder/small/"+recipes[i].imagename+"\"/>" +
									"<div><span>"+recipes[i].name+"</span></div></a>");
							
							$("#"+type+" .discover_container a").last().css("left", 120*counter++);
							
						}
				  }
			  }
			});
}

function showNextDiscover(event){
	//if(!checkFirstPos($(this).prev())){
		$(this).prev().children(".discover_rezept_bild").animate({left: "-=600"}, {duration: 700, complete:checkButtons});
	//}
	
}

function showBackDiscover(event){
	$(this).unbind("click", showBackDiscover);
	if(checkFirstPos($(this).next())){
		$(this).next().children(".discover_rezept_bild").animate({left: "+=600"}, {duration: 700, complete:checkButtons});
	}
	
}

function checkFirstPos(container){
	var firstpos = $(container).find(".discover_rezept_bild").first().position();
	if(firstpos.left == 0)
		return false;
	return true;
}

function checkButtons(){
	var back = $("#neuste .entdecken_back");
	if(!checkFirstPos($("#neuste")) && !back.hasClass("off")){
		back.addClass("off");
		back.unbind(showBackDiscover);
	}
	else if(back.hasClass("off")){
		back.removeClass("off");
		back.click(showBackDiscover);
	}
	
	
	back = $("#leckerste .entdecken_back");
	if(!checkFirstPos($("#leckerste"))&& !back.hasClass("off")){
		back.addClass("off");
		back.unbind(showBackDiscover);
	}
	else if(back.hasClass("off")){
		back.removeClass("off");
		back.click(showBackDiscover);
	}
	
	back = $("#beliebte .entdecken_back");
	if(!checkFirstPos($("#beliebte"))&& !back.hasClass("off")){
		back.addClass("off");
		back.unbind(showBackDiscover);
	}
	else if(back.hasClass("off")){
		back.removeClass("off");
		back.click(showBackDiscover);
	}
}

/*function loadDiscoverRecipe(response, type){
	// Methode lädt neue Elemente hinzu. Sind bereits welche vorhanden, werden sie erst einmal versteckt.
	//$("#"+type+"_container > .frame_main_small:first, #"+type+"_container > .frame_right:first").remove();
	var uri = encodeURI("#!/recipe/"+response.name);
	$("#"+type+"_container").append("<div class=\"frame_small\">" +
			"<a href=\""+uri+"\" class=\"frame_main_small small_rezept\">"+getSmallFrameText(response)+"</a>" +
					"<div class=\"frame_right\"></div></div>");
	var lastcontainer = $("#"+type+"_container > .frame_small").last();	
	cutSmallFrameText(lastcontainer);

	if($("#"+type+"_container > .frame_small").length>2)
		$("#"+type+"_container > .frame_small").last().hide(); 
}

function weiterDiscover(type){
	animateNext(type);
}

function zurueckDiscover(type){
	animateBack(type);
}

function animateNext(type){
	$("#"+type+" .entdecken_back").show();
	var divs = $("#"+type+"_container > .frame_small");
	$(divs[position[type]]).hide();
	$(divs[position[type]+1]).hide();
	if(length[type]-position[type]>3)
		position[type]+=2;
	else
		position[type]+=1;
	$(divs[position[type]]).show().css("marginRight", "8px");
	$(divs[position[type]+1]).show().css("marginRight", 0);
	
	if(length[type]-position[type]<=2)
		$("#"+type+" .entdecken_next").hide();
}

function animateBack(type){
	$("#"+type+" .entdecken_next").show();
	var divs = $("#"+type+"_container > .frame_small");
	$(divs[position[type]]).hide();
	$(divs[position[type]+1]).hide();
	if(position[type]>1)
		position[type]-=2;
	else
		position[type]-=1;
	$(divs[position[type]]).show().css("marginRight", "8px");;
	$(divs[position[type]+1]).show().css("marginRight", "0");;
	
	if(position[type]==0)
		$("#"+type+" .entdecken_back").hide();
	
}*/