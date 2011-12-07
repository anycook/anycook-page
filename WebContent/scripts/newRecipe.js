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
	$("#step1 input[type=\"text\"]").inputdecorator("required", decoratorSettings).focusout(function(){
		saveDraft("name", $(this).val());
	});
	$("#step1 textarea").inputdecorator("required", decoratorSettings).focusout(function(){
		saveDraft("description", $(this).val());
	});
	$("#step1 form").submit(submitStep1);
	
	new qq.FileUploader({
	    // pass the dom node (ex. $(selector)[0] for jQuery users)
	    element: $("#upload_button")[0],
	    multiple:false,
	    onSubmit:addProgressBar,
	    onProgress:nrProgress,
	    onComplete:completeUpload,
	    // path to server-side upload script
	    action: '/anycook/UploadRecipeImage'
	});
	
	
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
	
	$("#step2").on("focusout", "input, textarea", draftSteps);
	
	//step3
	
	$.getJSON("/anycook/GetAllKategories", function(json){
		var $category_select = $("#category_select");
		for(var category in json)
			$category_select.append("<option>"+category+"</option>");
	});
	$("#category_select").change(function(event){
		var $this = $(this);
		var text = $this.val();
		var span = $("#select_container span").text(text);
		saveDraft("category", text);
	});
	
	$("#step3 .label_chefhats, #step3 .label_muffins").click(function(){
		var $inputs = $(this).children("input");
		$inputs.attr("checked") ? $inputs.removeAttr("checked") : $inputs.attr("checked", "checked");
        handleRadios(this);
        
        var $this = $(this);
        if($inputs.attr("checked"))
        	saveDraft($inputs.attr("name"), $inputs.val());
        else
        	saveDraft($inputs.attr("name"), "0");
    	// must return false or function is sometimes called twice
    	return false;
    }).mouseover(function(){
    		mouseoverRadio(this);
	}).mouseleave(function(){
			handleRadios(this);
	});
	$("#step3 .std,#step3 .min")
		.keydown(keyTime)
		.change(draftTime)
		.keyup(draftTime)
		.siblings(".up, .down")
		.click(timeUpDownListener)
		.click(draftTime);
	makeTagCloud();
	
	
	//draft
	if(user.checkLogin()){
		var id = $.address.parameter("id");
		if(id == undefined){
			$.ajax({
				url:"/anycook/SaveDraft", 
				async:false,
				success:function(newid){
					$.address.parameter("id", newid);
					$(".nav_button").attr("href", function(i, attr){
						return attr+"&id="+newid;
					});
			}});
			return;
		}else{
			$.getJSON("/anycook/SaveDraft?id="+id, fillNewRecipe);
			//link
			$(".nav_button").attr("href", function(i, attr){
					return attr+"&id="+id;
			});	
		}
	}
}

function submitStep1(){
	var $this = $(this);
	var check = true;
	var $name = $this.find("#new_recipe_name");
	if($name.val().length == 0){
		$this.find("#new_recipe_name_error").fadeIn(300);
		check=false;
	}
	
	var $introduction = $this.find("#new_recipe_introduction");
	if($introduction.val().length == 0){
		$this.find("#new_recipe_introduction_error").fadeIn(300);
		check=false;
	}
	
	if(check)
		$.address.parameter("step", "2");
	else{
		$this.find("input[type=\"submit\"]").effect("shake", {distance:5, times:2}, 50);
		watchIntroduction();
	}
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
	if(!stepNum)
		stepNum = 1;
	
	
	var step1Left = 0;
	switch(stepNum){
	case 4:
		$navigation.children("#nav_step4").removeClass("inactive");
		step1Left -= 655;
		
	case 3:
		$navigation.children("#nav_step3").removeClass("inactive");
		step1Left -= 655;
					
	case 2:
		$navigation.children("#nav_step2").removeClass("inactive");
		resetNewRecipeHeight();
		step1Left -= 655;
		
	default:
		$navigation.children("#nav_step"+stepNum).addClass("active");
		var $step1 = $("#step1");
		var $step2 = $("#step2");
		var $step3 = $("#step3");
		var $step4 = $("#step4");
		$step1.animate({left:step1Left}, 
			{
				duration: 800,
				easing: "easeInOutCirc",
				step:function(now, fx){
					$step2.css("left",now+655);
					$step3.css("left",now+2*655);
					$step4.css("left",now+3*655);
				}
			});
	}
	
	return false;
}


//drafts
function fillNewRecipe(json){
	if(json.name)
		$("#new_recipe_name").val(json.name);
	if(json.description)
		$("#new_recipe_introduction").val(json.description);
	if(json.steps)
		fillSteps(json.steps);
	if(json.ingredients)
		fillIngredients(json.ingredients);
	if(json.category){
		var $container = $("#select_container");
		$container.find("span").text(json.category);
		$container.find("option").attr("selected", "").each(function(){
			var $this = $(this);
			if($this.val() == json.category)
				$this.attr("selected", "selected");
		});
	}
	if(json.time){
		$("#step3 .std").val(json.time.std);
		$("#step3 .min").val(json.time.min);
	}
	
	if(json.chefhats){
		$("#step3 .label_chefhats input[value=\""+json.chefhats+"\"]").attr("checked", "checked");
		handleRadios($("#step3 .label_chefhats"));
	}
	
	if(json.muffins){
		$("#step3 .label_muffins input[value=\""+json.muffins+"\"]").attr("checked", "checked");
		handleRadios($("#step3 .label_muffins"));
	}
	
	if(json.image){
		showNRImage(json.image);
	}
		
}

function fillSteps(steps){
	var $newStepContainer = $("#new_step_container").empty();
	for(var i in steps){
		var step = steps[i];
		var $step = getNewIngredientStep(step.num, step.text, step.ingredients);
		$newStepContainer.append($step);
	}
}

function fillIngredients(ingredients){
	var $ul = $(".lightbox ul");
	for(var i in ingredients){
		var $ingredientLine = getNewIngredientLine();
		$ingredientLine.children(".new_ingredient").val(ingredients[i].name);
		$ingredientLine.children(".new_ingredient_menge").val(ingredients[i].menge);
		$ul.append($ingredientLine);
	}
}

function draftSteps(){
	var $newIngredientSteps = $(".new_ingredient_step");
	var steps = [];
	for(var i = 0; i < $newIngredientSteps.length; i++){
		var $ingredientStep = $($newIngredientSteps[i]);
		var stepText = $ingredientStep.find("textarea").val();
		var num = i+1;
		var $ingredients = $ingredientStep.find("li");
		var ingredients = [];
		for(var j = 0; j< $ingredients.length;  j++){
			var $ingredient = $($ingredients[j]);
			var ingredient = $ingredient.children(".new_ingredient").val();
			var menge = $ingredient.children(".new_ingredient_menge").val();
			var ingredientMap = {name:ingredient, menge:menge};
			ingredients[ingredients.length] = ingredientMap;
		}
		var step = {num:num, text:stepText, ingredients:ingredients};
		steps[steps.length] = step;
	}
	
	saveDraft("steps", JSON.stringify(steps));
}

function draftTime(){
	var std = $("#step3 .std").val();
	var min = $("#step3 .min").val();
	var time = {std:std, min:min};
	saveDraft("time", JSON.stringify(time));
}

function draftIngredients(){
	var $lis = $("lightbox").find("li");
	var ingredients = [];
	for(var i = 0; i<$lis.length; i++){
		var $li = $lis.eq(i);
		var name = $li.children(".new_ingredient").val();
		var menge = $li.children(".new_ingredient_menge").val();
		var ingredient =  {name:name, menge:menge};
		ingredients[ingredients.length] = ingredient;		
	}	
	saveDraft("ingredients", JSON.stringify(ingredients));
}

function saveDraft(type, data){
	if(!user.checkLogin) return;
	var id = $.address.parameter("id");
	$.get("/anycook/SaveDraft", {id:id, type:type, data:encodeURIComponent(data)});
}




function getNewIngredientStep(number, text, ingredients){
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
		
	if(text != undefined)
		$textarea.val(text);
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
		.sortable({
			placeholder: "ui-state-highlight",
			cursorAt:"top",
			distance: 15,
			axis: "y"
		});
		
	if(ingredients === undefined || ingredients.length == 0)
		$newIngredientList.append(getNewIngredientLine());
	else{
		for(var i in ingredients)
			$newIngredientList.append(getNewIngredientLine(ingredients[i].name, ingredients[i].menge));
	}
		//.disableSelection();
	var $addingredientLine = $("<div></div>").addClass("add_new_ingredient_line")
		.append("<span></span>")
		.click(addNewIngredientLine);
	var $newIngredients  = $("<div></div>").addClass("ingredients new_ingredients")
		.append($zutaten)
		.append($menge)
		.append($newIngredientList)
		.append($addingredientLine);
	
	
	//all
	var $newIngredientStep = $("<li></li>").addClass("new_ingredient_step ingredient_step")
		.append($newStep)
		.append($newIngredients)
		.append($remove);
		
	return $newIngredientStep;	
}

function getNewIngredientLine(name, menge){
	var $dragdrop = $("<div></div>").addClass("ingredient_dragdrop");	
	var $ingredient = $("<input type=\"text\">").addClass("new_ingredient");
	if(name !== undefined)
		$ingredient.val(name);
	var $menge = $("<input type=\"text\">").addClass("new_ingredient_menge")
		.focusout(formatMenge);
	if(menge !== undefined)
		$menge.val(menge);
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

function watchIntroduction(){
	var id = $(document).data("watchIntroduction");
	var $name = $("#new_recipe_name");
	var $introduction = $("#new_recipe_introduction");
	if($name.length == 0){
		$(document).removeData("watchIntroduction");
		window.clearInterval(id);
		return;
	}
	if(id == undefined){
		id = window.setInterval("watchIntroduction()", 1000);
		$(document).data("watchIntroduction", id);
	}
	
	var nameLength = $name.val().length;
	var introductionLength = $introduction.val().length
	if(nameLength > 0)
		$("#new_recipe_name_error").fadeOut(300);
	if(introductionLength > 0)
		$("#new_recipe_introduction_error").fadeOut(300);
		
	if(nameLength>0 && introductionLength>0){
		$(document).removeData("watchIntroduction");
		window.clearInterval(id);
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

function addProgressBar(){
	$(".image_upload").hide();
	$("#progressbar").fadeIn(200).progressbar();
}

function nrProgress(id, filename, loaded, total){
	$("#progressbar").progressbar({value:(loaded/total*100)});
}

function completeUpload(id, fileName, responseJSON){
	if(responseJSON.success){
		var filename = responseJSON.success;
		saveDraft("image", filename);
		showNRImage(filename);
	}
}

function showNRImage(filename){
	var $recipeImageContainer = $(".recipe_image_container");
	$recipeImageContainer.children("img").remove();
	$recipeImageContainer.removeClass("visible").children("#progressbar").hide();
	$recipeImageContainer.children(".image_upload").show();
	
	var $img = $("<img/>").addClass("recipe_image").attr("src", "/gerichtebilder/big/"+filename);
	$recipeImageContainer.append($img);
}
