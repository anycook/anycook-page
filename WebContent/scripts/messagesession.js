function getMessages(sessionid, startid){
	if(startid === undefined)
		startid = -1;
	
	$.anycook.graph.getMessageSession(sessionid, startid,
		function(json){
			var messages = json.messages;
			
			if(startid == -1){
				var $messageAnswer = $("#message_answer").submit(submitAnswerMessage);
				$messageAnswer.find(".messageimageborder").append("<img src=\""+user.getUserImagePath()+"\"/>");
				$messageAnswer.find("textarea").autoGrow();
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
					$("#messagestream").jScrollPane();
				}
			}
			
			// gettingMessages[sessionid] = false;
			var path = $.address.pathNames();
			var $lastli;
			var lastid = startid;
			if(path[0] == "messagesession" && path[1] == sessionid){
				//if(json === undefined) return;			
				var $messagestream = $("#messagestream");
				var oldDataMap = $messagestream.data("messages") || {};
				var datamap = {};
				
				var $jspPane = $messagestream.find(".jspPane");
				for(var i in messages){
					lastid = messages[i].id;
					var oldData = oldDataMap[lastid];
					if(oldData)
						continue;
					$lastli = getMessageContainerforSession(messages[i]);
					$jspPane.append($lastli);
					datamap[lastid] = messages[i];
					
					
					if(messages[i].unread)
						$.anycook.graph.readMessage(sessionid, messages[i].id);
						
					$.extend(oldDataMap, datamap);
					$messagestream.data("messages", oldDataMap);
				}
				if(messages!= null && messages.length>0){
					
					var lasttop = $lastli.position().top;
					var lastheight = $lastli.outerHeight(true);
					var oldtop = $messagestream.innerHeight() -(lasttop);
					var newtop = $messagestream.innerHeight() -(lasttop+lastheight);					
					var $jspContainer = $messagestream.children(".jspContainer");
					$messagestream.jScrollPane();
					
					
					if(startid == -1){
						if(newtop<0)
							$jspPane.css({top:newtop});
					}else{
						
						$lastli.css({backgroundColor:"#D7E8B5", borderColor:"#859F5E"});
						if(newtop<0){								
							$jspPane.css({top:oldtop}).animate({top:newtop}, {duration:"slow", complete:function(){
									$lastli.animate({backgroundColor:"#E6E2D7", borderColor:"#C2C0BE"},
										{duration:2000});											
							}});
						}else{
							$lastli.hide().fadeIn(1000).animate({backgroundColor:"#E6E2D7", borderColor:"#C2C0BE"},
								{duration:2000});
						}
					}
					
					$messagestream.jScrollPane();
				
				}
				getMessages(sessionid, lastid);
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
	
	$.anycook.graph.writeMessage(sessionid, message);
	
	//console.log(encodeURIComponent(message));
	$textarea.val("");
	
	return false;
}

function getMessageContainerforSession(message){
	var sender = message.sender;
	var $sender = $("<a></a>").attr("href", User.getProfileURI(sender.id))
		.text(sender.name);
	var $image = $("<img />").attr("src", User.getUserImagePath(sender.id));

	var $headline = $("<div></div>").addClass("message_headline")
		.append($sender);
		
	var lastdate = $(".datetime").last().val();
	var $datetime = $("<div></div>").addClass("datetime").text(getDateString(message.datetime));
	
	
	var $p = $("<p></p>").html(message.text.replace(/\n/g,"<br/>"));
	
	var $messageright = $("<div></div>").addClass("message_right")
		.append($headline)
		.append($p)
		.append($datetime);
	
	var $li = $("<li></li>").addClass("messagedialog")
		.append($image)
		.append($messageright);
	
	return $li;

}


