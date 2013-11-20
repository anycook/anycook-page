function updateLiveAtHome(){
	var path = $.address.path();
	var newestid = getNewestNewsId();
	
	if(path == "/"){
		var data = {newestid:newestid};
		$.anycook.graph.life(data,function(response){
				parseAndAddLiveAtHome(response);
				window.setTimeout(updateLiveAtHome, 5000);
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
	var userid = -1;
	while(pos>=0){
		if(text[pos+1]=="u"){
			var array = text.split("#u");
			text = "";
			for(var j = 0; j<array.length-1;++j){
				var uri = User.getProfileURI(life.user.id);
				userid = life.user.id;
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

	var imagePath = User.getUserImagePath(userid, "small");
	
	var $li = $("<li></li>").append("<div class=\"left\"><img src=\""+imagePath+"\"></div><div class=\"right\"></div>").data("id", life.id);
	if(user.checkLogin() && user.isFollowing(userid))
		$li.addClass("following");
	
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
		var data = {oldestid:oldestid};
		$.anycook.graph.life(data,function(response){
				parseAndAddLiveAtHome(response);
				$this.scroll(newsScrollListener);
		});
	}
	return false;
}