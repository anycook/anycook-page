function loadRecipeEditing(){
	var $versioninfo = $("#version_info");
	$versioninfo.css({height : $versioninfo.height()});
	var $headline = $("#version_info .headline");
	var oldHeight = $headline.height();
	$("#version_info .right, #schmecktmir, #recipe_options").fadeOut(200);
	
	$headline.animate({opacity: 0},{duration: 200, complete: function(){
		
		$versioninfo.removeClass("active").find(".left").width(543);
		var newHeight = $headline.html("Danke, dass du dieses Rezept verbessern möchtest.<br/>"+
			"Klicke auf die Bereiche, die du bearbeiten willst. Anschließend musste noch auf nen Button drücken.").height();
		$headline.css({height: oldHeight});
		$versioninfo.css({height:"auto"});
		$headline.animate({height: newHeight}, {duration: 200, complete: function(){
			$headline.animate({opacity:1}, {duration: 150});
		}});
	}});
	
	
	$("#recipe_container").addClass("edit");
	addEditingHandler();
	
}

function addEditingHandler(){
	
	var $recipeImageContainer = $("#recipe_image_container");
	var $layer = $("<div></div>").addClass("image_layer");
	var $uploader = $("<div></div>").addClass("image_upload").append("<div><div id=\"cam\"></div><p>Bild hochladen:<p></div>").append("<div id=\"upload_button\" class=\"button\">durchsuchen<div>");
	
	$recipeImageContainer.append($layer).append($uploader).mouseover(setUploaderPosition);
	
	
	var uploader = new qq.FileUploader({
	    // pass the dom node (ex. $(selector)[0] for jQuery users)
	    element: document.getElementById('upload_button'),
	    // path to server-side upload script
	    action: '/anycook/UploadRecipeImage',
	    onComplete:saveRecipeImage
	});
	
	 //$("#recipe_image_container").mouseenter(showEditImage);
	 //$("#recipe_image_container").mouseleave(hideEditImage);
	
	//kategorien
	// blockFilter(false);
	// $("div.kategorie_filter").unbind("click", handleKategories);
	// $("div.kategorie_filter").click(handleEditKategories);
// 	
	// $("#zutaten_table td").dblclick(zutatTableEditClick);
	// $("#beschreibung").dblclick(beschreibungEditClick);
	// $("#rezept_headline").dblclick(nameEditClick);
	// $(".step").dblclick(schrittEditClick);
// 	
// 	
	// $("#zutaten_table tr").each(function(i){
		// $(this).append("<td class=\"edit_removeZutat\"><div></div></td>");
	// });	
	// $(".edit_removeZutat div").click(editRemoveZutatClick);	
	// $("#zutaten_table").css({width: function(index, value) {
        // return parseFloat(value) +15;
        // }
	// });
// 	
	// $("#zutaten_table").append("<tr><td id=\"edit_addZutatRow\"><div></div></td>");
	// $("#edit_addZutatRow").click(editaddZutatRow);
	// $("#newZutatForm").live("submit", submitNewZutat);
// 	
// 
	
	// var removezutathtml = "<div id=\"remove_zutat_request\"><p>\"<span></span>\"" +
	// " wirklich enfernen?</p>" +
	// "<div><div id=\"submit_remove_zutat\">submit</div>" +
	// "<div id=\"undo_remove_zutat\">undo</div></div>" +
	// "</div>";
	// $("#zutaten_table").after(removezutathtml);
	// $("#undo_remove_zutat").click(undoRemoveZutat);
	// $("#submit_remove_zutat").click(submitRemoveZutat);
	
	
}

function setUploaderPosition(){
	var $uploader = $(".image_upload");
	var uploaderHeight = $uploader.outerHeight();
    var containerHeight = $("#recipe_image_container").height();
    $uploader.css("marginTop", (containerHeight -uploaderHeight)/2);
}
//schritte
function schrittEditClick(event){
	var steptext = $(this).find(".step_text").first();
	var currentText = steptext.text();
	steptext.remove();
	$(this).children(".step_left").first().append("<form>" +
			"<textarea class=\"edit_step\"></textarea>" +
			"<input type=\"hidden\" class=\"old_step_text\"/>" +
			"<div class=\"step_buttons\">"+
			"<div class=\"step_submit\">submit</div>" +
			"<div class=\"step_undo\">undo</div>" +
			"</div>"+
			"</form>");
	$(this).find(".edit_step, .old_step_text").val(currentText);
	$(this).find(".edit_step").focus();
	$(this).find(".step_undo").click(undoStepEdit);	
	$(this).find(".step_submit").click(submitStepEdit);
}

function undoStepEdit(){
	var stepLeft = $(this).parents(".step_left").first();
	var oldText = stepLeft.find(".old_step_text").val();
	stepLeft.children("form").remove();
	stepLeft.append("<div class=\"step_text\">"+oldText+"</div>");
	var stepheight = stepLeft.css("height");
	var heighttext = stepLeft.children(".step_text").css("height");
	var newMargin = (parseInt(stepheight.substring(0, stepheight.length-2))-parseInt(heighttext.substring(0, heighttext.length-2)))/2;
	stepLeft.children(".step_text").css("margin-top", newMargin);
}

function submitStepEdit(){
	var stepLeft = $(this).parents(".step_left").first();
	var newText = stepLeft.find(".edit_step").val();
	var pathNames = $.address.pathNames();
	var recipe = pathNames[1];
	var version = pathNames[2];
	var schrittnr = 0;
	$(".step_left").each(function(i){
		if($(this).find(".edit_step").val()==newText)
			schrittnr = i+1;
	});
	
	editRecipe("todo=changeschritt&recipe="+recipe+"&version="+version+"&schrittnr="+schrittnr+"&newtext="+newText);
	
}

//rezept bild
function showEditImage(){
	var $layer = $("<div></div>").addClass("image_layer");
	var $uploader = $("<div></div>").addClass("image_upload").append("<h3></h3>").append("<div id=\"upload_button\">durchsuchen<div>");
	
	
	var recipeImageContainer = $("#recipe_image_container").append($layer).append($uploader);
	
	var uploader = new qq.FileUploader({
	    // pass the dom node (ex. $(selector)[0] for jQuery users)
	    element: document.getElementById('upload_button'),
	    // path to server-side upload script
	    action: '/anycook/UploadRecipeImage',
	    onComplete:saveRecipeImage
	});
	
	$(".image_layer, .image_upload").fadeIn(200);
}

function hideEditImage(){
	$(".image_layer, .image_upload").fadeOut(200, function(){
		$(this).remove();
	});
}

function saveRecipeImage(){
	var pathNames = $.address.pathNames();
	var recipe = pathNames[1];
	var version = pathNames[2];
	editRecipe("todo=saveimage&recipe="+recipe+"&version="+version);
}
//zutaten
function editaddZutatRow(event){
	var target = $(event.target);
	var tr = target.parents("tr").first();
	tr.before("<form id=\"newZutatForm\">" +
			"<input type=\"text\" class=\"newZutatName\" />" +
			"<input type=\"text\" class=\"newZutatMenge\" />" +
			"<input type=\"submit\" value=\"speichern\" />" +
			"</form>");
	
}

function submitNewZutat(event){
	var zutat = $(this).find(".newZutatName").val();
	var menge = $(this).find(".newZutatMenge").val();
	
	var pathNames = $.address.pathNames();
	var recipe = pathNames[1];
	var version = pathNames[2];
	if(zutat!="")
		editRecipe("todo=addzutat&recipe="+recipe+"&version="+version+"&zutat="+zutat+"&menge="+menge);
	
	return false;
}
function editRemoveZutatClick(event){
	var zutat = $(this).parent().siblings(".zutaten_table_left").first().text();
	
	$("#remove_zutat_request span").text(zutat);
	
	$("#remove_zutat_request").fadeIn(500);
}

function undoRemoveZutat(event){
	$("#remove_zutat_request").fadeOut(500);
}

function submitRemoveZutat(event){
	var pathNames = $.address.pathNames();
	var recipe = pathNames[1];
	var version = pathNames[2];
	var zutat = $("#remove_zutat_request span").text();
	editRecipe("todo=removezutat&recipe="+recipe+"&version="+version+"&zutat="+zutat);
}

//name
function nameEditClick(event){
	var target = $(event.target);
	var name = target.text();
	var htmlstring = "<form id=\"name_edit_form\"><input type=\"text\" value=\""+name+"\"/><input type=\"hidden\" id=\"old_name\" value=\""+name+"\"/></form>";
	target.html(htmlstring);
	
	$("#name_edit_form input").first().focusout(editNameFocusout).focus();
	$("#name_edit_form").submit(submitEditName);
}

function editNameFocusout(event){
	var name = $("#old_name").val();
	$("#rezept_headline").text(name);
}

function submitEditName(event){
	var pathNames = $.address.pathNames();
	var recipe = pathNames[1];
	var version = pathNames[2];
	var newName = $("#name_edit_form input").first().val();
	$.ajax({
		url:"/anycook/EditRecipe",
		data:"todo=changename&recipe="+recipe+"&version="+version+"&newname="+newName,
		success:function(){
			 window.location = "http://anycook.de/#/recipe/"+newName+"/0";
		}
	});
	return false;
}

//beschreibung
function beschreibungEditClick(event){
	var target = $(event.target);
	var beschreibung = target.text();
	var htmlstring = "<form id=\"beschreibung_edit_form\"><textarea>"+beschreibung+"</textarea><input type=\"hidden\" value=\""+beschreibung+"\"/>" +
			"<div id=\"submit_beschreibung_edit_form\">submit</div>" +
			"<div id=\"undo_beschreibung_edit_form\">undo</div>" +
			"<div id=\"beschreibung_edit_counter\">250</div>" +
			"</form>";
	target.html(htmlstring);
	$("#submit_beschreibung_edit_form").click(function(){$("#beschreibung_edit_form").submit();});
	$("#undo_beschreibung_edit_form").click(undoEditBeschreibung);
	$("#beschreibung_edit_form").submit(submitEditBeschreibung);
	
	target.find("textarea").focus();
}

function submitEditBeschreibung(event){
	var pathNames = $.address.pathNames();
	var recipe = pathNames[1];
	var version = pathNames[2];
	var newBeschreibung = $("#beschreibung_edit_form textarea").val();
	editRecipe("todo=changebeschreibung&recipe="+recipe+"&version="+version+"&beschreibung="+newBeschreibung);
	return false;
}

function undoEditBeschreibung(event){
	var oldBeschreibung = $("#beschreibung_edit_form").children("input").val();
	$("#beschreibung").text(oldBeschreibung);
}

//zutaten und menge

function zutatTableEditClick(event){
	var target = $(event.target);
	var value = target.text();
	var width = target.css("width");
	var htmlstring = "<form id=\"zutaten_table_edit_form\">" +
		"<input type=\"text\" value=\""+value+"\"/>" +
		"<input type=\"hidden\" id=\"edit_hidden\" value=\""+value+"\"/>" +
		"</form>";
	target.html(htmlstring);
	target.find("input").first().css("width", width).focus();
	
	target.focusout(zutatTableFocusout);
	$("#zutaten_table_edit_form").submit(submitEditZutaten);

}

function zutatTableFocusout(event){
	
	var target = $(event.target);
	var td = target.parents("td").first();
	var value = td.find("#edit_hidden").val();
	td.text(value);
}

function submitEditZutaten(event){
	var target = $(event.target);
	var td = target.parents("td").first();
	var value = target.children("input").first().val();
	if(td.hasClass("zutaten_table_right")){
		var zutat = td.siblings(".zutaten_table_left").text();
		editMenge(zutat, value);
	}else{
		var oldZutat = target.children("#edit_hidden").val();
		editZutat(oldZutat, value);
	}
	
	return false;
}

function editZutat(oldZutat, newZutat){
	var pathNames = $.address.pathNames();
	var recipe = pathNames[1];
	var version = pathNames[2];
	editRecipe("todo=changezutat&recipe="+recipe+"&version="+version+"&oldzutat="+oldZutat+"&newzutat="+newZutat);
}

function editMenge(zutat, newMenge){
	var pathNames = $.address.pathNames();
	var recipe = pathNames[1];
	var version = pathNames[2];
	editRecipe("todo=changemenge&recipe="+recipe+"&version="+version+"&zutat="+zutat+"&menge="+newMenge);
	
}

function changeKategorie(){
	var pathNames = $.address.pathNames();
	var recipe = pathNames[1];
	var version = pathNames[2];
	var kategorie = $(this).text();
	if(kategorie != "Keine Kategorie"){
		kategorie = encodeURIComponent(kategorie);
		editRecipe("todo=changekategorie&newkategorie="+kategorie+"&recipe="+recipe+"&version="+version);
	}
}

function editRecipe(data){
	$.ajax({
		url:"/anycook/EditRecipe",
		data:data,
		success:function(){
			 window.location.reload();
		}
	});
}

function handleEditKategories(obj){
	if(blocked==false){
		$("ul.kategorie_filter").toggle();
		$("div.kategorie_filter").toggleClass("on");
		if($("div.kategorie_filter").hasClass("on")){
			$("ul.kategorie_filter li").mouseenter(kategorieOver).mouseout(kategorieOut).click(changeKategorie);
	    	$(document).click(closeKategorien);
	    	
		}
		else{
			$("ul.kategorie_filter li").unbind("mouseenter", kategorieOver).unbind("mouseout", kategorieOut).unbind("click", changeKategorie);
	    	$(document).unbind("click", closeKategorien);
		}
		return false;
	}
}