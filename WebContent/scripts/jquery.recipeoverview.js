;(function ( $, window, document, undefined ){
	$.fn.recipeoverview = function(headline, recipes){
		var dfd = $.Deferred();
      	var $this = $(this);

      	var $h2 = $("<h2></h2>").text(headline);
      	var $p = $("<p></p>");

      	for(var i in recipes){
      		var recipe = recipes[i];
      		var img = $.anycook.graph.recipe.image(recipe);

      		var $img = $("<img src=\""+img+"\"/>");

      		var href = Recipe.getURI(recipe);
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