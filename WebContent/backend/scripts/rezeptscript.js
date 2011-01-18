function loadRezTable(){
	$.ajax({
		url:"/zombiecooking/GetRezeptValues",
		dataType: "json",
		async:false,
		success:function(json){
			
				for(var i in json){
					$("#rezeptTable").append("<div class='rezObject'><div class='recipeName'>" + json[i].name+"</div> " +
							json[i].version_nr + " " + json[i].username + " " + json[i].date + "</div>"); 
				}
				//$(".moreContent").hide();
				$(".rezObject").click(clickRez);
			}
		});
	$("#edit_btn, #activate_btn, #delete_btn").addClass("button");
}

function clickRez(event){
	var target = $(this);
	var name = target.children(".recipeName").text();
	if(!(target.children(".recipeName").hasClass("open"))){
		target.children(".recipeName").addClass("open");
		$.ajax({
			url:"/zombiecooking/LoadRecipe",
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
				var appendtext = "<div class='rezept_bild'><img src='/zombiecooking/gerichtebilder/small/"+json.imagename+"'/><div class='time_gericht'><div class='time_corner_left'></div><div class='time_gericht_mid'></div><div class='time_corner_right'></div></div></div><p></p>";
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