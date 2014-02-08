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
 	'jquery', 
 	'classes/Search', 
 	'searchView',
 	'stringTools',
 	'time',
 	'text!templates/filters/ingredientRow.erb'
 ], function($, Search, searchView, stringTools, time, ingredientRowTemplate){
	// alle Filter
	return {
		setFromSession : function(){
			this.reset();
			
			var search = Search.init();

			if(search.kategorie!=null){
				$('#kategorie_head').text(search.kategorie);
				$('#kategorie_filter_hidden').val(search.kategorie);
			}
			if(search.skill!=null){
				$('.chefhats').removeAttr('checked');
				this.checkOn($('#chef_'+search.skill));
				// handleRadios($("#filter_table .label_chefhats"));
			}
			if(search.kalorien!=null){
				$('.muffins').removeAttr('checked');
				this.checkOn($('#muffin_'+search.kalorien));
				// handleRadios($("#filter_table .label_muffins"));
			}
			if(search.time != null){
				$('#time_std').val(search.time.std);
				$('#time_min').val(search.time.min);
			}
			if(search.user !=null){
				this.setUserfilter(search.user);
			}
			
			for(var num in search.zutaten) {
				this.addIngredientRow(search.zutaten[num]);
			}
				
			for(var num in search.excludedIngredients) {
				this.addExcludedIngredientRow(search.excludedIngredients[num]);
			}
			
			for(var num in search.tags) {
				$(".tags_list").append(getTag(search.tags[num], "remove"));
			}
			
			if(search.terms!=null){
				searchView.addTerms(search.terms);
			}
		},
		reset : function(){
			$("#filter_main").removeClass("blocked");
			$("#zutat_head").text("Zutaten:");
			$("#userfilter").hide();
			$("#filter_main").show().css({paddingBottom: "20px", height: "auto"});
			$("#filter_main *").not("ul.kategorie_filter, #userfilter, #userfilter *, label .active").show().css("opacity", 1);
			$("#filter_headline").text("Filter");
			
			$("#time_form > *").show();
			$("#time_form .time_text_end").text("h");
			
			$("#time_std, #time_min").val("0");
			this.removeChecked();
			//blockFilter(false);
			this.handleRadios($("#filter_table .label_chefhats, #filter_table .label_muffins"));
			// handleRadios(".label_chefhats, .label_muffins");
			var $ingredientList = $("#ingredient_list").empty();
			for(var i= 0; i<6; i++)
				$ingredientList.append("<li></li>");
			
			$(".tags_list").empty();
			
			$("#kategorie_head").text("keine Kategorie");
			$("#kategorie_filter_hidden").val("keine Kategorie");
			
			$("#userfilter").hide();
			
			$(".search_term").remove();
			$("#terms_text").hide();
			$(".close_term").off("click", search.removeTerm);
		},
		//kategorie
		loadAllCategories : function($target){
			if(!$target.children().size() > 0){
				if($target.parents(".step_1_right").length == 0){
					$target.append("<li><span class=\"left\">alle Kategorien</span><span class=\"right\"></span></li>");
				}
				
				AnycookAPI.category.sorted(function(json){
					var totalrecipes = 0;
						for(var k in json){
							$target.append("<li><span class=\"left\">"+k+"</span><span class=\"right\">"+json[k]+"</span></li>");
							totalrecipes+=Number(json[k])
						}
						$($target.find(".right")[0]).text(totalrecipes);
				});
			}
		},
		handleCategories : function(obj){
			if(!$("#filter_main").is(".blocked")){
				
				var $kategorieList = $("#kategorie_list");
				this.animateCategory($kategorieList);
				$("#kategorie_filter").toggleClass("on");
				if($("#kategorie_filter").hasClass("on")){
					var self = this;
					var $ul = $("#kategorie_list ul");
					$ul.children("li").mouseenter(this.kategorieOver)
						.mouseleave(this.kategorieOut)
						.click(function(e){self.kategorieClick(e)});
			    	$(document).click(function(e){self.closeKategorien(e)});
			    	
				}
				else{
					$("#kategorie_list ul li").unbind("mouseenter")
						.unbind("mouseleave")
						.unbind("click");
			    	//$(document).unbind("click", this.closeKategorien);
				}
				return false;
			}
		},
		animateCategory : function($kategorieList){
				var newHeight = 9;
				if($kategorieList.height()==newHeight)
					newHeight += $kategorieList.children("ul").height()+6;
				
				$kategorieList.animate({
					height:newHeight
				}, {
					duration: 600,
					easing: "swing"
				});
		},
		kategorieOver : function(event){
			var $this = $(this);	
			var text = $this.children(".left").text();
			$("#kategorie_head").text(text);
		},
		kategorieOut : function(event){
			var oldtext = $("#kategorie_filter_hidden").val();
			$("#kategorie_head").text(oldtext);
		},
		kategorieClick : function(event){
			var text = $(event.target).children(".left").text();
			
			this.setKategorie(text);
			this.handleCategories(event);
		},
		setKategorie : function(text){
			var hiddenval = $("#kategorie_filter_hidden").val();
			if(hiddenval != text){
				if(text == "keine Kategorie")
					text = null;

				var searchObject = Search.init();
				searchObject.setKategorie(text);
				searchObject.flush();
			}
		},
		closeKategorien : function(event){
			var $target = $(event.target);
			var $kategorieList = $("#kategorie_list");
			
			if($target.parents().andSelf().not($kategorieList) && $("#kategorie_filter").hasClass("on")){
				$("#kategorie_filter").removeClass("on");
				this.animateCategory($kategorieList);
			}
		},
		//radiobuttons
		handleRadios : function($obj){
			$obj.removeClass("on");
			$obj.each(function(){
				var $this = $(this);
				var $input = $this.children("input");
				if($input.attr("checked"))			
					$this.prevAll().andSelf().addClass('on');
			});
		},
		mouseoverRadio : function(obj){
			$(obj).nextAll().removeClass('on');
			$(obj).prevAll().andSelf().addClass('on');
		},
		removeChecked : function(){
			$('#filter_table label input[checked]').removeAttr('checked');
		},
		checkOnOff : function(obj){
			var $obj=$(obj).children("input").first();
			var value = $obj.val();

			var search = Search.init();
				
			switch($obj.attr('class')){
			case 'chefhats':
				search.setSkill(value);
				break;
			case 'muffins':
				search.setKalorien(value);
				break;
			}
			search.flush();
		},
		checkOn : function($obj){
			$obj.attr("checked", "checked");
			this.handleRadios($obj.parent().siblings().andSelf());
		},
		textReplacement : function(input){
			var originalvalue = input.val();
			 input.focus( function(){
			  if( $.trim(input.val()) == originalvalue ){ input.val(''); }
			 });
			 input.blur( function(){
			  if( $.trim(input.val()) == '' ){ input.val(originalvalue); }
			 });
		},
		//zutaten
		ingredientListClick : function(){	
			if(!$("#filter_main").is(".blocked")){
				var $target = $(event.target);
				var $input = $target.find("input");
				
				if($input.length > 0)
					$input.focus();
				else{
					var $li = null;
					$target.children("li").each(function(i){
						if($li!=null) return;
						if($(this).children().length == 0)
							$li = $(this);
					});
					
					if($li == null){
						$li = $("<div></div>");
						$target.append($li);
					}
					
					$li.append('<input type="text" /><div class="close"></div>');			
					
					$input = $li.children("input");
					$li.children(".close").hide();
					$input
						.focus()
						.keypress($.proxy(this.addCloseBtn, this))
						.autocomplete({
				    		source : function(req,resp){
			        			//var array = [];
				        		var term = req.term;
				        		var excluded = false;
				        		if(term.charAt(0) === '-'){
				        			excluded = true;
				        			term = term.substr(1);
				        			if(term.length == 0) return;
				        		}

				        		var excludedIngredients = [];
				        		$('#ingredient_list .ingredient').each(function() {
				        			excludedIngredients.push($(this).text());
				        		});
				        		
				        		AnycookAPI.autocomplete.ingredient(term,excludedIngredients,function(data){
			        				resp($.map(data, function(item){
			        					return{
			        						label:item,
			        						data:item,
			        						value:excluded?"-"+item:item,
			        						excluded:excluded
		        						};
		        					}));        			
		        				});
		        			},
		        			minlength : 1,
		        			autoFocus : true,
		        			position : {
		        				my : 'left top',
		        				at : 'left-5 bottom'
		        			},
		        			select:function(event, ui){
		        				var text = ui.item.data;
		        				$('#ingredient_list input').autocomplete('destroy');

		        				var search = Search.init();
		        				if(ui.item.excluded)
		        					search.excludeIngredient(text);
		        				else
		        					search.addZutat(text);
		        				search.flush();
		        				return false;
		        			}
			    	});
			    	$('.ui-autocomplete').last().addClass('ingredient-autocomplete');
			    	
			    	
				}
			}
		},
		addCloseBtn : function(event){
			var $target = $(event.target);
			
			var val = $target.val();
			if(event.which === 13){
				$target.autocomplete('destroy');
				search.addZutat(val);
				search.flush();
			}else if((val + String.fromCharCode(event.which)).length > 0){
				$target.siblings().first().fadeIn(500);
			}
		},
		removeIngredientField : function(event){
			var $target = $(event.target);
			var  $input = $target.siblings("input");
			if($input.length == 1){
				$input.remove();
				$target.remove();
			}else{
				var $li = $target.parent();
				var ingredient = $target.siblings('.ingredient').text();
				var search = Search.init();
				if($li.hasClass("excluded"))
					search.removeExcludedingredient(ingredient);
				else
					search.removeZutat(ingredient);
				search.flush();
			}
		},
		//userfilter
		setUserfilter : function(username){
			//TODO show filtered user in filterbar
			// if($("#userfilter span>a").text() == username){
				// $("#userfilter").css({display:"block", opacity:1, height:50});
			// }else{
		// 	
				// $.ajax({
					  // url: "/anycook/GetUserInformation",
					  // data:"username="+username,
					  // success: function(imagepath){
						  // var uri = User.getProfileURI(username);
						  // $("#userfilter a").attr("href", uri);
						  // $("#userfilter img").attr("src", imagepath);
						  // var text = "<span><a href=\"/"+uri+"\">"+username+"</a>'s<br/>Rezepte</span>";
						  // $("#userfiltertext").html(text);
		// 				  
						  // if($("#userfilter").css("display")=="none"){
							  // $("#userfilter").css({display:"block", opacity:0, height:0}).animate({height:50}, {duration:300, complete:function(){
								  // $(this).animate({opacity:1}, 400);
							  // }});
						  // }
					  // }
				// });
			// }
		},
		showUserfilterremove : function(event){
			$("#userfilterremove").fadeIn(300);
		},
		hideUserfilterremove : function(event){
			$("#userfilterremove").fadeOut(300);
		},
		removeUserfilter : function(){
			$("#userfilter").animate({opacity:0}, {duration:400, complete:function(){
				$(this).animate({height:0}, {duration:300, complete:function(){
					$(this).css({display:"none", opacity:1, height:50});
					//var username = $("#userfiltername").text();
					$("#userfiltertext").html("");
					search.setUsername(null);
					search.flush();
				}});
			}});
		},
		addIngredientRow : function(ingredient){	
			var $ingredientList = $("#ingredient_list");
			var $li = null;
			$ingredientList.children("li").each(function(i){
				var $this = $(this);
				if($li!=null) return;
				if($this.children().length == 0)
					$li = $this;
			});
			
			if($li == null){
				$li = $("<li></li>");
				$ingredientList.append($li);
			}
			
			var template = _.template(ingredientRowTemplate, {name : ingredient});
			$li.append(template);
			return $li;
		},
		addExcludedIngredientRow : function(ingredient){	
			return this.addIngredientRow(ingredient).addClass('excluded');
		},
		clickExcludeIngredient : function(event){
			var ingredient = $(event.target).siblings('.ingredient').text();
			var search = Search.init();
			search.removeZutat(ingredient);
			search.excludeIngredient(ingredient);
			search.flush();
		},
		clickAddIngredient : function(event){
			var ingredient = $(event.target).siblings('.ingredient').text();
			var search = Search.init();
			search.addZutat(ingredient);
			search.removeExcludedingredient(ingredient);
			search.flush();
		},
		//recipe
		setFromRecipe : function(recipe){
			$("#filter_headline").text("Legende");
			$("#filter_main").addClass("blocked");
			$("#kategorie_head").text(recipe.category);
			
			$("#time_form > *").not(".time_text_end").hide();
			$("#time_form .time_text_end").text(time.fillStd(recipe.time.std)+" : "+time.fillMin(recipe.time.min)+" h");
			
			var persons = Number(recipe.persons);

			this.makeIngredientHeaderForRecipe(persons);

			this.checkOn($("#chef_" + recipe.skill));
			this.checkOn($("#muffin_" + recipe.calorie));
			//blockFilter(true);
		},
		makeIngredientHeaderForRecipe : function(personNum) {
			var $zutatHead = $("#zutat_head").empty().append("<span>Zutaten für </span>");

			var $personsForm = $("<div></div>").addClass("numberinput persons").append("<input type=\"text\"></input><div class=\"up\"></div><div class=\"down\"></div>");
			var $input = $personsForm.children("input").first().attr({
				id : "persons_num",
				value : personNum,
				size : 2,
				maxlength : 2
			}).data("persons", personNum);

			var person = "<span>" + personNum == 1 ? "Person:" : "Personen:" + "</span>";
			$zutatHead.append($personsForm).append(person);

			var persCount = null;
			var self = this;
			$input.keydown(function(e) {
				var $this = $(this);
				if(e.which == 13) {
					persCount = $this.val();
					multiZutaten(persCount);
					$this.blur();
				} else if(e.which == 38) {//up{
					self.personsUp();
					return false;
				} else if(e.which == 40) {//down
					self.personsDown();
					return false;
				} else if(!(event.which >= 48 && event.which <= 57) && !(event.which >= 96 && event.which <= 105) && event.which != 8 && event.which != 46)
					return false;

			});

			$personsForm.children(".up").click($.proxy(this.personsUp, this));

			$personsForm.children(".down").click($.proxy(this.personsDown, this));

		},
		personsUp : function() {
			var $input = $("#persons_num");
			var currentNum = Number($input.val());
			var newNum = ((currentNum) % 99) + 1;
			$input.val(newNum);
			this.multiplyIngredients(newNum);
		},
		personsDown : function() {
			var $input = $("#persons_num");
			var currentNum = Number($input.val());
			var newNum = ((99 - 2 + currentNum) % 99) + 1;
			$input.val(newNum);
			this.multiplyIngredients(newNum);
		},
		multiplyIngredients : function(perscount, recipe) {

			$("#ingredient_list .amount").each(function(i) {
				var amount = $(this).data("amount");
				if(amount === undefined){
					amount = $(this).text();
					$(this).data("amount", amount);
				}
				var newValue = stringTools.getNumbersFromString(amount, perscount);
				
				if(recipe!=null){
					var zutat = recipe.ingredients[i];
					//var currentzutattext = $(this).prev().text();
					if(zutat.singular != null) {
						if(getValuefromString(newValue) == 1) {
							$(this).prev().text(zutat.singular);
						} else
							$(this).prev().text(zutat.name);
					}
				}
				$(this).text(newValue);
			});
		}
	};
});

