/**
 * @license This file is part of anycook. The new internet cookbook
 * Copyright (C) 2014 Jan Graßegger
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see [http://www.gnu.org/licenses/].
 * 
 * @author Jan Graßegger <jan@anycook.de>
 */
'use strict';

define([
	'jquery'
], function($){
	return {
		loadNewRecipe : function(){			
			//navigation
			var path = $.address.path();
			for(var i = 1; i<=4; i++)
				$("#nav_step"+i).attr("href", "#!"+path+"?step="+i);
			$(".nav_button").click(function(){
				if($(this).hasClass("inactive"))
					return false;
			});

			//if resizing
			$(".sliding_container").resize(function(){
				var id = $(this).attr("id");
				var stepNum = id.substring(4);
				var currentStep = $.address.parameter("step") || 1;
				if(stepNum != currentStep) return;

				var height = $(this).height();
				$("#recipe_editing_container").height(height);
			})
			
			
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
			    action: baseUrl+'/upload/image/recipe'
			});
			
			
			//step2
			var $firstStep = getNewIngredientStep(1);
			$("#new_step_container").append($firstStep)
				.sortable({
					placeholder:"step-placeholder",
					forcePlaceholderSize : true,
					cursorAt : {bottom: 200},
					distance: 15,
					axis: "y",
					containment: "parent",
					opacity:0.75,
					scroll:true,
					tolerance:"pointer",
					update:updateStepNumbers
				});
				//.disableSelection();
			$firstStep.find("textarea").inputdecorator("maxlength", {color:"#878787", decoratorFontSize:"8pt", change:checkStep2});
			$("#add_new_step").click(function(){
				var $newStep = getNewIngredientStep($(".new_ingredient_step").length+1);
				
				$("#new_step_container")
				.append($newStep);
				$newStep.find("textarea").inputdecorator("maxlength", {color:"#878787", decoratorFontSize:"8pt", change:checkStep2});
				$("#step2").trigger($.Event("resize"));
				// if($.address.parameter("step") == 2)
				// 	resetNewRecipeHeight($("#step2"));
			});

			$("#ingredient_overview").click(makeIngredientLightBox);
			// watchSteps();
			
			$("#step2").on("focusout", "input, textarea", draftSteps);
			
			//step3
			
			$.anycook.api.category.sorted(function(json){
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
		        
		        var $this = $(this);
		        handleRadios($this);
		        var name = $inputs.attr("name") == "new_muffins" ? "calorie" : "skill";
		        
		        
		        
		        if($inputs.attr("checked"))
		        	$.anycook.drafts.save(name, $inputs.val());
		        else
		        	$.anycook.drafts.save(name, "0");
		    	
		    	checkValidateStep3();
		    	if(name == "calorie")
					$("#muffin_error").fadeOut(300);
				else
					$("#skill_error").fadeOut(300);
		    	return false;
		    }).mouseover(function(){
		    		mouseoverRadio(this);
			});
			$("#step3 .label_container").mouseleave(function(){
					handleRadios($(this).children());
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
				if(id == undefined){
					$.anycook.drafts.newDraft(function(id){
						$.address.parameter("id", id);
					});
					return;
				}else{
					//link
					$.anycook.drafts.open(id, fillNewRecipe);
					$(".nav_button, #step4 a").not("#cancel_recipe").attr("href", function(i, attr){
							return attr+"&id="+id;
					});

					$("#cancel_recipe").show();
				}
			}
		}
		//step1
		validateStep1 : function(event){
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
		},
		checkValidationStep1 : function(){
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
		},
		submitStep1 : function(){
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
		},
		//step2
		checkStep2 : function(event){
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
						
					$.anycook.api.ingredient.extract(currentSentences[i], function(json){
						var $stepIngredients = $step.find(".new_ingredient");
						var $stepQuestions = $step.find(".new_ingredient_question .ingredient");
						var ingredients = [];
						for(var i = 0; i < $stepIngredients.length; i++){
							ingredients[i] = $stepIngredients.eq(i).val();
						}
						
						for(var i = 0; i < $stepQuestions.length; i++){
							var text = $stepQuestions.eq(i).text();
							ingredients.push(text);
						}
						
						for(var i in json){
							if($.inArray(json[i], ingredients) > -1)
								continue;
								
							if($.inArray(json[i], currentIngredients) >-1){
								var $ingredientQuestion = getIngredientQuestion(json[i]);
								
								$step.find(".new_ingredient_list").append($ingredientQuestion);
								continue;
							}
							
							addNewStepIngredient($step, json[i]);
						}
						draftSteps();
					});
				}
				
			}else{
				if(!checkValidationStep2())
					$("#nav_step2").nextAll().addClass("inactive");
			}
		},
		checkValidationStep2 : function(){
			var stepcheck = false;
			$(".new_step textarea").each(function(){
				if($(this).val().length > 0)
					stepcheck = true;
			});
			
			
			var ingredientcheck = false;
			$("#step2 .new_ingredient").each(function(){
				if($(this).val().length > 0)
					ingredientcheck = true;
				
			})
			
			return stepcheck && ingredientcheck;
		},
		checkValidateLightboxPersons : function(){
			var personcheck = false;
			var $lightbox = $(".lightbox");
			var persons = $lightbox.find("#new_num_persons").val();
			if(persons != ""  && Number(persons) > 0)
				personcheck = true;
			
			return personcheck;
		},
		checkValidateLightboxIngredients : function(){
			var $lightbox = $(".lightbox");
			var ingredienttexts = $lightbox.find(".new_ingredient").val();
			for(var i in ingredienttexts){
				if(ingredienttexts[i].length > 0)
					return true;
			}
			return false;
		},
		submitStep2 : function(event){
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

			saveLightbox();
			hideLightbox();
			$.address.parameter("step", "3");
		},
		//step3
		checkCategory : function(){
			var category = $("#select_container span").text();
			return category != "" && category != "Kategorie auswählen";
		},
		checkTime : function(){
			var time = getTime();
			return time.std != "0" || time.min != "0"; 
		},
		checkSkill : function(){
			var skill = getSkill();
			return skill!==undefined;
		},
		checkCalorie : function(){
			return getCalorie() !== undefined;
		},
		checkValidateStep3 : function(){
			if(checkCategory() && checkTime() && checkSkill() && checkCalorie()){
				$("#nav_step3").nextAll().removeClass("inactive");
				return true;
			}else{
				$("#nav_step3").nextAll().addClass("inactive");
				return false;
			}
		},
		submitStep3 : function(){
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
			
			
		},
		saveRecipe : function(){
			var ingredients = getIngredients();
			var ingredientsCheck = ingredients !== undefined && ingredients.length > 0;

			var persons = getPersons();
			var personCheck = persons !== undefined && persons > 0


			if(checkValidationStep1() && checkValidationStep2() && 
				ingredientsCheck && personCheck && 
				checkValidateStep3()){
				
				var recipe = {
					name : getRecipeName(),
					steps : getSteps(),
					image : getImageName(),
					description : getDescription(),
					ingredients : ingredients,
					category : getCategory(),
					time : getTime(),
					skill : getSkill(),
					calorie : getCalorie(),
					persons : persons,
					tags : getTags()
				};

				var userid = -1;
				if(user.checkLogin())
					userid = user.id;
				
				var id =  $.address.parameter("id");
				if(id)
					recipe.mongoid = id;
				

				$.anycook.api.recipe.save(recipe, function(response){
					$.anycook.popup("Vielen Dank!", "Dein Rezept wurde eingereicht und wird überprüft.<br\>Wir benachrichtigen dich, sobald dein Rezept akiviert wurde.<br\><br\>Dein anycook-Team");
					$("body").on("click", function(){
						$.address.path("");
						$(".fixedpopup").remove();
					});
					
					$(".fixedpopup").show(1).delay(5000).fadeOut(500, function(){
						$(this).remove();
						var pathNames = $.address.pathNames();
						if(pathNames.length > 0 && pathNames[0] == "recipeediting"){
							$.address.path("");
						}
					});
				});
				
				
				
				
				return false;
			}
		},
		newRecipeAdressChange : function(event){
			resetFilter();
			var checkedinput = $("#step3 .label_muffins input:checked, #step3 .label_chefhats input:checked");
			var $editingContainer = $("#recipe_editing_container");	
			$editingContainer.removeClass("step2 step3");
			var $navigation = $(".navigation");
			$navigation.children().removeClass("active");
			
			var stepNum = Number(event.parameters["step"]);
			if(!stepNum)
				stepNum = 1;
			
			
			var step1Left = 0;
			switch(stepNum){
			case 4:
				$navigation.children("#nav_step4").removeClass("inactive");
				var id = $.address.parameter("id");
				//draft
				if(user.checkLogin() && id !== undefined)
					$.anycook.drafts.open(id, loadPreview);
				else{
					var data = {
						time : getTime(),
						skill : getSkill(),
						calorie : getCalorie(),
						category : getCategory(),
						persons : getPersons(),
						ingredients : getIngredients(),
						steps : getSteps(),
						name : getRecipeName(),
						image : getImageName(),
						tags : getTags()
					}
					loadPreview(data);
				}
					

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

				var animate = function(){
					$step1.animate({left:step1Left}, 
					{
						duration: 800,
						easing: "easeInOutCirc",
						step:function(now, fx){
							$step2.css("left",now+655);
							$step3.css("left",now+2*655);
							$step4.css("left",now+3*655);
						},
						complete:function(){
							if(stepNum == 1) $step1.trigger($.Event('resize'));;
							if(stepNum == 2) $step2.trigger($.Event('resize'));
							if(stepNum == 4) $step4.trigger($.Event('resize'));
						}
					});
				};

				var scrollTop = $(document).scrollTop();
				if(scrollTop > 10)
					backtothetop(1000, animate); 
				else animate();
				
				
			}
			
			return false;
		},
		//drafts
		fillNewRecipe : function(json){
			var data = json.data;

			if(json.name)
				$("#new_recipe_name").val(json.name);
			if(json.description)
				$("#new_recipe_introduction").val(json.description);
			if(json.steps)
				fillSteps(json.steps);
			if(json.ingredients)
				$("#step2").data("ingredients", json.ingredients);
			if(json.persons)
				$("#step2").data("numPersons", json.persons);

			if(json.category){
				var $container = $("#select_container");
				$container.find("span").text(json.category);
				$container.find("option").each(function(){
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
				
		},
		updateStepNumbers : function(){
			draftSteps();
			
			$(".new_ingredient_step .number").each(function(i){
				$(this).text(i+1);
			});
		},
		updateIngredients : function(){
			draftSteps();
		},
		fillSteps : function(steps){
			var $newStepContainer = $("#new_step_container").empty();
			for(var i in steps){
				var step = steps[i];
				var $step = getNewIngredientStep(step.id, step.text, step.ingredients);
				$newStepContainer.append($step);
				$step.find("textarea").inputdecorator("maxlength", {color:"#878787", decoratorFontSize:"8pt", change:checkStep2});
			}
		},
		fillPersons : function(persons){
			$("#new_num_persons").val(persons);
		},
		draftSteps : function(){	
			$.anycook.drafts.save("steps", getSteps());
		},
		draftTags : function(){			
			$.anycook.drafts.save("tags", getTags());
		},
		draftTime : function(){			
			$.anycook.drafts.save("time", getTime());
		},
		draftIngredients : function(){
			$.anycook.drafts.save("ingredients", getIngredients());
		},
		getImageName : function(){
			var image = $("#step1 .recipe_image_container img").attr("src").split("/");
			var imageName = image[image.length-1];
			return imageName == "sonstiges.png" ? undefined : imageName;
		},
		getRecipeName : function(){
			var name = $("#new_recipe_name").val();
			return name;
		},
		getDescription : function(){
			var description = $("#new_recipe_introduction").val();
			return description;
		},
		getIngredients : function(){
			return $("#step2").data("ingredients");
		},
		getCategory : function(){
			return $("#select_container span").text();
		},
		getSkill : function(){
			return $("#step3 .chefhats:checked").val()
		},
		getCalorie : function(){
			return $("#step3 .muffins:checked").val()
		},
		getTime : function(){
			var std = $("#step3 .std").val();
			var min = $("#step3 .min").val();
			var time = {std:std, min:min};
			return time;
		},
		getTags : function(){
			var $tags =  $(".tagsbox .tag_text");
			var tags = [];
			for(var i = 0; i<$tags.length; i++){
				var tag = $tags.eq(i).text();
				tags[tags.length] = tag;
			}
			return tags;
		},
		getPersons : function(){
			return $("#step2").data("numPersons");
		},
		getSteps : function(){
			var $newIngredientSteps = $(".new_ingredient_step");
			var steps = [];
			for(var i = 0; i < $newIngredientSteps.length; i++){
				var $ingredientStep = $($newIngredientSteps[i]);
				var stepText = $ingredientStep.find("textarea").val();
				var id = i+1;
				var $ingredients = $ingredientStep.find(".new_ingredient_line");
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
		},
		getCurrentStepIngredients : function(){
			var stepingredients = [];
			var $ingredients = $(".new_ingredient_step .new_ingredient");
			for(var i =0; i<$ingredients.length; i++)
				stepingredients.push($ingredients.eq(i).val());
			return stepingredients;
		},
		getIngredientQuestion : function(ingredient){
			var $span = $("<span></span>").html("<span class=\"ingredient\">"+ingredient+"</span> auch zu diesem Schritt hinzufügen?").addClass("new_ingredient_question");
			var $spanJa =  $("<a></a>").text("Ja").addClass("yes")
				.click(function(event){
					var $this = $(this);
					// var ingredient = $this.prev().text();
					// ingredient = ingredient.substring(0, ingredient.length -35);
					addNewStepIngredient($this.parents(".new_ingredient_step"), ingredient);
					removeIngredientQuestion.apply($this);
				});
			var $spanNein =  $("<a></a>").text("Nein").addClass("no")
				.click(removeIngredientQuestion);
			
			var $li = $("<li></li>").addClass("ingredient_question")
				.append($span)
				.append($spanJa)
				.append($spanNein);
				
			return $li;
		},
		removeIngredientQuestion : function(event){
			$(this).parent().fadeOut(300);
		},
		getNewIngredientStep : function(number, text, ingredients){
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
					axis: "y",
					// containment: "parent",
					cursorAt:{top : 0},
					distance: 15,
					forcePlaceholderSize : true,		
					opacity:0.75,
					placeholder: "ingredient-placeholder",
					tolerance:"pointer",
					update: updateIngredients			
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
		},
		getNewIngredientLine : function(name, menge){
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

			$ingredient.autocomplete({
			    		source:function(req,resp){
		        			//var array = [];
		        		var term = req.term;

		        		var $list = $newIngredientLine.parent("ul");

		        		var excludedIngredients = [];
		        		$list.find(".new_ingredient").not($ingredient).each(function() {
		        			excludedIngredients.push($(this).val());
		        		});
		        		
		        		$.anycook.api.autocomplete.ingredient(term,excludedIngredients,function(data){
		        				resp($.map(data, function(item){
		        					return{
		        						label:item,
		        						data:item,
		        						value:item
		        						};
		        					}));        			
		        				});
		        			},
		        			minlength:1,
		        			autoFocus:true,
		        			position:{
		        				offset:"-5 1"
		        			}, 
		        			select:function(event, ui){
		        				var text = ui.item.data;
		        				$ingredient.val(text);
		        				return false;
		        			}
			    	});
				
			return $newIngredientLine;
		},
		resetNewRecipeHeight : function($container){
			var height = $container.height()+20;
			$("#recipe_editing_container").animate({height:height}, {duration:500});
		},
		removeNewStep : function(){
			var $this = $(this);
			var $step = $this.parent();
			
			if($step.siblings().length > 0){
				$step.remove();
				makeStepNumbers();
				// resetNewRecipeHeight($("#step2"));
				draftSteps();
				$("#step2").trigger($.Event('resize'));
			}
			
		},
		makeStepNumbers : function(){
			$(".new_ingredient_step .number").each(function(i){
				$(this).text(i+1);
			});
		},
		addNewIngredientLine : function(){
			var $this = $(this);
			var $list = $this.prev();
			var $newIngredientLine = getNewIngredientLine();
			$list.append($newIngredientLine);
			// if($.address.parameter("step") == 2)
			// 	resetNewRecipeHeight($("#step2"));

			var $input = $newIngredientLine.children(".new_ingredient");
			$("#step2").trigger($.Event('resize'));
			

		},
		removeNewIngredientLine : function(){
			var $this = $(this);
			var $li = $this.parent();
			if($li.siblings(".new_ingredient_line").length > 0){
				$li.remove();
				// resetNewRecipeHeight($("#step2"));
				draftSteps();
				draftIngredients();
				$("#step2").trigger($.Event('resize'))
			}
		},
		addNewStepIngredient : function($step, ingredient){
			var $stepIngredients = $step.find(".new_ingredient");
			var $ingredientLine = null;
			for(var j = 0; j < $stepIngredients.length; j++){
				var $stepIngredient = $($stepIngredients[j]);
				if($stepIngredient.val().length == 0)
					$ingredientLine = $stepIngredient.parent();
			}
			
			if($ingredientLine == null){
				$ingredientLine = getNewIngredientLine().hide();
				$step.find(".new_ingredient_line").last().after($ingredientLine.fadeIn(300));
			}
			
			$ingredientLine.children(".new_ingredient").val(ingredient);
			$("#step2").trigger($.Event('resize'));
		},
		watchForIngredients : function(){
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
			
		},
		watchForLightboxIngredients : function(){
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
			
		},
		formatMenge : function(){
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
		},
		mergeMenge : function(menge1, menge2){
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
		},
		addProgressBar : function(){
			$(".image_upload").hide();
			$("#progressbar").fadeIn(200).progressbar();
		},
		nrProgress : function(id, filename, loaded, total){
			$("#progressbar").progressbar({value:(loaded/total*100)});
		},
		completeUpload : function(id, fileName, responseJSON){
			if(responseJSON.success){
				var filename = responseJSON.success;
				$.anycook.drafts.save("image", filename);
				showNRImage(filename);
			}
		},
		showNRImage : function(filename){
			var $recipeImageContainer = $(".recipe_image_container");
			$recipeImageContainer.children("img").remove();
			$recipeImageContainer.removeClass("visible").children("#progressbar").hide();
			$recipeImageContainer.children(".image_upload").show();
			
			var $img = $("<img/>").addClass("recipe_image").attr("src", baseUrl+"/images/recipe/big/"+filename);
			$recipeImageContainer.append($img);
			$img.load(function(){$("#step1").trigger($.Event('resize'))});
		},
		loadPreview : function(data){
			var image = data.image || "category/sonstiges.png";
			$("#step4 .recipe_image_container img").attr("src", baseUrl+"/images/recipe/big/"+image)
			.load(function(){
				$("#step4").trigger($.Event('resize'));
			});
			$("#recipe_headline").text(getRecipeName());
			$("#introduction").text(getDescription());

			loadSteps(data.steps);
			loadFilter(data);
			loadIngredients(data.ingredients);

			loadTags(data.tags);
			var id = $.address.parameter("id");
			$(".tags_list a").attr("href", function(i, attr){
				if(id)
					return "#!/recipeediting?step=3&id="+id;
				return "#!/recipeediting?step=3";
			});
			$("#filter_main.blocked").one("click", function(){$.address.parameter("step", 3)});
			
			$("#step4").trigger($.Event('resize'));
			// if($.address.parameter("step") == 4)
			// 	resetNewRecipeHeight($("#step4"));
			//var height = $("#step4").height()
			//$("#recipe_editing_container").css("height", height+20);
		},
		//ingredientLightBox
		makeIngredientLightBox : function(){
			//ingredientOverview
			var numPersons = $("#step2").data("numPersons");

			var $input = $("<input/>").attr({id:"new_num_persons", type:"text", placeholder:"0", size:"2", maxlength:"2"})
				.val(!numPersons ? 0 : numPersons);
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
				.append("<span> Personen</span>")
				.append("<span id=\"numberinput_error\" class=\"error\">Bitte Personenzahl angeben</span>");
				
			var $ul =$("<ul></ul>").addClass("new_ingredient_list");
				
			var $content = $("<div></div>")
				.append($ul)
				.append("<span id=\"ingredientoverview_error\" class=\"error\">Kein Rezept ohne Zutaten</span>");	

			var $lightbox = getLightbox($headline.children(), 
			"Dies sind alle Zutaten, die du in den Schritten angegeben hast. "+ 
			"Falls Zutaten fehlen, füge diese bitte noch zu den entsprechenden Schritten hinzu.", $content, "Rezept abschließen")
				.addClass("ingredient_overview");
			$("#main").append($lightbox);
			
			$lightbox.find("form").submit(submitStep2);
			
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
				
				if($this.val()!="" && $this.val() != "0") $("#numberinput_error").fadeOut(300);
				$.anycook.drafts.save("persons", $this.val());
			});
			
			$up.click(newPersonsUp);
			
			$down.click(newPersonsDown);

			showIngredientLightbox();

			return false;
		},
		saveLightbox : function(){
			var $lis = $(".lightbox").find("li");
			var ingredients = [];
			for(var i = 0; i<$lis.length; i++){
				var $li = $lis.eq(i);
				var name = $li.children(".new_ingredient").val();
				var menge = $li.children(".new_ingredient_menge").val();
				var ingredient =  {name:name, menge:menge};
				ingredients[ingredients.length] = ingredient;		
			}

			$("#step2").data("ingredients", ingredients);
			$.anycook.drafts.save("ingredients", ingredients);

			var numPersons = $("#new_num_persons").val();
			$("#step2").data("numPersons", numPersons);

		},
		newPersonsUp : function(){
			var $input = $("#new_num_persons");
			var currentNum = Number($input.val());
			var newNum = ((currentNum)%99)+1;
			$.anycook.drafts.save("persons", newNum);
			$("#step2").data("numPersons", newNum);
			$input.val(newNum);
			$("#numberinput_error").fadeOut(300);
		},
		newPersonsDown : function(){
			var $input = $("#new_num_persons");
			var currentNum = Number($input.val());
			var newNum = ((99 - 2 + currentNum)%99)+1;
			$.anycook.drafts.save("persons", newNum);
			$("#step2").data("numPersons", newNum);
			$input.val(newNum);
			$("#numberinput_error").fadeOut(300);
		},
		showIngredientLightbox : function(){
			var $this = $(this);
			var $lightbox = $(".lightbox");
			if(getIngrededientsForOverview()){
				draftIngredients();
				var $ingredientOverview = $("#ingredient_overview");
				var bottom = $ingredientOverview.offset().top - 60;
				showLightboxfromBottom($lightbox, bottom);
				$lightbox.on("focusout", "input", draftIngredients);
			}else{
				$("#no_ingredients_error").fadeIn(300);
				$this.effect("shake", {distance:5, times:2}, 50);
				watchForIngredients();
			}
			return false;
		},
		getIngrededientsForOverview : function(){
			var ingredients = {};
			if(!checkValidationStep2())
				return false;
			
			
			$("#step2 .new_ingredient_line").each(function(){
				var $this = $(this);
				var ingredient = $this.children(".new_ingredient").val();
				if(ingredient.length == 0)
					return;
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
			
			
			
			return true;
		}
	};
});