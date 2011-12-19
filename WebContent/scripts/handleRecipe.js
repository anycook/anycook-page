function getBigFrameText(json) {
	var beschreibung = json.description;

	var uri = encodeURI("/#!/recipe/" + json.name);
	var frame_big = $("<a></a>").addClass("frame_big").attr("href", uri).append("<div></div>");

	frame_big.append("<div></div>").children("div").last().addClass("frame_big_left");

	var frame_big_main = frame_big.append("<div></div>").children("div").last().addClass("frame_big_main");

	var recipe_img = frame_big_main.append("<div></div>").children("div").last().addClass("recipe_img").append("<img/>").append("<div></div>");

	recipe_img.children("img").attr("src", Recipe.getImageURL(json.name));

	if(json.timemin && json.timestd){
		var std = json.timestd;
		if(std.length == 1)
			std = "0" + std;
	
		var min = json.timemin;
		if(min.length == 1)
			min = "0" + min;
	
		recipe_img.children("div").addClass("recipe_time").text(std + ":" + min + " h");
	
	}

	var recipe_text = frame_big_main.append("<div></div>").children("div").last().addClass("recipe_text");

	recipe_text.append("<h3></h3>").children("h3").text(json.name);
	recipe_text.append("<p></p>").children("p").text(beschreibung);

	var heart = frame_big_main.append("<div></div>").children("div").last().addClass("heart");

	if($.inArray(json.name, user.schmeckt)>=0)
		heart.addClass("schmeckt");

	if(json.schmecktNum!== undefined)
		rame_big_main.append("<div></div>").children("div").last().addClass("schmeckt_num").text(json.schmecktNum);

	frame_big.append("<div></div>").children("div").last().addClass("frame_big_right");

	return frame_big;
}

function profileRecipe(recipename){
	var uri = "#!/recipe/"+encodeURIComponent(recipename);
	
	var $img = $("<img/>").attr("src", $.anycook.graph.recipeImagePath(recipename));
	var $div =$("<div></div>").append("<span>"+recipename+"</span>");
	
	var $link = $("<a></a>").addClass("profile_rezept_bild").attr("href", uri)
		.append($img)
		.append($div);
	return $link;
}

function loadRecipewJSON(json) {
	recipe = Recipe.loadJSON(json);
	loadRecipe(recipe);
}

function loadRecipe(recipe) {
	resetFilter();

	var rezepturi = recipe.getURI();
	$("#content_header #recipe_btn").attr("href", rezepturi);
	$("#content_header #discussion_btn").attr("href", rezepturi + "?page=discussion");

	$("#recipe_headline").append(recipe.name);
	$("#introduction").append(recipe.beschreibung);

	//recipe_image
	$(".recipe_image").attr("src", recipe.getImageURL("large"));

	var steps = recipe.steps;
	loadSteps(steps);
	loadFilter(recipe);
	//$("#search").attr("value", recipe.name);

	//schmeckt-button
	if(user.checkLogin()) {
		if(schmecktChecker(recipe.name)) {
			$("#schmecktmir").click(schmecktmir);
		} else {
			$("#schmecktmir").addClass("on");
			$("#schmecktmir").click(schmecktmirnicht);
		}
	}

	$.address.title(recipe.name + " | anycook");

	// if($.address.pathNames().length == 3 && user.level > 0){
	// addEditingHandler();
	// }

	//Autoren
	var num_autoren = recipe.authors.length;
	var $autoren = $("#autoren span");

	for(var i in recipe.authors) {
		var author = recipe.authors[i];
		$autoren.append("<a href='#!/profile/" + author.id + "'>" + author.name + "</a>");
		if(i <= num_autoren - 3)
			$autoren.append(", ");
		if(i == num_autoren - 2)
			$autoren.append(" und ");
	}

	//bezeichner
	//$("#zubereitung").addClass("on");
	//$("#zubereitung").attr("href", "#!/recipe/"+encodeURI(recipe.name));
	//$("#addtags").attr("href", "#!/recipe/"+encodeURI(recipe.name)+"?page=addtags");
	//$("#zubereitung").click(showZubereitung);
	//$("#addtags").click(showaddTags);

	//icons
	$("#share").click(showShare);
	$("#tags").click(showaddTags);

	$("#print").click(function() {
		window.print();
	});
	//addtagsbox
	makeAddTags();

	//version
	if($.address.pathNames().length == 3) {
		showVersionInfo(recipe);
	}

	//discussion
	$(".center_headline").html("Diskussion zum Rezept<br/>" + recipe.name);

	$.ajax({
		url : "/anycook/GetDiscussion",
		data : "gericht=" + encodeURIComponent(recipe.name),
		dataType : "json",
		success : function(json) {
			if(json.length == 0) {
				$("#comment_discussion").html("<div class='no_discussion'>Zu diesem Rezept existiert noch keine Diskussion.<br/>Mach doch den Anfang!</div>");
			} else {
				var $ul = $("#comment_discussion").append("<ul></ul>").children("ul");
				for(var i in json) {
					maxID = Math.max(maxID, Number(json[i].id));
					var $li;
					if(json[i].syntax == null)
						$li = getDiscussionElement(false, json[i].text, json[i].user, json[i].likes, login, json[i].datetime, json[i].id);
					else
						$li = getDiscussionEvent(json[i].syntax, json[i].versions_id, json[i].text, json[i].user, json[i].likes, login, json[i].datetime, json[i].id);
					$ul.append($li);
					loadChildren(i, json[i].id, login);
				}
				$("#comment_discussion > ul > li.comment:odd").addClass("odd");
				centercommenteventlikes();

			}
		}
	});
	var login = user.checkLogin();
	if(login) {
		$("#discussion_footer .nologin").hide();
		$("#discussion_footer img").attr("src", user.getUserImagePath());
		$(".comment_btn").click(comment);
		$(".answer_btn").live("click", answerBtnClick);
		$(".like").live("click", discussionLike);
	} else {
		$("#discussion_footer .login").hide();
		$("#no_comment").click(clickSignin);
	}
}

function loadSteps(steps) {
	var $stepContainer = $("#step_container").empty();
	for(var j = 0; j < steps.length; j++) {
		var $step = getIngredientStep(steps[j]);
		$stepContainer.append($step);
		var stepheight = $step.children(".step").innerHeight();
		var $text = $step.find(".text");
		var newMargin = (stepheight - $text.height()) / 2;
		$text.css("marginTop", newMargin);
	}
	return true;
}

function loadFilter(filter) {
	
	$("#filter_headline").text("Legende");
	$("#filter_main").addClass("blocked");
	$("#kategorie_head").text(filter.category);
	
	$("#time_form > *").not(".time_text_end").hide();
	$("#time_form .time_text_end").text(fillStd(filter.time.std)+" : "+fillMin(filter.time.min)+" h");
	
	var persons = Number(filter.persons);

	makeIngredientHeaderForRecipe(persons);

	var $ingredientList = $("#ingredient_list").empty();
	for(var i in filter.ingredients) {
		var zutat = filter.ingredients[i].name;
		var menge = filter.ingredients[i].menge;
		var singular = filter.ingredients[i].singular;
		if(singular !== undefined && singular != null && getValuefromString(menge) == 1)
			zutat = singular;

		var $li = $("<li></li>").append("<div></div>").append("<div></div>");
		$li.children().first().addClass("ingredient").text(zutat);
		$li.children().last().addClass("amount").text(menge);
		$ingredientList.append($li);
	}
	
	if($ingredientList.children().length <6){
		var length = $ingredientList.children().length;
		for(var i = 0; i<= 6-length; i++){
			var $li = $("<li></li>");
			$ingredientList.append($li);
		}
	}

	var $tags_list = $(".tags_list").empty();
	var tags = filter.tags;
	for(var i = 0; i < tags.length; i++)
	$tags_list.append(getTag(tags[i], "link"));

	checkOn("#chef_" + filter.skill);
	checkOn("#muffin_" + filter.calorie);
	handleRadios("#filter_table .label_chefhats, #filter_table .label_muffins");
	//blockFilter(true);
}

function getIngredientStep(step) {
	//step-part
	var $left = $("<div></div>").addClass("left");
	var $number = $("<div></div>").addClass("number").text(step.id);
	var $numberContainer = $("<div></div>").addClass("number_container").append($number);

	var $text = $("<div></div>").addClass("text").text(step.text);
	var $mid = $("<div></div>").addClass("mid").append($numberContainer).append($text);

	var $right = $("<div></div>").addClass("right");
	var $step = $("<div></div>").addClass("step").append($left).append($mid).append($right);

	var $ingredientStep = $("<li></li>").addClass("ingredient_step").append($step);
	var ingredients = step.ingredients;

	//TODO testdaten
	// ingredients["Tomaten"] = "300g";
	// ingredients["Mehl"] = "500g";
	// ingredients["Knoblauch"] = "2 Zehen";
	// ingredients["Salz"] = "";

	var text = "";
	for(var i in ingredients) {
		if(ingredients[i].name.length == 0)
			continue;
		text += ingredients[i].menge + " " + ingredients[i].name + ", ";
	}
	text = text.substring(0, text.length - 2);

	if(text.length > 0) {
		var $ingredients = $("<div></div>").addClass("ingredients").text(text);
		$ingredientStep.append($ingredients);
	}

	//all

	return $ingredientStep;
}

function makeIngredientHeaderForRecipe(personNum) {
	var $zutatHead = $("#zutat_head").empty().append("<span>Zutaten für </span>");

	var $personsForm = $("<div></div>").addClass("numberinput persons").append("<input type=\"text\"></input><div class=\"up\"></div><div class=\"down\"></div>");
	var $input = $personsForm.children("input").first().attr({
		id : "persons_num",
		value : personNum,
		size : 2,
		maxlength : 2
	}).data("persons", personNum);

	var person = "<span>" + personNum == 1 ? "Person:" : "Personen:" + "</span>";
	$zutatHead.append($personsForm).append(person);

	var persCount = null;
	$input.keydown(function(e) {
		var $this = $(this);
		if(e.which == 13) {
			persCount = $this.val();
			multiZutaten(persCount);
			$this.blur();
		} else if(e.which == 38) {//up{
			personsUp();
			return false;
		} else if(e.which == 40) {//down
			personsDown();
			return false;
		} else if(!(event.which >= 48 && event.which <= 57) && !(event.which >= 96 && event.which <= 105) && event.which != 8 && event.which != 46)
			return false;

	});

	$personsForm.children(".up").click(personsUp);

	$personsForm.children(".down").click(personsDown);

}

function personsUp() {
	var $input = $("#persons_num");
	var currentNum = Number($input.val());
	var newNum = ((currentNum) % 99) + 1;
	$input.val(newNum);
	multiZutaten(newNum);
}

function personsDown() {
	var $input = $("#persons_num");
	var currentNum = Number($input.val());
	var newNum = ((99 - 2 + currentNum) % 99) + 1;
	$input.val(newNum);
	multiZutaten(newNum);
}

function showVersionInfo(recipe) {
	if($("#version_info").length == 0) {
		var $versionInfo = $("<div></div>").attr("id", "version_info").addClass("info");
		$versionInfo.append("<div class=\"left\"><div class=\"headline\"></div></div>").append("<div class=\"text\"></div>").append("<div class=\"right\"><a class=\"button\">Version bearbeiten</a></div>").append("<div class=\"rightbackground\"></div>");
		$("#recipe_container").prepend($versionInfo);
	}
	var $versionInfo = $("#version_info");
	$versionInfo.find(".right").show();
	$versionInfo.children(".left").width("auto");
	$versionInfo.find(".headline").text("Diese Version wurde " + getDateString(recipe.created) + " von " + recipe.usernames[0] + " erstellt.");
	$versionInfo.find(".button").attr("href", recipe.getURI() + "/" + recipe.id + "?page=edit");

	if(recipe.active)
		$versionInfo.addClass("active");

	$versionInfo.fadeIn(500);
}

function showShare() {
	var recipeURI = recipe.getURI();
	var $this = $(this).unbind("click", showShare);
	$this.children(".img").hide();
	var $left = $this.children(".left").empty();

	$left.append("<div id=\"fb\"><fb:like colorscheme=\"dark\" width=\"80\" font=\"verdana\" action=\"like\" layout=\"button_count\"></fb:like></div>");

	var anycookuricomponent = encodeURIComponent("http://anycook.de/" + recipeURI);
	var twittertarget = "https://twitter.com/share?url=" + anycookuricomponent + "";
	$left.append("<div id=\"twitter\"></div>").children("div").last().append("<a href=\"" + twittertarget + "\" target=\"_blank\"><span></span></a>");

	$left.append("<div id=\"gplus\"></div>").children("div").last().append("<g:plusone size=\"small\" count=\"false\" href=\"http://anycook.de/" + recipeURI + "\"></g:plusone>");

	$left.children("div").addClass("share_container");

	$("#twitter").click(function() {
		window.open(twittertarget, 'child', 'height=420,width=550');
		return false;
	});

	FB.XFBML.parse(document.getElementById('share'));
	gapi.plusone.go();

	$this.addClass("on");

	$("body").click(function(event) {

		if($(event.target).parents().andSelf().is("#share"))
			return;

		$this.removeClass("on").children(".img").show();

		$left.empty().text("teilen");

		$(this).unbind("click");
		$this.click(showShare);
	});
	// $(".connect_widget_summary").remove();
}

function showaddTags() {

	//TODO show signin
	if(!user.checkLogin())
		return;

	var $lightbox = $(".lightbox");

	var top = $("#tags").offset().top - 113;
	showLightbox($lightbox, top);

	$lightbox.find(".tagsbox").click(makeNewTagInput);

	$lightbox.find("form").submit(submitSuggestTags);

	return false;
}

function makeAddTags() {
	var $content = $("<div class=\"tagsbox\"></div>" + "<p>Die bekanntesten Tags:</p>" + "<div id=\"tagcloud\"></div>")

	var $lightbox = getLightbox("Tags hinzufügen:", "Hilf den anderen beim finden, in dem du neue Tags vorschlägst.", $content, "einreichen");
	makeTagCloud();
	$("#main").append($lightbox);
}

function hideaddTags() {
	// $("#recipetags").fadeOut(200, function(){
	// $tagcontainer.remove();
	// });
}

function multiZutaten(perscount) {

	$("#ingredient_list .amount").each(function(i) {
		var amount = $(this).data("amount");
		if(amount === undefined){
			amount = $(this).text();
			$(this).data("amount", amount);
		}
		var newValue = getNumbersFromString(amount, perscount);
		
		if(recipe!=null){
			var zutat = recipe.getZutatOnPosition(i);
			//var currentzutattext = $(this).prev().text();
			if(zutat.singular != null) {
				if(getValuefromString(newValue) == 1) {
					$(this).prev().text(zutat.singular);
				} else
					$(this).prev().text(zutat.name);
			}
		}
		$(this).text(newValue);
	});
}

function getNumbersFromString(inputstring, factor) {
	var beginString = "";
	var valueFromString = "";
	var restString = "";

	var postProc = false;
	var i = null;

	for(var n = 0; n < inputstring.length; n++) {
		i = inputstring.substring(n, n + 1);
		if(i.match(/\d/)) {
			valueFromString += i;
			for(var m = n + 1; m < inputstring.length; m++) {
				i = inputstring.substring(m, m + 1);
				if(i.match(/\d/))
					valueFromString += i;
				else if(i == "," || i == ".") {
					valueFromString += ".";
				} else if(i == "-" || i == "/") {
					valueFromString += i;
					postProc = true;
				} else {
					restString += inputstring.substring(m, inputstring.length);
					break;
				}
			}
			break;
		} else
			beginString += i;
	}
	factor = factor / $("#persons_num").data("persons");
	if(beginString.length == inputstring.length)
		return beginString;
	if(postProc)
		return beginString + postProcessString(valueFromString, factor).toString().replace(".", ",") + restString;
	var finalValue = parseFloat(valueFromString) * factor;
	return beginString + handleTrailingNumbers(finalValue).toString().replace(".", ",") + restString;

}

function getValuefromString(inputstring) {
	var valueFromString = "";
	for(var n = 0; n < inputstring.length; n++) {
		var i = inputstring.substring(n, n + 1);
		if(i == "1" || i == "2" || i == "3" || i == "4" || i == "5" || i == "6" || i == "7" || i == "8" || i == "9" || i == "0") {
			valueFromString += i;
			for(var m = n + 1; m < inputstring.length; m++) {
				var i = inputstring.substring(m, m + 1);
				if(i == "1" || i == "2" || i == "3" || i == "4" || i == "5" || i == "6" || i == "7" || i == "8" || i == "9" || i == "0")
					valueFromString += i;
				else if(i == "," || i == ".") {
					valueFromString += ".";
				} else if(i == "-" || i == "/") {
					valueFromString += i;
				} else {
					break;
				}
			}
			break;
		}
	}
	return Number(valueFromString);
}

function handleTrailingNumbers(string) {
	var count = 0;
	string = string.toString();
	for(var n = 0; n < string.length; n++) {
		var i = string.substring(n, n + 1);
		if(i == ".")
			count = string.substring(n + 1, string.length).length;
	}
	if(count < 2)
		return parseFloat(string);
	return parseFloat(string).toFixed(2);
}

function postProcessString(string, factor) {
	var first = "";
	var delimiter = "";
	var second = "";
	var trail = false;
	for(var n = 0; n < string.length; n++) {
		var i = string.substring(n, n + 1);

		if(i == "-" || i == "/") {
			delimiter = i;
			trail = true;
		} else if(trail)
			second += i;
		else
			first += i;
	}
	if(delimiter == "-") {
		var mean = (parseInt(first) + parseInt(second)) / 2;
		return handleTrailingNumbers((mean * factor).toString());
	}
	if(delimiter == "/") {
		var quotient = parseInt(first) / parseInt(second);
		return handleTrailingNumbers((quotient * factor).toString());
	}

}

function loadDiscussion() {
	window.setTimeout(checkNewDiscussion, 5000);
}

function loadChildren(i, id, login) {
	$.ajax({
		url : "/anycook/GetDiscussion",
		data : "gericht=" + encodeURIComponent(recipe.name) + "&pid=" + id,
		dataType : "json",
		success : function(childjson) {
			if(childjson.length > 0) {
				var $ul = $($("#comment_discussion > ul > li > ul")[i]);
				for(var j in childjson) {
					maxID = Math.max(maxID, Number(childjson[j].id));
					var $li = getDiscussionElement(true, childjson[j].text, childjson[j].user, childjson[j].likes, login, childjson[j].datetime, id);
					$ul.append($li);
				}

				//$(ul).children(":odd").addClass("odd");
			}
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

function getDiscussionEvent(syntax, versions_id, text, user, likes, login, eingefuegt, id) {
	//var datetime = getDateString(eingefuegt);
	var $li = $("<li></li>").addClass("event");

	if(Number(likes) > 0) {
		likes = "+" + likes;
	}

	var $comment = $("<div></div>").addClass("recipe_event");
	if(versions_id == recipe.id)
		$comment.addClass("active");

	var altText = "Hier klicken um diese Version zu öffnen";
	var $comment_headline = $("<div></div>").addClass("comment_headline").append(parseDiscussionEvent(syntax, eingefuegt, versions_id, user.name));
	var $left = $("<a></a>").addClass("left").attr({
		href : recipe.getURI() + "/" + versions_id,
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

function parseDiscussionEvent(syntax, eingefuegt, versions_id, nickname) {
	var text = syntax;
	var recipename = recipe.name;

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

function checkNewDiscussion() {
	if($.address.pathNames()[0] == "recipe") {
		$.ajax({
			url : "/anycook/CheckforNewDiscussion",
			data : "gericht=" + encodeURIComponent(recipe.name) + "&maxid=" + maxID,
			success : function(response) {
				if(response == "true") {
					if($(".no_discussion").length > 0) {
						$(".no_discussion").remove();
						$("#comment_discussion").append("<ul></ul>");
					}
					var uls = $("#comment_discussion ul");
					var oldmaxID = maxID;
					for(var i = 0; i < uls.length; ++i) {
						var ul = uls[i];
						var tempid = $(ul).siblings(".recipe_comment").children(".comment_number").text();
						var id = Number(tempid.substring(1, tempid.length)) - 1;
						loadNewDiscussion(ul, id, oldmaxID);
					}
				}
				window.setTimeout(checkNewDiscussion, 2000);

			}
		});
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
//var commenttimeout;