function loadNewsstream(){
	var $ul = $("#newsstream");
	
	var oldDatamap = $ul.data("map") || {};
	
	$.ajax({
		url:"/anycook/GetNewsstream",
		dataType:"json",
		success:function(json){
			var datamap = {};
						
			for(var i = 0; i<json.length; i++){
				var $appendTo = $ul;
				var $li;
				var oldData = oldDatamap[json[i].id];
				var data = json[i];
				
				switch(data.type){
				case "life":
					$li = parseLife(data);
					
					if(i>0 && json[i-1].type == "life")
						$appendTo = $ul.find("ul").last();
					else{
						$temp = $("<li><div class=\"top\"></div><ul></ul></li>").addClass("news");
						$temp.find("ul").append($li);
						$li = $temp;
					}
					$appendTo.append($li);
					break;
				case "messagesession":
					if(oldData){
						if(oldData.datetime != data.datetime){
							var $target = oldData.target;
							$target.find("p").text(data.text);
						}
					}else{					
						$li = $("<li></li>").append(getMessageContainer(data));
						$appendTo.append($li);
					}		
					break;
				
				}
				json[i].target = $li;				
				datamap[json[i].id] = json[i];
				//$li.data("data", json[i]);				
			}
			
			$ul.data("map", datamap);
		}
	});
	var $lightbox = getLightbox("Neue Nachricht", 
		"Schreibe einem oder mehreren Usern eine Nachricht", getNewMessageContent(), "abschicken");
	$lightbox.find("form").submit(submitNewMessage);
	
	$("#newMessageBtn").click(function(){
		var top = $(this).offset().top-113;
		showLightbox($lightbox, top);
		return false;
	});
	
	var $recipients = $lightbox.find(".recipients").click(clickRecipients);
	$recipients.data("height", 22);
	
	
	
}

var isCheckingMessageNum = false;

function checkNewMessageNum(lastnum){
	if(isCheckingMessageNum)
		return;
	
	isCheckingMessageNum = true;
	
	if(!lastnum)
		lastnum = 0;
	$.ajax({
		url:"/anycook/GetNotificationNumbers",
		data:{lastnum:lastnum},
		success:function(newNum){
			isCheckingMessageNum = false;
			if(newNum != "false" && user.checkLogin()){
				var $newMessageBubble = $("#message_btn_container .new_messages_bubble");
				newNum = Number(newNum);
				if(lastnum == 0 && newNum > 0)
					$newMessageBubble.fadeIn();
				else if(newNum == 0)
					$newMessageBubble.fadeOut();
				$newMessageBubble.children().text(newNum);
				setTimeout("checkNewMessageNum("+newNum+")", 1000);
			}
		},
		error: function(error){
			console.log("error loading messageNum. trying again in 10 sec");
			setTimeout("checkNewMessageNum(0)", 10000);
		}
	});
}

function clickRecipients(){
	var $this = $(this);
	
	var ids = getRecipientIds();
	if(ids.length == 7)
		return;
	
	var $input = $this.children("input");
	if($input.length == 1)
		$input.focus();
	else{
		$this.append("<input type=\"text\"/>")
			.children("input").focus().focusout(focusoutRecipientInput)
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
						var ids = getRecipientIds();
						for(var i = 0; i<json.length; i++){
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
			
			$(".ui-autocomplete").last().addClass("recipient-autocomplete")
			.addClass("lightbox-autocomplete");
			resizeMessageTextarea();
			
	}
	
}

function getRecipientIds(){
	var ids = $(".recipients").data("ids");
	if(ids === undefined)
		ids = [];
	return ids;
}

function addRecipient(name, id){
	var $recipients = $(".recipients");	
	var ids = $(".recipients").data("ids");
	if(ids === undefined)
		ids = [];
	
	var $input = $recipients.children("input");	
	if($.inArray(id, ids) > -1){
		$input.val("");
		return;
	}
	
	var $name = $("<div></div>").addClass("name").text(name);
	
	var $recipient = $("<div></div>").addClass("recipient")
		.append($name)
		.append("<div class=\"close\">x</div>")
		.data("id", id)
		.click(closeRecipient);
	ids[ids.length] = id;
	
	$recipients.data("ids", ids);
	
	
	$input.before($recipient).val("").focus();
	if($(".recipient").length == 7)
		$input.remove();
		
	
	resizeMessageTextarea();
	
}

function focusoutRecipientInput(event){
	var $this = $(this);
	
	if($this.val().length == 0){
		$this.parent().removeClass("focus");
		$this.remove();
		resizeMessageTextarea();
	}
}

function closeRecipient(){
	var $this = $(this);
	var id = $this.data("id");
	var ids = $(".recipients").data("ids");
	for(var i = 0; i<ids.length; i++){
		if(ids[i] == id){
			ids.splice(i, 1);
			break;
		}
	}
	$this.remove();
	resizeMessageTextarea();
	return false;
}

function resizeMessageTextarea(){
	var $recipients = $(".recipients");
	var oldHeightRecipients = $recipients.data("height");
	var heightRecipients = $recipients.height();
	var $textarea = $recipients.siblings("textarea").first();
	var heightTextarea = $textarea.height();
	var newTextareaHeight = heightTextarea-(heightRecipients-oldHeightRecipients);
	$textarea.height(newTextareaHeight);
	$recipients.data("height", heightRecipients);
}

function getNewMessageContent(){
	
	var $image = $("<div></div>").addClass("messageimageborder")
		.append("<img title=\"Das bist du!\" src=\""+user.getUserImagePath()+"\"/>");
		
	var $right = $("<div></div>").addClass("right")
		.append("<p>Empfänger:</p>")
		.append("<div class=\"recipients\"/>")
		.append("<p>Nachricht:</p>")
		.append("<textarea class=\"light\"></textarea>");
	var $container = $("<div></div>").addClass("new_message")
		.append($image)
		.append($right);
		
	return $container;
		
}

function submitNewMessage(){
	var $this = $(this);
	var $recipients = $(".recipients");
	var recipientIds = $recipients.data("ids");
	var $textarea = $this.find("textarea")
	var message = $textarea.val();
	
	if(recipientIds.length == 0 || message.length == 0)
		return false;
	
	$.post("/anycook/NewMessage?recipients="+recipientIds+"&text="+encodeURIComponent(message));
	
	//console.log(encodeURIComponent(message));
	$recipients.empty().data("ids", []);
	$textarea.val("");
	
	hideLightbox($this.parents(".lightbox"));
	
	return false;
}

function getMessageContainer(message){
	var recipients = message.recipients;
	
	var $imageborder = $("<div></div>").addClass("messageimageborder");
	var $headline = $("<div></div>").addClass("message_headline");
	var $datetime = $("<div></div>").addClass("datetime").text(getDateString(message.datetime));
	for(var i = 0; i<recipients.length; i++){
		var recipient = recipients[i];
		if(recipient.id == user.id)
			continue;
		
		
		var $recipientlink = $("<a></a>")
			.attr("href", User.getProfileURI(recipient.id))
			.text(recipient.name);
		if($imageborder.children().length > 0)
			$headline.append("<span>, </span>");
		$headline.append($recipientlink);
		
		var $image = $("<img />").attr("src", User.getUserImagePath(recipient.id));
		if(recipient.id == message.sender)
			$imageborder.prepend($image);
		else
			$imageborder.append($image);
	}
	
	$headline.append("<span> und </span><a href=\""+user.getProfileURI()+"\">Ich</a>");
	
	var $p = $("<p></p>").html(message.text.replace(/\n/g,"<br/>"));
	
	var $messageright = $("<div></div>").addClass("message_right")
		.append($headline)
		.append($p)
		.append($datetime);
	
	var $a = $("<a></a>").addClass("message").attr("href", "#!/messagesession/"+message.id)
		.append($imageborder)
		.append($messageright);
		
		if(message.unread)
			$a.addClass("unread");
		
	return $a;
}
