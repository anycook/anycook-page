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

;(function ( $, window, document, undefined ){
	$.fn.recipeoverview = function(headline, recipes){
		var dfd = $.Deferred();
      	var $this = $(this);

      	var $h2 = $("<h2></h2>").text(headline);
      	var $p = $("<p></p>");

      	for(var i in recipes){
      		var recipe = recipes[i];
      		var img = AnycookAPI.recipe.image(recipe);

      		var $img = $("<img src=\""+img+"\"/>");

      		var href = '#/recipe/'+recipe;
      		var $a = $("<a></a>").attr("href", href)
      			.append($img).append("<div><span>"+recipe+"</span></div>");

      		$p.append($a);
      	}

      	var $show_more = $("<div></div>").addClass("button show_more").text("mehr anzeigen")
                  .click($.recipeoverview.showMore);

      	$this.addClass("recipeoverview").append($h2).append($p)

            if(recipes.length > 10)
                  $this.append($show_more);
            else if(recipes.length <=5)
                  $p.height(120);

      	return $this;
	}

      $.recipeoverview = {
            showMore : function(event){
                  var newheight;
                  var p = $(this).siblings("p").first();
                  if($(this).text() == "mehr anzeigen"){
                        var numelements = p.children().length;    
                        
                        var rest = numelements % 5;
                        newheight = ((numelements-rest)/5)*120;
                        if(rest>0) newheight+=120;
                        
                        $(this).text("weniger anzeigen");
                        /*$(this).animate({height:0, opacity:0},{duration:1000, complete:function(){
                              $(this).remove();
                              }});*/
                  }else{
                        newheight = 240;
                        $(this).text("mehr anzeigen");
                  }
                  
                  p.animate({height:newheight}, 1000);
            }
      }
})( jQuery, window, document );