function keyTag(event) {
	var text = $(event.target).val();

	if((event.keyCode == 13 || event.keyCode == 188 || event.keyCode == 32) && text!="" ){
		saveTag(text);		
		makeNewInput();		
	}
	else if(event.keyCode == 8 && text ==""){
		removeTag($(".tag:last"));
		removeInput();
		makeNewInput();
		
		return false;
	}
	
}

function saveTag(text){
	if(text[0]=="," || text[0]==" ")
		text = text.substring(1,text.length);
	
	var tags = $(".tag_text");
	for(var i = 0; i<tags.length; i++){
		if($(tags[i]).text() == text){
			$(".tags_table_right input").val("");
			return;
		}
	}
			
		removeInput();
		$(".tags_table_right").append("<div class='tag'><div class='tag_text'>"+text+"</div><div class='tag_remove'>x</div></div>");
		//$(".tags_table_right .tag_remove").last().click(function(event){removeTag(event.target.parentNode);});
		addTag(text);
}

function getDivLength(){
	var divs = $(".tag");
	var divlength=0;
	for(var i=0;i<divs.length;i++){
		var width = $(divs[i]).css("width");
		width = width.substring(0, width.search("px"));
		
		var right = $(divs[i]).css("margin-right");
		right = right.substring(0, right.search("px"));
		
		var left = $(divs[i]).css("margin-left");
		left = left.substring(0, left.search("px"));
		divlength = divlength+parseInt(width)+parseInt(right)+parseInt(left);
	}
	return divlength;
}

function makeNewInput(){
	if(blocked==false){
		if($(".tags_table_right input").length==0){
			var divlength = getDivLength();
			//make new input field
			if(divlength<320){
				$(".tags_table_right").append("<input type='text'/>");
				$(".tags_table_right input").keydown(keyTag);
				$(".tags_table_right input").focus();
			}
		}
		else 
			$(".tags_table_right input").focus();
	}
}

function removeInput(){
	$(".tags_table_right input").remove();
}

function removeTag(tag){
	var text = $(tag).children(".tag_text").text();
	removeTagfromSession(text);
	$(tag).remove();
	removeInput();
}

function addTag(tag){
	$("#searchbar").val("");
	addtoSession("tag="+tag);
}

function removeTagfromSession(tag){
	removefromSession("tag="+tag);
}

function loadFamousTags(tags){
	for(tag in tags){
		$("#famous_tags_cloud").append("<span><span>"+tag+"</span></span> ");
		$("#famous_tags_cloud span span").last().css({"font-size":Math.round(tags[tag]*9.6),
				"opacity": tags[tag]/3
		});
	}
	$("#famous_tags span span").click(clickFamousTag);
}

function clickFamousTag(event){
	var text = $(event.target).text();
	saveTag(text);
}