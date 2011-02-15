function loadRezTable(){
	$(".activate").die("click", clickActivate);
	$(".deactivate").die("click", clickDeactivate);
	$("#new_index").unbind("click", makeNewIndex);
	
	$("#rezeptelist").empty();
	$("#info table").empty();
	$.ajax({
		url:"/anycook/GetRezeptValues",
		dataType: "json",
		async:false,
		success:function(json){
			var rezeptcounter = 0;
			var inactivecounter = 0;
			
				for(var i in json){
					rezeptcounter++;
					var htmlstring = "<li>";
					
					
					htmlstring += "<div class=\"rezept_name";
					if(json[i].active_id == "-1"){
						inactivecounter++;
						htmlstring += " inactive";
					}
					
					var eingefuegt = parseDate(json[i].eingefuegt.split(" ")[0]);
					
					htmlstring += "\">"+json[i].name+"</div>";
					
					if(Number(json[i].admin_viewed) == 0)
						htmlstring += "<div class=\"new\">*Neu*</div>";
					
					htmlstring += "<div class=\"rezept_date\">"+eingefuegt+"</div>" +
							"<div class=\"rezept_viewed\">"+json[i].viewed+" views</div><div class=\"rezept_schmeckt\">"+json[i].schmeckt+" schmeckt</div><div class=\"rezept_delete\">löschen</div></li>";
					$("#rezeptelist").append(htmlstring);					
				}
				$("#info table").append("<tr><td>Rezepte gesamt:</td><td>"+rezeptcounter+"</td></tr>");
				$("#info table").append("<tr><td>Inaktive Rezepte:</td><td>"+inactivecounter+"</td></tr>");	
			}
		});
	$("#rezeptelist .rezept_name").click(clickRezept);
	$(".activate").live("click", clickActivate);
	$(".deactivate").live("click", clickDeactivate);
	$(".rezept_delete").click(clickDeleteRecipe);
	
	$("#new_index").click(makeNewIndex);
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

function clickDeleteRecipe(event){
	var target = $(event.target);
	var name = $(target.prevAll(".rezept_name")[0]).text();
	
	$("#selected_recipe").text(name);
	if($("#confirm").css("display")=="none"){		
		var confirmheight = $("#confirm").css("height");
		confirmheight = Number(confirmheight.substring(0, confirmheight.length-2))+30+30;
		$("#info h3").animate({"marginTop": confirmheight},{duration:500, complete:function(){
			$("#info h3").css("marginTop", 30);
			$("#confirm").fadeIn(500);
		}});
		$("#confirm_yes, #confirm_no").click(rezeptConfirmedClick);
	}
}

function rezeptConfirmedClick(event){
	var target = $(event.target);
	if(target.attr("id")== "confirm_yes"){
		var recipe = $("#selected_recipe").text();
		$.ajax({
			url:"/anycook/EditRecipe",
			data:"todo=delete&recipe="+recipe
		});
		loadRezTable();
	}
	
	var confirmheight = $("#confirm").css("height");
	confirmheight = Number(confirmheight.substring(0, confirmheight.length-2))+30;
	$("#confirm").fadeOut(500, function(){
		$("#info h3").css("marginTop", confirmheight+30);
		$("#info h3").animate({"marginTop": 30},{duration:500});
	});
	$("#confirm_yes, #confirm_no").unbind("click", rezeptConfirmedClick);
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
	var id = $(target.prevAll(".version_id")[0]).text();
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

function makeNewIndex(){
	$.ajax({
		url:"/anycook/MakeNewIndex",
		data:"index=fulltextindex"
	});
}