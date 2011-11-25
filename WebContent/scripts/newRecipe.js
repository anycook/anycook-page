/**
 * @author Jan Grassegger
 */

function loadNewRecipe(){
	$("#recipe_editing_container").data("address", {path:$.address.path(),value:$.address.value()});
	
	var decoratorSettings = {color:"#878787"};
	$("#step1 input[type=\"text\"]").inputdecorator("required", decoratorSettings);
	$("#step1 textarea").inputdecorator("required", decoratorSettings);
	$("#step1 form").submit(submitStep1);
	//$.address.unbind("change", handleChange);
}

function submitStep1(){
	$.address.parameter("step", "2");
	return false;
	//return false;
}

function newRecipeAdressChange(event){
	var $editingContainer = $("#recipe_editing_container");	
	$editingContainer.removeClass("step2 step3");
	
	switch(Number(event.parameters["step"])){			
	case 2:
		$editingContainer.addClass("step2");
		break;
		
	case 3:
		$editingContainer.addClass("step3");
		break;
	}
	
	return false;
}
