function loadMessagesession(sessionid){
	
	
	var $messageAnswer = $("#message_answer").submit(submitAnswerMessage);
	$messageAnswer.find(".messageimageborder").append("<img src=\""+user.getUserImagePath()+"\"/>");
	$messageAnswer.find("textarea").autoGrow();
	
	$.ajax({
		url:"/anycook/GetMessageSession",
		data:{sessionid:sessionid},
		dataType:"json",
		success: function(json){
			var recipients = json.recipients;
			var $recipientSpan = $("h1 span").last();
			for(var i = 0; i<recipients.length; i++){
				var recipient = recipients[i];
				
				if(recipient.id == user.id)
					continue;
				
				if($recipientSpan.children("a").length == recipients.length -2 && 
					$recipientSpan.children("a").length != 0)
					$recipientSpan.append("<span> und </span>");
				else if($recipientSpan.children().length > 0)
					$recipientSpan.append("<span>, </span>");
				
				var $a = $("<a></a>").attr("href", User.getProfileURI(recipient.id))
					.text(recipient.name);
					
				$recipientSpan.append($a);
			}
			//var $messagestream = $("#messagestream");
			//for(var i in json.messages){
			//	$messagestream.append(getMessageContainerforSession(json.messages[i], recipientsMap));
			//}
			
			// var path = $.address.pathNames();
			// if(path[0] == "messagesession" && path[1] == sessionid)
				// getMessageSession(sessionid);
		}
	});
	
	$("#messagestream").jScrollPane();
	getMessages(sessionid);
	
}

function getMessages(sessionid, startid){
	if(startid === undefined)
		startid = 0;
	
	$.ajax({
		url:"/anycook/PushMessages",
		data:{sessionid:sessionid, lastid:startid},
		dataType:"json",
		success: function(messages){
			var path = $.address.pathNames();
			var $lastli;
			var lastid;
			if(path[0] == "messagesession" && path[1] == sessionid){
				//if(json === undefined) return;			
				var $messagestream = $("#messagestream");
				var $jspPane = $messagestream.find(".jspPane");
				for(var i in messages){
					$lastli = getMessageContainerforSession(messages[i]);
					$jspPane.append($lastli);
					lastid = messages[i].id;
				}
				if(messages!= null && messages.length>0){
					
					var lasttop = $lastli.position().top;
					var lastheight = $lastli.outerHeight(true);
					var newtop = $messagestream.innerHeight() -(lasttop+lastheight);					
					var $jspContainer = $messagestream.children(".jspContainer");
					$messagestream.jScrollPane();	
					if(startid == 0)
						$jspPane.css({top:newtop});
					else
						$jspPane.animate({top:newtop}, "slow");
					
					$messagestream.jScrollPane();
				
				}
				getMessages(sessionid, lastid);
			}
		}
	});
}

function submitAnswerMessage(){
	var $this = $(this);
	var $textarea = $this.find("textarea")
	var message = $textarea.val();
	var sessionid = $.address.pathNames()[1];
	
	if(message.length == 0)
		return false;
	
	$.post("/anycook/NewMessage?streamid="+sessionid+"&text="+encodeURIComponent(message));
	
	//console.log(encodeURIComponent(message));
	$textarea.val("");
	
	return false;
}

function getMessageContainerforSession(message, recipientsMap){
	var sender = message.sender;
	var $sender = $("<a></a>").attr("href", User.getProfileURI(sender.id))
		.text(sender.name);
	var $image = $("<img />").attr("src", User.getUserImagePath(sender.id));
	
	var $imageborder = $("<div></div>").addClass("messageimageborder")
		.append($image);
	var $headline = $("<div></div>").addClass("message_headline")
		.append($sender);
	var $datetime = $("<div></div>").addClass("datetime").text(getDateString(message.datetime));
	
	
	var $p = $("<p></p>").html(message.text.replace(/\n/g,"<br/>"));
	
	var $messageright = $("<div></div>").addClass("message_right")
		.append($headline)
		.append($p)
		.append($datetime);
	
	var $li = $("<li></li>").addClass("message")
		.append($imageborder)
		.append($messageright); 
		
	return $li;

}


