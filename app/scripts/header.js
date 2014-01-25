define(['jquery'], function($){
	return {
		buildLink : function(value, href, id){
			var $a = $("<a></a>").addClass("header_link").attr("href", href).attr("id", id)
				.append("<div class=\"background\"></div>").append("<div class=\"button\"></div>");
			$a.children(".button").text(value);
			return $a;
		}
	}
})