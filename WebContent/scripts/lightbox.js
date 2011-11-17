function getLightbox(headline, subhead, $content, inputvalue){
	var $h2 = $("<h2></h2>").text(headline);
	var $subhead = $("<p></p>").text(subhead);
	var $lightboxcontent = $("<div></div>").addClass("ligthbox_content")
		.append($content);
		
	var $submit = $("<input type=\"submit\"/>").val(inputvalue);
	
	var $form = $("<form></form>")
		.append($lightboxcontent)
		.append($submit);
	
	var $contentbox = $("<div></div>").addClass("contentbox")
		.append($h2)
		.append($subhead)
		.append($form);
		
	var $dogear = $("<div></div>").addClass("dogear")
		.append("<div class=\"top\"></div>")
		.append("<div class=\"middle\"></div>")
		.append("<div class=\"bottom\"></div>");
	var $lightbox = $("<div></div>").addClass("lightbox")
		.append($dogear)
		.append("<div class=\"mask\"></div>")
		.append($contentbox);
	
	
	
	
	
	$("#main").append($lightbox);
	
	var $container = $("#container");
	var containerposition = $container.offset();
	var left = containerposition.left + $container.innerWidth() + 9 - $lightbox.innerWidth();
	$lightbox.data("left", left).css({left:left}).hide();
	return $lightbox;
}

function showLightbox($lightbox, top){
	
	var left = $lightbox.show();
	$lightbox.css({top:top})	
		.find(".dogear").animate({
			right:0,
			top:0
		},
		{
			duration:150,
			easing: "swing",
			complete:function(){
				$(".contentbox").animate({
					left: 3
				}, {duration: 500});
			}
		});
		
	$("body").click(function(event){
		
		if($(event.target).parents().andSelf().is(".lightbox"))
			return;
			
		hideLightbox($lightbox);
		
		$(this).unbind("click");
	});
}

function hideLightbox($lightbox){
	$lightbox.fadeOut(200, function(){
			$(this).css({left:$lightbox.data("left")});
			
	});
}


