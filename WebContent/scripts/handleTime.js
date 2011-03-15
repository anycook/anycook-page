function timeFormSubmit(event){
	var std = Number($("#time_std").val());
	var min = Number($("#time_min").val());
	if(std == 0 && min ==0)
		removefromSession("time");
	else 
		addtoSession("std="+std+"&min="+min);
	
	
	if($("#time_std").is(":focus")){
		$("#hidden_std").val(std);
		$("#time_min").focus();
	}
	else{
		$("#hidden_min").val(min);
		$("#time_min").blur();
	}
	return false;
}

function keyTime(event){
	var target = $(event.target);
	var std = $("#time_std").val();
	var min = $("#time_min").val();
	
	if(event.which != 13){
	
		if((target.attr("id")=="#time_std" && std.length==2) || target.attr("id")=="#time_min" && min.length==2)
			return false;
		if(!(event.which>=48 &&  event.which<=57) && !(event.which>=96 &&  event.which<=105) && event.which != 8 && event.which != 46)
			return false;
	
	}else{
		$("#time_form").submit();
		
	}
	
}

function focusinTime(event){
	var target = $(event.target);
	var value = target.val();
	target.val("");
	if(target.is("#time_std")){
		$("#hidden_std").val(value);
	}else
		$("#hidden_min").val(value);
	
		
}

function focusoutTime(event){
	var target =$(event.target);
	if(target.is("#time_std")){
		var value = $("#hidden_std").val();
		target.val(value);
	}else{
		var value = $("#hidden_min").val();
		target.val(value);
	}
	
}

function fillStd(std){
	if(std=="" || std =="0" || parseInt(std)>23)
		std = "00";
	else if(std.length==1)
		std="0"+std;
	
	$("#time_std").val(std);
}

function fillMin(min){
	if(min=="" || min =="0" || parseInt(min)>59)
		min = "00";
	else if(min.length==1)
		min="0"+min;
	
	$("#time_min").val(min);
}