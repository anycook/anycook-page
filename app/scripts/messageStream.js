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
	'lightbox',
	'title',
	'text!templates/newMessageDialog.erb'
], function($, _, AnycookAPI, User, date, lightbox, title, newMessageDialogTemplate){
	'use strict';
	return {
		loadNewsstream : function(){
			var self = this;

			$('#newMessageBtn').click(function(){
				var $lightbox = self.getNewMessageLightbox();
				var top = $(this).offset().top-113;
				lightbox.show($lightbox, top);
				return false;
			});

			this.getNewsstream();
		},
		getNewMessageLightbox : function(){
			var user = User.get();
			var content = _.template(newMessageDialogTemplate, {userImagePath : user.getUserImagePath()});
			var $lightbox = lightbox.get('Neue Nachricht',
				'Schreibe einem oder mehreren Usern eine Nachricht', content, 'abschicken');
			$lightbox.find('form').submit($.proxy(this.submitNewMessage, this));

			var $recipients = $lightbox.find('.recipients').click($.proxy(this.clickRecipients, this));
			$recipients.data('height', 22);

			return $lightbox;
		},
		getNewsstream : function(lastDatetime){
			var pathNames = $.address.pathNames();
			if(pathNames.length !== 1 || pathNames[0] !== 'newsstream'){ return; }

			var $ul = $('#newsstream');
			var timeout = 0;
			if(lastDatetime) { timeout = 500; }

			var self = this;
			setTimeout(function(){
				AnycookAPI.message(lastDatetime, function(json){
					var datamap = {};
					var oldDatamap = $ul.data('map') || {};

					var $nomessages = $('#nomessages');
					if(json.length > 0 && $nomessages.css('display') === 'block'){
						$nomessages.hide();
					}

					var onComplete = function(){ $(this).remove(); };

					for(var i = 0; i<json.length; i++){
						var $appendTo = $ul;
						var $li;
						var oldData = oldDatamap[json[i].id];
						var data = json[i];
						if(oldData){
							if(oldData.datetime !== data.datetime){
								var $target = oldData.target;
								$target.animate({height:0, opacity:0}, {duration: 800, complete: onComplete});

							}
							else{ continue; }
						}
						$li = $('<li></li>').append(self.getMessageContainer(data));
						$appendTo.prepend($li);
						if(oldData){
							var oldHeight = $li.css('height');
							$li.css({height:0, opacity:0}).animate({height:oldHeight, opacity:1}, {duration:800});
						}

						json[i].target = $li;
						datamap[json[i].id] = json[i];
						//$li.data('data', json[i]);
					}

					$.extend(oldDatamap, datamap);
					$ul.data('map', oldDatamap);
					if(json.length >0) {
						lastDatetime = json[0].datetime;
					}
					else{
						var now = new Date();
						lastDatetime = now.getTime();
					}

					self.getNewsstream(lastDatetime);
				});
			}, timeout);
		},
		checkNewMessageNum : function(num){
			num = num || 0;

			var user = User.get();
			if(!user.checkLogin()) { return; }

			var self = this;
			AnycookAPI.message.number(num, function(newNum){
				title.setPrefix(newNum);

				var $newMessageBubble = $('#message_btn_container .new_messages_bubble');
				$newMessageBubble.children().text(newNum);
				if(newNum <= 0) { $newMessageBubble.fadeOut(); }
				else { $newMessageBubble.fadeIn(); }

				if(newNum > num){
					var audio = new Audio('sounds/newMessage.mp3');
					audio.play();
				}

				self.checkNewMessageNum(newNum);
			},
            //error
            function(){
                console.log('failed to get message num. Trying again in 5 seconds.');
                setTimeout($.proxy(self.checkNewMessageNum, self), 5000);
            });
		},
		clickRecipients : function(event){
			var self = this;
			var $target = $(event.target);

			var ids = this.getRecipientIds();
			if(ids.length === 7){
				return;
			}

			var $input = $target.children('input');
			if($input.length === 1){
				$input.focus();
			}
			else{
				$target.append('<input type=\'text\'/>')
					.children('input').focus().focusout($.proxy(this.focusoutRecipientInput, this))
					.keydown(function(event){
						if($(this).val().length === 0 && event.keyCode === 8){
							var $prevRecipient = $(this).prev('.recipient');
							var id = $prevRecipient.data('id');
							self.removeRecipient(id);
							$prevRecipient.remove();
							self.resizeMessageTextarea();
						}
					})
					.autocomplete({
					source:function(req,resp){
						var array = [];
						var term = req.term;
						var exclude = self.getRecipientIds();
						var user = User.get();
						exclude.push(user.id);
						AnycookAPI.autocomplete.user(term, exclude, function(json){
							var ids = self.getRecipientIds();
							for(var i = 0; i<json.length; i++){
								if($.inArray(json[i].id, ids) === -1) {
									array[array.length] = {label: json[i].name, value: json[i].name, data: json[i].id};
								}
							}
							resp(array);
						});
					},
					minLength:1,
					// selectFirst:true,
					autoFocus:true,
					position : {
						of : '.recipients',
						at : 'left bottom',
						my : 'left top-1'
					},
					select:function(event, ui){
						var id = ui.item.data;
						var name = ui.item.value;
						self.addRecipient(name, id);

						return false;
					}
				});

				$('.ui-autocomplete').last().addClass('recipient-autocomplete')
				.addClass('lightbox-autocomplete');
				this.resizeMessageTextarea();

			}

		},
		getRecipientIds : function(){
			var ids = $('.recipients').data('ids');
			if(!ids){ ids = []; }
			return ids;
		},
		addRecipient : function(name, id){
			var $recipients = $('.recipients');
			var ids = $('.recipients').data('ids');
			if(!ids){ ids = []; }

			var $input = $recipients.children('input');
			if($.inArray(id, ids) > -1){
				$input.val('');
				return;
			}

			var $name = $('<div></div>').addClass('name').text(name);

			var $recipient = $('<div></div>').addClass('recipient')
				.append($name)
				.append('<div class=\'close\'>x</div>')
				.data('id', id)
				.click($.proxy(this.closeRecipient, this));
			ids[ids.length] = id;

			$recipients.data('ids', ids);

			if($input.length > 0){
				$input.before($recipient).val('').focus();
				if($('.recipient').length === 7) {
					$input.remove();
				}
			}else{
				$recipients.append($recipient);
			}



			this.resizeMessageTextarea();

		},
		removeRecipient : function(id){
			var ids = $('.recipients').data('ids');
			for(var i = 0; i< ids.length; i++){
				if(ids[i] === id){
					ids.splice(i, 1);
					break;
				}
			}
			$('.recipients').data('ids', ids);
		},
		focusoutRecipientInput : function(event){
			var $target = $(event.target).removeClass('focus');
			$target.children('input').remove();
			this.resizeMessageTextarea();
		},
		closeRecipient : function(){
			var $target = $(event.target);
			var id = $target.data('id');
			this.removeRecipient(id);
			$target.remove();
			this.resizeMessageTextarea();
			return false;
		},
		resizeMessageTextarea : function(){
			var $recipients = $('.recipients');
			var oldHeightRecipients = $recipients.data('height');
			var heightRecipients = $recipients.height();
			var $textarea = $recipients.siblings('textarea').first();
			var heightTextarea = $textarea.height();
			var newTextareaHeight = heightTextarea-(heightRecipients-oldHeightRecipients);
			$textarea.height(newTextareaHeight);
			$recipients.data('height', heightRecipients);
		},
		submitNewMessage : function(event){
			event.preventDefault();
			var $recipients = $('.new_message .recipients');
			var recipientIds = $recipients.data('ids') || [];
			var $textarea = $('.new_message textarea');
			var message = $textarea.val();

			if(!recipientIds || recipientIds.length === 0 || message.length === 0){
				return;
			}

			AnycookAPI.message.writeNew(recipientIds, message,function(xhr){
				console.log(xhr);
			});

			//console.log(encodeURIComponent(message));
			$recipients.empty().data('ids', []);
			$textarea.val('');

			lightbox.hide();

		},
		getMessageContainer : function(message){
			var recipients = message.recipients;

			var $imageborder = $('<div></div>').addClass('messageimageborder');
			var $headline = $('<div></div>').addClass('message_headline');
			var $datetime = $('<div></div>').addClass('datetime').text(date.getDateTimeString(message.datetime));

			var user = User.get();
			for(var i = 0; i<recipients.length; i++){
				var recipient = recipients[i];
				var $image = $('<img />').attr('src', User.getUserImagePath(recipient.id));

				if(recipient.id === message.sender) { $imageborder.prepend($image); }
				else { $imageborder.append($image); }

				if(recipient.id === user.id) { continue; }


				var $recipientlink = $('<a></a>')
					.attr('href', User.getProfileURI(recipient.id))
					.text(recipient.name);
				if($headline.children('a').length > 0) {
					$headline.append('<span>, </span>');
				}
				$headline.append($recipientlink);

			}

			$imageborder.children().each(function(i){
				$(this).css('left', i*60);
			});


			$headline.append('<span> und </span><a href=\''+user.getProfileURI()+'\'>Ich</a>');

			var lastMessage = message.messages[message.messages.length-1];

			var $p = $('<p></p>').html(lastMessage.text.replace(/\n/g,'<br/>'));

			var $messageright = $('<div></div>').addClass('message_right')
				.append($headline)
				.append($p)
				.append($datetime);

			var $a = $('<a></a>').addClass('message').attr('href', '#/messagesession/'+message.id)
				.append($imageborder)
				.append($messageright);

			if(message.unread) {
				$a.addClass('unread');
			}

			var numImages = $imageborder.children().length;
			if(numImages > 1){

				$a.mouseover(function(){
					$imageborder.children().stop();
					// var i = 0;
					var $children = [];

					var $imgs = $imageborder.children();

					for(var i = 1; i < $imageborder.children().length; i++){
						$children.push($imgs.eq(i));
					}

					var animation = function(){
						if($children.length>0){
							$children.shift().animate({left:0}, {duration:500, easing:'easeInOutExpo', complete:animation});
						}
					};
					animation();
				}).mouseleave(function(){
					$imageborder.children().stop();
					var $children = [];
					var $imgs = $imageborder.children();

					for(var i = 0; i < $imageborder.children().length; i++){
						$children.push($imgs.eq(i));
					}

					var animation = function(){
						if($children.length>0){
							var $element = $children.pop();
							var newPosition = $children.length*60;
							var currentPos = $element.css('left');
							currentPos = Number(currentPos.substring(0, currentPos.length-2));
							if(currentPos === newPosition) { animation(); }
							else {
								$element.animate({left:newPosition}, {
									duration:500,
									easing:'easeInOutExpo',
									complete:animation
								});
							}
						}
					};
					animation();
				});
			}
			return $a;
		}
	};
});
