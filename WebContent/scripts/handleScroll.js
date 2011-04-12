function scrollListener(){
	var filterheight = $("#filter_box").css("height");
	filterheight = Number(filterheight.substr(0, filterheight.length-2))+50;
	var scrollTop = $(document).scrollTop();
	if(scrollTop > filterheight && $("#backtothetop").length == 0){
		$("body").append("<div id='backtothetop'></div>");
		var containerleft = $("#container").offset().left;
		$("#backtothetop").css("left", containerleft+20).fadeIn(500).click(backtothetop);
	}
	else if(scrollTop < filterheight && $("#backtothetop").length > 0){
		$("#backtothetop").fadeOut(700,function(){$("#backtothetop").remove();});
	}
}

function backtothetop(){
	$("html, body").animate({scrollTop:0}, {duration:1000, easing:"easeInOutQuart"});
}