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
	'AnycookAPI',
	'classes/Recipe',
	'classes/Search'
], function($, AnycookAPI, Recipe, Search){
	'use strict';
	return {
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
		remove : function(event){
			var $tag = $(event.target).parents('.tag');
			var text = $tag.find('.tag_text').text();
			$tag.remove();
			//this.removeInput();
			event.data.remove(text);
		},
		makeCloud : function(target, addTag){
			var $tagcloud = $(target).empty();
			var data ='';

			var self = this;
			
			var recipe = Recipe.getRecipeName();
			if(recipe !== null) {
				data += 'recipe='+recipe;
			}

			$tagcloud.on('click', '.tag', addTag);
			
			AnycookAPI.tag.popular(recipe, function(response){
				for(var tag in response){
					$tagcloud.append(self.get(tag, 'number', response[tag]));
				}
			});
		},
		//add fields 'add' and 'remove' for callbacks
		makeInput : function(event){
			var self = this;
			var $target = $(event.target);

			if(!event.data){
				event.data = {};
			}
			if(!event.data || !event.data.add || typeof event.data.add !== 'function'){
				console.error('no add function defined');
				$.extend(event.data, {add : function(text) {console.log('with callback '+text+' would be added');}});
			}
			if(!event.data.remove || typeof event.data.remove !== 'function'){
				console.error('no remove function defined');
				$.extend(event.data, {remove : function(text) {console.log('with callback '+text+' would be removed');}});
			}
			
			if(event !== undefined){
				if($target.parents().andSelf().is('.tag')) {
					return;
				}
			}
				
			if($target.children('input').length === 0 && $target.parents('.blocked').length === 0){
				//make new input field
				$target.append('<input type="text"/>')
					.addClass('active')
					.children('input')
					.keydown(event.data, $.proxy(this.inputKeyListener, this))
					.focus()
					.autocomplete({
						source:function(req,resp){
							var term = req.term;
							AnycookAPI.autocomplete.tag(term,function(data){
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
						select:function(e, ui){
							if(!ui.item) { return false; }
							var text = ui.item.label;
							$(this).autocomplete('destroy');

							event.data.add(text);

							/*if($target.hasClass('tags_list')){
								search.addTag(text);
								search.flush();
							}else {
								this.saveNewTag(text);
							}*/
							self.makeInput(event);
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
		removeInput : function(event){
			/*var $tagsbox = $('.tagsbox');
			$tagsbox.children('input').remove();*/
			var $target = $(event.target);
			$target.remove();
		},
		inputKeyListener : function(event) {
			var $target = $(event.target);
			var text = $target.val();
			var $tagsbox = $target.parent();

			if((event.keyCode === 13 || event.keyCode === 188 || event.keyCode === 32) && text !== '' ){
				event.preventDefault();
				//this.saveNewTag(text);
				event.data.add(text);
				this.removeInput(event);
				this.makeInput({
					target : $tagsbox[0],
					data : event.data
				});
			}
			else if(event.keyCode === 8 && text === ''){
				event.preventDefault();
				var tagName = $target.prevAll('.tag').last().find('.tag_text').text();
				event.data.remove(tagName);
				$tagsbox.children('.tag').last().remove();
				this.removeInput(event);
				this.makeInput({
					target : $tagsbox[0],
					data : event.data
				});
			}
			
		},
		//search
		searchTag : function(tag){
			var search = Search.init();
			search.addTag(tag);
			search.flush();
		},
		searchRemoveTag : function(tag){
			var search = Search.init();
			search.removeTag(tag);
			search.flush();
		},
		//OLD NEW
		/*removeNewTag : function(event){
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
			AnycookAPI.tag.suggest(recipe, tags);
			lightbox.hide();
			$('.tagsbox').empty();
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
		}*/
	};
});


