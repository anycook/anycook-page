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
	
	var $container = $("#container");
	var containerposition = $container.offset();
	var left = containerposition.left + $container.innerWidth() + 9 - $lightbox.innerWidth();
	$lightbox.data("left", left).css({left:left}).hide();
	return $lightbox;
}

function showLightbox($lightbox, top){
	
	var left = $lightbox.show();
	$lightbox.css({top:top})	
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

function hideLightbox($lightbox){
	$lightbox.fadeOut(200, function(){
			$(this).css({left:$lightbox.data("left")});
			
	});
}

//ingredientLightBox
function makeIngredientLightBox(){
	//ingredientOverview
	var $input = $("<input/>").attr({id:"new_num_persons", type:"text", placeholder:"0", size:"2", maxlength:"2"});
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
	$("#ingredient_overview").click(showIngredientLightbox);
}

function showIngredientLightbox(){
	var $this = $(this);
	var $lightbox = $(".lightbox");
	var top = $("#ingredient_overview").offset().top;
	if(getIngrededientsForOverview())
		showLightbox($lightbox, top);
	else{
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
	});
	
	return !noingredients;
}



