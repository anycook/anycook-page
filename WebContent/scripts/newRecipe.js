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
	var $firstStep = getNewIngredientStep(1);
	$("#new_step_container").append($firstStep)
		.sortable({
			//placeholder: "ui-state-highlight",
			//cursorAt:"top",
			distance: 15,
			axis: "y"
		});
		//.disableSelection();
	$firstStep.find("textarea").inputdecorator("maxlength", {color:"#878787", decoratorFontSize:"8pt"});
	$("#add_new_step").click(function(){
		var $newStep = getNewIngredientStep($(".new_ingredient_step").length+1);
		
		$("#new_step_container")
		.append($newStep);
		$newStep.find("textarea").inputdecorator("maxlength", {color:"#878787", decoratorFontSize:"8pt"});
		resetNewRecipeHeight();
	});
	makeIngredientLightBox();
	watchSteps();
	
	
	
}

function submitStep1(){
	$.address.parameter("step", "2");
	return false;
	//return false;
}

function submitStep2(){
	hideLightbox();
	$.address.parameter("step", "3");
	return false;
}

function newRecipeAdressChange(event){
	var $editingContainer = $("#recipe_editing_container");	
	$editingContainer.removeClass("step2 step3");
	var $navigation = $(".navigation");
	$navigation.children().removeClass("active");
	$("#recipe_editing_container").css("height", "");
	
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
		resetNewRecipeHeight();
		
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
		
	var decoratorSettings = {color:"#878787"};
	var $textarea = $("<textarea></textarea>").addClass("light")
		.attr("maxlength", 260);
	var $mid = $("<div></div>").addClass("mid")
		.append($numberContainer)
		.append($textarea);
		
	
	var $right = $("<div></div>").addClass("right");
	var $newStep = $("<div></div>").addClass("new_step step")
		.append($left)
		.append($mid)
		.append($right);
	
	//remove step
	var $remove = $("<div></div>").addClass("remove_new_step")
		.append("<span></span>")
		.click(removeNewStep);
	
	//ingredient part
	var $zutaten = $("<h4></h4>").addClass("zutaten_headline").text("Zutatenname");
	var $menge = $("<h4></h4>").addClass("menge_headline").text("Menge");
	var $newIngredientList = $("<ul></ul>").addClass("new_ingredient_list")
		.append(getNewIngredientLine)
		.sortable({
			placeholder: "ui-state-highlight",
			cursorAt:"top",
			distance: 15,
			axis: "y"
		});
		//.disableSelection();
	var $addingredientLine = $("<div></div>").addClass("add_new_ingredient_line")
		.append("<span></span>")
		.click(addNewIngredientLine);
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
	var $menge = $("<input type=\"text\">").addClass("new_ingredient_menge")
		.focusout(formatMenge);
	var $remove = $("<div></div>").addClass("remove_new_ingredient_line")
		.append("<span></span>")
		.click(removeNewIngredientLine);
	
	var $newIngredientLine = $("<li></li>").addClass("new_ingredient_line")
		.append($dragdrop)
		.append($ingredient)
		.append($menge)
		.append($remove);
		
	return $newIngredientLine;
}

function resetNewRecipeHeight(){
	$("#recipe_editing_container").animate({height:$("#step2").height()}, {duration:500});
}

function removeNewStep(){
	var $this = $(this);
	var $step = $this.parent();
	
	if($step.siblings().length > 0){
		$step.remove();
		makeStepNumbers();
		resetNewRecipeHeight();
	}
	
}

function makeStepNumbers(){
	$(".new_ingredient_step .number").each(function(i){
		$(this).text(i+1);
	});
}

function addNewIngredientLine(){
	var $this = $(this);
	var $list = $this.prev();
	$list.append(getNewIngredientLine());
	resetNewRecipeHeight();
}

function removeNewIngredientLine(){
	var $this = $(this);
	var $li = $this.parent();
	if($li.siblings().length > 0){
		$li.remove();
		resetNewRecipeHeight();
	}
}

function watchForIngredients(){
	var id = $(document).data("watchForIngredients");
	var $newIngredients = $(".new_ingredient");
	if($newIngredients.length == 0){
		$(document).removeData("watchForIngredients");
		window.clearInterval(id);
		return;
	}
	if(id == undefined){
		id = window.setInterval("watchForIngredients()", 1000);
		$(document).data("watchForIngredients", id);
	}
	
	for(var i = 0; i < $newIngredients.length; i++){
		if($($newIngredients[i]).val().length>0){
			$(document).removeData("watchForIngredients");
			window.clearInterval(id);
			$("#no_ingredients_error").fadeOut(300);
			break;
		}
	}
	
}

function watchSteps(){
	var id = $(document).data("watchSteps");
	var $newIngredientSteps = $(".new_ingredient_step");
	if($newIngredientSteps.length == 0){
		$(document).removeData("watchSteps");
		window.clearInterval(id);
		return;
	}
	
	if(id == undefined){
		id = window.setInterval("watchSteps()", 3000);
		$(document).data("watchSteps", id);
	}
	
	$(".new_ingredient_step").each(function(){
		var $this = $(this);
		var text = $this.find("textarea").val();
		
		var $stepIngredients = $this.find(".new_ingredient");
		var ingredients = [];
		for(var i = 0; i < $stepIngredients.length; i++){
			ingredients[i] = $($stepIngredients[i]).val();
		}
		
		if(text.length == 0)
			return;
		var lastSentences = $this.data("sentences");
		if(lastSentences == undefined)
			lastSentences = [];
		
		var currentSentences = text.split(/[!.?:;]+/g);
		$this.data("sentences", currentSentences);
		//console.log(currentSentences);
		for(var i = 0; i < currentSentences.length; i++){
			if(lastSentences.length > i && currentSentences[i] == lastSentences[i] || currentSentences[i].length == 0)
				continue;
				
				
			$.getJSON("/anycook/GetZutatenfromSchritte?q="+encodeURIComponent(currentSentences[i]), function(json){
				for(var i in json){
					if($.inArray(json[i], ingredients) > -1)
						continue;
					
					var $stepIngredients = $this.find(".new_ingredient");
					var $ingredientLine = null;
					for(var j = 0; j < $stepIngredients.length; j++){
						var $stepIngredient = $($stepIngredients[j]);
						if($stepIngredient.val().length == 0)
							$ingredientLine = $stepIngredient.parent();
					}
					
					if($ingredientLine == null){
						$ingredientLine = getNewIngredientLine().hide();
						$this.find(".new_ingredient_list").append($ingredientLine.fadeIn(300));
					}
					
					$ingredientLine.children(".new_ingredient").val(json[i]);
				}
				resetNewRecipeHeight();
				
			});
		}
		
	});
}

function formatMenge(){
	var $this = $(this);
	var text = $this.val();
	if(text.length == 0) return;
	var textArr = $this.val().split("");
	var newText = textArr[0];
	for(var i = 0; i<textArr.length -1; i++){
		if(textArr[i].match(/\d/) && textArr[i+1].match(/[a-z]/i))
			newText+= " ";
		if(textArr[i+1].match(/\./))
			newText+=",";
		else
			newText+=textArr[i+1];
	}
	$this.val(newText);
}

function mergeMenge(menge1, menge2){
	//TODO falls z.B. kg und g zusammen auftreten etc...
	
	if(menge2.length == 0)
		return menge1;
	var newMenge;
	menge1 = menge1.replace(/,/, ".");
	menge2 = menge2.replace(/,/, ".");
	var confirmRegex1 = /(\d+|\d+.\d+) [a-z]+/i;
	var confirmRegex2 = /(\d+|\d+.\d+)/i;
	if(menge1.match(confirmRegex1) && menge2.match(confirmRegex1)){
		var menge1EinheitPos = menge1.search(/[a-z]+/i);
		var menge2EinheitPos = menge2.search(/[a-z]+/i);
		var menge1Einheit = menge1.substring(menge1EinheitPos);
		var menge2Einheit = menge2.substring(menge2EinheitPos);
		
		if(menge1Einheit == menge2Einheit){
			newMenge =  (Number(menge1.substring(0, menge1EinheitPos-1)) + 
				Number(menge2.substring(0, menge1EinheitPos-1)))+" "+menge1Einheit;			
		}
			
	}else if(menge1.match(confirmRegex2) && menge2.match(confirmRegex2)){
		newMenge = Number(menge1) + Number(menge2);
	}
	if(newMenge === undefined)
		newMenge = menge1+" + "+menge2;
	newMenge = newMenge.replace(".", ",");
	return newMenge;
}
