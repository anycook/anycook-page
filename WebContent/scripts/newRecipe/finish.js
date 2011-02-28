//finish steps
function finishStep1(){
	var gerichtname = $("#recipe_name").val();
	var beschreibung = $("#recipe_beschreibung").val();
	var kategorie = $(".step_1_right #kategorie_filter_name").text();
	var checker = true;
	if(gerichtname == "kurz & knapp"){
		$("#recipe_name").addClass("wrong");
		checker =  false;
	}
	if(kategorie == "Keine Kategorie"){
		$(".step_1_right .kategorie_filter").addClass("wrong");
		checker =  false;
	}
	if(beschreibung.length < 2) {
		$("#recipe_beschreibung").addClass("wrong");
		checker =  false;
	}
	
	$.ajax({
		url: "/anycook/CheckRecipe",
		data:"gericht="+gerichtname,
		dataType:"text",
		async:false,
		success: function(response){
			if(response != "true"){
				
				checker = false;
			}
	}
	});	
	if(!checker)
		return false;
	
	
	newrecipe.setName(gerichtname);
	newrecipe.setKategorie(kategorie);
	newrecipe.setBeschreibung(beschreibung);
	
	return true;
	
	
}



function finishStep2(){
	if($(".step_textarea").first().val()=="")
		return false;
	
	newrecipe.resetSchritte();
	$(".step_textarea").each(function(index, value){
		var text = $(value).val();
		if(text!=""){
			newrecipe.addSchritt(index+1, text);
		}
	});
	
	
	return true;
}



function finishStep3(){
	if($(".new_zutat_name").first().val().length=="")
		return false;
	
	newrecipe.resetZutaten();
	$("#new_zutat_table tr").each(function(index, value){
		var zutat = $(value).find(".new_zutat_name").val();
		var menge = $(value).find(".new_zutat_menge").val();
		if(zutat!=""){
			newrecipe.addZutat(zutat, menge);
		}
	});
	
	
	return true;
}


function finishStep4(){
	var checker = true;
	var std = $("#nr_time_std").val();
	var min = $("#nr_time_min").val();
	if(std=="00" && min=="00"){
		$("#nr_time_std,#nr_time_min").addClass("wrong");
		checker =  false;
	}
	
	
	var skill = $(".step_4_left .label_chefhats.on").length;
	var kalorien = $(".step_4_left .label_muffins.on").length;
	if(kalorien == 0 || skill == 0 || kalorien == undefined || skill == undefined){
		$("#table_skill,#table_kalorien").addClass("wrong");
		checker =  false;
	}
		
	
	var personen = $("#nr_person").val();
	if(personen == "00"){
		$("#nr_person").addClass("wrong");
		checker =  false;
	}
	if(!checker)
		return false;
	
	newrecipe.setPersonen(personen);
	newrecipe.setSkill(skill);
	newrecipe.setKalorien(kalorien);
	newrecipe.setTime(std, min);
	
	$("#recipe_tags .tag_text").each(function(index, value){
		var tag = $(value).text();
		newrecipe.addTag(tag);
	});
	
	
	return newrecipe.checkRecipe();	
	
}
function finishNewRecipe(){
	if(!finishStep4())
		return false;
	
	$.ajax({
		url:"/anycook/SaveNewRecipe"
	});
	$("#content_main > *").fadeOut(400, function(){$("#content_main").contents().remove();});
	$("#content_header > *").fadeOut(400, function(){$("#content_header").contents().remove();});
	$("#content_main").append("<div id='new_recipe_ready' class='content_message'><h5>Danke!</h5><p>Dein Rezept wird geprüft und anschließend veröffentlicht.<br /> Wir benachrichtigen dich!</p></div>");
	$("#content").click(readyClick);
	window.setTimeout(readyClick, 4000);
	return false;
}

