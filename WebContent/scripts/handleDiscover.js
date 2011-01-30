//<div class="frame_main_small"></div><div class="frame_right"></div>

var position = new Object();
var length = new Object();
function loadDiscover(){
	$("#neuste_container > *, #leckerste_container > *, #beliebte_container > *").remove();
	fillDiscover();
	$(".entdecken_back").click(function(event){
		var target = event.target;
		var type = $(target.parentNode).attr("id");
		zurueckDiscover(type);
		});
	$(".entdecken_next").click(function(event){
		var target = event.target;
		var type = $(target.parentNode).attr("id");
		weiterDiscover(type);
		});
	
}

function fillDiscover(){
		$.ajax({
			  url: "/anycook/GetDiscoverRecipes",
			  dataType: 'json',
			  success: function(json){
				  for(var type in json){
					  var typelength = 0;
					  for(var i in json[type]){
						  loadDiscoverRecipe(json[type][i], type);
						  typelength++;
					  }
					  $("#"+type+"_container > .frame_small").first().css("marginRight", "8px");
					  $("#"+type+" .entdecken_back").hide();
					  $("#"+type+" .entdecken_next").show();
					  position[type] = 0;
					  length[type] = typelength;
				  }
			  }
			});
	
		/*length[type] = json.length;
		for(var i=0; i<json.length;i++){
			$.ajax({
		  		  url: "/anycook/LoadRecipeforSmallView",
		  		  dataType: 'json',
		  		  data:"recipe="+json[i],
		  		  async:false,
		  		  success: function(response){loadDiscoverRecipe(response, type);}
				});
		}
		
		$("#"+type+"_container > .frame_small").first().css("marginRight", "8px");
		$("#"+type+" .entdecken_back").hide();
		$("#"+type+" .entdecken_next").show();*/
}

function loadDiscoverRecipe(response, type){
	// Methode lädt neue Elemente hinzu. Sind bereits welche vorhanden, werden sie erst einmal versteckt.
	//$("#"+type+"_container > .frame_main_small:first, #"+type+"_container > .frame_right:first").remove();	
	$("#"+type+"_container").append('<div class="frame_small"><a href="#/recipe/'+response.name+'" class="frame_main_small small_rezept">'+getSmallFrameText(response)+'</a><div class="frame_right"></div></div>');
	var lastcontainer = $("#"+type+"_container > .frame_small").last();	
	cutSmallFrameText(lastcontainer);

	if($("#"+type+"_container > .frame_small").length>2)
		$("#"+type+"_container > .frame_small").last().hide(); 
}

function weiterDiscover(type){
	animateNext(type);
}

function zurueckDiscover(type){
	animateBack(type);
}

function animateNext(type){
	$("#"+type+" .entdecken_back").show();
	var divs = $("#"+type+"_container > .frame_small");
	$(divs[position[type]]).hide();
	$(divs[position[type]+1]).hide();
	if(length[type]-position[type]>3)
		position[type]+=2;
	else
		position[type]+=1;
	$(divs[position[type]]).show().css("marginRight", "8px");
	$(divs[position[type]+1]).show().css("marginRight", 0);
	
	if(length[type]-position[type]<=2)
		$("#"+type+" .entdecken_next").hide();
}

function animateBack(type){
	$("#"+type+" .entdecken_next").show();
	var divs = $("#"+type+"_container > .frame_small");
	$(divs[position[type]]).hide();
	$(divs[position[type]+1]).hide();
	if(position[type]>1)
		position[type]-=2;
	else
		position[type]-=1;
	$(divs[position[type]]).show().css("marginRight", "8px");;
	$(divs[position[type]+1]).show().css("marginRight", "0");;
	
	if(position[type]==0)
		$("#"+type+" .entdecken_back").hide();
	
}