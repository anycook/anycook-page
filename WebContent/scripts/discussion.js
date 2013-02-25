function loadDiscussion(recipename, lastid) {
	if(lastid === undefined)
		lastid = -1;
		
	var $commentDiscussion = $("#comment_discussion");
	var login = user.checkLogin();
	if(login)
		$("#no_comment").hide();
	else
		$("#yes_commit").hide();
	$.anycook.graph.discussion(recipename, lastid, function(json){
		var pathNames = $.address.pathNames();
		if(pathNames[0] != "recipe" || decodeURI(pathNames[1]) != recipename)
			return;
		
		var newLastid = lastid;
		if(json != null) {
			var discussion = $commentDiscussion.data("discussion") || {};
			
			var $ul = $commentDiscussion.children("ul");
			
			for(var i in json) {
				newLastid = Math.max(newLastid, Number(json[i].id));
				var parent_id = json[i].parent_id;
				var $li;
				if(parent_id == -1){
					if(json[i].syntax == null)
						$li = getDiscussionElement(false, json[i].text, json[i].user, json[i].likes, login, json[i].datetime, json[i].id);
					else
						$li = getDiscussionEvent(recipename, json[i].syntax, json[i].versions_id, json[i].text, json[i].user, json[i].likes, login, json[i].datetime, json[i].id, json[i].active);
					discussion[i] = $li;
					$ul.append($li);
					$li.data("comment_id", json[i].id);
				} else{
					$li = getDiscussionElement(true, json[i].text, json[i].user, json[i].likes, login, json[i].datetime, json[i].id);
					discussion[parent_id].children("ul").append($li);
					$li.data("comment_id", parent_id);
				}
				$li.data("id", json[i].id);
				
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
		setTimeout("loadDiscussion("+recipename+", "+newLastid+")", 2000);
		// loadDiscussion(recipename, newLastid);
	});
}

function getDiscussionElement(children, text, user, likes, login, datetime, id) {
	var datetime = getDateString(datetime);
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

function getDiscussionEvent(recipename, syntax, versions_id, text, user, likes, login, eingefuegt, id,active) {
	var $li = $("<li></li>").addClass("event");
	var $left = $("<div></div>").addClass('left');
	var $main = $("<div></div>").addClass('mid');
	
	$("<div></div>").addClass("up").appendTo($left);
	$("<div></div>").addClass("votes").text(likes).appendTo($left);
	$("<div></div>").addClass("down").text(text).appendTo($left);	
	
	var datetime = getDateString(eingefuegt,false);
	$("<div></div>").addClass("infodata").text(datetime+", von "+user.name).appendTo($main);
	$("<div></div>").addClass("title").text(syntax).appendTo($main);
	$("<div></div>").addClass("text").text(text).appendTo($main);
	
	$li.append($left).append($main);
	
// 
	// if(Number(likes) > 0) {
		// likes = "+" + likes;
	// }
// 
	// var $comment = $("<div></div>").addClass("recipe_event");
	// if(active)
		// $comment.addClass("active");
// 
	// var altText = "Hier klicken um diese Version zu öffnen";
	// var $comment_headline = $("<div></div>").addClass("comment_headline").append(parseDiscussionEvent(recipename, syntax, eingefuegt, versions_id, user.name));
	// var $left = $("<a></a>").addClass("left").attr({
		// href : Recipe.getURI(recipename) + "/" + versions_id,
		// title : altText
	// }).append($comment_headline);
// 
	// var $text = $("<div></div>").addClass("comment_text").text(text);
// 
	// var $like = $("<div></div>").addClass("comment_like").append("<div class=\"like\"></div>").append("<div class=\"like_nr\">" + likes + "</div>");
	// var $hiddeninput = $("<input />").attr({
		// type : "hidden",
		// value : id
	// }).addClass("comment_id");
// 
	// var $right = $("<div></div>").addClass("right").append($like);
// 
	// var $rightbackground = $("<div></div>").addClass("rightbackground");
// 
	// $comment.append($left).append($text).append($hiddeninput).append($right).append($rightbackground);
	// $li.append($comment).append("<ul></ul>");
// 
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
	var text = $(this).prev().children().val();
	if(text != "") {
		$.anycook.graph.discuss(recipe.name, text);
	}
}

function childComment(event) {
	if(event.which == 13){
		var $this = $(this);
		var pid = $this.parents(".comment").data("comment_id");
		var text = $this.val();
		if(text != "") {
			$.anycook.graph.discuss(recipe.name, text, pid);
			$this.parents(".child_comment").remove();
		}
	}

}

function discussionLike(event) {
	var $this = $(this);
	var id = $this.parents(".comment").data("id");

	$.post("/anycook/LikeDislike",{id:id,gericht:encodeURIComponent(recipe.name)},
		function(response) {
			if(response != "false") {
				var $like_nr = $this.siblings(".like_nr");
				$like_nr.removeClass("plus").removeClass("minus");
				if(Number(response) > 0) {
					response = "+" + response;
					$like_nr.addClass("plus");
				}

				$like_nr.text(response);
			}
		});
}

var recipe = null;