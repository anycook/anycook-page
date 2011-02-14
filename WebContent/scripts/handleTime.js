function handleTime(){
	var std = $("#time_std").val();
	var min = $("#time_min").val();
	if(std == "00" && min =="00")
		removefromSession("std&min");
	else 
		addtoSession("std="+std+"&min="+min);
	
	
}

function keyTime(event){
	var target = event.target;
	var std = $("#time_std").val();
	var min = $("#time_min").val();
	if(event.keyCode == 13){
		if($(target).attr("id")=="time_std"){
			fillStd(std);
			$("#time_min").focus();
		}
		else{
			fillMin(min);
			handleTime();
			//calls zutatenhandler to focus out
			zutatentableclick();
		}
		return false;
		
	}
	else{
		if(($(target).attr("id")=="#time_std" && std.length==2) || $(target).attr("id")=="#time_min" && min.length==2)
			return false;
		if(!(event.keyCode>=48 &&  event.keyCode<=57) && !(event.keyCode>=96 &&  event.keyCode<=105) && event.keyCode != 8 && event.keyCode != 46)
			return false;
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