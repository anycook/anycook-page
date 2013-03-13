//<div class="frame_main_small"></div><div class="frame_right"></div>

/*var position = new Object();
var length = new Object();*/


function loadDiscover(){
	/*$("#neuste_container > *, #leckerste_container > *, #beliebte_container > *").remove();*/
	$.anycook.graph.discover.recommended(function(json){
		$("#discover_recommended").recipeoverview("diese Rezepte könnten dir auch schmecken...", json);
	});
	
	$.anycook.graph.discover.tasty(function(json){
		$("#discover_tasty").recipeoverview("leckerste Rezepte", json);
	});
	
	
	$.anycook.graph.discover.new(function(json){
		$("#discover_new").recipeoverview("neueste Rezepte", json);
	});	
}


function fillDiscover(recipes, type){
	
		for(var i = 0; i<recipes.length; i++){
			var recipe = recipes[i];
			var uri = "#!/recipe/"+encodeURIComponent(recipe);
			$("#"+type+" .discover_border .discover_container").append("<a href=\""+uri+"\" class=\"recipe_thumbnail\">" +
					"<img src=\"http://graph.anycook.de/recipe/"+recipe+"/image?type=small\"/>" +
					"<div><span>"+recipe+"</span></div></a>");
			
			$("#"+type+" .discover_border .discover_container a").last().css("margin-left", 120*i);
		}
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