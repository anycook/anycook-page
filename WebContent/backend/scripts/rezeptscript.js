function loadRezTable(){
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
					
					htmlstring += "<tr><td>"+json[i].id+"</td><td>"+json[i].email+"</td>" +
							"<td>"+eingefuegt+"</td><td>"+json[i].zutaten+"</td><td>"+json[i].schritte+"</td><td>details</td></tr>";
					
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

/*
function clickRez(event){
	var target = $(this);
	var name = target.children(".recipeName").text();
	if(!(target.children(".recipeName").hasClass("open"))){
		target.children(".recipeName").addClass("open");
		$.ajax({
			url:"/anycook/LoadRecipe",
			dataType: "json",
			data: "recipe="+name,
			async:false,
			success:function(json){
				var zutaten;
				for(var i in json.zutaten){
					zutaten += "<div>"+i+" "+json.zutaten[i]+"</div>";
				}
				target.append("<div class='rezept_zutaten'>"+zutaten+"</div>");
				var schritte;
				for(var i in json.schritte){
					schritte += "<div class='step'><div class='step_number'>"+i+"</div><div class='step_text'>"+json.schritte[i]+"</div></div>";
				}
				target.append("<div class='rezept_schritte'>"+schritte+"</div>");
				var appendtext = "<div class='rezept_bild'><img src='/gerichtebilder/small/"+json.imagename+"'/><div class='time_gericht'><div class='time_corner_left'></div><div class='time_gericht_mid'></div><div class='time_corner_right'></div></div></div><p></p>";
				target.append(appendtext);
				
			}
		});
	}
	else{
		target.children(".rezept_zutaten").remove();
		target.children(".rezept_schritte").remove();
		target.children(".rezept_bild").remove();
		target.children(".recipeName").removeClass("open");
	}
	
	return false;
}*/

function updateActionBtnState(){
	if(!$("#rezeptTable").children(".rez_selected").hasClass("rez_selected")){
		$("#edit_btn, #activate_btn, #delete_btn").removeClass("action_possible");
		}
	if($("#rezeptTable").children(".rez_selected").hasClass("rez_selected")){
		$("#edit_btn, #activate_btn, #delete_btn").addClass("action_possible");
		$("#activate_btn").click(activateRez);
	}
}

function activateRez(){
	alert($("rezeptTable").children(".rez_selected").children("h1").text());
	/*$.ajax({
		url:"/zombiecooking/Activate",
		data: "q="+json[i].name,
		dataType: "json",
		async:false,
		success:function(jtag){
			for(var j in jtag){
				tags += jtag[j] + " ";
			}
		}
	});*/
}