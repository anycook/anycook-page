// alle Filter
function setFiltersfromSession(){
	resetFilter();
	
	if(search != null){
		if(search.kategorie!=null){
			$("#kategorie_head").text(search.kategorie);
			$("#kategorie_filter_hidden").val(search.kategorie);
		}
		if(search.skill!=null){
			checkOn("#chef_"+search.skill);
			handleRadios("#filter_table .label_chefhats");
		}
		if(search.kalorien!=null){
			checkOn("#muffin_"+search.kalorien);
			handleRadios("#filter_table .label_muffins");
		}
		if(search.time != null){
			var time = search.time.split(":");
			$("#time_std").val(time[0]);
			$("#time_min").val(time[1]);
		}
		if(search.user !=null){
			setUserfilter(search.user);
		}
		
		for(num in search.zutaten)
			addIngredientRow(search.zutaten[num]);
			
		for(num in search.excludedingredients)
			addExcludedIngredientRow(search.excludedingredients[num]);
		
		for(num in search.tags)
			$(".tags_list").append(getTag(search.tags[num], "remove"));
		
		if(search.terms!=undefined){
			$("#search_terms").show();
			for(i in search.terms){
				addTerms(search.terms[i], false);
			}
		}
	}

}

function resetFilter(){
	
	
	$("#filter_main").removeClass("blocked");
	$("#zutat_head").text("Zutaten:");
	$("#userfilter").hide();
	$("#filter_main").show().css({paddingBottom: "20px", height: "auto"});
	$("#filter_main *").not("ul.kategorie_filter, #userfilter, #userfilter *, label .active").show().css("opacity", 1);
	$("#filter_headline").text("Filter");
	
	$("#time_form > *").show();
	$("#time_form .time_text_end").text("h");
	
	$("#time_std, #time_min").val("0");
	removeChecked();
	//blockFilter(false);
	handleRadios("#filter_table .label_chefhats, #filter_table .label_muffins");
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
	$(".close_term").off("click", removeTerm);
	
}


//kategorie

function loadAllKategories(target){
	if(!target.children().size() > 0){
		if(target.parents(".step_1_right").length == 0){
			target.append("<li><span class=\"left\">keine Kategorie</span><span class=\"right\"></span></li>");
			target.append("<li><span class=\"left\">alle Kategorien</span><span class=\"right\"></span></li>");
		}
		
		$.anycook.graph.category.sorted(function(json){
			var totalrecipes = 0;
				for(var k in json){
					target.append("<li><span class=\"left\">"+k+"</span><span class=\"right\">"+json[k]+"</span></li>");
					totalrecipes+=Number(json[k])
				}
				$(target.find(".right")[1]).text(totalrecipes);
		});
	}
}

function handleKategories(obj){
	if(!$("#filter_main").is(".blocked")){
		
		$kategorieList = $("#kategorie_list");
		animateCategory($kategorieList);
		$("#kategorie_filter").toggleClass("on");
		if($("#kategorie_filter").hasClass("on")){
			var $ul = $("#kategorie_list ul");
			$ul.children("li").mouseenter(kategorieOver).mouseleave(kategorieOut).click(kategorieClick);
	    	$(document).click(closeKategorien);
	    	
		}
		else{
			$("#kategorie_list ul li").unbind("mouseenter", kategorieOver).unbind("mouseleave", kategorieOut).unbind("click", kategorieClick);
	    	$(document).unbind("click", closeKategorien);
		}
		return false;
	}
}

function animateCategory($kategorieList){
		var newHeight = 9;
		if($kategorieList.height()==newHeight)
			newHeight += $kategorieList.children("ul").height()+6;
		
		$kategorieList.animate({
			height:newHeight
		}, {
			duration: 600,
			easing: "swing"
		});
}

function kategorieOver(event){
	var $this = $(this);	
	var text = $this.children(".left").text();
	$("#kategorie_head").text(text);
}

function kategorieOut(event){
	var oldtext = $("#kategorie_filter_hidden").val();
	$("#kategorie_head").text(oldtext);
}

function kategorieClick(obj){
	var text = $(this).children(".left").text();
	
	setKategorie(text);
	
	
	handleKategories(obj);
}

function setKategorie(text){
	var hiddenval = $("#kategorie_filter_hidden").val();
	if(hiddenval != text){
		if(text == "keine Kategorie")
			text = null;

		search.setKategorie(text);
		search.flush();
	}
	
}


function closeKategorien(event){
	var $target = $(event.target);
	var $kategorieList = $("#kategorie_list");
	
	if($target.parents().andSelf().not($kategorieList) && $("#kategorie_filter").hasClass("on")){
		$("#kategorie_filter").removeClass("on");
		animateCategory($kategorieList);
	}
}


//radiobuttons

function handleRadios(obj){
		var $obj = $(obj).removeClass('on')
			.siblings().andSelf().removeClass('on');	
	   		$obj.children("input:checked").parent('label').addClass('on').prevAll().addClass('on');
	   	return;
}

function mouseoverRadio(obj){
	$(obj).nextAll().removeClass('on');
	$(obj).prevAll().andSelf().addClass('on');
}

function removeChecked(){
	$('#filter_table label input:checked').removeAttr("checked");
}

function checkOnOff(obj){
	$obj=$(obj).children("input").first();
	var value = $obj.val();
		
	switch($obj.attr("class")){
	case "chefhats":
		search.setSkill(value);
		break;
	case "muffins":
		search.setKalorien(value);
		break;
	}
	search.flush();
}

function checkOn(obj){
	if($(obj).attr("ckecked")==null){
		$(obj).siblings().removeAttr("checked");
		$(obj).attr("checked", "checked");
	}
}

function textReplacement(input){
	var originalvalue = input.val();
	 input.focus( function(){
	  if( $.trim(input.val()) == originalvalue ){ input.val(''); }
	 });
	 input.blur( function(){
	  if( $.trim(input.val()) == '' ){ input.val(originalvalue); }
	 });
}


//zutaten
function ingredientListClick(){	
	if(!$("#filter_main").is(".blocked")){
		var $this = $(this);
		var $input = $this.find("input");
		
		if($input.length > 0)
			$input.focus();
		else{
			var $li = null;
			$this.children("li").each(function(i){
				if($li!=null) return;
				if($(this).children().length == 0)
					$li = $(this);
			});
			
			if($li == null){
				$li = $("<li></li>");
				$this.append($li);
			}
			
			$li.append("<input type=\"text\" /><div class=\"close\"></div>");			
			
			$input = $li.children("input");
			$li.children(".close").hide();
			$input
				.focus()
				.keypress(addCloseBtn)
				.autocomplete({
	    		source:function(req,resp){
        			//var array = [];
        		var term = req.term;
        		var excluded = false;
        		if(term.charAt(0)=== "-"){
        			excluded = true;
        			term = term.substr(1);
        			if(term.length == 0) return;
        		}
        		
        		$.anycook.graph.autocomplete.ingredient(term,function(data){
        				resp($.map(data, function(item){
        					return{
        						data:item,
        						value:"-"+item,
        						excluded:excluded
        						};
        					}));        			
        				});
        			},
        			minlength:1,
        			position:{
        				offset:"-5 1"
        			}, 
        			select:function(event, ui){
        				var text = ui.item.data;
        				$("#ingredient_list input").autocomplete("destroy");
        				if(ui.item.excluded)
        					search.excludeIngredient(text);
        				else
        					search.addZutat(text);
        				search.flush();
        				return false;
        			}
	    	});
	    	$(".ui-autocomplete").last().addClass("ingredient-autocomplete");
	    	
	    	/*$("#zutat_form").submit(function(event){
	    		var zutat = $("#zutat_input").val();
	    		$("#zutat_input").autocomplete("destroy");
				$("#zutat_input").parents("tr").remove();
	    		search.addZutat(zutat);
	    		search.flush();
	    		//zutatentableclick();
	    		return false;
	    	});*/
	    	
	    	
		}
	}
}

function addCloseBtn(e){
	var $this = $(this);
	
	var val = $this.val();
	if(e.which == 13){
		$this.autocomplete("destroy");
		search.addZutat(val);
		search.flush();
	}else if((val+String.fromCharCode(e.which)).length>0)
		$this.siblings().first().fadeIn(500);
		
	
		
}



function removeZutatField(event){
	var $this = $(this);
	var  $input = $this.siblings("input");
	if($input.length == 1){
		$input.remove();
		$this.remove();
	}else{
		var ingredient = $this.siblings();
		if(ingredient.hasClass("excluded"))
			search.removeExcludedingredient(ingredient.text());
		else
			search.removeZutat(ingredient.text());
		search.flush();
	}
}


//userfilter

function setUserfilter(username){
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
}

function showUserfilterremove(event){
	$("#userfilterremove").fadeIn(300);
}

function hideUserfilterremove(event){
	$("#userfilterremove").fadeOut(300);
}

function removeUserfilter(){
	$("#userfilter").animate({opacity:0}, {duration:400, complete:function(){
		$(this).animate({height:0}, {duration:300, complete:function(){
			$(this).css({display:"none", opacity:1, height:50});
			//var username = $("#userfiltername").text();
			$("#userfiltertext").html("");
			search.setUsername(null);
			search.flush();
		}});
	}});
	
}

function addIngredientRow(ingredient){	
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
	
	$li.append("<div class=\"ingredient\">"+ingredient+"</div><div class=\"close\"></div>");
}

function addExcludedIngredientRow(ingredient){	
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
	
	$li.append("<div class=\"ingredient excluded\">"+ingredient+"</div><div class=\"close\"></div>");
}

