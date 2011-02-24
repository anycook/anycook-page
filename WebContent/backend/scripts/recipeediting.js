function addEditingHandler(){
	$("#zutaten_table tr").dblclick(zutatTableEditClick);
}

function zutatTableEditClick(event){
	var target = $(event.target);
	var zutat = target.children(".zutaten_table_left").first().text();
	var menge = target.children(".zutaten_table_right").first().text();
	target.empty();
	var htmlstring = "<form id=\"zutaten_table_edit_form\"><td class=\"zutaten_table_left\">" +
	"<input type=\"text\" value=\""+zutat+"\"/></td>" +
			"<td class=\"zutaten_table_right\"><input type=\"text\" value=\""+menge+"\"/></td></form>";
	target.append(htmlstring);
}