/**
 * @author Jan Grassegger
 */

function loadNewRecipe(){
	//navigation
	var path = $.address.path();
	for(var i = 1; i<=4; i++)
		$("#nav_step"+i).attr("href", "#!"+path+"?step="+i);
	$(".nav_button").click(function(){
		if($(this).hasClass("inactive"))
			return false;
	});
	
	
	//step1	
	var decoratorSettings = {color:"#878787"};
	$("#step1 input[type=\"text\"]").inputdecorator("required", decoratorSettings);
	$("#step1 textarea").inputdecorator("required", decoratorSettings);
	$("#step1 form").submit(submitStep1);
	
	//step2
	$("#new_step_container").append(getNewIngredientStep(1));
	$("#add_new_step").click(function(){
		$("#new_step_container")
		.append(getNewIngredientStep($(".new_ingredient_step").length+1));
		resetNewRecipeHeight();
	});
}

function submitStep1(){
	$.address.parameter("step", "2");
	return false;
	//return false;
}

function newRecipeAdressChange(event){
	var $editingContainer = $("#recipe_editing_container");	
	$editingContainer.removeClass("step2 step3");
	var $navigation = $(".navigation");
	$navigation.children().removeClass("active");
	
	var stepNum = Number(event.parameters["step"]);
	if(stepNum == undefined)
		stepNum = 1;
	
	switch(stepNum){
	case 4:
		$navigation.children("#nav_step3").removeClass("inactive");
		
	case 3:
		$navigation.children("#nav_step2").removeClass("inactive");
					
	case 2:
		$navigation.children("#nav_step2").removeClass("inactive");
		
	default:
		$navigation.children("#nav_step"+stepNum).addClass("active");
		$editingContainer.addClass("step"+stepNum);
	}
	
	return false;
}

function getNewIngredientStep(number){
	//step-part
	var $left = $("<div></div>").addClass("left");
	var $dragdrop = $("<div></div>").addClass("step_dragdrop");
	var $number = $("<div></div>").addClass("number").text(number);
	var $numberContainer = $("<div></div>").addClass("number_container")
		.append($dragdrop)
		.append($number)
		.append($dragdrop.clone());
		
	
	var $textarea = $("<textarea></textarea>").addClass("light");
	var $mid = $("<div></div>").addClass("mid")
		.append($numberContainer)
		.append($textarea);
		
	
	var $right = $("<div></div>").addClass("right");
	var $newStep = $("<div></div>").addClass("new_step step")
		.append($left)
		.append($mid)
		.append($right);
	
	//remove step
	var $remove = $("<div></div>").addClass("remove_new_step").append("<span></span>");
	
	//ingredient part
	var $zutaten = $("<h4></h4>").addClass("zutaten_headline").text("Zutatenname");
	var $menge = $("<h4></h4>").addClass("menge_headline").text("Menge");
	var $newIngredientList = $("<ul></ul>")
		.append(getNewIngredientLine);
	var $addingredientLine = $("<div></div>").addClass("add_new_ingredient_line")
		.append("<span></span>");
	var $newIngredients  = $("<div></div>").addClass("new_ingredients")
		.append($zutaten)
		.append($menge)
		.append($newIngredientList)
		.append($addingredientLine);
	
	
	//all
	var $newIngredientStep = $("<li></li>").addClass("new_ingredient_step")
		.append($newStep)
		.append($newIngredients)
		.append($remove);
		
	return $newIngredientStep;	
}

function getNewIngredientLine(){
	var $dragdrop = $("<div></div>").addClass("ingredient_dragdrop");	
	var $ingredient = $("<input type=\"text\">").addClass("new_ingredient");
	var $menge = $("<input type=\"text\">").addClass("new_ingredient_menge");
	var $remove = $("<div></div>").addClass("remove_new_ingredient_line")
		.append("<span></span>");
	
	var $newIngredientLine = $("<li></li>").addClass("new_ingredient_line")
		.append($dragdrop)
		.append($ingredient)
		.append($menge)
		.append($remove);
		
	return $newIngredientLine;
}

function resetNewRecipeHeight(){
	
}
