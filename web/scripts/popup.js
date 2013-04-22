(function($){
	var settings = {
		
	};
	
	if(!$.anycook)
		$.anycook = {};
		
	
	$.anycook.popup = function(headline, content){
		var $image = $("<img/>").attr("src", "/img/success_icon.png");
		var $h2 = $("<h1></h1>").text(headline);
		var $p = $("<p></p>").html(content);
		var $content = $("<div></div>").addClass("content")
			.append($h2)
			.append($p);
		var $div = $("<div></div>").addClass("fixedpopup")
			.append($image)
			.append($content);
			
		$("body").append($div);
	}
	
	
})(jQuery);
