/**
 * @author Jan Grassegger
 */

function loadNewRecipe(){
	var decoratorSettings = {color:"#878787"};
	$("#step1 input[type=\"text\"]").inputdecorator("required", decoratorSettings);
	$("#step1 textarea").inputdecorator("required", decoratorSettings);
	$("#step1 form").submit(submitStep1);
}

function submitStep1(){
	$("#recipe_editing_container").removeClass("step3").addClass("step2");
	return false;
}
