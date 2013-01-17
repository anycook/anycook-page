function getMessages(sessionid, startid){
	var timeout = 500;
	if(startid === undefined){
		startid = -1;
		timeout = 0;
	}
	
	setTimeout(function(){$.anycook.graph.message.session(sessionid, startid,
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
						$.anycook.graph.message.read(sessionid, messages[i].id);
						
					$.extend(oldDataMap, datamap);
					$messagestream.data("messages", oldDataMap);
				}
				if(messages!= null && messages.length>0){
					
					$messagestream.jScrollPane();
					
					var jspPaneHeight = $jspPane.outerHeight();
					var messageHeight =  $messagestream.innerHeight();
					var oldtop = $jspPane.position().top;
					var newtop = messageHeight-jspPaneHeight;
					
					// var lasttop = $lastli.position().top;
					// var lastheight = $lastli.outerHeight(true);
					// var oldtop = $messagestream.innerHeight() -(lasttop);
					// var newtop = $messagestream.innerHeight() -(lasttop+lastheight);					
					var $jspContainer = $messagestream.children(".jspContainer");
					
					
					
					if(startid == -1){
						if(newtop<0)
							$jspPane.css({top:newtop});
					}else{
						var $messageContainer = $lastli.children(".messagecontainer");
						$messageContainer.css({backgroundColor:"#D7E8B5"});
						if(newtop<0){								
							$jspPane.css({top:oldtop}).animate({top:newtop}, {duration:"slow", complete:function(){
									$messageContainer.animate({backgroundColor:"#F7F4F1"},
										{duration:2000, complete:function(){
											$messageContainer.css("backgroundColor", "");
										}});							
							}});
						}else{
							$messageContainer.hide().fadeIn(1000).animate({backgroundColor:"#E6E2D7", borderColor:"#C2C0BE"},
								{duration:2000, complete:function(){
									$messageContainer.css("backgroundColor", "");
								}});
						}
					}
					
					$messagestream.jScrollPane();
				
				}
				getMessages(sessionid, lastid);
			}
		});},timeout);
}

function submitAnswerMessage(event){
	event.preventDefault();
	var $this = $(this);
	var $textarea = $this.find("textarea")
	var message = $textarea.val();
	var sessionid = $.address.pathNames()[1];
	
	if(message.length == 0)
		return;
	
	$.anycook.graph.message.answer(sessionid, message);
	
	//console.log(encodeURIComponent(message));
	$textarea.val("");
}

function getMessageContainerforSession(message){
	var sender = message.sender;
	var $sender = $("<a></a>").attr("href", User.getProfileURI(sender.id))
		.text(sender.name);
	var $image = $("<img />").attr("src", User.getUserImagePath(sender.id));

	var $headline = $("<div></div>").addClass("message_headline")
		.append($sender);
		
	
	
	
	var $p = $("<p></p>").html(message.text.replace(/\n/g,"<br/>"));
	
	var $messageright = $("<div></div>").addClass("message_content")
		.append($headline)
		.append($p);
	
	var $clockicon = $("<div></div>").addClass("clock");
	var $datetimeline = $("<div></div>").addClass("timeline_container");
		
	var $dates = $(".messagedialog .datetime");
	var lastDate = $dates.last().text();
	var newDate = getDateString(message.datetime);
	if(lastDate !== newDate){
		var $datetime = $("<div></div>").addClass("datetime").text(newDate);
		$datetimeline.append($clockicon);
		$datetimeline.append($datetime);
	}
	
	var $massagecontainer = $("<div></div>").addClass("messagecontainer")
		.append($image)
		.append($messageright);	
	
	var $li = $("<li></li>").addClass("messagedialog")
		.append($massagecontainer)
		.append($datetimeline);
		
	
	return $li;

}


