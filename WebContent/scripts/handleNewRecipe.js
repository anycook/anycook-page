function clickNewRecipeHeader(event){
	var target = $(event.target);
	var id = target.attr("id");
	if(id.match("general")!=null){
		$.address.parameter("page", "");
	}
	else if(id.match("schritte")!=null){
		$.address.parameter("page", "schritte");
	}
	else if(id.match("zutaten")!=null){
		$.address.parameter("page", "zutaten");
	}
	else if(id.match("abschluss")!=null){
		$.address.parameter("page", "abschluss");
	}		
}

function nextStep(event){
	if($.address.parameterNames().length ==0){
		if(finishStep1()){
			$("#nr_schritte_btn").removeClass("inactive");
			$.address.parameter("page", "schritte");
		}
			
	}
	else{
		if($.address.parameter("page")=="schritte"){
			if(finishStep2()){
				$("#nr_zutaten_btn").removeClass("inactive");
				$.address.parameter("page", "zutaten");
			}				
		}
		else if($.address.parameter("page")=="zutaten"){
			if(finishStep3()){
				$("#nr_abschluss_btn").removeClass("inactive");
				$.address.parameter("page", "abschluss");
			}				
		}							
	}
}

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

function focusNewRecipe(event){
	var target = $(event.target);
	
	if(target.val()=="kurz & knapp"){
		//$("#nr_progress").append("<div id='nr_name'></div>");
		target.val("");
		$("#recipe_name").css("color", "#404040");
	}
}

function focusoutNewRecipe(event){
	var target = $(event.target);
	if(target.val()==""){
		target.val("kurz & knapp");
		$("#recipe_name").css("color", "#9b9b9a");	
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
	
	var newTop = $(".new_step").last().offset().top;
	$("html:not(:animated),body:not(:animated)").scrollTop(newTop);
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
	$("#new_zutat_table").append('<tr><td class="step_3_left"><input type="text" class="new_zutat_name" value="" /></td><td class="step_3_right"><input type="text" class="new_zutat_menge" value="" /></td>'+
								'<td class="step_3_delete"><div class="step_3_deletebtn"></div></td></tr>');
	var newTop = $("#new_zutat_table tr").last().offset().top;
	$("html:not(:animated),body:not(:animated)").scrollTop(newTop);
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


//tags
function makeTagCloud(){
	var json = null;
	$.ajax({
		  url: "/anycook/GetPopularTags",
		  dataType: 'json',
		  data: "num=14",
		  async:false,
		  success: function(response){
				if(response != "false")
					json=response;
	}
		});
	
	for(tag in json){
		$("#tagcloud").append("<span><span>"+tag+"</span></span> ");
		$("#tagcloud span span").last().css({"font-size":json[tag]*7,
				"opacity": json[tag]/4
		});
	}
}

function addNewTag(event){
	
	var target = $(event.target);
	var text = target.text();
	saveNewTag(text);	
}

function handleNewTagClick(event){
		makeNewRInput();
}

function removeNewTag(event){
	var target = $(event.target);
	target.parent().remove();
	removeNewInput();
	
	var count = $("#recipe_tags .tag").length;
	
	if(count<10)
		count = "0"+count;
	
	$("#nr_tagnumber").text(count);
}

function removeNewInput(){
	$("#recipe_tags input").remove();
}

function keyNewTag(event) {
	var text = $(event.target).val();

	if((event.keyCode == 13 || event.keyCode == 188 || event.keyCode == 32) && text!="" ){
		saveNewTag(text);
		makeNewRInput();		
	}
	else if(event.keyCode == 8 && text ==""){
		$("#recipe_tags .tag").last().remove();
		removeNewInput();
		makeNewRInput();
		
		var count = $("#recipe_tags .tag").length;
		
		if(count<10)
			count = "0"+count;
		
		$("#nr_tagnumber").text(count);
		
		return false;
	}
	
}

function makeNewRInput(){
	if(blocked==false){
		if($("#recipe_tags input").length==0){
			var divlength = getDivLength();
			//make new input field
			if(divlength<320){
				$("#recipe_tags").append("<input type='text'/>");
				$("#recipe_tags input").keydown(keyNewTag);
				$("#recipe_tags input").focus();
			}
		}
		else 
			$("#recipe_tags input").focus();
	}
}

function saveNewTag(text){
	if(text[0]=="," || text[0]==" ")
		text = text.substring(1,text.length);
	
	removeNewInput();	
	if($("#recipe_tags .tag_text:contains("+text+")").length == 0){		
		var htmlstring = "<div class='tag'><div class='tag_text'>"+text+"</div><div class='tag_remove'>x</div></div>";
		$("#recipe_tags").append(htmlstring);
		$("#recipe_tags .tag_remove").last().click(removeNewTag);
		
		var count = $("#recipe_tags .tag").length;
		
		if(count<10)
			count = "0"+count;
		
		$("#nr_tagnumber").text(count);
	}
}


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
	
	
	$.ajax({
		url:"/anycook/AddtoNewRecipe",
		data:"recipe_name="+gerichtname+"&kategorie="+kategorie+"&beschreibung="+beschreibung
	});
	
	$("#nr_schritte_btn").click(clickNewRecipeHeader);
	return true;
	
	
}

function finishStep2(){
	if($(".step_textarea").first().val()=="")
		return false;
	
	
	$(".step_textarea").each(function(index, value){
		var text = $(value).val();
		if(text!=""){
			$.ajax({
				url:"/anycook/AddtoNewRecipe",
				data:"schritt="+text+"&num="+(index+1)
			});
		}
	});
	
	var reihen = 0;
	$.ajax({
		url:"/anycook/GetZutatenfromSchritte",
		dataType:"json",
		async:false,
		success:function(json){
		if(json.error == null){
				for(zutat in json){
					var htmlstring = '<tr><td class="step_3_left"><input type="text" class="new_zutat_name" value="'+json[zutat]+'" /></td>'+
											'<td class="step_3_right"><input type="text" class="new_zutat_menge"/></td><td class="step_3_delete"><div class="step_3_deletebtn"></div></td></tr>';
					$("#new_zutat_table").append(htmlstring);
					reihen++;
				}
			}
		}
	});
	var htmlstring = '<tr><td class="step_3_left"><input type="text" class="new_zutat_name" value="" /></td>'+
						'<td class="step_3_right"><input type="text" class="new_zutat_menge" value="" /></td><td class="step_3_delete"><div class="step_3_deletebtn"></div></td></tr>';
	
	//füllt reihen auf 
	if(reihen < 8){
		for(reihen; reihen <=8; reihen++)
			$("#new_zutat_table").append(htmlstring);			
	}
	
	$("#nr_zutaten_btn").click(clickNewRecipeHeader);
	return true;
}

function finishStep3(){
	if($(".new_zutat_name").first().val().length=="")
		return false;
	
	$("#new_zutat_table tr").each(function(index, value){
		var zutat = $(value).find(".new_zutat_name").val();
		var menge = $(value).find(".new_zutat_menge").val();
		if(zutat!=""){
			$.ajax({
				url:"/anycook/AddtoNewRecipe",
				data:"zutat="+zutat+"&menge="+menge
			});
		}
	});
	
	
	$("#nr_abschluss_btn").click(clickNewRecipeHeader);
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
	
	$.ajax({
		url:"/anycook/AddtoNewRecipe",
		data:"std="+std+"&min="+min+"&skill="+skill+"&kalorien="+kalorien+"&personen="+personen
	});
	
	$("#recipe_tags .tag_text").each(function(index, value){
		var tag = $(value).text();
		$.ajax({
			url:"/anycook/AddtoNewRecipe",
			data:"tag="+tag
		});
	});
	
	
	$.ajax({
		url:"/anycook/CheckRecipe",
		async:false,
		success:function(response){
			if(response == "false"){
				alert("Ups! Fehler bei der Erstellung des Rezeptes!");
				checker=false;
			}
			else
				checker = true;
		}
	});
	
	return checker;
	
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
	//$.delay(2000).address.value("");
	return false;
	//$.delay(2000).address.value("");
}

function readyClick(){
	$("#new_recipe_ready").fadeOut(400, function(){
		$("#content_main").unbind("click");
		$.address.value("");
	});
	
	//$("#content_main").unbind("click");
	//$.address.value("");
}