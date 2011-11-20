function loadMessagesession(sessionid){
	$.ajax({
		url:"/anycook/GetMessageStream",
		data:{sessionid:sessionid},
		dataType:"json",
		success: function(json){
			var recipients = json.recipients;
			var $recipientSpan = $("h1 span").last();
			var recipientsMap = {};
			for(var i = 0; i<recipients.length; i++){
				var recipient = recipients[i];
				
				recipientsMap[recipient.id] = recipient.name;
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
			
			var $messagestream = $("#messagestream");
			for(var i in json.messages){
				$messagestream.append(getMessageContainerforSession(json.messages[i], recipientsMap));
			}
			
			
		}
	});
	
	var $messageAnswer = $("#message_answer").submit(submitAnswerMessage);
	$messageAnswer.find(".messageimageborder").append("<img src=\""+user.getUserImagePath()+"\"/>");
	$messageAnswer.find("textarea").autoGrow();
	
	
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
	var sender = message.sender_id;
	var $sender = $("<a></a>").attr("href", User.getProfileURI(sender))
		.text(recipientsMap[sender]);
	var $image = $("<img />").attr("src", User.getUserImagePath(sender));
	
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


