function updateLiveAtHome(){
	var path = $.address.path();
	var newestid = getNewestNewsId();
	
	if(path == "/"){
		$.ajax({
			url:"/anycook/GetLifes",
			dataType:"json",
			data:"newestid="+newestid,
			success:function(response){
				parseAndAddLiveAtHome(response);
				window.setTimeout(updateLiveAtHome, 5000);
			}
		});
	}
}

function getNewestNewsId(){
	var newestid = $("#news li").first().data("id");
	if(newestid == undefined) newestid = 0;
	return Number(newestid);
}

function parseAndAddLiveAtHome(json){
	var $ul = $("#news ul");
	if(json.length>0)
	{
		var newestid = getNewestNewsId();
		var $container = $ul.find(".jspPane");
		if($container.length == 0)
			$container = $ul;
		
		var empty = false;
		if($ul.children().length == 0)
			empty = true;
		
		for(var i in json){
			
			var $li = parseLife(json[i]);
			if(Number(json[i].id) > newestid)				
				$container.prepend($li);
			else
				$container.append($li);
				
			/*if(!empty){
				var oldMarginTop = $('#news_inhalt div:first').css('margin-top');
				var newMarginTop = 0 - $('#news_inhalt div:first').outerHeight();
				$ul.find("li").first().css({'margin-top': newMarginTop, 'opacity': 0})
					.animate({marginTop: oldMarginTop, opacity: 1});
			}*/
		}
		var active = $("#news .jspDrag").hasClass("jspActive");
		$ul.jScrollPane();
		if(active)
			$("#news .jspDrag").addClass("jspActive");
	}
}

function parseLife(life){
	var text = life.syntax;
	var regex = /#[ug]/;
	var pos = text.search(regex);
	
	while(pos>=0){
		if(text[pos+1]=="u"){
			var array = text.split("#u");
			text = "";
			for(var j = 0; j<array.length-1;++j){
				var uri = User.getProfileURI(life.user.id);
				var link = "<a href=\""+uri+"\">"+life.user.name+"</a>";
				text+=array[j]+link;
			}
			text+=array[array.length-1];
		}
		else if(text[pos+1]=="g"){
			var array = text.split("#g");
			text = "";
			for(var j = 0; j<array.length-1;++j){
				var uri = encodeURI("/#!/recipe/"+life.recipe);
				var link = "<a href=\""+uri+"\">"+life.recipe+"</a>";
				text+=array[j]+link;
			}
			text+=array[array.length-1];
		}
			
		pos = text.search(regex);
	}
	
	var $li = $("<li></li>").append("<div class=\"left\"></div><div class=\"right\"></div>").data("id", life.id);
	$li.children(".right").html(text);
	return $li;
}

function newsScrollListener(e){
	var $this = $(this);
	var $last = $this.find("li").last();
	var delta = $last.offset().top-($this.offset().top+ $this.height());
	if(delta < 40){
		$this.unbind("scroll", newsScrollListener);
		var oldestid = $last.data("id");
		$.ajax({
			url:"/anycook/GetLifes",
			dataType:"json",
			data:"oldestid="+oldestid,
			success:function(response){
				parseAndAddLiveAtHome(response);
				$this.scroll(newsScrollListener);
			}
		});
	}
	return false;
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