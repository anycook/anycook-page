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
	$.address.parameter("page", "step2");
	//return false;
}
