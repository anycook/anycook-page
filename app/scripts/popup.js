/**
 * @license This file is part of anycook. The new internet cookbook
 * Copyright (C) 2014 Jan Graßegger
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see [http://www.gnu.org/licenses/].
 * 
 * @author Jan Graßegger <jan@anycook.de>
 */
define([
	'jquery'
], function($){
	return {
		show : function(headline, content){
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
	};
});