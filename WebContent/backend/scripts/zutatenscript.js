function loadZutaten(json){
	$("#zutatenlist").empty();
	$(".setparent").die("click", setParent);
	$("#new_zutat").unbind("submit", newZutat);
	$("#confirm_form").unbind("submit", parentConfirmed);
	
	for(var i in json){
		var stem = json[i].stem;
		if(stem == null)
			stem="";
		
		var childs = Number(json[i].childs);
		
		var htmlstring = "<li>";
		
		if(childs>0)
			htmlstring+="<div class=\"zutatenopen\"></div>";
		
		htmlstring += "<div class=\"zutatenname\">"+json[i].name+"</div><div class=\"zutatenstem\">Stem: "+stem+"</div><div class=\"zutatengerichte\">Gerichte: "+
		json[i].gerichte+"</div><div class=\"children\">Childs: "+json[i].childs+"</div><div class=\"setparent\">set parent</div></li>";
		$("#zutatenlist").append(htmlstring);
	}
	
	$(".setparent").live("click", setParent);
	$("#new_zutat").submit(newZutat);
	$("#confirm_form").submit(parentConfirmed);
}

function setParent(event){	
	var target = $(event.target);
	var zutat = target.siblings(".zutatenname").first().text();
	$("#selected_zutat").text(zutat);
	
	if($("#confirm").css("display")=="none"){
		var confirmheight = $("#confirm").css("height");
		confirmheight = Number(confirmheight.substring(0, confirmheight.length-2))+30+30;
		$("#info h3").first().animate({"marginTop": confirmheight},{duration:500, complete:function(){
			$("#info h3").first().css("marginTop", 30);
			$("#confirm").fadeIn(500);
		}});
	}
	
}

function parentConfirmed(){
	var zutat = $("#selected_zutat").text();
	var parent = $("#confirm_input").val();
	$.ajax({
		url:"/anycook/EditZutaten",
		data:"todo=setparent&zutat="+zutat+"&parent="+parent,
		success:function(){
			$.ajax({
				url:"/anycook/GetZutaten",
				dataType:"json",
				success:loadZutaten
			});
		}
	});
	
	var confirmheight = $("#confirm").css("height");
	confirmheight = Number(confirmheight.substring(0, confirmheight.length-2))+30;
	$("#confirm").fadeOut(500, function(){
		$("#info h3").first().css("marginTop", confirmheight+30);
		$("#info h3").first().animate({"marginTop": 30},{duration:500});
	});
	
	return false;
}

function newZutat(event){
	var zutat = $("#new_zutat_name").val();
	$.ajax({
		url:"/anycook/EditZutaten",
		data:"todo=new&zutat="+zutat,
		success:function(){
			$.ajax({
				url:"/anycook/GetZutaten",
				dataType:"json",
				success:loadZutaten
			});
		}
	});
	return false;
}