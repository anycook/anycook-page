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
'use strict';
define([
	'jquery',
	'classes/Recipe'
], function($, Recipe){
	return {
		//NEW
		makeNewTagInput : function(event){
			var $target = $(event.target);
			
			
			if(event !== undefined){
				if($target.parents().andSelf().is('.tag')) {
					return;
				}
			}
				
			if($target.children('input').length === 0 && $target.parents('.blocked').length === 0){
					//var divlength = getDivLength();
					//make new input field
				$target.append('<input type="text"/>')
					.addClass('active')
					.children('input')
					.keydown($.proxy(this.keyNewTag, this))
					.focus()
					.autocomplete({
						source:function(req,resp){
							var term = req.term;
							$.anycook.api.autocomplete.tag(term,function(data){
								resp($.map(data, function(item){
									return{
										label:item
									};
								}));
							});
						},
						autoFocus:true,
						minlength:1,
						position:{
							offset : '-1 1'
						},
						select:function(event, ui){
							if(!ui.item) { return false; }
							var text = ui.item.label;
							$(this).autocomplete('destroy');

							if($target.hasClass('tags_list')){
								search.addTag(text);
								search.flush();
							}else {
								this.saveNewTag(text);
							}
							this.makeNewTagInput(e);
							return false;
						}
					});

				$('.ui-autocomplete').last().addClass('newtag-autocomplete');
				// if($this.hasClass("tags_list"))
					
				$('body').click(function(event){
					if($(event.target).parents().andSelf().is($($target))) {
						return;
					}
						
					$target
						.removeClass('active')
						.children('input').remove();
						
				});
			}
				
			$target.children('input').focus();
					
		},
		keyNewTag : function(event) {
			var $target = $(event.target);
			var text = $target.val();
			var $tagsbox = $target.parent();

			if((event.keyCode === 13 || event.keyCode === 188 || event.keyCode === 32) && text !== '' ){
				event.preventDefault();
				this.saveNewTag(text);
				this.removeNewInput();
				this.makeNewTagInput({target : $tagsbox[0]});
			}
			else if(event.keyCode === 8 && text === ''){
				event.preventDefault();
				
				if($tagsbox.is('.tags_list')){
					var tagName = $this.prev().find('.tag_text').text();
					search.removeTag(tagName);
					search.flush();
				}
				$tagsbox.children('.tag').last().remove();
				removeNewInput();
				draftTags();
				makeNewTagInput.call($tagsbox[0]);
			}
			
		},
		removeNewInput : function(){
			var $tagsbox = $('.tagsbox');
			$tagsbox.children('input').remove();
		},
		removeNewTag : function(event){
			var $this = $(this);
			if($this.parents().is('.tags_list')){
				search.removeTag($this.prev().text());
				search.flush();
				return;
			}
			
			$this.parents('.tag').animate({
				opacity:0
			}, {
				duration:150,
				complete:function(){
					$(this).animate({
						width:0,
						margin: 0,
						padding:0
					}, {
						duration:300,
						easing: 'swing',
						complete:function(){
							$(this).remove();
							draftTags();
						}
					});
				}
			});
		},
		makeTagCloud : function(){
			$('#tagcloud').empty();
			var data ='';

			var self = this;
			
			var recipe = Recipe.getRecipeName();
			if(recipe !== null) {
				data += 'recipe='+recipe;
			}
			
			$.anycook.api.tag.popular(recipe, function(response){
				for(var tag in response){
					$('#tagcloud').append(self.get(tag, 'number', response[tag]));
				}
				
				$('#tagcloud .tag').click($.proxy(self.addNewTag, self));
			});
		},
		submitTags : function(event){
			event.preventDefault();
			var tagtext = $(this).children('input').val();
			search.addTag(tagtext);
		},
		submitSuggestTags : function(event){
			event.preventDefault();
			var pathNames = $.address.pathNames();
			var recipe = pathNames[1];
			var $tagsText = $('.tagsbox .tag_text');
			var tags = [];
			for(var i = 0; i<$tagsText.length; i++){
				tags.push($tagsText.eq(i).text());
			}
			var userid = -1;
			if(user.checkLogin()) {
				userid = user.id;
			}
			$.anycook.api.tag.suggest(recipe, tags);
			lightbox.hide();
			$('.tagsbox').empty();
			/*$("#recipe_tags").empty();
			$("#addtags_container").fadeOut(200, function(){
				$("#bezeichner_container").append("<div id='suggestedtags_message' class='content_message'>" +
						"<h5>Danke!</h5><p>Wir schauen uns deine Vorschläge gleich einmal an.<br /> " +
						"Wir benachrichtigen dich!</p></div>");
				$("#content").click(addTagreadyClick);
				window.setTimeout(addTagreadyClick, 3000);
			});*/
		},
		get : function(name, type, number){
			var $tag;
			
			if(type === 'link' || type === 'linknumber') {
				$tag = $('<a href="#/search/tagged/'+name+'"></a>');
			}
			else {
				$tag = $('<div></div>');
			}
				
			var $right = $tag.addClass('tag').append('<div class="right"></div>').children()
				.append('<div class="tag_text">'+name+'</div>');
			
			if(type === 'remove'){
				var $remove = $('<div>x</div>').addClass('tag_remove')
					.click($.proxy(this.removeNewTag, this));
				$right.append($remove);
			}
			else if(type === 'number' || type === 'linknumber') {
				$right.append('<div class="tag_num">'+number+'</div>');
			}
				
			return $tag;
		},
		saveNewTag : function(text){
			if(text[0] === ',' || text[0] === ' ') {
				text = text.substring(1,text.length);
			}
			
			this.removeNewInput();
			if($('.tag_text:contains('+text+')').not('#tagcloud .tag_text:contains('+text+')').length === 0){
				$('.tagsbox').append(this.get(text, 'remove'))
					.children('.tag').last()
					.hide().fadeIn(100);
				draftTags();
			}
			
		},
		addNewTag : function(event){
			var $this = $(this);
			var text = $this.find('.tag_text').text();
			$this.animate({
				opacity:0
			}, {
				duration:150,
				complete:function(){
					$this.animate({
						width:0,
						margin: 0,
						padding:0
					}, {
						duration:300,
						easing: 'swing',
						complete:function(){
							$this.remove();
						}
					});
				}
			});
			
			this.saveNewTag(text);
		},
		//OLD!!!
		keyTag : function(event) {
			var text = $(event.target).val();

			if((event.keyCode === 188 || event.keyCode === 32) && text.length > 0){
				$('.tags_table_right form').submit();
				makeNewInput();
			}
			else if(event.keyCode === 8 && text.length > 0){
				removeTag($('.tag:last'));
				removeInput();
				makeNewInput();
				
				return false;
			}
			
		},
		submitTag : function(event){
			var text = $(this).children().first().val();
			search.addTag(text);
			search.flush();
			return false;
		},
		removeInput : function(){
			$('.tags_table_right input').remove();
		},
		removeTag : function(tag){
			var text = $(tag).children('.tag_text').text();
			removeTagfromSession(text);
			$(tag).remove();
			removeInput();
		},
		removeTagfromSession : function(tag){
			search.removeTag(tag);
			search.flush();
		},
		clickFamousTag : function(event){
			var text = $(event.target).text();
			saveTag(text);
		},
		//tags
		loadFamousTags : function(tags){
			var $tagsCloud = $('#famous_tags_cloud');
			for(var tag in tags){
				$tagsCloud.append(getTag(tag, 'linknumber', tags[tag]));
			}
		},
		handleNewTagClick : function(event){
			makeNewRInput();
		}
	};
});


