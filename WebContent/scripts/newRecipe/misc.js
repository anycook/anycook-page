
function getZutatenfromSchritte() {
	$.ajax({
		url:"/anycook/GetZutatenfromSchritte",
		dataType:"json",
		async:false,
		success:function(json)
		{
			for(var i in json)
				newrecipe.addZutat(json[i], "");
		}
	});
}

function clickNewRecipeHeader(event){
	var page = $.address.parameter("page");
	if(page ==null || page==undefined || page=="") finishStep1();
	else if(page=="schritte") finishStep2();
	else if(page=="zutaten") finishStep3();
	
	var target = $(event.target);
	if(!target.hasClass("inactive")){
		var id = target.attr("id");
		if(id.match("general")!=null){
			$.address.parameter("page", "");
		}
		else if(id.match("schritte")!=null){
			$.address.parameter("page", "schritte");
		}
		else if(id.match("zutaten")!=null){
			$.address.parameter("page", "zutaten");
		}
		else if(id.match("abschluss")!=null){
			$.address.parameter("page", "abschluss");
		}
	}
}

function nextStep(event){
	if($.address.parameterNames().length ==0){
		if(finishStep1()){
			$("#nr_schritte_btn").removeClass("inactive");
			$.address.parameter("page", "schritte");
		}
			
	}
	else{
		if($.address.parameter("page")=="schritte"){
			if(finishStep2()){
				$("#nr_zutaten_btn").removeClass("inactive");
				$.address.parameter("page", "zutaten");
			}				
		}
		else if($.address.parameter("page")=="zutaten"){
			if(finishStep3()){
				$("#nr_abschluss_btn").removeClass("inactive");
				$.address.parameter("page", "abschluss");
			}				
		}							
	}
}

