function loadZutaten(json){
	for(var i in json){
		var stem = json[i].stem;
		if(stem == null)
			stem="";
		
		var childs = Number(json[i].childs);
		
		var htmlstring = "<li>";
		
		if(childs>0)
			htmlstring+="<div class=\"zutatenopen\"></div>";
		
		htmlstring += "<div class=\"zutatenname\">"+json[i].name+"</div><div class=\"zutatenstem\">Stem: "+stem+"</div><div class=\"zutatengerichte\">Count: "+
		json[i].gerichte+"</div><div class=\"setparent\">set parent</div></li>";
		$("#zutatenlist").append(htmlstring);
	}
	
	$(".setparent").live("click", setParent);
}

function setParent(event){
	var target = $(event.target);
	var zutat = target.siblings(".zutatenname").first().text();
	$("#selected_zutat").text(zutat);
	
	if($("#confirm").css("display")=="none"){
		var confirmheight = $("#confirm").css("height");
		confirmheight = Number(confirmheight.substring(0, confirmheight.length-2))+30+30;
		$("#info h3").animate({"marginTop": confirmheight},{duration:500, complete:function(){
			$("#info h3").css("marginTop", 30);
			$("#confirm").fadeIn(500);
		}});
	}
	
}