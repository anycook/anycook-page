function loadZutaten(json){
	$("#zutatenlist").empty();
	$(".setparent").die("click", setParent);
	$(".zutatenopen").die("click", openZutat);
	$("#new_zutat").unbind("submit", newZutat);
	$("#confirm_form").unbind("submit", parentConfirmed);
	$("#new_index").unbind("click", newZutatenIndex);
	
	for(var i in json){
		var stem = json[i].stem;
		if(stem == null)
			stem="";
		
		var childs = Number(json[i].childs);
		
		var htmlstring = "<li>";
		
		if(childs>0)
			htmlstring+="<div class=\"zutatenopen\"></div>";
		
		htmlstring += "<div class=\"zutatenname\">"+json[i].name+"</div>" +
				//"<div class=\"zutatenstem\">Stem: "+stem+"</div>" +
						"<div class=\"zutatengerichte\">Gerichte: "+
		json[i].gerichte+"</div><div class=\"children\">Childs: "+json[i].childs+"</div><div class=\"setparent\">set parent</div><ul></ul></li>";
		$("#zutatenlist").append(htmlstring);
	}
	
	$(".setparent").live("click", setParent);
	$(".zutatenopen").live("click", openZutat);
	$(".zutatenname").live("dblclick", clickRenameZutat);
	$("#new_zutat").submit(newZutat);
	$("#confirm_form").submit(parentConfirmed);
	$("#new_index").click(newZutatenIndex);
	$("#reset_zutaten").click(resetZutaten);
}

function loadChilds(json, ul){
	for(var i in json){
		var stem = json[i].stem;
		if(stem == null)
			stem="";
		
		var childs = Number(json[i].childs);
		
		var htmlstring = "<li>";
		
		if(childs>0)
			htmlstring+="<div class=\"zutatenopen\"></div>";
		
		htmlstring += "<div class=\"zutatenname\">"+json[i].name+"</div><div class=\"zutatenstem\">Stem: "+stem+"</div><div class=\"zutatengerichte\">Gerichte: "+
		json[i].gerichte+"</div><div class=\"children\">Childs: "+json[i].childs+"</div><div class=\"setparent\">set parent</div><ul></ul></li>";
		ul.append(htmlstring);
	}
}

function clickRenameZutat(event){
	var zutatennamediv = $(event.target);
	var zutatenname = $(zutatennamediv).text();
	$(zutatennamediv).html("<form id=\"newzutat_form\"><input type=\"text\" id=\"new_zutatname\" /><input type=\"hidden\" id=\"old_zutatname\" value=\""+zutatenname+"\" /></form>");
	
	
	$("#new_zutatname").focus();
	$("#new_zutatname").focusout(focusOutNewZutat);
	$("#newzutat_form").submit(sendRenameZutat);
	
}

function focusOutNewZutat(event){
	var target = $(event.target);
	target.parents(".zutatenname").text($("#old_zutatname").val());
}

function sendRenameZutat(event){
	var target = $(event.target);
	var oldName = $("#old_zutatname").val();
	var newName = $("#new_zutatname").val();
	renameZutat(oldName, newName);
	return false;
}

function renameZutat(oldName, newName){
	$.ajax({
		url:"/anycook/EditZutaten",
		data:"todo=rename&zutat="+oldName+"&newname="+newName,
		success:function(){
			$.ajax({
				url:"/anycook/GetZutaten",
				dataType:"json",
				success:loadZutaten
			});
		}
	});
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

function openZutat(event){
	var target = $(event.target);
	var zutat = target.siblings(".zutatenname").first().text();
	var ul = target.siblings("ul").first();
	if(ul.children().length>0)
		ul.empty();
	else{
		$.ajax({
			url:"/anycook/GetZutaten",
			data:"parent="+zutat,
			dataType:"json",
			success:function(json){
				loadChilds(json, ul);
			}
		});
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

function newZutatenIndex(){
	$.ajax({
		url:"/anycook/MakeNewIndex",
		data:"index=zutatenindex"
	});
}

function resetZutaten(){
	$.ajax({
		url:"/anycook/EditZutaten",
		data:"todo=reset"
	});
}