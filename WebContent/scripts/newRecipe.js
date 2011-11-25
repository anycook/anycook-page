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
	$.address.parameter("page", "step2");
	//return false;
}

function newRecipeAdressChange(event){
	var $editingContainer = $("#recipe_editing_container");
	if($editingContainer.length == 0)
		return;
	
	var oldAddress = $editingContainer.data("address");
	if(oldAddress.path == event.path){
		$editingContainer.removeClass("step2 step3");
		
		switch(event.parameters["step"]){			
		case 2:
			$editingContainer.addClass("step2");
			break;
			
		case 3:
			
			break;
		}
		
		return false;
	}
	
	var check = confirm("Willst du wirklich aufhören, ein Rezept zu erstellen?");
	if(!check){
		$.address.value(oldAddress.value);
		return false;
	}
}
