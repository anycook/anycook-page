function updateLiveAtHome(){
	var path = $.address.path();
	if(path == "/"){
		$.ajax({
			url:"/anycook/GetLastLifes",
			dataType:"json",
			data:"id="+newestid,
			success:function(response){
				parseAndAddLiveAtHome(response);
			}
		});
		window.setTimeout(updateLiveAtHome, 5000);
	}
}

function parseAndAddLiveAtHome(json){
	if(json.length>0)
	{
		var empty = false;
		if($("#news_inhalt").children().length == 0)
			empty = true;
		
		for(var i =json.length-1; i>=0; --i){
			var text = json[i]["syntax"];
			var regex = /#[ug]/;
			var pos = text.search(regex);
			
			while(pos>=0){
				if(text[pos+1]=="u"){
					var array = text.split("#u");
					text = "";
					for(var j = 0; j<array.length-1;++j){
						var uri = User.getProfileURI(json[i].user);
						var link = "<a href=\""+uri+"\">"+json[i].user+"</a>";
						text+=array[j]+link;
					}
					text+=array[array.length-1];
				}
				else if(text[pos+1]=="g"){
					var array = text.split("#g");
					text = "";
					for(var j = 0; j<array.length-1;++j){
						var uri = encodeURI("/#!/recipe/"+json[i].gericht);
						var link = "<a href=\""+uri+"\">"+json[i].gericht+"</a>";
						text+=array[j]+link;
					}
					text+=array[array.length-1];
				}
					
				pos = text.search(regex);
			}
			
			if($("#news_inhalt").children().length>=6)
				$("#news_inhalt").children().last().remove();
			
			$("#news_inhalt").prepend("<div>"+text+"</div>");
			if(!empty){
				var oldMarginTop = $('#news_inhalt div:first').css('margin-top');
				var newMarginTop = 0 - $('#news_inhalt div:first').outerHeight();
				$('#news_inhalt div:first').css({'margin-top': newMarginTop, 'opacity': 0});
				$('#news_inhalt div:first').animate({marginTop: oldMarginTop, opacity: 1});
			}
		}
		newestid = Number(json[0]["id"]);
	}
}

function schmecktmir(){
		var gericht = $.address.pathNames()[1];
		$.ajax({
			url:"/anycook/Schmeckt",
			data:"g="+gericht,
			success:function(response){
				if(response != "false"){
					$("#rezept_schmeckt").unbind("click", schmecktmir);
					$("#rezept_schmeckt").text("Das schmeckt mir nicht mehr!");
					$("#rezept_schmeckt").click(schmecktmirnicht);
				}				
			}
		});
}

function schmecktmirnicht(){
	var gericht = $.address.pathNames()[1];
	$.ajax({
		url:"/anycook/Schmeckt",
		data:"g="+gericht+"&schmecktnicht",
		success:function(response){
			if(response != "false"){
				$("#rezept_schmeckt").unbind("click", schmecktmirnicht);
				$("#rezept_schmeckt").text("Das schmeckt mir!");
				$("#rezept_schmeckt").click(schmecktmir);
			}				
		}
	});
}

var newestid;