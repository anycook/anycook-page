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
 
function loadDiscussion(recipename, lastid) {
	if(lastid === undefined){
		lastid = -1;

		$("#edit_recipe").click(function(){
			$.anycook.drafts.getDraftFromRecipe(recipename);
		});

		$("#hide_discussion").click(toggleDiscussion);
	}

	
		
	var $commentDiscussion = $("#comment_discussion");
	var login = user.checkLogin();
	if(login)
		$("#no_comment").hide();
	else
		$("#yes_commit").hide();
	$.anycook.api.discussion(recipename, lastid, function(json){
		var pathNames = $.address.pathNames();
		if(pathNames[0] != "recipe" || decodeURI(pathNames[1]) != recipename)
			return;
		
		var newLastid = lastid;
		if(json != null) {
			var discussion = $commentDiscussion.data("discussion") || {};
			
			var $ul = $commentDiscussion.children("ul");
			
			var elements = json.elements;

			for(var i in elements) {
				newLastid = Math.max(newLastid, Number(elements[i].id));
				var parentId = elements[i].parentId;
				var $li;
				if(parentId == -1){
					if(elements[i].syntax == null)
						$li = getDiscussionElement(false, login, elements[i]);
					else
						$li = getDiscussionEvent(recipename, login, elements[i]);
					discussion[i] = $li;
					$ul.append($li);
					$li.data("comment_id", elements[i].id);
				} else{
					$li = getDiscussionElement(true, login, elements[i]);
					discussion[parentId].children("ul").append($li);
					$li.data("comment_id", parentId);
				}
				$li.data("id", elements[i].id);
				
				if(lastid>-1){
					var height = $li.height();
					$li.css({'height': 0, 'opacity': 0});
					$li.animate({'height': height},{complete:function(){
						$li.animate({opacity: 1});
						$li.css("height", "");
					}});
				}
			}
			$("#comment_discussion > ul > li.comment:odd").addClass("odd");
			centercommenteventlikes();
			$commentDiscussion.data("discussion", discussion);
		}
		//setTimeout("loadDiscussion(\""+recipename+"\", "+newLastid+")", 2000);
		// loadDiscussion(recipename, newLastid);
	});
}

function getDiscussionElement(children, login, json) {
	var id = json.id;
	var text = json.text == null ? "" : json.text;
	var user = json.user;
	var likes = json.likes;

	var likedByUser = json.liked_by_user;

	var datetime = getDateString(json.datetime);
	var linktext = "/#!/profile/" + user.id;
	var image = User.getUserImagePath(user.id);
	var $li = $("<li></li>").addClass("comment").append("<a></a>");
	$li.children("a").attr("href", linktext).append("<img src=\"" + image + "\"/>");

	if(Number(likes) > 0) {
		likes = "+" + likes;
	}
	var $arrow = $("<div></div>");
	var $comment = $("<div></div>").addClass("recipe_comment");

	if(!children) {
		$arrow.addClass("comment_arrow");
	} else {
		$arrow.addClass("comment_arrow_small");
	}
	var $comment_headline = $("<div></div>").addClass("comment_headline").append("<a></a>");
	$comment_headline.children("a").attr("href", linktext).text(user.name);

	var $date = $("<span></span>").addClass("comment_date").text(datetime);
	$comment_headline.append($date);

	var $text = $("<div></div>").addClass("comment_text").text(text);
	var $footer = $("<div></div>").addClass("comment_footer");

	if(login){
		var $answer_btn = $("<a></a>").addClass("answer_btn").text("antworten");
		$answer_btn.on("click", answerBtnClick);
		$footer.append($answer_btn);
	}
	var $like = $("<div class=\"like\"></div>");

	if(likedByUser)
		$like.addClass("liked_by_user");

	var $comment_like = $("<div></div>").addClass("comment_like")
		.append($like)
		.append("<div class=\"like_nr\">" + likes + "</div>");

	$footer.append($comment_like);
	if(login){
		$like.on("click", discussionLike);
	}
	
	$comment.append($comment_headline).append($text).append($footer);
	$li.append($arrow).append($comment);

	if(!children)
		$li.append("<ul></ul>");

	return $li;

}

function getDiscussionEvent(recipeName, login, json) {
	$.extend(json, {
		datetime : getDateString(json.datetime,false),
		recipeName : recipeName
	});

	var $li = $("<li></li>").addClass("event");

	$.get("/templates/discussionEvent.erb", function(template){
		var discussionEvent = _.template(template, json);
		$li.html(discussionEvent);
	});

	return $li;
}

function centercommenteventlikes() {
	$(".recipe_event .comment_like").each(function() {
		var $this = $(this);
		var elementHeight = $this.outerHeight();
		var parentHeight = $this.parents(".right").innerHeight();
		var newMargin = (parentHeight - elementHeight) / 2;
		$this.css("marginTop", newMargin);
	});
}

function parseDiscussionEvent(recipename, syntax, eingefuegt, versions_id, nickname) {
	var text = syntax;

	var array = text.split("@u");
	text = "";
	for(var j = 0; j < array.length - 1; ++j) {
		text += array[j] + nickname;
	}
	text += array[array.length - 1];
	array = text.split("@r");
	text = "";
	for(var j = 0; j < array.length - 1; ++j) {
		text += array[j] + recipename;
	}
	text += array[array.length - 1];
	array = text.split("@d");
	text = "";
	for(var j = 0; j < array.length - 1; ++j) {
		text += array[j] + getDateString(eingefuegt);
	}
	text += array[array.length - 1];

	return text;
}

function answerBtnClick(event) {
	var $this = $(this);
	var $container = $this.parents(".recipe_comment");
	var id = $container.find(".comment_id").val();
	var $ul = $container.siblings("ul");
	if($ul.length == 0)
		$ul = $this.closest("ul");
	var $childComment = $ul.children(".child_comment");
	if($childComment.length == 0) {

		$ul.append(getChildComment(user,id)).find("textarea").focus();
		var $comment = $ul.children(".child_comment");
		var commentoffset = $comment.offset();
		var commentheight = $comment.height();
		var windowheight = $(window).height();
		var scrollTop = $(document).scrollTop();
		if(scrollTop + windowheight < commentoffset.top) {
			$("body").animate({
				scrollTop : commentoffset.top + commentheight - windowheight + 5
			}, {
				duration : 700,
				easing : "easeInOutQuart"
			});
		}

		$("body").click(function(event) {
			var $target = $(event.target);

			if($(".child_comment").length > 0 && !$target.parents().andSelf().is(".child_comment")) {
				$(".child_comment").remove();
			}
		});
	}else{
		$childComment.remove();
	}
	
	return false;
}

function getChildComment(user, id){
	var $li = $("<li></li>").addClass("child_comment");
	var $a = $("<a></a>").attr("href", user.getProfileURI());
	var $img = $("<img />").attr("src", user.getUserImagePath("small"));
	$a.append($img);
	
	var $arrow = $("<div></div>").addClass("comment_arrow_answer");
	
	var $answer = $("<div></div>").addClass("recipe_comment_answer");
	var $textarea = $("<textarea></textarea>").attr({cols: 200, rows:1}).addClass("light");
	$textarea.autoGrow().keydown(childComment);
	var $info = $("<div></div>").addClass("answer_info").text("mit Enter abschicken");
	$answer.append($textarea).append($info);	
	$li.append($a).append($arrow).append($answer);
	return $li;
	
}

function comment(event) {
	var $textarea = $(this).prev().children();
	var text = $textarea.val();
	if(text != "") {
		var parameterNames = $.address.pathNames();
		var recipeName = parameterNames[1];
		$.anycook.api.discussion.answer(recipeName, text, function(){
			$textarea.val("");
		});
	}
}

function childComment(event) {
	if(event.which == 13){
		var $this = $(this);
		var pid = $this.parents(".comment").data("comment_id");
		var text = $this.val();
		if(text != "") {
			var parameterNames = $.address.pathNames();
			var recipeName = parameterNames[1];
			$.anycook.api.discussion.answer(recipeName, text, pid, function(){
				$this.parents(".child_comment").fadeOut(200, function(){
					$(this).remove();
				});
			});
			
		}
		return false;
	}

}

function discussionLike(event) {
	var $this = $(this);
	var id = $this.parents(".comment").data("id");

	var parameterNames = $.address.pathNames();
	var recipeName = parameterNames[1];

	if(!$this.hasClass("liked_by_user")){
		$.anycook.api.discussion.like(recipeName, id, function(){
			var $like_nr = $this.siblings(".like_nr");
			var oldNum = Number($like_nr.text());
			$like_nr.text(++oldNum);
			$this.addClass("liked_by_user");
		});
	}else{
		$.anycook.api.discussion.unlike(recipeName, id, function(){
			var $like_nr = $this.siblings(".like_nr");
			var oldNum = Number($like_nr.text());
			$like_nr.text(--oldNum);
			$this.removeClass("liked_by_user");
		});
	}	
}

function toggleDiscussion(){
	$("#comment_discussion > ul > li.comment").toggle(500);
}