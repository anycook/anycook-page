function getSmallFrameText(json){
	var maxlength = 120;
	var beschreibung = json.beschreibung;
	if(beschreibung.length > maxlength){
		for(var i = maxlength-1; i>=0; i--)
			if(beschreibung[i] == " "){
				beschreibung = beschreibung.substring(0, i+1)+"...";
				break;
			}
	}
	
	var std = json.std;
	if(std.length==1)
		std="0"+std;
	
	var min = json.min;
	if(min.length==1)
		min="0"+min;
	var appendtext = "<div class='rezept_bild'><img src='/gerichtebilder/small/"+json.imagename+"'/><div class='time_gericht'><div class='time_corner_left'></div><div class='time_gericht_mid'>"+std+":"+min+" h</div><div class='time_corner_right'></div></div></div><h5>"+json.name+"</h5><p>"+beschreibung+"</p>";
	return appendtext;
}

function cutSmallFrameText(container){
	var h5height = container.find("h5").css("height");
	h5height = Number(h5height.substring(0, h5height.length-2));
	var pheight = container.find("p").css("height");
	pheight = Number(pheight.substring(0, pheight.length-2));
	while(pheight+h5height>110){
		h5height = container.find("h5").css("height");
		h5height = Number(h5height.substring(0, h5height.length-2));
		pheight = container.find("p").css("height");
		pheight = Number(pheight.substring(0, pheight.length-2));
		var text = container.find("p").text();
		container.find("p").text(text.substring(0,text.lastIndexOf(" "))+"...");
	}
}


function getBigFrameText(json){
	var maxlength = 200;
	var beschreibung = json.beschreibung;
	if(beschreibung.length > maxlength){
		for(var i = maxlength-1; i>=0; i--)
			if(beschreibung[i] == " "){
				beschreibung = beschreibung.substring(0, i+1)+"...";
				break;
			}
	}
	
	
	var std = json.std;
	if(std.length==1)
		std="0"+std;
	
	var min = json.min;
	if(min.length==1)
		min="0"+min;
	
	var htmlstring = "<a href='#/recipe/"+json.name+"' class='frame_big'><div class='frame_main_big big_rezept'><div class='rezept_bild'><img src='/gerichtebilder/small/"+json.imagename+"'/><div class='time_gericht'><div class='time_corner_left'></div><div class='time_gericht_mid'>"+std+":"+min+" h</div><div class='time_corner_right'></div></div></div><h5>"+json.name+"</h5><div class='result_schmeckt'><div class='heart_img'></div><div class='heart_number'>"+json.schmeckt+"</div></div><p>"+beschreibung+"</p>";
	
	htmlstring+="</div><div class='frame_right_big'></div></a>";
	return htmlstring;
}

var personen;

function loadRecipewJSON(json){
	var recipe = new Recipe();
	recipe.loadJSON(json);
	loadRecipe(recipe);
}

function loadRecipe(recipe){
	
	
	
	var headertext = "<div class='float_right_header'><div id='recipe_general_btn' class='big_button'>Rezept</div><div id='recipe_discussion_btn' class='big_button'>Diskussion</div></div>";
	$("#content_header").html(headertext);
	$("#recipe_general_btn").click(function(event){$.address.parameter("page", "");});
	$("#recipe_discussion_btn").click(function(event){$.address.parameter("page", "discussion");});
	
	personen = Number(recipe.personen);
	if(personen>1)
		$("#zutat_head").html("Zutaten für <input type='text' id='person_number' value='"+recipe.personen+"' size='2' maxlength='2' /> Personen:");
	else
		$("#zutat_head").html("Zutaten für <input type='text' id='person_number' value='"+recipe.personen+"' size='2' maxlength='2' /> Person:");
	
	$("#person_number").click(function(){$("#person_number").val('');});
	var persCount;
	$("#person_number").bind('keypress', function(e){
		var cleanString =String.fromCharCode(e.keyCode).match(/[0-9]+/); 
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
    $("#rezept_headline").append(recipe.name);
    $("#beschreibung").append(recipe.beschreibung);
    
    $("#rezept_bild").attr("src", "./gerichtebilder/big/"+recipe.imagename);
    	
	var steps = recipe.schritte;
	for(var j = 0; j<steps.length; j++){
		$("#step_container").append('<div class="step"><div class="step_left"><p class="step_number">'+(j+1)+'.</p><p class="step_text">'+steps[j]+'</p></div><div class="step_right"></div></div>');
		var step = $(".step_left:last");
		var stepheight = step.css("height");
		var heighttext = step.children(".step_text").css("height");
		var newMargin = (parseInt(stepheight.substring(0, stepheight.length-2))-parseInt(heighttext.substring(0, heighttext.length-2)))/2;
		step.children(".step_text").css("margin-top", newMargin);
	
	}
	
	$("#search").attr("value", recipe.name);
	$("#search, #time_std, #time_min").attr("readonly", "readonly");
	fillStd(recipe.std);
	fillMin(recipe.min);
	
	$("#zutaten_table > *").remove();
	for(zutat in recipe.zutaten){
		$("#zutaten_table").append("<tr><td class='zutaten_table_left'>"+zutat+"</td><td class='zutaten_table_right'>"+recipe.zutaten[zutat]+"</td></tr>");
	}
	
	$(".tags_table_right > *").remove();
	var tags = recipe.tags;
	for(var i = 0; i<tags.length; i++)
		$(".tags_table_right").append("<div class='tag'><div class='tag_text'>"+tags[i]+"</div></div>");

	
	checkOn("#chef_"+recipe.skill);
	checkOn("#muffin_"+recipe.kalorien);
	handleRadios(".label_stars, .label_chefhats, .label_muffins");
	blockFilter(true);
	
	//schmeckt-button
	if(loginChecker()){
		if(schmecktChecker(recipe.name)){
			$("#rezept_footer").prepend("<div id='rezept_schmeckt'>Das schmeckt mir!</div>");
			$("#rezept_schmeckt").click(schmecktmir);	
		}else{
			$("#rezept_footer").prepend("<div id='rezept_schmeckt'>Das schmeckt mir nicht mehr!</div>");
			$("#rezept_schmeckt").click(schmecktmirnicht);
		}
	}
	
	$.address.title("anycook | "+recipe.name);
	
	//FB.XFBML.parse(document.getElementById('social'));
	
	if($.address.pathNames().length == 3 && Number(logindata.level) > 0){
		/*$.ajaxSetup({async:false});
		$.getScript("/backend/scripts/recipeediting.js");
		$.ajaxSetup({async:true});*/
		addEditingHandler();
	}
	
	//bezeichner
	$("#zubereitung").addClass("on");
	$("#zubereitung").click(showZubereitung);
	$("#addtags").click(showaddTags);
}

function showZubereitung(){
	
	if(!$(this).hasClass("on")){
		$(".bezeichner").removeClass("on");
		$(this).addClass("on");
		$("#step_container").show();
		$("#addtags_container").hide();
	}
}

function showaddTags(){
	
	if(!$(this).hasClass("on")){
		$(".bezeichner").removeClass("on");
		$(this).addClass("on");
		$("#step_container").hide();
		$("#addtags_container").show();
		
		if($("#tagcloud").children().length == 0){
			makeTagCloud();
			$("#tagcloud span span").click(addNewTag);
			$("#recipe_tags").click(handleNewTagClick);
			$("#suggest_tags_btn").click(submitSuggestTags);
		}
	}
}

function submitSuggestTags(){
	var pathNames = $.address.pathNames();
	var recipe = pathNames[1];
	$("#recipe_tags .tag_text").each(function(index){
		var tag = $(this).text();
		$.ajax({
			url:"/anycook/SuggestTags",
			data:"recipe="+recipe+"&tag="+tag,
			async:false
		});
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
			
		$(this).empty();
		$(this).append(newValue);
	});
	
}

function getNumbersFromString(inputstring, factor)
{
	var beginString = "";
	var valueFromString = "";
	var restString = "";
	
	var postProc = false;
	
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

function loadDiscussion(gericht){
	var login = loginChecker();
	$("#discussion_headline").html("Diskussion zum Rezept<br/>"+gericht);
	
	$.ajax({
		url:"/anycook/GetDiscussion",
		data:"gericht="+gericht,
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
					var datetime = json[i].eingefuegt.split(/[ :-]/);
					var litext = "<li><a href='#'><img src='"+json[i].image+
						"'/></a><div class='comment_arrow'></div><div class='recipe_comment'><div class='comment_headline'><a href='#'>"+json[i].nickname+"</a> schrieb am "+datetime[2]+"."+datetime[1]+"."+datetime[0]+" um "+datetime[3]+":"+datetime[4]+"</div><div class='comment_number'>#"+(Number(json[i].id)+1)+
						"</div><div class='comment_text'>"+json[i].text+"</div><div class='comment_footer'>";
					
					if(login)
						litext+= "<a class='answer_btn'>antworten</a>";
					
					litext+="<div class='comment_like'><div class='like'></div><div class='like_nr "+likeclass+"'>"+likes+"</div><div class='dislike'></div></div></div></div><ul></ul></li>";
					$("#comment_discussion > ul").append(litext);
					loadChildren(i, json[i].id, gericht, login);					
				}
				$("#comment_discussion > ul > li:odd").addClass("odd");
				
			}
		}
	});
	
	if(login){
		$("#discussion_footer").html("<h6 id='yes_comment'>Was meinst du dazu?</h6><a href='#'><img src='"+logindata.image+"'/></a><div class='comment_arrow'></div><div class='recipe_comment'><textarea></textarea><div class='comment_btn'>Abschicken</div></div>");
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

function loadChildren(i, id, gericht, login){
	$.ajax({
		url:"/anycook/GetDiscussion",
		data:"gericht="+gericht+"&pid="+id,
		dataType:"json",
		success:function(childjson){
			if(childjson.length>0){
				var ul = $("#comment_discussion > ul > li > ul")[i];
				for(var j in childjson){
					maxID = Math.max(maxID, Number(childjson[j].id));
					var childdatetime = childjson[j].eingefuegt.split(/[ :-]/);
					var likes = childjson[j].likes;
					var likeclass = "";
					if(Number(likes)>0){
						likes = "+"+likes;
						likeclass = "plus";
					}
					else if(Number(likes)<0)
					likeclass = "minus";
					var childlitext = "<li><a href='#'><img src='"+childjson[j].image+
					"'/></a><div class='comment_arrow_small'></div><div class='recipe_comment_small'><div class='comment_headline'><a href='#'>"+childjson[j].nickname+"</a> schrieb am "+childdatetime[2]+"."+childdatetime[1]+"."+childdatetime[0]+" um "+childdatetime[3]+":"+childdatetime[4]+"</div><div class='comment_number'>#"+(Number(childjson[j].id)+1)+
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
		$(ul).append("<li class='child_comment'><a href='#'><img src='"+logindata.image+"'/></a><div class='comment_arrow_answer'></div><div class='recipe_comment_answer'><textarea></textarea><div class='comment_btn'>Abschicken</div><div></li>");
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
	var gericht = $.address.pathNames()[1];
	if(text!=""){
		$.ajax({
			url:"/anycook/Discuss",
			data: "comment="+text+"&gericht="+gericht
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
	
	var gericht = $.address.pathNames()[1];
	var text = target.prev().val();
	if(text!=""){
		$.ajax({
			url:"/anycook/Discuss",
			data: "comment="+text+"&gericht="+gericht+"&pid="+pid
		});
		target.parents(".child_comment").remove();
		
		//window.clearTimeout(commenttimeout);
		//checkNewDiscussion();
	}
	
	
}

function checkNewDiscussion(){
	if($.address.pathNames()[0] == "recipe"){
		var gericht = $.address.pathNames()[1];
		$.ajax({
			url:"/anycook/CheckforNewDiscussion",
			data:"gericht="+gericht+"&maxid="+maxID,
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
						loadNewDiscussion(ul, id, gericht, oldmaxID);
					}
				}
				window.setTimeout(checkNewDiscussion, 2000);
				
			}
		});	
	}
}

// lalalalaa
function loadNewDiscussion(ul, pid, gericht, oldmaxID){
	$.ajax({
		url:"/anycook/GetDiscussion",
		data:"gericht="+gericht+"&pid="+pid+"&maxid="+oldmaxID,
		dataType:"json",
		success:function(json){
			for(var i in json){
				
				var login = loginChecker();
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
				
				var datetime = json[i].eingefuegt.split(/[ :-]/);
				var litext = "<li><a href='#'><img src='"+image+
					"'/></a><div class='"+arrow+"'></div><div class='"+comment+"'><div class='comment_headline'><a href='#'>"+json[i].nickname+"</a> schrieb am "+datetime[2]+"."+datetime[1]+"."+datetime[0]+" um "+datetime[3]+":"+datetime[4]+"</div><div class='comment_number'>#"+(Number(json[i].id)+1)+
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
				var newMarginTop = 0 - newcomment.outerHeight();
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
	var gericht = $.address.pathNames()[1];
	var like = "&like";
	if(target.hasClass("dislike"))
		like = "";
	
	$.ajax({
		url:"/anycook/LikeDislike",
		data:"id="+id+"&gericht="+gericht+like,
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
//var commenttimeout;
