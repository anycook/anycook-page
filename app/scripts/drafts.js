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
	'text!templates/draftFrame.erb'
], function( $, _, AnycookAPI, User, draftFrameTemplate){
	'use strict';

	var queue = [];
	return {
		init : function(callback){
			AnycookAPI._put('/drafts',{}, callback);
		},
		load : function(){
			var self = this;
			AnycookAPI._get('/drafts', {}, function(drafts){
				if(drafts.length === 0){
					$('#nodrafts').show();
					return;
				}
				var $list = $('#draft_list').on('click', '.delete', self.remove);
				for(var i in drafts){
					var draft = drafts[i];
					$list.append(self.getBigFrameDraft(draft.id,draft.data));
				}
			});
		},
		num : function(lastnum){
			if(lastnum === undefined) { lastnum = -1; }

			var user = User.get();
			if(user.checkLogin()){
				var self = this;

				AnycookAPI._get('/drafts/num', {lastNum:lastnum}, function(num){
					$('#drafts #draftnum').text(num);
					var $messageBubble = $('#settings_btn_container .new_messages_bubble');
					if(num>0) { $messageBubble.fadeIn(200).children().text(num); }
					else { $messageBubble.fadeOut(200); }
					
					// $.anycook.drafts.num(num);	
					self.num(num);
				});
			}
		},
		open : function(id, callback){
			return AnycookAPI._get('/drafts/'+id, {}, callback);
		},
		remove : function(event){
			var $li = $(event.target).parents('li');
			AnycookAPI._delete('/drafts/'+$li.data('id'),{}, function(){
				$li.animate({height:0, opacity:0},{duration:500, complete:function(){
					$(this).remove();
					if($('#draft_list').children().length === 0){
						$('#nodrafts').fadeIn(500);
					}
				}});
			});
		},
		getBigFrameDraft : function(id,draft){
			var image = !draft.image ? 'category/sonstiges.png' : draft.image;
			var date = new Date(draft.timestamp);
			var dateString = this.parseDraftDate(date);

			var data = {
				uri : encodeURI('#/recipeediting?id='+id),
				name : !draft.name ? 'Noch kein Titel' : draft.name,
				description : !draft.description ? 'Noch keine Beschreibung' : draft.description,
				imagePath : AnycookAPI.upload.imagePath(image, 'recipe', 'small'),
				date : dateString,
				percent : Math.round(draft.percentage*100)+'%',
				year : date.getFullYear()
			};

			return $(_.template(draftFrameTemplate, data)).data('id', id);
		},
		parseDraftDate : function(date){
			
			var month = date.getMonth();
			var day = date.getDate();
			switch(month){
				case 0:
					month = 'Jan';
					break;
				case 1:
					month = 'Feb';
					break;
				case 2:
					month = 'Mär';
					break;
				case 3:
					month = 'Apr';
					break;
				case 4:
					month = 'Mai';
					break;
				case 5:
					month = 'Jun';
					break;
				case 6:
					month = 'Jul';
					break;
				case 7:
					month = 'Aug';
					break;
				case 8:
					month = 'Sep';
					break;
				case 9:
					month = 'Okt';
					break;
				case 10:
					month = 'Nov';
					break;
				case 11:
					month = 'Dez';
					break;
			}
			
			//console.log(year, month, day);
			return day+'. '+month;
			
			
		},
		save : function(type, data){
			var user = User.get();
			var id = $.address.parameter('id');
			if(!user.checkLogin || id === undefined) { return; }
			
			
			var newData = {id:id, data:{}};
			newData.data[type] = data;
			queue.push(newData);
			if(queue.length === 1){
				this.saveDoc();
			}
		},
		saveDoc : function(){
			var self = this;
			if(queue.length > 0){
				var data = queue[0];
				AnycookAPI._postJSON('/drafts/'+data.id,data.data, function(){
					queue.shift();
					self.saveDoc();
				});
			}
		},
		getDraftFromRecipe : function(recipename){
			var path = '/drafts/'+encodeURIComponent(recipename);

			AnycookAPI._put(path, {}, function(draftId){
				if(draftId) {
					$.address.value('/recipeediting?step=4&id='+draftId);
				}
			});
		}
	};
});
