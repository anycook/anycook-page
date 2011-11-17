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
	
	
	var $lightbox = getLightbox("Neue Nachricht", 
		"Schreibe einem oder mehreren Usern eine Nachricht", getNewMessageContent(), "abschicken");
	
	$("#newMessageBtn").click(function(){
		var top = $(this).offset().top-113;
		showLightbox($lightbox, top);
		return false;
	});
	
	$lightbox.find(".recipients").click(clickRecipients);
	
	
	
}

function clickRecipients(){
	var $this = $(this);
	
	var ids = $(this).data("ids");
	if(ids === undefined)
		ids = [];
	
	var $input = $this.children("input");
	if($input.length == 1)
		$input.focus();
	else{
		$this.append("<input type=\"text\"/>")
			.children("input").focus()
			.autocomplete({
			source:function(req,resp){
	    		var array = [];
	    		var term = req.term;
				$.ajax({
					url:"/anycook/AutocompleteUsers",
					dataType:"json",
					async:false,
					data:"q="+term,
					success:function(json){
						for(var i in json){
							if($.inArray(json[i].id, ids) == -1)
								array[array.length] = {label: json[i].name, value: json[i].name, data: json[i].id};	
						}
					}
				});
				resp(array);},
	    		minLength:1,   
				select:function(event, ui){
					var id = ui.item.data;
					var name = ui.item.value;
					addRecipient(name, id);
					
					return false;
				}		
			});
			
	}
	
}

function addRecipient(name, id){
	var $recipients = $(".recipients");	
	$recipients.children("input").remove();
	var ids = $(".recipients").data("ids");
	if(ids === undefined)
		ids = [];
		
	if($.inArray(id, ids) > -1)
		return;
	
	var $name = $("<div></div>").addClass("name").text(name);
	
	var $recipient = $("<div></div>").addClass("recipient")
		.append($name)
		.append("<div class=\"close\">x</div>")
		.data("id", id);
	ids[ids.length] = id;
	
	$(".recipients").append($recipient).data("ids", ids);
	
}

function getNews(news){
	var $li = $("<li></li>");
	if(news.type=="life"){
		return parseLife(news);
	}
}

function getNewMessageContent(){
	
	var $image = $("<div></div>").addClass("imageborder")
		.append("<img title=\"Das bist du!\" src=\""+user.getUserImagePath()+"\"/>");
		
	var $right = $("<div></div>").addClass("right")
		.append("<p>Empfänger:</p>")
		.append("<div class=\"recipients\"/>")
		.append("<p>Nachricht:</p>")
		.append("<textarea></textarea>");
	var $container = $("<div></div>").addClass("new_message")
		.append($image)
		.append($right);
		
	return $container;
		
}
