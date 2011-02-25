function addEditingHandler(){
	$("#zutaten_table td").dblclick(zutatTableEditClick);
	$("#beschreibung").dblclick(beschreibungEditClick);
}


//beschreibung
function beschreibungEditClick(event){
	var target = $(event.target);
	var beschreibung = target.text();
	var htmlstring = "<form id=\"beschreibung_edit_form\"><textarea>"+beschreibung+"</textarea><input type=\"hidden\" value=\""+beschreibung+"\"/>" +
			"<input type=\"submit\" value=\"speichern\"/>" +
			"</form>";
	target.html(htmlstring);
	
	target.find("textarea").focus();
	//target.find("textarea").focusout(beschreibungEditFocusout);
}

function beschreibungEditFocusout(event){
	var target = $(event.target);
	var beschreibung = target.siblings("input").first().val();
	var div = $("#beschreibung");
	div.text(beschreibung);
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
	$.ajax({
		url:"/anycook/EditRecipe",
		data:"todo=changezutat&recipe="+recipe+"&version="+version+"&oldzutat="+oldZutat+"&newzutat="+newZutat,
		success:function(){
			 window.location.reload();
		}
	});
}

function editMenge(zutat, newMenge){
	var pathNames = $.address.pathNames();
	var recipe = pathNames[1];
	var version = pathNames[2];
	$.ajax({
		url:"/anycook/EditRecipe",
		data:"todo=changemenge&recipe="+recipe+"&version="+version+"&zutat="+zutat+"&menge="+newMenge,
		success:function(){
			 window.location.reload();
		}
	});
}