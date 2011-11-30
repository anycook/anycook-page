function getLightbox(headline, subhead, $content, inputvalue){
	var $h2 = $("<h2></h2>").html(headline);
	var $subhead = $("<p></p>").html(subhead);
	var $lightboxcontent = $("<div></div>").addClass("ligthbox_content")
		.append($content);
		
	var $submit = $("<input type=\"submit\"/>").val(inputvalue);
	
	var $form = $("<form></form>")
		.append($lightboxcontent)
		.append($submit);
	
	var $contentbox = $("<div></div>").addClass("contentbox")
		.append($h2)
		.append($subhead)
		.append($form);
		
	var $dogear = $("<div></div>").addClass("dogear")
		.append("<div class=\"top\"></div>")
		.append("<div class=\"middle\"></div>")
		.append("<div class=\"bottom\"></div>");
	var $lightbox = $("<div></div>").addClass("lightbox")
		.append($dogear)
		.append("<div class=\"mask\"></div>")
		.append($contentbox);
	
	
	
	
	
	$("#main").append($lightbox);
	
	$lightbox.css({left:getLightBoxLeft()}).hide();
	return $lightbox;
}

function showLightbox($lightbox, top){
	
	$lightbox.show();
	resizeLightbox();
	
	
	$lightbox.css({top:top, left:getLightBoxLeft()})	
		.find(".dogear").animate({
			right:0,
			top:0
		},
		{
			duration:150,
			easing: "swing",
			complete:function(){
				$(".contentbox").animate({
					left: 3
				}, {duration: 500});
			}
		});
		
	$("body").click(function(event){
		var $target = $(event.target);
		if($target.parents().andSelf().is(".lightbox")||
			$target.parents().andSelf().is(".lightbox-autocomplete"))
			return;
			
		hideLightbox($lightbox);
		
		$(this).unbind("click");
	});
}

function showLightboxfromBottom($lightbox, bottom){
	
	$lightbox.show();
	resizeLightbox();
	var top = bottom - $lightbox.outerHeight();
	$lightbox.css({top:top, left:getLightBoxLeft()})	
		.find(".dogear").animate({
			right:0,
			top:0
		},
		{
			duration:150,
			easing: "swing",
			complete:function(){
				$(".contentbox").animate({
					left: 3
				}, {duration: 500});
			}
		});
		
	$("body").click(function(event){
		var $target = $(event.target);
		if($target.parents().andSelf().is(".lightbox")||
			$target.parents().andSelf().is(".lightbox-autocomplete"))
			return;
			
		hideLightbox($lightbox);
		
		$(this).unbind("click");
	});
}

function hideLightbox(){
	$(".lightbox").fadeOut(200, function(){
			$(this).css({left:getLightBoxLeft()});
			
	});
}

//ingredientLightBox
function makeIngredientLightBox(){
	//ingredientOverview
	var $input = $("<input/>").attr({id:"new_num_persons", type:"text", placeholder:"0", size:"2", maxlength:"2", value:"2"});
	var $up = $("<div></div>").addClass("up");
	var $down = $("<div></div>").addClass("down");
	var $numberinput = $("<div></div>")
		.addClass("numberinput")
		.attr("id", "new_person_num")
		.append($input)
		.append($up)
		.append($down);
	var $headline = $("<div></div>")
		.append("<span>Zutaten für </span>")
		.append($numberinput)
		.append("<span> Personen</span>");
		
	var $ul =$("<ul></ul>").addClass("new_ingredient_list");
		
	var $content = $("<div></div>")
		.append($ul);	

	var $lightbox = getLightbox($headline.children(), 
	"Dies sind alle Zutaten, die du in den Schritten angegeben hast. "+ 
	"Falls Zutaten fehlen, füge diese bitte noch zu den entsprechenden Schritten hinzu.", $content, "Rezept abschließen")
		.addClass("ingredient_overview");
	$("#main").append($lightbox);
	
	$lightbox.find("form").submit(submitStep2);
	$("#ingredient_overview").click(showIngredientLightbox);
	
	$input.keydown(function(e){
		var $this = $(this);
		if(e.which==13){
			persCount = $this.val();
			$this.blur();
		}else if(e.which == 38){ //up{
			newPersonsUp();
			return false;
		}else if(e.which == 40){ //down
			newPersonsDown();
			return false;
		}else if(!(event.which>=48 &&  event.which<=57) && !(event.which>=96 &&  event.which<=105) && event.which != 8 && event.which != 46)
			return false;
		
	});
	
	$up.click(newPersonsUp);
	
	$down.click(newPersonsDown);
}

function newPersonsUp(){
	var $input = $("#new_num_persons");
	var currentNum = Number($input.val());
	var newNum = ((currentNum)%99)+1;
	$input.val(newNum);
}

function newPersonsDown(){
	var $input = $("#new_num_persons");
	var currentNum = Number($input.val());
	var newNum = ((99 - 2 + currentNum)%99)+1;
	$input.val(newNum);
}

function showIngredientLightbox(){
	var $this = $(this);
	var $lightbox = $(".lightbox");
	if(getIngrededientsForOverview()){
		var $ingredientOverview = $("#ingredient_overview");
		var bottom = $ingredientOverview.offset().top - 60;
		showLightboxfromBottom($lightbox, bottom);
	}else{
		$("#no_ingredients_error").fadeIn(300);
		$this.effect("shake", {distance:5, times:2}, 50);
		watchForIngredients();
	}
	return false;
}

function getIngrededientsForOverview(){
	var ingredients = {};
	var noingredients = true;
	
	
	$("#step2 .new_ingredient_line").each(function(){
		var $this = $(this);
		var ingredient = $this.children(".new_ingredient").val();
		if(ingredient.length == 0)
			return;
		noingredients = false;
		var menge = $this.children(".new_ingredient_menge").val();
		if(ingredients[ingredient] != undefined)
			ingredients[ingredient] = mergeMenge(ingredients[ingredient], menge);
		else
			ingredients[ingredient] = menge;
		
	});
	
	
	var $ul = $(".lightbox ul").empty();
	for(var ingredient in ingredients){
		var $ingredientLine = getNewIngredientLine();
		$ingredientLine.children(".new_ingredient").val(ingredient);
		$ingredientLine.children(".new_ingredient_menge").val(ingredients[ingredient]);
		$ul.append($ingredientLine);
	}
	
	return !noingredients;
}

function resizeLightbox(){
	var $lightbox = $(".lightbox");
	var $contentBox = $lightbox.children(".contentbox");
	var contentHeight = $contentBox.outerHeight();
	$lightbox.height(contentHeight + $contentBox.position().top);
}

function getLightBoxLeft(){
	var $container = $("#container");
	var $lightbox = $(".lightbox");
	var containerposition = $container.offset();
	// var left = containerposition.left + $container.innerWidth() + 9 - $lightbox.innerWidth();
	var left = containerposition.left + $container.innerWidth() + 9 - $lightbox.innerWidth();
	return left;
}



