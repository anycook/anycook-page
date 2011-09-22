function getSmallFrameText(json){
	//var maxlength = 120;
	var beschreibung = json.description;
	/*if(beschreibung.length > maxlength){
		for(var i = maxlength-1; i>=0; i--)
			if(beschreibung[i] == " "){
				beschreibung = beschreibung.substring(0, i+1)+"...";
				break;
		}
	}*/
	
	var std = json.timestd;
	if(std.length==1)
		std="0"+std;
	
	var min = json.timemin;
	if(min.length==1)
		min="0"+min;
	var appendtext = "<div class='rezept_bild'>" +
			"<img src='http://graph.anycook.de/recipe/"+json.name+"/image?type=small'/>" +
			"<div class='time_gericht'>" +
				"<div class='time_corner_left'></div>" +
				"<div class='time_gericht_mid'>"+std+":"+min+" h</div>" +
				"<div class='time_corner_right'></div></div></div>" +
			"<h5>"+json.name+"</h5><p>"+beschreibung+"</p>";
	return appendtext;
}

function setSmallFrameText(container){
	var p = container.find("p");
	var h5 = container.find("h5");
	
	var h5height = h5.css("height");
	h5height = Number(h5height.substring(0, h5height.length-2));
	var pheight = p.css("height");
	pheight = Number(pheight.substring(0, pheight.length-2));
	
	var heightsum = h5height+pheight+3;
	if(heightsum>110){
		p.css("height", pheight-(heightsum-110));
	}	
}


function getBigFrameText(json){
	var beschreibung = json.description;
	
	var uri = encodeURI("/#!/recipe/"+json.name);
	var frame_big = $("<a></a>")
		.addClass("frame_big")
		.attr("href", uri)
		.append("<div></div>");
		
	frame_big.append("<div></div>").children("div").last()
		.addClass("frame_big_left");
		
	
		
	
	var frame_big_main = frame_big.append("<div></div>").children("div").last()
		.addClass("frame_big_main");
		
	var recipe_img = frame_big_main.append("<div></div>").children("div").last()
		.addClass("recipe_img")
		.append("<img/>")
		.append("<div></div>");
		
	recipe_img.children("img")
		.attr("src", "http://graph.anycook.de/recipe/"+json.name+"/image?type=small");
		
	var std = json.timestd;
	if(std.length==1)
		std="0"+std;
	
	var min = json.timemin;
	if(min.length==1)
		min="0"+min;
	
	recipe_img.children("div")
		.addClass("recipe_time")
		.text(std+":"+min+" h");
		
		
	var recipe_text = frame_big_main.append("<div></div>").children("div").last()
		.addClass("recipe_text");
	
	recipe_text.append("<h3></h3>").children("h3").text(json.name);
	recipe_text.append("<p></p>").children("p").text(beschreibung);
	
	var heart = frame_big_main.append("<div></div>").children("div").last()
		.addClass("heart");
		
	if(json.schmeckt)
		heart.addClass("schmeckt");
		
	frame_big_main.append("<div></div>").children("div").last()
		.addClass("schmeckt_num").text(json.schmecktNum);
	
	frame_big.append("<div></div>").children("div").last()
		.addClass("frame_big_right");
		
	
	return frame_big;
}

var personen;

function loadRecipewJSON(json){
	recipe = new Recipe();
	recipe.loadJSON(json);
	loadRecipe(recipe);
}

function loadRecipe(recipe){
	resetFilter();
	
	var rezepturi = recipe.getURI();
	$("#content_header").empty()
		.append(getHeaderLink("Rezept", rezepturi, "recipe_btn"))
		.append(getHeaderLink("Diskussion", rezepturi+"?page=discussion", "discussion_btn"));
	
	
	personen = Number(recipe.personen);
	if(personen>1)
		$("#zutat_head").html("Zutaten für <input type='text' id='person_number' value='"+recipe.personen+"' size='2' maxlength='2' /> Personen:");
	else
		$("#zutat_head").html("Zutaten für <input type='text' id='person_number' value='"+recipe.personen+"' size='2' maxlength='2' /> Person:");
	
	$("#person_number").click(function(){$("#person_number").val('');});
	var persCount = null;
	$("#person_number").bind('keypress', function(e){
		var inputString = String.fromCharCode(e.charCode);
		var cleanString =inputString.match(/[0-9]+/); 
		if(e.keyCode==13){
			persCount = $("#person_number").val();
			multiZutaten(persCount);
			$("#person_number").blur();
		}
		else if(cleanString == null) return false;
		
	});
	
	$("#person_number").focusout(function(){
		if($("#person_number").val()==''){
			if(persCount == null) $("#person_number").val(personen);
			else $("#person_number").val(persCount);
		}
		else{
			persCount = $("#person_number").val();
			multiZutaten(persCount);
		}
			
	});
	
	$("#filter_headline").text("Status");
	
    $("#kategorie_filter_name").text(recipe.kategorie);
    $("#recipe_headline").append(recipe.name);
    $("#introduction").append(recipe.beschreibung);
    
    
    //recipe_image
    $("#recipe_image").attr("src", "/gerichtebilder/big/"+recipe.imagename);
    
    
    
    	
	var steps = recipe.schritte;
	for(var j = 0; j<steps.length; j++){
		$("#step_container").append('<div class="step"><div class="step_left"><div class="step_number">'+(j+1)+'.</div><div class="step_text">'+steps[j]+'</div></div><div class="step_right"></div></div>');
		var step = $(".step_left:last");
		var stepheight = step.css("height");
		var heighttext = step.children(".step_text").css("height");
		var newMargin = (parseInt(stepheight.substring(0, stepheight.length-2))-parseInt(heighttext.substring(0, heighttext.length-2)))/2;
		step.children(".step_text").css("margin-top", newMargin);
	
	}
	
	//$("#search").attr("value", recipe.name);
	$("#time_std, #time_min").attr("readonly", "readonly");
	$("#time_std").val(fillStd(recipe.std));
	$("#time_min").val(fillMin(recipe.min));
	
	$("#zutaten_table > *").remove();
	for(var zutat in recipe.zutaten){
		var menge = recipe.zutaten[zutat].menge;
		var singular = recipe.zutaten[zutat].singular;
		if(singular != null &&getValuefromString(menge) == 1)
			zutat = singular;
		
		$("#zutaten_table").append("<tr><td class='zutaten_table_left'>"+zutat+"</td><td class='zutaten_table_right'>"+menge+"</td></tr>");
	}
	
	$(".tags_table_right > *").remove();
	var tags = recipe.tags;
	for(var i = 0; i<tags.length; i++)
		$(".tags_table_right").append(getTag(tags[i], "link"));

	
	checkOn("#chef_"+recipe.skill);
	checkOn("#muffin_"+recipe.kalorien);
	handleRadios(".label_stars, .label_chefhats, .label_muffins");
	blockFilter(true);
	
	//schmeckt-button
	if(user.checkLogin()){
		if(schmecktChecker(recipe.name)){
			$("#schmecktmir").click(schmecktmir);	
		}else{
			$("#schmecktmir").addClass("on");
			$("#schmecktmir").click(schmecktmirnicht);
		}
	}
	
	$.address.title(recipe.name+" | anycook");
	
	if($.address.pathNames().length == 3 && user.level > 0){
		addEditingHandler();
	}
	
	
	//Autoren
	var num_autoren = recipe.usernames.length;
	var $autoren = $("#autoren span");
	
	for(var autor in recipe.usernames){
		var autorname = recipe.usernames[autor];
		$autoren.append("<a href='#!/profile/"+encodeURI(autorname)+"'>"
				+autorname+"</a>");
		if(autor <= num_autoren-3)
			$autoren.append(", ");
		if(autor == num_autoren-2)
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
	
	$("#print").click(function(){
		window.print();
	});
}

function showShare(){
	var recipeURI = recipe.getURI()
	var $this = $(this).unbind("click", showShare);
	$this.children(".img").hide();
	var $left = $this.children(".left").empty();
	
	$left.append("<div id=\"fb\"><fb:like colorscheme=\"dark\" width=\"80\" font=\"verdana\" action=\"like\" layout=\"button_count\"></fb:like></div>");
	
	var anycookuricomponent = encodeURIComponent("http://anycook.de/"+recipeURI);
	var twittertarget = "https://twitter.com/share?url="+anycookuricomponent+"";
	$left.append("<div id=\"twitter\"></div>").children("div").last()
		.append("<a href=\""+twittertarget+"\" target=\"_blank\"><span></span></a>");
		
	$left.append("<div id=\"gplus\"></div>").children("div").last()
		.append("<g:plusone size=\"small\" count=\"false\" href=\"http://anycook.de/"+recipeURI+"\"></g:plusone>");
		
		
	$left.children("div").addClass("share_container");
		
	$("#twitter").click(function(){
		window.open(twittertarget, 'child', 'height=420,width=550');
		return false;
	});
		
	FB.XFBML.parse(document.getElementById('share'));
	gapi.plusone.go();
	
	
	
	$this.addClass("on");
	
	$("body").click(function(event){
		
		if($(event.target).parents().andSelf().is("#share"))
			return;
			
		
		$this.removeClass("on").children(".img").show();
		
		$left.empty()
			.text("teilen");
			
		$(this).unbind("click");
		$this.click(showShare);
	});
	// $(".connect_widget_summary").remove();
}

function showaddTags(){
	
	//TODO show signin
	if(!user.checkLogin())
		return;
		
	
	var $main = $("#main").append("<div id=\"recipetags\"></div>");
	
	var tagsPosition = $("#tags").offset();
	
	
	var $tagcontainer = $main.children("div").last()
		.append("<div id=\"dogear\"></div>")
		.append("<div id=\"taglayer\"></div>")
		.append("<div id=\"lightbox\"></div>");
		
		
	var $lightboxform = $tagcontainer.children("#lightbox")
		.append("<form id=\"recipe_tag_form\"></form>").children("form")
		.append("<h2>Tags hinzufügen:</h2>")
		.append("<p>Hilf den anderen beim finden, in dem du neue Tags vorschlägst.</p>")
		.append("<div class=\"tagsbox\"></div>")
		.append("<p>Die bekanntesten Tags:</p>")
		.append("<div id=\"tagcloud\"></div>")
		.append("<input type=\"submit\" value=\"einreichen\"/>");
	
	makeTagCloud();
	
	$lightboxform.children(".tagsbox").click(makeNewTagInput);
		
	var $container = $("#container");
	var containerposition = $container.offset();
	var left = containerposition.left + $container.innerWidth() + 9 - $tagcontainer.innerWidth();
	
	$tagcontainer.css({top:tagsPosition.top-113, left:left});
		
	var $dogear = $("#dogear").append("<div id=\"top\"></div>")
		.append("<div id=\"bottom\"></div>")
		.append("<div id=\"middle\"></div>");
		
	$dogear.animate({
		right:0,
		top:0
	},
	{
		duration:150,
		easing: "swing",
		complete:function(){
			$("#lightbox").animate({
				left: 3
			}, {duration: 500});
		}
	});
		
	$("body").click(function(event){
		
		if($(event.target).parents().andSelf().is("#recipetags"))
			return;
			
		$tagcontainer.fadeOut(200, function(){
			$tagcontainer.remove();
		});
		
		$(this).unbind("click");
	});
	
	$("#recipe_tag_form").submit(submitSuggestTags);
	
	return false;
}

function hideaddTags(){
	$("#recipetags").fadeOut(200, function(){
			$tagcontainer.remove();
		});
}

zutatValues = new Array();

function multiZutaten(perscount){
	
	$("td.zutaten_table_right").each(function(i){
		var newValue = '';
		if(zutatValues[i] == null){
			zutatValues[i] = $(this).text();
			newValue = getNumbersFromString($(this).text(), perscount);			
		}
		else{
			newValue =  getNumbersFromString(zutatValues[i], perscount);
		}
		
		var zutat = recipe.getZutatOnPosition(i);
		//var currentzutattext = $(this).prev().text();
		if(zutat.singular != null){
			if(getValuefromString(newValue) == 1){
				$(this).prev().text(zutat.singular);
			}else
				$(this).prev().text(zutat.name);
		}
		$(this).text(newValue);
	});
	
}

function getNumbersFromString(inputstring, factor)
{
	var beginString = "";
	var valueFromString = "";
	var restString = "";
	
	var postProc = false;
	var i = null;
	
	for(var n=0; n<inputstring.length; n++){
		i = inputstring.substring(n,n+1);
		if(i=="1"||i=="2"||i=="3"||i=="4"||i=="5"||i=="6"||i=="7"||i=="8"||i=="9"||i=="0"){
			valueFromString += i;
			for(var m=n+1; m<inputstring.length; m++){
				i = inputstring.substring(m,m+1);
				if(i=="1"||i=="2"||i=="3"||i=="4"||i=="5"||i=="6"||i=="7"||i=="8"||i=="9"||i=="0")
					valueFromString += i;
				else if(i==","||i=="."){
					valueFromString += ".";
				}
				else if(i=="-"||i=="/"){
					valueFromString += i;
					postProc= true;
				}
				else{
					restString += inputstring.substring(m,inputstring.length);
					break;
					}
				}
			break;
			}
		else
			beginString += i;
		}			
		
	factor = factor / personen;
	if(beginString.length == inputstring.length)
		return beginString;
	if(postProc)
		return beginString + postProcessString(valueFromString, factor).toString().replace(".",",") + restString;
	var finalValue = parseFloat(valueFromString)*factor;
	return beginString+handleTrailingNumbers(finalValue).toString().replace(".",",")+restString;
	
}

function getValuefromString(inputstring){
	var valueFromString = "";
	for(var n=0; n<inputstring.length; n++){
		var i = inputstring.substring(n,n+1);
		if(i=="1"||i=="2"||i=="3"||i=="4"||i=="5"||i=="6"||i=="7"||i=="8"||i=="9"||i=="0"){
			valueFromString += i;
			for(var m=n+1; m<inputstring.length; m++){
				var i = inputstring.substring(m,m+1);
				if(i=="1"||i=="2"||i=="3"||i=="4"||i=="5"||i=="6"||i=="7"||i=="8"||i=="9"||i=="0")
					valueFromString += i;
				else if(i==","||i=="."){
					valueFromString += ".";
				}
				else if(i=="-"||i=="/"){
					valueFromString += i;
				}
				else{
					break;
				}
			}
			break;
		}
	}
	return Number(valueFromString);
}


function handleTrailingNumbers(string){
	var count = 0;
	string = string.toString();
	for(var n=0; n<string.length; n++){
		var i = string.substring(n,n+1);
		if(i==".") count=string.substring(n+1,string.length).length;
	}
	if(count < 2)
		return parseFloat(string);
	return parseFloat(string).toFixed(2);
}

function postProcessString(string, factor){
	var first = "";
	var delimiter = "";
	var second = "";
	var trail = false;
	for(var n=0; n<string.length; n++){
		var i = string.substring(n,n+1);
		
		if(i=="-" || i == "/"){
				delimiter=i;
				trail=true;
			}
		else if(trail)
			second +=i;
		else
			first +=i;
		}
	if(delimiter == "-"){
		var mean = (parseInt(first) + parseInt(second)) / 2;
		return handleTrailingNumbers((mean*factor).toString());
	}
	if(delimiter == "/"){
		var quotient = parseInt(first) / parseInt(second);
		return handleTrailingNumbers((quotient*factor).toString());
	}
		
}

function loadDiscussion(){
	var login = user.checkLogin();
	$("#discussion_headline").html("Diskussion zum Rezept<br/>"+recipe.name);
	
	$.ajax({
		url:"/anycook/GetDiscussion",
		data:"gericht="+encodeURIComponent(recipe.name),
		dataType:"json",
		success:function(json){
			if(json.length == 0){
				$("#comment_discussion").html("<div class='no_discussion'>Zu diesem Rezept existiert noch keine Diskussion.<br/>Mach doch den Anfang!</div>");
			}else{
				$("#comment_discussion").append("<ul></ul>");			
				for(var i in json){
					maxID = Math.max(maxID, Number(json[i].id));
					var likes = json[i].likes;
					var likeclass = "";
					if(Number(likes)>0){
						likes = "+"+likes;
						likeclass = "plus";
					}
					else if(Number(likes)<0)
						likeclass = "minus";
					var datetime = getDateString(json[i].eingefuegt);
					var linktext = encodeURI("/#!/profile/"+json[i].nickname);
					var litext = "<li><a href=\""+linktext+"\"><img src='"+json[i].image+
						"'/></a><div class='comment_arrow'></div><div class='recipe_comment'><div class='comment_headline'>" +
						"<a href=\""+linktext+"\">"+json[i].nickname+"</a> schrieb "+datetime+"</div><div class='comment_number'>#"+(Number(json[i].id)+1)+
						"</div><div class='comment_text'>"+json[i].text+"</div><div class='comment_footer'>";
					
					if(login)
						litext+= "<a class='answer_btn'>antworten</a>";
					
					litext+="<div class='comment_like'><div class='like'></div><div class='like_nr "+likeclass+"'>"+likes+"</div><div class='dislike'></div></div></div></div><ul></ul></li>";
					$("#comment_discussion > ul").append(litext);
					loadChildren(i, json[i].id, login);					
				}
				$("#comment_discussion > ul > li:odd").addClass("odd");
				
			}
		}
	});
	
	if(login){
		$("#discussion_footer").html("<h6 id='yes_comment'>Was meinst du dazu?</h6>" +
				"<img src='"+user.image+"'/><div class='comment_arrow'></div><div class='recipe_comment'><textarea></textarea><div class='comment_btn'>Abschicken</div></div>");
		$(".comment_btn").click(comment);
		$(".answer_btn").live("click", answerBtnClick);
		$(".like, .dislike").live("click", discussionLike);
	}else{
		$("#discussion_footer").html("<h6 id='no_comment'>Log dich ein und diskutiere mit!</h6>");
		$("#no_comment").click(clickSignin);
	}
	
	window.setTimeout(checkNewDiscussion, 5000);
	//commenttimeout = window.setTimeout(checkNewDiscussion, 5000);	
}

function loadChildren(i, id, login){
	$.ajax({
		url:"/anycook/GetDiscussion",
		data:"gericht="+encodeURIComponent(recipe.name)+"&pid="+id,
		dataType:"json",
		success:function(childjson){
			if(childjson.length>0){
				var ul = $("#comment_discussion > ul > li > ul")[i];
				for(var j in childjson){
					maxID = Math.max(maxID, Number(childjson[j].id));
					var childdatetime = getDateString(childjson[j].eingefuegt);
					var likes = childjson[j].likes;
					var likeclass = "";
					if(Number(likes)>0){
						likes = "+"+likes;
						likeclass = "plus";
					}
					else if(Number(likes)<0)
					likeclass = "minus";
					var linktext = encodeURI("/#!/profile/"+childjson[j].nickname);
					var childlitext = "<li><a href=\""+linktext+"\"><img src='"+childjson[j].image+"'/></a>" +
							"<div class='comment_arrow_small'></div><div class='recipe_comment_small'><div class='comment_headline'>" +
							"<a href=\""+linktext+"\">"+childjson[j].nickname+"</a> schrieb "+childdatetime+"</div><div class='comment_number'>#"+(Number(childjson[j].id)+1)+
					"</div><div class='comment_text'>"+childjson[j].text+"</div><div class='comment_footer'>";
					if(login)
						childlitext += "<a class='answer_btn'>antworten</a>";
					
					childlitext+= "<div class='comment_like'><div class='like'></div><div class='like_nr "+likeclass+"'>"+likes+"</div><div class='dislike'></div></div></div></div></li>";
					$(ul).append(childlitext);
				}
				
				//$(ul).children(":odd").addClass("odd");
			}
		}
	});
}

function answerBtnClick(event){
	var target = $(event.target);
	var container = target.parents(".recipe_comment");
	var ul = $(container).siblings("ul");
	if(ul.length == 0)
		ul = target.closest("ul");
	if($(ul).children(".child_comment").length == 0){
		$(ul).append("<li class='child_comment'><a href='#'><img src='"+user.image+"'/></a><div class='comment_arrow_answer'></div><div class='recipe_comment_answer'><textarea></textarea><div class='comment_btn'>Abschicken</div><div></li>");
		var comment = $(ul).children(".child_comment");
		comment.find(".comment_btn").click(childComment);
		var commentoffset = comment.offset();
		var commentheight = comment.height();
		var windowheight = $(window).height();
		var scrollTop = $(document).scrollTop();
		if(scrollTop+windowheight < commentoffset.top){
			$("body").animate({scrollTop : commentoffset.top+commentheight-windowheight+5}, {duration:700, easing:"easeInOutQuart"});
		}
	}else{
		$(ul).children(".child_comment").remove();
	}
}

function comment(event){
	var target = event.target;
	var text = $(target).prev().val();
	//var gericht = $.address.pathNames()[1];
	if(text!=""){
		$.ajax({
			url:"/anycook/Discuss",
			data: "comment="+text+"&gericht="+encodeURIComponent(recipe.name)
		});
		$(target).prev().val("");
		//window.clearTimeout(commenttimeout);
		//checkNewDiscussion();
		
	}
}

function childComment(event){
	var target = $(event.target);
	var ul = target.parents("ul").first();
	var tempid =$(ul).siblings(".recipe_comment").find(".comment_number").text();
	var pid = Number(tempid.substring(1, tempid.length))-1;
	var text = target.prev().val();
	if(text!=""){
		$.ajax({
			url:"/anycook/Discuss",
			data: "comment="+text+"&gericht="+encodeURIComponent(recipe.name)+"&pid="+pid
		});
		target.parents(".child_comment").remove();
		
		//window.clearTimeout(commenttimeout);
		//checkNewDiscussion();
	}
	
	
}

function checkNewDiscussion(){
	if($.address.pathNames()[0] == "recipe"){
		$.ajax({
			url:"/anycook/CheckforNewDiscussion",
			data:"gericht="+encodeURIComponent(recipe.name)+"&maxid="+maxID,
			success:function(response){
				if(response =="true"){
					if($(".no_discussion").length > 0){
						$(".no_discussion").remove();
						$("#comment_discussion").append("<ul></ul>");
					}				
					var uls = $("#comment_discussion ul");
					var oldmaxID = maxID;
					for (var i = 0; i < uls.length; ++i){
						var ul = uls[i];
						var tempid = $(ul).siblings(".recipe_comment").children(".comment_number").text();
						var id = Number(tempid.substring(1, tempid.length))-1;
						loadNewDiscussion(ul, id, oldmaxID);
					}
				}
				window.setTimeout(checkNewDiscussion, 2000);
				
			}
		});	
	}
}

// lalalalaa
function loadNewDiscussion(ul, pid, oldmaxID){
	$.ajax({
		url:"/anycook/GetDiscussion",
		data:"gericht="+encodeURIComponent(recipe.name)+"&pid="+pid+"&maxid="+oldmaxID,
		dataType:"json",
		success:function(json){
			for(var i in json){
				
				var login = user.checkLogin();
				maxID = Math.max(maxID, Number(json[i].id));
				var image;
				var arrow = "comment_arrow";
				var comment = "recipe_comment";
				if(pid==-1){
					image = json[i].image;					
				}else{
					image = json[i].image;
					arrow+="_small";
					comment+="_small";
				}
				
				var likes = json[i].likes;
				var likeclass = "";
				if(Number(likes)>0){
					likes = "+"+likes;
					likeclass = "plus";
				}
				else if(Number(likes)<0)
					likeclass = "minus";
				
				var datetime = getDateString(json[i].eingefuegt);
				var linktext = encodeURI("/#!/profile/"+json[i].nickname);
				var litext = "<li><a href=\""+linktext+"\"><img src='"+image+
					"'/></a><div class='"+arrow+"'></div><div class='"+comment+"'><div class='comment_headline'>" +
							"<a href=\""+linktext+"\">"+json[i].nickname+"</a> schrieb "+datetime+"</div><div class='comment_number'>#"+(Number(json[i].id)+1)+
					"</div><div class='comment_text'>"+json[i].text+"</div><div class='comment_footer'>";
				if(login)
					litext+="<a class='answer_btn'>antworten</a>";
				
				litext+= "<div class='comment_like'><div class='like'></div><div class='like_nr "+likeclass+"'>"+likes+"</div><div class='dislike'></div></div></div></div>";
				if(pid==-1)
					litext+= "<ul></ul>";
				
				
				litext+="</li>";
				$(ul).append(litext);
				
				var newcomment = $(ul).children("li").last();
				var height = newcomment.height();
				//var newMarginTop = 0 - newcomment.outerHeight();
				newcomment.css({'height': 0, 'opacity': 0});
				newcomment.animate({'height': height},{complete:function(){
					newcomment.animate({opacity: 1});
					newcomment.css("height", "");
				}});
				
				
			}
			if(pid==-1)
				$(ul).children("li:odd").addClass("odd");
		}
		});
}

function discussionLike(event){
	var target = $(event.target);
	var tempid = target.parents(".comment_footer").siblings(".comment_number").text();
	var id = Number(tempid.substring(1, tempid.length))-1;
	var like = "&like";
	if(target.hasClass("dislike"))
		like = "";
	
	$.ajax({
		url:"/anycook/LikeDislike",
		data:"id="+id+"&gericht="+encodeURIComponent(recipe.name)+like,
		success:function(response){
			if(response != "false"){
				var like_nr = target.siblings(".like_nr");
				like_nr.removeClass("plus").removeClass("minus");
				if(Number(response)>0){
					response = "+"+response;
					like_nr.addClass("plus");
				}else if(Number(response)<0){
					like_nr.addClass("minus");
				}
				
				
				like_nr.text(response);					
			}
		}
	});
}



var maxID = -1;
var recipe = null;
//var commenttimeout;
