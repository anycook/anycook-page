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
	var val = $(this).val();
	
	var $timeform = $("#time_form");
	if(event.which == 13){
		if($timeform.length > 0)$timeform.submit();
		
	}else if(event.which == 38){
		timeUp(target);
		return false;
	}else if(event.which == 40){
		timeDown(target);
		return false;	
	}else{
		if((target.hasClass("std") && val.length==2) || target.hasClass("min") && val.length==2)
			return false;
		if(!(event.which>=48 &&  event.which<=57) && !(event.which>=96 &&  event.which<=105) && event.which != 8 && event.which != 46)
			return false;
	
	}
	
}

function timeUpDownListener(event){
	var $this = $(this);
	var $input = $this.siblings("input").first();
	var submit = $this.parents("#time_form").length > 0;
	if($this.hasClass("up"))
		timeUp($input,submit);
	else
		timeDown($input,submit);
}

function timeUp($input, submit){
	var value = Number($input.val());
	if($input.hasClass("std")){
		value = (value +1)%100;
	}else{
		value = (value +5)%60;
	}
	$input.val(value);
	if(submit)timeFormSubmit();
}

function timeDown($input, submit){
	var value = Number($input.val());
	if($input.hasClass("std")){
		
		value = (100+(value -1))%100;
	}else{
		value = (60+(value - 5))%60;
	}
	$input.val(value);
	if(submit)timeFormSubmit();
}

function fillStd(std){
	std = Number(std);
	if(std==0 || std>99)
		std = 0;
	std = String(std);
	if(std.length == 1)
		std = "0"+std;
	return std;
}

function fillMin(min){
	min = Number(min);
	if(min==0 || min>59)
		min = 0;
	
	min = String(min);
	if(min.length == 1)
		min = "0"+min;	
	
	
	return min;
}