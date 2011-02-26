function addEditingHandler(){
	$("#zutaten_table td").dblclick(zutatTableEditClick);
	$("#beschreibung").dblclick(beschreibungEditClick);
	$("#rezept_headline").dblclick(nameEditClick);
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

function editRecipe(data){
	$.ajax({
		url:"/anycook/EditRecipe",
		data:data,
		success:function(){
			 window.location.reload();
		}
	});
}