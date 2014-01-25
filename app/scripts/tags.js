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

define(['jquery'],
function($){
	return {
		//NEW
		makeNewTagInput : function(event){
			var $this = $(this);
			
			
			if(event !== undefined){
				var $target = $(event.target);
				if($target.parents().andSelf().is(".tag"))
					return;
			}
				
			if($this.children("input").length==0 && $this.parents(".blocked").length == 0){
					//var divlength = getDivLength();
					//make new input field
					$this.append("<input type='text'/>")
						.addClass("active")
						.children("input")
						.keydown(keyNewTag)
						.focus()
						.autocomplete({
			    		source:function(req,resp){
		        			//var array = [];
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
		        				offset:"-1 1"
		        			}, 
		        			select:function(event, ui){
		        				if(ui.item === undefined) return false;
		        				var text = ui.item.label;
		        				$(this).autocomplete("destroy");
		        				
		        				if($this.hasClass("tags_list")){
		        					search.addTag(text);
		        					search.flush();
		        				}else
		        					saveNewTag(text);
		        				makeNewTagInput.apply($this[0]);
		        				return false;
		        			}
			    	});
			    	
			    	
					$(".ui-autocomplete").last().addClass("newtag-autocomplete");
					// if($this.hasClass("tags_list"))
					
					$("body").click(function(event){
						if($(event.target).parents().andSelf().is($($this)))
							return;
						
						$this
						.removeClass("active")
						.children("input").remove();
						
					});
				}
				
				$this.children("input").focus();
					
		},
		keyNewTag : function(event) {
			var $this = $(this);
			var text = $this.val();
			var $tagsbox = $this.parent();

			if((event.keyCode == 13 || event.keyCode == 188 || event.keyCode == 32) && text!="" ){
				event.preventDefault();
				saveNewTag(text);
				removeNewInput();
				makeNewTagInput.call($tagsbox[0]);
			}
			else if(event.keyCode == 8 && text ==""){
				event.preventDefault();
				
				if($tagsbox.is(".tags_list")){
					var tagName = $this.prev().find(".tag_text").text();
					search.removeTag(tagName);
					search.flush();
				}
				$tagsbox.children(".tag").last().remove();
				removeNewInput();
				draftTags();
				makeNewTagInput.call($tagsbox[0]);
			}
			
		},
		removeNewInput : function(){
			var $tagsbox = $(".tagsbox");
			$tagsbox.children("input").remove();
		},
		removeNewTag : function(event){
			var $this = $(this);
			if($this.parents().is(".tags_list")){
				search.removeTag($this.prev().text());
				search.flush();
				return;
			}
			
			$this.parents(".tag").animate({
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
						easing: "swing",
						complete:function(){
							$(this).remove();
							draftTags();
						}
					});
				}
			});
		},
		makeTagCloud : function(){
			$("#tagcloud").empty();
			var data ="";
			
			
			var recipe = Recipe.getRecipeName();
			if(recipe != null)
				data+="recipe="+recipe;
			
			$.anycook.api.tag.popular(recipe, function(response){
					for(tag in response){
						$("#tagcloud").append(getTag(tag, "number", response[tag]));
					}
					
					$("#tagcloud .tag").click(addNewTag);
				});
			
			
		},
		submitTags : function(event){
			event.preventDefault();
			var tagtext = $(this).children("input").val();
			search.addTag(tagtext);
		},
		submitSuggestTags : function(event){
			event.preventDefault();	
			var pathNames = $.address.pathNames();
			var recipe = pathNames[1];
			var $tags_text = $(".tagsbox .tag_text");
			var tags = [];
			for(var i = 0; i<$tags_text.length; i++){
				tags.push($tags_text.eq(i).text());
			}
			var userid = -1;
			if(user.checkLogin())
				userid = user.id;
			$.anycook.api.tag.suggest(recipe, tags);
			hideLightbox();
			$(".tagsbox").empty();
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
			
			if(type == "link" || type == "linknumber")
				$tag = $("<a href=\"#/search/tagged/"+name+"\"></a>");
			else
				$tag = $("<div></div>");
				
			var $right = $tag.addClass("tag").append("<div class=\"right\"></div>").children()
				.append("<div class='tag_text'>"+name+"</div>");
			
			if(type == "remove"){
				var $remove = $("<div>x</div>").addClass("tag_remove").click(removeNewTag);
				$right.append($remove);
			}else if(type == "number" || type == "linknumber")
				$right.append("<div class=\"tag_num\">"+number+"</div>");
				
			return $tag;
		},
		saveNewTag : function(text){
			if(text[0]=="," || text[0]==" ")
				text = text.substring(1,text.length);
			
			removeNewInput();	
			if($(".tag_text:contains("+text+")").not("#tagcloud .tag_text:contains("+text+")").length == 0){		
				$(".tagsbox").append(getTag(text, "remove"))
					.children(".tag").last()
					.hide().fadeIn(100);
				draftTags();
			}
			
		},
		addNewTag : function(event){
			var $this = $(this);
			var text = $this.find(".tag_text").text();
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
						easing: "swing",
						complete:function(){
							$this.remove();
						}
					});
				}
			});
			
			saveNewTag.apply($(".tagsbox")[0],[text]);	
		},
		//OLD!!!
		keyTag : function(event) {
			var text = $(event.target).val();

			if((event.keyCode == 188 || event.keyCode == 32) && text!="" ){
				$(".tags_table_right form").submit();
				makeNewInput();		
			}
			else if(event.keyCode == 8 && text ==""){
				removeTag($(".tag:last"));
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
			$(".tags_table_right input").remove();
		},
		removeTag : function(tag){
			var text = $(tag).children(".tag_text").text();
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
			var $tagsCloud = $("#famous_tags_cloud");
			for(tag in tags){
				$tagsCloud.append(getTag(tag, "linknumber", tags[tag]));
			}
		},
		handleNewTagClick : function(event){
				makeNewRInput();
		}
	}
});


