function getLightbox(headline, subhead, $content, inputvalue){
	var $h2 = $("<h2></h2>").html(headline);
	var $subhead = $("<p></p>").html(subhead);
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
	
	$lightbox.css({left:getLightBoxLeft()}).hide();
	return $lightbox;
}

function showLightbox($lightbox, top, callback){

	var callback = callback || function(){};
	
	$lightbox.show();
	resizeLightbox();
	
	
	$lightbox.css({top:top, left:getLightBoxLeft()})	
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
				}, {
					duration: 500,
					complete: function(){
						callback.call($lightbox);
					}
				});
			}
		});
		
	$("body").click(function(event){
		var $target = $(event.target);
		if($target.parents().andSelf().is(".lightbox")||
			$target.parents().andSelf().is(".lightbox-autocomplete"))
			return;
			
		hideLightbox($lightbox);
		
		$(this).unbind("click");
	});
}

function showLightboxfromBottom($lightbox, bottom){
	
	$lightbox.show();
	resizeLightbox();
	var top = bottom - $lightbox.outerHeight();
	$lightbox.css({top:top, left:getLightBoxLeft()})	
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
		var $target = $(event.target);
		if($target.parents().andSelf().is(".lightbox")||
			$target.parents().andSelf().is(".lightbox-autocomplete"))
			return;
			
		hideLightbox($lightbox);
		
		$(this).unbind("click");
	});
}

function hideLightbox(){
	$(".lightbox").fadeOut(200, function(){
			$(this).css({left:getLightBoxLeft()}).remove();
	});
}

function resizeLightbox(){
	var $lightbox = $(".lightbox");
	var $contentBox = $lightbox.children(".contentbox");
	var contentHeight = $contentBox.outerHeight();
	$lightbox.height(contentHeight + $contentBox.position().top);
}

function getLightBoxLeft(){
	var $container = $("#container");
	var $lightbox = $(".lightbox");
	var containerposition = $container.offset();
	// var left = containerposition.left + $container.innerWidth() + 9 - $lightbox.innerWidth();
	var left = containerposition.left + $container.innerWidth() + 9 - $lightbox.innerWidth();
	return left;
}



