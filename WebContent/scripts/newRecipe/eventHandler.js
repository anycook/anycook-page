//step1
function newRecipeKeypress(event){
	if(navigator.appCodeName=="Mozilla" &&!event.charCode)
		return;
	var text = $("#recipe_name").val()+String.fromCharCode(event.charCode);

	if(text.length > 20)
		text = text.substring(0, 20)+"...";
		
	$("#nr_name").text(text);
}

function newRecipeKeydown(event){
	var text = $("#recipe_name").val();
	if(text.length == 0)
		text = "Rezeptname";
	else{
		if(event.keyCode==8 && text.length<=20){
			text = text.substring(0, text.length-1);
			if(text.length == 0)
				text = "Rezeptname";
			
			$("#nr_name").text(text);
		}
	}
	
	if(event.keyCode==8){
		
	}
	
}

function focusNRBeschreibung(event){
	var target = $(event.target);
	var text = target.val();
	if(text == "Aller Anfang ist schwer"){
		target.val("");
		target.css("color","#404040");
	}
}
function focusoutNRBeschreibung(event){
	var target = $(event.target);
	var text = target.val();
	if(text == ""){
		target.val("Aller Anfang ist schwer");
		target.css("color","#9b9b9a");
	}
}
function nrProgress(id, filename, loaded, total){
	var progress = (loaded/total*100).toFixed(0);
	$("#progress").css("width", progress*2.22);
	if(progress>15){
		$("#progress_percent").text((progress)+"%");
	}
}

function addProgressBar(){
	/*var htmlstring = "";
	$("#upload").html(htmlstring);*/
}

function completeUpload(id, fileName, responseJSON){
	if(responseJSON.success == "true"){
		
	}
}

function beschreibungCounter(event){
	var target = $(event.target);
	var maxlength = 250;
	var length = Number(target.val().length);
	if(length >= maxlength){
		if(event.keyCode !=8 && event.keyCode !=13)
			return false;
	}
	else{
		$(".beschreibung_character").text((maxlength-length)-1);
	}
}
function handleNRKategories(event){
	$(".step_1_right ul.kategorie_filter").toggle();
	$(".step_1_right div.kategorie_filter").toggleClass("on");
	if($(".step_1_right div.kategorie_filter").hasClass("on")){
		$(".step_1_right ul.kategorie_filter li").mouseenter(kategorieOver).mouseout(kategorieOut).click(newKategorieClick);
		$(document).click(closeNRKategorien);
		
	}
	else{
		$(".step_1_right ul.kategorie_filter li").unbind("mouseenter", kategorieOver).unbind("mouseout", kategorieOut).unbind("click", newKategorieClick);
		$(document).unbind("click", closeNRKategorien);
	}
	return false;
}

function closeNRKategorien(event){
	var menu = $('.step_1_right .kategorie_filter');
	var target = $(event.target);
	if (target.parents().andSelf().not(menu) && $(".step_1_right div.kategorie_filter").hasClass("on"))
		handleNRKategories(event);
}

function newKategorieClick(event){
	var target = $(event.target);
	var text = target.text();
	$(".step_1_right #kategorie_filter_name").text(text);
	$(".step_1_right .kategorie_filter_hidden").val(text);
	
	$("#nr_kategorie").text(text);
}

//step2 handler
function addNewSchritt(event){
	var count = $(".new_step").length;
	$("#step_table").append("<tr><td><div class='new_step'><div class='step_left'><p class='step_number'>"+(count+1)+".</p><textarea class='step_textarea'></textarea>"+
					"</div><div class='step_right'></div></div></td><td><div class='step_character'>260</div><div class='minus_btn remove_schritt'></div></td></tr>");
	
	$newRecipeStep2 = $("#new_recipe_step2");
	var outerHeight = $newRecipeStep2.height();
	var innerHeight = 0;
	$newRecipeStep2.children().each(function(){
		innerHeight+=$(this).outerHeight(true);
	});
	var newTop = innerHeight - outerHeight;
	$newRecipeStep2.animate({scrollTop: newTop},1000);
	$(".new_step textarea").last().focus();
}

function removeNewSchritt(event){
	var count = $(".new_step").length;
	if(count>2){
		var target = $(event.target);
		target.parents("tr").remove();
		
		var stepnums = $(".step_number");
		for (var i = 1; i<=stepnums.length; i++)
			$(stepnums[i-1]).text(i+".");
	}
	
}

function schrittCounter(event){
	var target = $(event.target);
	var maxlength = 260;
	var length = Number(target.val().length);
	if(length >= maxlength){
		if(event.keyCode !=8 && event.keyCode !=13)
			return false;
	}
	else{
		if(event.keyCode ==8){
			if(length>0)
				target.parents("tr").find(".step_character").text(maxlength-length+1);
		}
		else
			target.parents("tr").find(".step_character").text((maxlength-length)-1);
	}
	
	var counter = 0;
	$(".step_character").each(function(index, value){
		if(Number($(value).text())<260)
			counter++;
	});
	if(counter < 10)
		counter = "0"+counter;
	$("#nr_stepnumber").text(counter);
}


//step3
function deleteNewZutat(event){
	var count = $(".step_3_left").length;
	if(count>2){
		var target = $(event.target);
		target.parents("tr").remove();
	}
}

function addNewZutat(event){
	$("#new_zutat_table").append('<tr><td class="step_3_left"><input type="text" class="new_zutat_name" value="" maxlength="45" /></td><td class="step_3_right"><input type="text" class="new_zutat_menge" value="" maxlength="45" /></td>'+
								'<td class="step_3_delete"><div class="step_3_deletebtn"></div></td></tr>');
	$newRecipeStep3 = $("#new_recipe_step3");
	var outerHeight = $newRecipeStep3.height();
	var innerHeight = 0;
	$newRecipeStep3.children().each(function(){
		innerHeight+=$(this).outerHeight(true);
	});
	var newTop = innerHeight - outerHeight;
	$newRecipeStep3.animate({scrollTop: newTop},500);
	$(".new_zutat_name").last().focus();
}

function keyupNewZutat(event){
	var counter = 0;
	$(".new_zutat_name").each(function(index, value){
		if($(value).val().length > 0)
			counter++;
	});
	
	if(counter<10)
		counter="0"+counter;
	$("#nr_zutatennumber").text(counter);
}


//step4





//dauer

//radios

function checkNewOnOff(event){
	var target = $(event.target);
	if(target.children().attr("checked")){
		target.children().removeAttr("checked");
		handleRadios(event.target);
	}
	else{
		target.children().attr("checked", "checked");
		handleRadios(event.target);
	}
		
	
}

//animation
function animateNewRecipe(newLeft){
		$("#new_recipe_step1").animate({left: newLeft}, 
				{duration: 700, step:synchronizeNewRecipe});	
}

function synchronizeNewRecipe(now){
	var siblings = $(this).siblings();
	$(siblings[0]).css("left", now+655);
	$(siblings[1]).css("left", now+1310);
	$(siblings[2]).css("left", now+1965);
}
