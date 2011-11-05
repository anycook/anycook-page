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
	var $ul = $("#news ul");
	if(json.length>0)
	{
		var empty = false;
		if($ul.children().length == 0)
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
			
			if($ul.children().length>=10)
				$ul.children().last().remove();
			
			var $li = $("<li></li>").append("<div class=\"left\"></div><div class=\"right\"></div>");
			$li.children(".right").html(text);
			
			$ul.prepend($li);
			if(!empty){
				var oldMarginTop = $('#news_inhalt div:first').css('margin-top');
				var newMarginTop = 0 - $('#news_inhalt div:first').outerHeight();
				$ul.children().first.css({'margin-top': newMarginTop, 'opacity': 0})
					.animate({marginTop: oldMarginTop, opacity: 1});
			}
		}
		newestid = Number(json[0]["id"]);
		$ul.jScrollPane();
	}
}

function schmecktmir(){
		var gericht = $.address.pathNames()[1];
		$.ajax({
			url:"/anycook/Schmeckt",
			data:"g="+gericht,
			success:function(response){
				if(response != "false"){
					$("#schmecktmir").unbind("click", schmecktmir);
					$("#schmecktmir").addClass("on");
					$("#schmecktmir").click(schmecktmirnicht);
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
				$("#schmecktmir").unbind("click", schmecktmirnicht);
				$("#schmecktmir").removeClass("on");
				$("#schmecktmir").click(schmecktmir);
			}				
		}
	});
}

var newestid;