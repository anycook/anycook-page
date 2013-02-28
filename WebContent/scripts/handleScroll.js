function scrollListener(){
	var filterheight = $("#filter_box").css("height");
	filterheight = Number(filterheight.substr(0, filterheight.length-2))+50;
	var scrollTop = $(document).scrollTop();
	if(scrollTop > filterheight && $("#backtothetop").length == 0){
		$("<div id='backtothetop'><div></div><label>zurück nach oben</label></div>").appendTo("body").hide();;
		var containerleft = $("#container").offset().left;
		$("#backtothetop").css("left", containerleft+20).fadeIn(1000).click(backtothetop);
	}
	else if(scrollTop < filterheight && $("#backtothetop").length > 0){
		$("#backtothetop").fadeOut(700,function(){$("#backtothetop").remove();});
	}
	
}

function backtothetop(time, callback){
	if(time  === undefined) time = 1000;
 	if(!callback) callback = function(){};
	$("html, body").animate({scrollTop:0}, {duration:time, easing:"easeInOutQuart", complete: callback});
}