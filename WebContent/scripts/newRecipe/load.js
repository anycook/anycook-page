var newrecipe;

function loadNewRecipe(){
	if(!loginChecker())
		$.address.path("");
	else{
		
		//load other newRecipescripts
		$.ajaxSetup({async:false});
		$.getScript("/scripts/newRecipe/finish.js");
		$.getScript("/scripts/newRecipe/misc.js");
		$.getScript("/scripts/newRecipe/eventHandler.js");
		$.ajaxSetup({async:true});
		
		
		newrecipe = new Recipe();
		
		$(".new_recipe_steps").hide();
		$("#new_recipe_step1").show();
		var headertext = "<div id='nr_general_btn' class='big_button'>Generelles</div>" +
				"<div class='nr_dots'></div><div id='nr_schritte_btn' class='big_button inactive'>Schritte</div>" +
				"<div class='nr_dots'></div><div id='nr_zutaten_btn' class='big_button inactive'>Zutaten</div>" +
				"<div class='nr_dots'></div><div id='nr_abschluss_btn' class='big_button inactive'>Abschluss</div>";
		$("#content_header").html(headertext);
		$("#filter_headline").text("Fortschritt");
		$("#nr_general_btn").addClass("on");
		$("#filter_main").after("<div id='progress_1'><div id='nr_name'>Rezeptname</div><div id='nr_kategorie'>Keine Kategorie</div><div id='nr_upload'>Bildupload:</div><div id='upload'><div id='progressborder'><div id='progress'><div id='progress_percent'></div></div></div></div></div>");
		$("#progress_1 > *").animate({"opacity":.0}, 0);
		$("#filter_main").animate({height:0, paddingBottom:0},1000);
		var filter_content = $("#filter_main *");
		filter_content.animate({"opacity":0}, {duration:1000, complete:function(){
			$("#filter_main").hide();
			$("#progress_1 > *").animate({"opacity":1}, 500);
			$("#filter_main > *").hide();
		}});
		
		$("#filter_main").css("height", "auto");
		
		
		//actionListener
		$("#recipe_name, #recipe_beschreibung").focus(function(event){
			var target = $(event.target);
			target.removeClass("wrong");
		});
		$(".step_1_right .kategorie_filter").click(function(){
			$(".step_1_right .kategorie_filter").removeClass("wrong");
		});
		
		//header
		$("#nr_general_btn").click(clickNewRecipeHeader);
		$(".next_step").click(nextStep);
		
		//step1
		$("#recipe_name").focus(focusNewRecipe);
		$("#recipe_name").focusout(focusoutNewRecipe);
		$("#recipe_name").keypress(newRecipeKeypress).keydown(newRecipeKeydown);
		
		$("#recipe_beschreibung").focus(focusNRBeschreibung);
		$("#recipe_beschreibung").focusout(focusoutNRBeschreibung);
		$("#recipe_beschreibung").keydown(beschreibungCounter);
		
		loadAllKategories($(".step_1_right ul.kategorie_filter"));
		$(".step_1_right ul.kategorie_filter").hide();
		$(".step_1_right .recipe_kategorie").click(handleNRKategories);
		
		var uploader = new qq.FileUploader({
		    // pass the dom node (ex. $(selector)[0] for jQuery users)
		    element: document.getElementById('file_uploader'),
		    onSubmit:addProgressBar,
		    onProgress:nrProgress,
		    onComplete:completeUpload,
		    // path to server-side upload script
		    action: '/anycook/UploadImage'
		});
		
		
		//step2
		$("#neuer_schritt").click(addNewSchritt);
		$(".remove_schritt").live("click", removeNewSchritt);
		$(".step_textarea").live("keydown", schrittCounter);
		
		//step3
		$(".step_3_deletebtn").live("click", deleteNewZutat);
		$(".new_zutat_name").live("keyup", keyupNewZutat);
		$("#new_zutat").click(addNewZutat);
		
		//step4
		makeTagCloud();
		$("#tagcloud span span").live("click", addNewTag);
		$("#recipe_tags").click(handleNewTagClick);
		$(".step_4_left .label_chefhats, .step_4_left .label_muffins").mouseover(function(event){
				mouseoverRadio(event.target);
    	});
		$(".label_stars, .label_chefhats, .label_muffins").mouseleave(function(event){
    			handleRadios(event.target);
    	});
		$(".step_4_left .label_chefhats, .step_4_left .label_muffins").click(checkNewOnOff);
		$("#recipe_ready").click(finishNewRecipe);
	}
}

function loadStep2(){
	if(newrecipe.name ==null || newrecipe.beschreibung == null || newrecipe.kategorie == null)
		$.address.parameter("page", "");
	$("#nr_schritte_btn").click(clickNewRecipeHeader);
	
	$("#nr_schritte_btn").addClass("on");			
	$("#new_recipe_step2").show();
	if($("#progress_2").length == 0){
		$("#progress_1").after("<div id='progress_2'></div>");
		$("#progress_2").animate({"height": 90}, {duration:1000,complete:function(){
			$("#progress_2").append("<div class='nr_devider'></div><div id='nr_statussteps'>Du hast<br /><span id='nr_stepnumber'>00</span> Schritte eingerichtet.</div>");
			$("#progress_2 > *").animate({"opacity": .0}, 0);
			$("#progress_2 > *").animate({"opacity": 1.0}, 500);
			}
		});
	}
}

function loadStep3(){
	if(newrecipe.schritte.length == 0)
		$.address.parameter("page", "schritte");
	$("#new_zutat_table").empty();
	var reihen = 0;
	
	newrecipe.sendSchritte();
	
	if(newrecipe.zutaten == null)
		getZutatenfromSchritte();
	
	var zutaten = newrecipe.zutaten;
	for(zutat in zutaten){
		var htmlstring = '<tr><td class="step_3_left"><input type="text" class="new_zutat_name" value="'+zutaten[zutat]+'" /></td>'+
								'<td class="step_3_right"><input type="text" class="new_zutat_menge"/></td><td class="step_3_delete"><div class="step_3_deletebtn"></div></td></tr>';
		$("#new_zutat_table").append(htmlstring);
		reihen++;
	}
	
				
	var htmlstring = '<tr><td class="step_3_left"><input type="text" class="new_zutat_name" value="" /></td>'+
						'<td class="step_3_right"><input type="text" class="new_zutat_menge" value="" /></td><td class="step_3_delete"><div class="step_3_deletebtn"></div></td></tr>';
	
	//füllt reihen auf 
	if(reihen < 8){
		for(reihen; reihen <=8; reihen++)
			$("#new_zutat_table").append(htmlstring);			
	}
	
	$("#nr_zutaten_btn").click(clickNewRecipeHeader);
	
	$("#nr_zutaten_btn").addClass("on");
	$("#new_recipe_step3").show();
	if($("#progress_3").length == 0){
		$("#progress_2").after("<div id='progress_3'></div>");
		$("#progress_3").animate({"height": 90}, {duration:1000,complete:function(){
			$("#progress_3").append("<div class='nr_devider'></div><div id='nr_statuszutaten'>Dein Rezept hat ganze<br /><span id='nr_zutatennumber'>00</span> Zutaten.</div>");
			$("#progress_3 > *").animate({"opacity": .0}, 0);
			$("#progress_3 > *").animate({"opacity": 1.0}, {duration:500, complete:function(){
				//setzt zähler auf den ersten Stand
				var reihen = 0;
				$(".new_zutat_name").each(function(index, value){
					if($(value).val().length > 0)
						reihen++;
				});
				if(reihen<10)
					reihen="0"+reihen;
				$("#nr_zutatennumber").text(reihen);
			}});}});
	}
}


function loadStep4(){
	if(newrecipe.zutaten == null)
		$.address.parameter("page", "zutaten");
	$("#nr_abschluss_btn").click(clickNewRecipeHeader);
	
	$("#nr_abschluss_btn").addClass("on");
	$("#new_recipe_step4").show();
	if($("#progress_4").length == 0){
		$("#progress_3").after("<div id='progress_4'></div>");
		$("#progress_4").animate({"height": 90}, {duration:1000,complete:function(){
			$("#progress_4").append("<div class='nr_devider'></div><div id='nr_statustags'>Mit <span id='nr_tagnumber'>00</span> Tags lässt sich<br /> dein Rezept besser finden.</div>");
			$("#progress_4 > *").animate({"opacity": .0}, 0);
			$("#progress_4 > *").animate({"opacity": 1.0}, {duration: 500});
			}});
	}
}