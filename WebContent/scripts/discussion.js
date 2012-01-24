function loadDiscussion(recipename) {
	var $commentDiscussion = $("#comment_discussion");
	$.getJSON("/anycook/GetDiscussion", {gericht:recipename}, function(json){
		if(json.length == 0) {
			$commentDiscussion.html("<div class='no_discussion'>Zu diesem Rezept existiert noch keine Diskussion.<br/>Mach doch den Anfang!</div>");
		} else {
			var $ul = $commentDiscussion.append("<ul></ul>").children("ul");
			var login = user.checkLogin();
			for(var i in json) {
				maxID = Math.max(maxID, Number(json[i].id));
				var $li;
				if(json[i].syntax == null)
					$li = getDiscussionElement(false, json[i].text, json[i].user, json[i].likes, login, json[i].datetime, json[i].id);
				else
					$li = getDiscussionEvent(recipename, json[i].syntax, json[i].versions_id, json[i].text, json[i].user, json[i].likes, login, json[i].datetime, json[i].id, json[i].active);
				$ul.append($li);
				loadChildren(recipename, i, json[i].id, login);
			}
			$("#comment_discussion > ul > li.comment:odd").addClass("odd");
			centercommenteventlikes();
			
		}
	});
}

function loadChildren(recipename, i, id, login) {
	$.getJSON("/anycook/GetDiscussion", {gericht:encodeURIComponent(recipename), pid:id},function(json){
		if(json != null && json.length > 0) {
			var $ul = $($("#comment_discussion > ul > li > ul")[i]);
			for(var j in json) {
				maxID = Math.max(maxID, Number(json[j].id));
				var $li = getDiscussionElement(true, json[j].text, json[j].user, json[j].likes, login, json[j].datetime, id);
				$ul.append($li);
			}

			//$(ul).children(":odd").addClass("odd");
		}
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
	var $arrow = $("<div</div>");
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

	if(login)
		$footer.append("<a class='answer_btn'>antworten</a>");

	var $like = $("<div></div>").addClass("comment_like").append("<div class=\"like\"></div>").append("<div class=\"like_nr\">" + likes + "</div>");

	var $hiddeninput = $("<input />").attr({
		type : "hidden",
		value : id
	}).addClass("comment_id");

	$footer.append($like);
	$comment.append($comment_headline).append($text).append($footer).append($hiddeninput);
	$li.append($arrow).append($comment);

	if(!children)
		$li.append("<ul></ul>");

	return $li;

}

function getDiscussionEvent(recipename, syntax, versions_id, text, user, likes, login, eingefuegt, id,active) {
	//var datetime = getDateString(eingefuegt);
	var $li = $("<li></li>").addClass("event");

	if(Number(likes) > 0) {
		likes = "+" + likes;
	}

	var $comment = $("<div></div>").addClass("recipe_event");
	if(active)
		$comment.addClass("active");

	var altText = "Hier klicken um diese Version zu öffnen";
	var $comment_headline = $("<div></div>").addClass("comment_headline").append(parseDiscussionEvent(recipename, syntax, eingefuegt, versions_id, user.name));
	var $left = $("<a></a>").addClass("left").attr({
		href : Recipe.getURI(recipename) + "/" + versions_id,
		title : altText
	}).append($comment_headline);

	var $text = $("<div></div>").addClass("comment_text").text(text);

	var $like = $("<div></div>").addClass("comment_like").append("<div class=\"like\"></div>").append("<div class=\"like_nr\">" + likes + "</div>");
	var $hiddeninput = $("<input />").attr({
		type : "hidden",
		value : id
	}).addClass("comment_id");

	var $right = $("<div></div>").addClass("right").append($like);

	var $rightbackground = $("<div></div>").addClass("rightbackground");

	$comment.append($left).append($text).append($hiddeninput).append($right).append($rightbackground);
	$li.append($comment).append("<ul></ul>");

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
	if($ul.children(".child_comment").length == 0) {

		$ul.append("<li class='child_comment'><a href='#'><img src='" + user.image + "'/></a><div class='comment_arrow_answer'></div><div class='recipe_comment_answer'><input type=\"hidden\" value=\"" + id + "\"/><textarea></textarea><div class='answer_info'>mit Enter abschicken</div><div></li>");
		$ul.find("textarea").last().autoGrow().keydown(childComment).focus();

		var $comment = $ul.children(".child_comment");

		$comment.find(".comment_btn").click(childComment);
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
	}
}

function comment(event) {
	//var gericht = $.address.pathNames()[1];
	var text = $(this).prev().children().val();
	if(text != "") {
		$.ajax({
			url : "/anycook/Discuss",
			data : "comment=" + text + "&gericht=" + encodeURIComponent(recipe.name)
		});
		//window.clearTimeout(commenttimeout);
		//checkNewDiscussion();

	}
}

function childComment(event) {

	if(event.which == 13) {
		var $this = $(this);
		var pid = $this.siblings("input").val();
		var text = $this.val();
		if(text != "") {
			$.ajax({
				url : "/anycook/Discuss",
				data : "comment=" + text + "&gericht=" + encodeURIComponent(recipe.name) + "&pid=" + pid
			});
			$this.parents(".child_comment").remove();

			//window.clearTimeout(commenttimeout);
			//checkNewDiscussion();
		}
		return false;
	}

}

// lalalalaa
function loadNewDiscussion(ul, pid, oldmaxID) {
	$.ajax({
		url : "/anycook/GetDiscussion",
		data : "gericht=" + encodeURIComponent(recipe.name) + "&pid=" + pid + "&maxid=" + oldmaxID,
		dataType : "json",
		success : function(json) {
			for(var i in json) {

				var login = user.checkLogin();
				maxID = Math.max(maxID, Number(json[i].id));
				var image;
				var arrow = "comment_arrow";
				var comment = "recipe_comment";
				if(pid == -1) {
					image = json[i].image;
				} else {
					image = json[i].image;
					arrow += "_small";
					comment += "_small";
				}

				var likes = json[i].likes;
				var likeclass = "";
				if(Number(likes) > 0) {
					likes = "+" + likes;
					likeclass = "plus";
				} else if(Number(likes) < 0)
					likeclass = "minus";

				var datetime = getDateString(json[i].eingefuegt);
				var linktext = encodeURI("/#!/profile/" + json[i].user.id);
				var litext = "<li><a href=\"" + linktext + "\"><img src='" + image + "'/></a><div class='" + arrow + "'></div><div class='" + comment + "'><div class='comment_headline'>" + "<a href=\"" + linktext + "\">" + json[i].user.name + "</a> schrieb " + datetime + "</div><div class='comment_number'>#" + (Number(json[i].id) + 1) + "</div><div class='comment_text'>" + json[i].text + "</div><div class='comment_footer'>";
				if(login)
					litext += "<a class='answer_btn'>antworten</a>";
				litext += "<div class='comment_like'><div class='like'></div><div class='like_nr " + likeclass + "'>" + likes + "</div><div class='dislike'></div></div></div></div>";
				if(pid == -1)
					litext += "<ul></ul>";
				litext += "</li>";
				$(ul).append(litext);

				var newcomment = $(ul).children("li").last();
				var height = newcomment.height();
				//var newMarginTop = 0 - newcomment.outerHeight();
				newcomment.css({
					'height' : 0,
					'opacity' : 0
				});
				newcomment.animate({
					'height' : height
				}, {
					complete : function() {
						newcomment.animate({
							opacity : 1
						});
						newcomment.css("height", "");
					}
				});

			}
			if(pid == -1)
				$(ul).children("li:odd").addClass("odd");
		}
	});
}

function discussionLike(event) {
	var $this = $(this);
	var id = $this.parents("li").find(".comment_id").val();

	$.ajax({
		url : "/anycook/LikeDislike",
		data : "id=" + id + "&gericht=" + encodeURIComponent(recipe.name),
		success : function(response) {
			if(response != "false") {
				var $like_nr = $this.siblings(".like_nr");
				$like_nr.removeClass("plus").removeClass("minus");
				if(Number(response) > 0) {
					response = "+" + response;
					$like_nr.addClass("plus");
				}

				$like_nr.text(response);
			}
		},
		error : function(response) {
			console.error(response.responseText);
		}
	});
}

var maxID = -1;
var recipe = null;