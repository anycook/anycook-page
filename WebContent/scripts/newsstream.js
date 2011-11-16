function loadNewsstream(){
	$.ajax({
		url:"/anycook/GetNewsstream",
		dataType:"json",
		success:function(json){
			var $ul = $("#newsstream");
			for(var i = 0; i<json.length; i++){
				var $appendTo = $ul;
				var $li;
				
				switch(json[i].type){
				case "life":
					$li = parseLife(json[i]);
					
					if(i>0 && json[i-1].type == "life")
						$appendTo = $ul.find("ul").last();
					else{
						$temp = $("<li><div class=\"top\"></div><ul></ul></li>").addClass("news");
						$temp.find("ul").append($li);
						$li = $temp;
					}
				}
				$appendTo.append($li);
				
			}
		}
	});
}

function getNews(news){
	var $li = $("<li></li>");
	if(news.type=="life"){
		return parseLife(news);
	}
}
