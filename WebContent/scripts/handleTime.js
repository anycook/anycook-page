function timeFormSubmit(event){
	var std = Number($("#time_std").val());
	var min = Number($("#time_min").val());
	
	if(std == 0 && min ==0)
		search.setTime(null);
	else
		search.setTime(fillStd(std)+":"+fillMin(min));
		
	search.flush();
	return false;
}

function keyTime(event){
	var target = $(event.target);
	var std = $("#time_std").val();
	var min = $("#time_min").val();
	
	if(event.which == 13){
		$("#time_form").submit();
		
	}else if(event.which == 38){
		timeUp(target);
		return false;
	}else if(event.which == 40){
		timeDown(target);
		return false;	
	}else{
		if((target.attr("id")=="#time_std" && std.length==2) || target.attr("id")=="#time_min" && min.length==2)
			return false;
		if(!(event.which>=48 &&  event.which<=57) && !(event.which>=96 &&  event.which<=105) && event.which != 8 && event.which != 46)
			return false;
	
	}
	
}

function timeUpDownListener(event){
	var $this = $(this);
	var $input = $this.siblings("input").first();
	if($this.hasClass("up"))
		timeUp($input);
	else
		timeDown($input);
}

function timeUp($input){
	var value = Number($input.val());
	if($input.attr("id") == "time_std"){
		value = (value +1)%100;
	}else{
		value = (value +5)%60;
	}
	$input.val(value);
	timeFormSubmit();
}

function timeDown($input){
	var value = Number($input.val());
	if($input.attr("id") == "time_std"){
		
		value = (100+(value -1))%100;
	}else{
		value = (60+(value - 5))%60;
	}
	$input.val(value);
	timeFormSubmit();
}

function fillStd(std){
	if(std==0 || std>99)
		std = 0;
	
	return std;
}

function fillMin(min){
	if(min==0 || min>59)
		min = 0;
	
	return min;
}