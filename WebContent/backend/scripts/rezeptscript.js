function loadRezTable(){
	$("#rezeptelist").empty();
	$.ajax({
		url:"/anycook/GetRezeptValues",
		dataType: "json",
		async:false,
		success:function(json){
				for(var i in json){
					var htmlstring = "<li><div class=\"rezept_name";
					if(json[i].active_id == "-1")
						htmlstring += " inactive";
					
					var eingefuegt = parseDate(json[i].eingefuegt.split(" ")[0]);
					
					htmlstring += "\">"+json[i].name+"</div><div class=\"rezept_date\">"+eingefuegt+"</div>" +
							"<div class=\"rezept_viewed\">"+json[i].viewed+" views</div><div class=\"rezept_schmeckt\">"+json[i].schmeckt+" schmeckt</div></li>";
					$("#rezeptelist").append(htmlstring);					
				}
			}
		});
	$("#rezeptelist .rezept_name").click(clickRezept);
	$(".activate").live("click", clickActivate);
	$(".deactivate").live("click", clickDeactivate);
}

function clickRezept(event){
	var target = $(event.target);
	var li = target.parent();
	var gericht = target.text();
	if(!li.hasClass("open")){
		li.addClass("open");
		$.ajax({
			url:"/anycook/GetRezeptValues",
			dataType: "json",
			data:"rezept="+gericht,
			async:false,
			success:function(json){
				var htmlstring = "<table class=\"versiontable\"><tr><th>ID</th><th>User</th><th>eingefügt</th><th>Zutaten</th><th>Schritte</th><th></th></tr>";
				for(var i in json){					
					var eingefuegt = parseDate(json[i].eingefuegt.split(" ")[0]);
					
					if(json[i].active == "1")
						htmlstring += "<tr class=\"active\">";
					else
						htmlstring += "<tr>";
					htmlstring += "<td class=\"version_id\">"+json[i].id+"</td><td>"+json[i].email+"</td>" +
							"<td>"+eingefuegt+"</td><td>"+json[i].zutaten+"</td><td>"+json[i].schritte+"</td>";
					
					if(json[i].active == "0")
						htmlstring +="<td class=\"activate\">aktivieren</td>";
					else
						htmlstring +="<td class=\"deactivate\">deaktivieren</td>";
					
					htmlstring += "</tr>";
					
				}
				htmlstring += "</table>";
				li.append(htmlstring);
				
			}				
		});
	}else{
		li.removeClass("open");
		li.children(".versiontable").remove();
	}
}

function updateActionBtnState(){
	if(!$("#rezeptTable").children(".rez_selected").hasClass("rez_selected")){
		$("#edit_btn, #activate_btn, #delete_btn").removeClass("action_possible");
		}
	if($("#rezeptTable").children(".rez_selected").hasClass("rez_selected")){
		$("#edit_btn, #activate_btn, #delete_btn").addClass("action_possible");
		$("#activate_btn").click(activateRez);
	}
}


function clickActivate(event){
	var target = $(event.target);
	var gericht = $(target.closest("li").children(".rezept_name")[0]).text();
	var id = target.prevAll(".version_id");
	activateVersion(gericht, id);
}

function clickDeactivate(event){
	var target = $(event.target);
	var gericht = $(target.closest("li").children(".rezept_name")[0]).text();
	activateVersion(gericht, -1);
}
function activateVersion(gericht, id){
	$.ajax({
		url:"/anycook/EditVersion",
		data: "todo=activate&gericht="+gericht+"&id="+id,
		success:function(){
			loadRezTable();
		}
	});
}