//NEW
function makeNewTagInput(event){
	var $this = $(this);
	
	
	if(event !== undefined){
		var $target = $(event.target);
		if($target.parents().andSelf().is(".tag"))
			return;
	}
		
	if($this.children("input").length==0){
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
        		$.ajax({
        			url:"/anycook/AutocompleteTags",
        			dataType: "json",
        			async:false,
        			data:"q="+term,
        			success:function(data){
        				resp($.map(data, function(item){
        					return{
        						label:item
        						};
        					}));        			
        					}
        				});
        			},
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
        					saveNewTag.apply(this, [text]);
        				makeNewTagInput.apply(this);
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
			
}

function keyNewTag(event) {
	var $this = $(this);
	var text = $this.val();

	if((event.keyCode == 13 || event.keyCode == 188 || event.keyCode == 32) && text!="" ){
		saveNewTag(text);
		removeNewInput();
		makeNewTagInput();	
		
		return false;
	}
	else if(event.keyCode == 8 && text ==""){
		$(".tagsbox").children(".tag").last().remove();
		removeNewInput();
		draftTags();
		makeNewTagInput();
		
		return false;	
	}
	
}

function removeNewInput(){
	var $tagsbox = $(".tagsbox");
	$tagsbox.children("input").remove();
}

function removeNewTag(event){
	var $this = $(this);
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
	removeNewInput();
}


function makeTagCloud(){
	$("#tagcloud").empty();
	var data ="";
	
	
	var recipe = Recipe.getRecipeName();
	if(recipe != null)
		data+="recipe="+recipe;
	
	$.ajax({
		  url: "/anycook/GetPopularTags",
		  dataType: 'json',
		  data: data,
		  success: function(response){
				if(response != "false"){
					for(tag in response){
						$("#tagcloud").append(getTag(tag, "number", response[tag]));
					}
					
					$("#tagcloud .tag").click(addNewTag);
				}
			}
		});
	
	
}

function submitTags(event){
	event.preventDefault();
	var tagtext = $(this).children("input").val();
	search.addTag(tagtext);
}

function submitSuggestTags(){
	var pathNames = $.address.pathNames();
	var recipe = pathNames[1];
	$(".tagsbox .tag_text").each(function(index){
		var tag = $(this).text();
		$.ajax({
			url:"/anycook/SuggestTags",
			data:"recipe="+recipe+"&tag="+tag,
		});
	});
	hideAddTags();
	
	return false;
	/*$("#recipe_tags").empty();
	$("#addtags_container").fadeOut(200, function(){
		$("#bezeichner_container").append("<div id='suggestedtags_message' class='content_message'>" +
				"<h5>Danke!</h5><p>Wir schauen uns deine Vorschläge gleich einmal an.<br /> " +
				"Wir benachrichtigen dich!</p></div>");
		$("#content").click(addTagreadyClick);
		window.setTimeout(addTagreadyClick, 3000);
	});*/
}

function getTag(name, type, number){
	
	var $tag;
	
	if(type == "link" || type == "linknumber")
		$tag = $("<a href=\"#!/search/tagged/"+name+"\"></a>");
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
}

function saveNewTag(text){
	if(text[0]=="," || text[0]==" ")
		text = text.substring(1,text.length);
	
	removeNewInput();	
	if($(".tag_text:contains("+text+")").not("#tagcloud .tag_text:contains("+text+")").length == 0){		
		$(this).append(getTag(text, "remove"))
			.children(".tag").last()
			.hide().fadeIn(100);
		draftTags();
	}
	
}

function addNewTag(event){
	
	
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
	
	saveNewTag(text);	
}



//OLD!!!
function keyTag(event) {
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
	
}

function submitTag(event){
	var text = $(this).children().first().val();
	search.addTag(text);
	search.flush();
	return false;
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

function removeTagfromSession(tag){
	search.removeTag(tag);
	search.flush();
}


function clickFamousTag(event){
	var text = $(event.target).text();
	saveTag(text);
}

//tags

function loadFamousTags(tags){
	var $tagsCloud = $("#famous_tags_cloud");
	for(tag in tags){
		$tagsCloud.append(getTag(tag, "linknumber", tags[tag]));
	}
}

function handleNewTagClick(event){
		makeNewRInput();
}


