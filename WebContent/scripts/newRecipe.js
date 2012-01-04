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
	var decoratorSettings = {color:"#878787", change:validateStep1};
	$("#step1 input[type=\"text\"]").inputdecorator("required", decoratorSettings).focusout(function(){
		$.anycook.drafts.save("name", $(this).val());
	});
	$("#step1 textarea").inputdecorator("required", decoratorSettings).focusout(function(){
		$.anycook.drafts.save("description", $(this).val());
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
	$firstStep.find("textarea").inputdecorator("maxlength", {color:"#878787", decoratorFontSize:"8pt", change:checkStep2});
	$("#add_new_step").click(function(){
		var $newStep = getNewIngredientStep($(".new_ingredient_step").length+1);
		
		$("#new_step_container")
		.append($newStep);
		$newStep.find("textarea").inputdecorator("maxlength", {color:"#878787", decoratorFontSize:"8pt", change:checkStep2});
		if($.address.parameter("step") == 2)
			resetNewRecipeHeight($("#step2"));
	});
	makeIngredientLightBox();
	// watchSteps();
	
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
		$.anycook.drafts.save("category", text);
		checkValidateStep3();
		$("#category_error").fadeOut(300);
	});
	
	$("#step3 .label_chefhats, #step3 .label_muffins").click(function(){
		var $inputs = $(this).children("input");
		$inputs.attr("checked") ? $inputs.removeAttr("checked") : $inputs.attr("checked", "checked");
        handleRadios(this);
        
        var $this = $(this);
        var name = $inputs.attr("name") == "new_muffins" ? "calorie" : "skill";
        
        
        
        if($inputs.attr("checked"))
        	$.anycook.drafts.save(name, $inputs.val());
        else
        	$.anycook.drafts.save(name, "0");
    	// must return false or function is sometimes called twice
    	checkValidateStep3();
    	if(name == "calorie")
			$("#muffin_error").fadeOut(300);
		else
			$("#skill_error").fadeOut(300);
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
		.focus(function(){
			checkValidateStep3();
			$("#time_error").fadeOut(300);
		})
		.siblings(".up, .down")
		.click(timeUpDownListener)
		.click(draftTime)
		.click(function(){
			checkValidateStep3();
			$("#time_error").fadeOut(300);
		});
		
	$(".tagsbox").click(makeNewTagInput);
	makeTagCloud();
	$("#open_preview").click(submitStep3);
	
	
	$("#submit_recipe").click(saveRecipe);
	
	
	//preview (step4)
	
	
	
	//draft
	if(user.checkLogin()){
		 var id = $.address.parameter("id");
		 var $db = $.couch.db("recipedrafts");
		if(id == undefined){
			var a = new Date();
			a = JSON.stringify(a)
			$db.saveDoc({user:"anycook_"+user.id, date:a},{ success:function(doc){
				var newid = doc.id;
				$.address.parameter("id", newid);
				$(".nav_button, #step4 a").attr("href", function(i, attr){
					return attr+"&id="+newid;
				});
			}});
		
			// $.ajax({
				// url:"/anycook/SaveDraft", 
				// async:false,
				// success:function(newid){
					// $.address.parameter("id", newid);
					// $(".nav_button").attr("href", function(i, attr){
						// return attr+"&id="+newid;
					// });
			// }});
			return;
		}else{
			//link
			$db.openDoc(id, {success:fillNewRecipe});
			$(".nav_button, #step4 a").attr("href", function(i, attr){
					return attr+"&id="+id;
			});	
		}
	}
}


//step1
function validateStep1(event){
	var $this = $(this);
	var $container = event.container;
	var $step1 = $("#step1");
	var check = true;
	//var $name = $step1.find("#new_recipe_name");
	if(!event.empty){
		$container.next(".error").fadeOut(300);
		if(checkValidationStep1())
			$("#nav_step1").next().removeClass("inactive");
			
	}else{
		$("#nav_step1").nextAll().addClass("inactive");
	}
}

function checkValidationStep1(){
	var check = true;
	var $name = $("#new_recipe_name");
	if($name.val().length == 0){
		check=false;
	}
	
	var $introduction = $("#new_recipe_introduction");
	if($introduction.val().length == 0){
		check=false;
	}
	return check;
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
		//watchIntroduction();
	}
	return false;
	//return false;
}



//step2
function checkStep2(event){
	var $this = $(this);
	var text = $this.val();
	var $step = $this.parents(".ingredient_step");
	if(!event.empty){
		var lastSentences = $this.data("sentences");
		if(lastSentences == undefined)
			lastSentences = [];
		
		var currentSentences = text.split(/[!.?:;]+/g);
		
		var currentIngredients = getCurrentStepIngredients();
		$this.data("sentences", currentSentences);
		//console.log(currentSentences);
		for(var i = 0; i < currentSentences.length; i++){
			if(lastSentences.length > i && currentSentences[i] == lastSentences[i] || currentSentences[i].length == 0)
				continue;
				
				
			$.getJSON("/anycook/GetZutatenfromSchritte", {q:encodeURIComponent(currentSentences[i])}, function(json){
				var $stepIngredients = $step.find(".new_ingredient, new_ingredient_question");
				var ingredients = [];
				for(var i = 0; i < $stepIngredients.length; i++){
					ingredients[i] = $($stepIngredients[i]).val();
				}
				
				for(var i in json){
					if($.inArray(json[i], ingredients) > -1)
						continue;
						
					if($.inArray(json[i], currentIngredients) >-1){
						var $ingredientQuestion = getIngredientQuestion(json[i]);
						
						continue;
					}
					
					var $stepIngredients = $step.find(".new_ingredient");
					var $ingredientLine = null;
					for(var j = 0; j < $stepIngredients.length; j++){
						var $stepIngredient = $($stepIngredients[j]);
						if($stepIngredient.val().length == 0)
							$ingredientLine = $stepIngredient.parent();
					}
					
					if($ingredientLine == null){
						$ingredientLine = getNewIngredientLine().hide();
						$step.find(".new_ingredient_list").append($ingredientLine.fadeIn(300));
					}
					
					$ingredientLine.children(".new_ingredient").val(json[i]);
				}
				if($.address.parameter("step") == 2)
					resetNewRecipeHeight($("#step2"));
				draftSteps();
			});
		}
		
	}else{
		if(!checkValidationStep2())
			$("#nav_step2").nextAll().addClass("inactive");
	}
}

function checkValidationStep2(){
	var stepcheck = false;
	var steptexts = $(".new_step textarea").val();
	for(var i in steptexts){
		if(steptexts[i].length > 0){
			stepcheck = true;
			break;
		}
	}
	
	
	var ingredientcheck = false;
	var ingredienttexts = $("#step2 .new_ingredient").val();
	for(var i in ingredienttexts){
		if(ingredienttexts[i].length > 0){
			ingredientcheck = true;
			break;		
		}
	}
	
	return stepcheck && ingredientcheck;
}

function checkValidateLightboxPersons(){
	var personcheck = false;
	var $lightbox = $(".lightbox");
	var persons = $lightbox.find("#new_num_persons").val();
	if(persons != ""  && Number(persons) > 0)
		personcheck = true;
	
	return personcheck;
}

function checkValidateLightboxIngredients(){
	var $lightbox = $(".lightbox");
	var ingredienttexts = $lightbox.find(".new_ingredient").val();
	for(var i in ingredienttexts){
		if(ingredienttexts[i].length > 0)
			return true;
	}
	return false;
}

function submitStep2(event){
	event.preventDefault();
	var $this = $(this);
	
	var check = true;
	if(!checkValidateLightboxPersons()){
		check = false;
		$("#numberinput_error").fadeIn(300);
	}
	
	if(!checkValidateLightboxIngredients()){
		check = false;
		$("#ingredientoverview_error").fadeIn(300);
		watchForLightboxIngredients();
	}
	
	if(!check){
		$this.find("input[type=\"submit\"]").effect("shake", {distance:5, times:2}, 50);
		return;
	}
		
	hideLightbox();
	$.address.parameter("step", "3");
}


//step3
function checkCategory(){
	var category = $("#category_select :selected").val();
	return category != "" && category != "Kategorie auswählen";
}

function checkTime(){
	var time = getTime();
	return time.std != "0" || time.min != "0"; 
}

function checkSkill(){
	var skill = getSkill();
	return skill!==undefined;
}

function checkCalorie(){
	return getCalorie() !== undefined;
}

function checkValidateStep3(){
	if(checkCategory() && checkTime() && checkSkill() && checkCalorie()){
		$("#nav_step3").nextAll().removeClass("inactive");
		return true;
	}else{
		$("#nav_step3").nextAll().addClass("inactive");
		return false;
	}
}


function submitStep3(){
	var check = true;
	if(!checkCategory()){
		$("#category_error").fadeIn(300);
		check = false;
	}
	
	if(!checkTime()){
		$("#time_error").fadeIn(300);
		check = false;
	}
	
	if(!checkSkill()){
		$("#skill_error").fadeIn(300);
		check = false;
	}
	
	if(!checkCalorie()){
		$("#muffin_error").fadeIn(300);
		check = false;
	}
	
	if(!check){
		$("#open_preview").effect("shake", {distance:5, times:2}, 50);	
	}else{
		$.address.parameter("step", "4");
	}
	
	
}

function saveRecipe(){
	if(checkValidationStep1() && checkValidationStep2() && 
		checkValidateLightboxPersons() && checkValidateLightboxIngredients() && 
		checkValidateStep3()){
		
		var recipe = {};
		recipe.steps = getSteps();
		recipe.name = getRecipeName();
		recipe.image = getImageName();
		recipe.description = getDescription();
		recipe.ingredients = getIngredients();
		recipe.category = getCategory();
		recipe.time = getTime();
		recipe.skill = getSkill();
		recipe.calorie = getCalorie();
		recipe.tags = getTags();
		recipe.persons = getPersons();
		
		var id =  $.address.parameter("id");
		if(id)
			recipe.mongoid = id;
		
		
		//TODO activate again
		// $.post("/anycook/SaveNewRecipe", {recipe:encodeURIComponent(JSON.stringify(recipe))},function(response){
			// alert(response);	
		// });
		
		$.anycook.popup("Vielen Dank!", "Dein Rezept wurde eingereicht und wird überprüft.<br\>Wir benachrichtigen dich, sobald dein Rezept akiviert wurde.<br\><br\>Dein anycook-Team");
	}
}

function newRecipeAdressChange(event){
	resetFilter();
	var checkedinput = $("#step3 .label_muffins input:checked, #step3 .label_chefhats input:checked");
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
		loadPreview();
		step1Left -= 655;
		
	case 3:
		$navigation.children("#nav_step3").removeClass("inactive");
		step1Left -= 655;
					
	case 2:
		$navigation.children("#nav_step2").removeClass("inactive");
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
		if(stepNum == 1) resetNewRecipeHeight($step1);
		if(stepNum == 2) resetNewRecipeHeight($step2);
		if(stepNum == 4) resetNewRecipeHeight($step4);
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
	if(json.persons)
		fillPersons(json.persons);
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
	
	if(json.skill){
		$("#step3 .label_chefhats input[value=\""+json.skill+"\"]").attr("checked", "checked");
		handleRadios($("#step3 .label_chefhats"));
	}
	
	if(json.calorie){
		$("#step3 .label_muffins input[value=\""+json.calorie+"\"]").attr("checked", "checked");
		handleRadios($("#step3 .label_muffins"));
	}
	
	if(json.image){
		showNRImage(json.image);
	}
	
	
	if(json.tags){
		var $tagsbox = $(".tagsbox");
		for(var i  in json.tags){
			$tagsbox.append(getTag(json.tags[i], "remove"));
		}
	}
	
	if($.address.parameter("step") == 4)
		loadPreview();
		
}

function fillSteps(steps){
	var $newStepContainer = $("#new_step_container").empty();
	for(var i in steps){
		var step = steps[i];
		var $step = getNewIngredientStep(step.id, step.text, step.ingredients);
		$newStepContainer.append($step);
		$step.find("textarea").inputdecorator("maxlength", {color:"#878787", decoratorFontSize:"8pt", change:checkStep2});
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

function fillPersons(persons){
	$("#new_num_persons").val(persons);
}

function draftSteps(){	
	$.anycook.drafts.save("steps", getSteps());
}

function draftTags(){
	
	$.anycook.drafts.save("tags", getTags());
}

function draftTime(){
	
	$.anycook.drafts.save("time", getTime());
}

function draftIngredients(){
	
	$.anycook.drafts.save("ingredients", getIngredients());
}

function getImageName(){
	var image = $("#step1 .recipe_image_container img").attr("src").split("/");
	return image[image.length-1];
}

function getRecipeName(){
	var name = $("#new_recipe_name").val();
	return name;
}

function getDescription(){
	var description = $("#new_recipe_introduction").val();
	return description;
}

function getIngredients(){
	var $lis = $(".lightbox").find("li");
	var ingredients = [];
	for(var i = 0; i<$lis.length; i++){
		var $li = $lis.eq(i);
		var name = $li.children(".new_ingredient").val();
		var menge = $li.children(".new_ingredient_menge").val();
		var ingredient =  {name:name, menge:menge};
		ingredients[ingredients.length] = ingredient;		
	}
	return ingredients;
}

function getCategory(){
	return $("#select_container option:selected").val();
}

function getSkill(){
	return $("#step3 .chefhats:checked").val()
}

function getCalorie(){
	return $("#step3 .muffins:checked").val()
}

function getTime(){
	var std = $("#step3 .std").val();
	var min = $("#step3 .min").val();
	var time = {std:std, min:min};
	return time;
}

function getTags(){
	var $tags =  $(".tagsbox .tag_text");
	var tags = [];
	for(var i = 0; i<$tags.length; i++){
		var tag = $tags.eq(i).text();
		tags[tags.length] = tag;
	}
	return tags;
}

function getPersons(){
	return $("#new_num_persons").val();
}

function getSteps(){
	var $newIngredientSteps = $(".new_ingredient_step");
	var steps = [];
	for(var i = 0; i < $newIngredientSteps.length; i++){
		var $ingredientStep = $($newIngredientSteps[i]);
		var stepText = $ingredientStep.find("textarea").val();
		var id = i+1;
		var $ingredients = $ingredientStep.find("li");
		var ingredients = [];
		for(var j = 0; j< $ingredients.length;  j++){
			var $ingredient = $($ingredients[j]);
			var ingredient = $ingredient.children(".new_ingredient").val();
			var menge = $ingredient.children(".new_ingredient_menge").val();
			var ingredientMap = {name:ingredient, menge:menge};
			ingredients[ingredients.length] = ingredientMap;
		}
		var step = {id:id, text:stepText, ingredients:ingredients};
		steps[steps.length] = step;
	}
	return steps;
}

function getCurrentStepIngredients(){
	var stepingredients = $(".new_ingredient_step .new_ingredient").val() || [];
	return stepingredients;
}

function getIngredientQuestion(ingredient){
	var $span = $("<span></span>").text(ingredient+"?").addClass("new_ingredient_question");
	var $spanJa =  $("<span></span>").text("Ja").addClass("yes");
	var $spanNein =  $("<span></span>").text("Nein").addClass("no");
	
	var $li = $("<li></li>").addClass("ingredientQuestion")
		.append($span)
		.append($spanJa)
		.append($spanNein);
		
	return $li;
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

function resetNewRecipeHeight($container){
	var height = $container.height()+20;
	$("#recipe_editing_container").animate({height:height}, {duration:500});
}

function removeNewStep(){
	var $this = $(this);
	var $step = $this.parent();
	
	if($step.siblings().length > 0){
		$step.remove();
		makeStepNumbers();
		resetNewRecipeHeight($("#step2"));
		draftSteps();
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
	if($.address.parameter("step") == 2)
		resetNewRecipeHeight($("#step2"));
}

function removeNewIngredientLine(){
	var $this = $(this);
	var $li = $this.parent();
	if($li.siblings().length > 0){
		$li.remove();
		resetNewRecipeHeight($("#step2"));
		draftSteps();
		draftIngredients();
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
		if(checkValidationStep2()){
			$(document).removeData("watchForIngredients");
			window.clearInterval(id);
			$("#no_ingredients_error").fadeOut(300);
			break;
		}
	}
	
}

function watchForLightboxIngredients(){
	var id = $(document).data("watchForLightboxIngredients");
	var $newIngredients = $(".lightbox .new_ingredient");
	if($newIngredients.length == 0){
		$(document).removeData("watchForLightboxIngredients");
		window.clearInterval(id);
		return;
	}
	if(id == undefined){
		id = window.setInterval("watchForLightboxIngredients()", 1000);
		$(document).data("watchForLightboxIngredients", id);
	}
	
	if(checkValidateLightboxIngredients()){
		$(document).removeData("watchForLightboxIngredients");
		window.clearInterval(id);
		$("#ingredientoverview_error").fadeOut(300);
	}
	
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
		$.anycook.drafts.save("image", filename);
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

function loadPreview(){
	var recipeImage = getImageName();
	$("#step4 .recipe_image_container img").attr("src", "/gerichtebilder/big/"+recipeImage)
	.load(function(){
		if($.address.parameter("step") == 4)
			resetNewRecipeHeight($("#step4"));
	});
	$("#recipe_headline").text(getRecipeName());
	$("#introduction").text(getDescription());
	var steps = getSteps();	
	loadSteps(steps);
	var filter = {
		time : getTime(),
		tags : getTags(),
		ingredients : getIngredients(),
		skill:getSkill(),
		calorie: getCalorie(),
		category:getCategory(),
		persons:getPersons()
	}
	loadFilter(filter);
	var id = $.address.parameter("id");
	$(".tags_list a").attr("href", function(i, attr){
		if(id)
			return "#!/recipeediting?step=3&id="+id;
		return "#!/recipeediting?step=3";
	});
	$("#filter_main.blocked").one("click", function(){$.address.parameter("step", 3)});
	
	
	if($.address.parameter("step") == 4)
		resetNewRecipeHeight($("#step4"));
	//var height = $("#step4").height()
	//$("#recipe_editing_container").css("height", height+20);
}
