//<div class="frame_main_small"></div><div class="frame_right"></div>

/*var position = new Object();
var length = new Object();*/


function loadDiscover(){
	/*$("#neuste_container > *, #leckerste_container > *, #beliebte_container > *").remove();*/
	fillDiscover();
	$(".scroll_right").click(showNextDiscover).disableSelection();
	$(".scroll_left").click(showBackDiscover).addClass("off").disableSelection();
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
			success: function(json){
				for(var i = 0; i<json.leckerste.length; i++){
					for(var type in json){
						var recipe = json[type][i];
							var uri = "#!/recipe/"+encodeURIComponent(recipe.name);
							$("#"+type+" .discover_border .discover_container").append("<a href=\""+uri+"\" class=\"recipe_thumbnail\">" +
									"<img src=\"http://graph.anycook.de/recipe/"+recipe.name+"/image?type=small\"/>" +
									"<div><span>"+recipe.name+"</span></div></a>");
							
							$("#"+type+" .discover_border .discover_container a").last().css("margin-left", 120*i);							
					}
				}
			}				  
			});
}

function showNextDiscover(event){
	var $entdecken = $(this).parents(".entdecken");
	var $discoverContainer = $entdecken.find(".discover_container");
	var $toAnimate = $discoverContainer.children(".recipe_thumbnail").first().stop(true,true);
	if(checkRightPos($discoverContainer)){
		$toAnimate.animate({left: "-=600"}, 
				{duration: 700, step:synchronizeDiscover, complete:checkButtons});
	}
	
}

function showBackDiscover(event){
	var $entdecken = $(this).parents(".entdecken");
	var $discoverContainer = $entdecken.find(".discover_container");
	var $toAnimate = $discoverContainer.children(".recipe_thumbnail").first().stop(true,true);
	if(checkLeftPos($discoverContainer)){
		$toAnimate.animate({left: "+=600"}, 
				{duration: 700,  step:synchronizeDiscover, complete:checkButtons});
	}
	
}

function synchronizeDiscover(now){
	$(this).siblings().css("left", now);
}

function checkLeftPos($container){
	var firstpos = $container.find(".recipe_thumbnail").first().position();
	if(firstpos.left >= 0)
		return false;
	return true;
}

function checkRightPos($container){
	var $elements = $container.find(".recipe_thumbnail");
	var firstpos = $elements.first().position();
	if(firstpos.left <= -($elements.length-5)*120)
		return false;
	return true;
}


function checkButtons(){
	var $entdecken = $(this).parents(".entdecken");
	var $discoverContainer = $entdecken.find(".discover_container");
	var $back = $entdecken.find(".entdecken_back");
	if(!checkLeftPos($discoverContainer) && !$back.hasClass("off")){
		$back.addClass("off");
	}
	else if($back.hasClass("off")){
		$back.removeClass("off");
	}
	
	var $next = $entdecken.find(".entdecken_next")
	if(!checkRightPos($discoverContainer) && !$next.hasClass("off")){
		$next.addClass("off");
	}
	else if($next.hasClass("off")){
		$next.removeClass("off");
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