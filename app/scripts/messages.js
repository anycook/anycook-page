/**
 * @license This file is part of anycook. The new internet cookbook
 * Copyright (C) 2014 Jan Graßegger
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see [http://www.gnu.org/licenses/].
 * 
 * @author Jan Graßegger <jan@anycook.de>
 */
define([
	'jquery',
	'underscore',
	'AnycookAPI',
	'classes/User',
	'date',
	'text!templates/dialogBox.erb',
	'jquery.autogrowtextarea'
], function($, _, AnycookAPI, User, date, dialogBoxTemplate){
	'use strict';
	return {
		show : function(sessionid, startid){
			var timeout = 500;
			if(!startid){
				startid = -1;
				timeout = 0;
			}

			var self = this;
			
			setTimeout(function(){
				AnycookAPI.message.session(sessionid, startid, function(json){
					var messages = json.messages;
					
					if(startid === -1){
						var user = User.get();

						var $messageAnswer = $('#message_answer').submit($.proxy(self.submitAnswer, self));
						$messageAnswer.find('.messageimageborder').append('<img src=\''+user.getUserImagePath()+'\'/>');
						$messageAnswer.find('textarea').autoGrow();
						var recipients = json.recipients;
						var $recipientSpan = $('h1 span').last();
						for(var i = 0; i<recipients.length; i++){
							var recipient = recipients[i];
							
							if(recipient.id === user.id){
								continue;
							}
							
							if($recipientSpan.children('a').length === recipients.length -2 &&
								$recipientSpan.children('a').length !== 0) {
								$recipientSpan.append('<span> und </span>');
							}
							else if($recipientSpan.children().length > 0){
								$recipientSpan.append('<span>, </span>');
							}
							
							var $a = $('<a></a>').attr('href', User.getProfileURI(recipient.id))
								.text(recipient.name);
								
							$recipientSpan.append($a);
							
						}
						$('#messagestream').jScrollPane();
					}
					
					// gettingMessages[sessionid] = false;
					var path = $.address.pathNames();
					var $lastli;
					var lastid = startid;
					if(path[0] === 'messagesession' && path[1] === sessionid){
						//if(json === undefined) return;			
						var $messagestream = $('#messagestream');
						var oldDataMap = $messagestream.data('messages') || {};
						var datamap = {};
						
						var $jspPane = $messagestream.find('.jspPane');
						for(var j in messages){
							lastid = messages[j].id;
							var oldData = oldDataMap[lastid];
							if(oldData){
								continue;
							}
							$lastli = self.getContainerforSession(messages[j]);
							$jspPane.append($lastli);
							datamap[lastid] = messages[j];
							
							
							if(messages[j].unread){
								AnycookAPI.message.read(sessionid, messages[j].id);
							}
								
							$.extend(oldDataMap, datamap);
							$messagestream.data('messages', oldDataMap);
						}
						if(messages!== null && messages.length > 0){
							
							$messagestream.jScrollPane();
							
							var jspPaneHeight = $jspPane.outerHeight();
							var messageHeight =  $messagestream.innerHeight();
							var oldtop = $jspPane.position().top;
							var newtop = messageHeight-jspPaneHeight;
							
							// var lasttop = $lastli.position().top;
							// var lastheight = $lastli.outerHeight(true);
							// var oldtop = $messagestream.innerHeight() -(lasttop);
							// var newtop = $messagestream.innerHeight() -(lasttop+lastheight);					
							
							if(startid === -1){
								if(newtop < 0) { $jspPane.css({top:newtop}); }
							}else{
								var $messageContainer = $lastli.children('.messagecontainer');
								$messageContainer.css({backgroundColor:'#D7E8B5'});
								if(newtop < 0) {
									$jspPane.css({top:oldtop}).animate({top:newtop}, {
										duration:'slow',
										complete:function(){
											$messageContainer.animate({backgroundColor:'#F7F4F1'}, {
												duration:2000,
												complete:function(){
													$messageContainer.css('backgroundColor', '');
												}
											});
										}
									});
								}else{
									$messageContainer.hide().fadeIn(1000).animate({backgroundColor:'#E6E2D7', borderColor:'#C2C0BE'},
										{duration:2000, complete:function(){
											$messageContainer.css('backgroundColor', '');
										}});
								}
							}
							
							$messagestream.jScrollPane();
						
						}
						self.show(sessionid, lastid);
					}
				});
			},timeout);
		},
		submitAnswer : function(event){
			event.preventDefault();
			var $textarea = $(event.target).find('textarea');
			var message = $textarea.val();
			var sessionid = $.address.pathNames()[1];
			
			if(message.length === 0) { return; }
			
			AnycookAPI.message.answer(sessionid, message);
			
			//console.log(encodeURIComponent(message));
			$textarea.val('');
		},
		getContainerforSession : function(message){
			var sender = message.sender;
			var lastDate = $('.messagedialog .datetime').last().text();
			var newDate = date.getDateTimeString(message.datetime);

			var data = {
				imagePath : User.getUserImagePath(sender.id),
				senderPath : User.getProfileURI(sender.id),
				sender : sender.name,
				text : message.text.replace(/\n/g,'<br/>'),
				date : lastDate === newDate ? null : newDate
			}
				
			return _.template(dialogBoxTemplate, data);

		}
	};
});


