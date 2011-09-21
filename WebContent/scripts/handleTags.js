//NEW
function makeNewTagInput(event){
	var $this = $(this);
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
        				var text = ui.item.label;
        				$(this).autocomplete("destroy");
        				saveNewTag(text);
        				makeNewInput();
        				return false;
        			}
	    	});
	    	
	    	
			$(".ui-autocomplete").last().addClass("newtag-autocomplete");
			//$(".tags_table_right form").submit(submitTag);
			
			$("body").click(function(event){
				if($(event.target).parents().andSelf().is($($this)))
					return;
				
				$this
				.removeClass("active")
				.children("input").remove();
				
			});
		}
		else 
			$this.children("input").focus();
}

function keyNewTag(event) {
	var $this = $(this);
	var text = $this.val();

	if((event.keyCode == 13 || event.keyCode == 188 || event.keyCode == 32) && text!="" ){
		saveNewTag(text);
		makeNewRInput();		
	}
	else if(event.keyCode == 8 && text ==""){
		$this.children(".tag").last().remove();
		removeNewInput();
		makeNewTagInput();
		
		var count = $("#recipe_tags .tag").length;
		
		if(count<10)
			count = "0"+count;
		
		$("#nr_tagnumber").text(count);
		
		return false;
	}
	
}

function removeNewInput(){
	var $this = $(this);
	$this.children("input").remove();
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

function getTag(name, type, number){
	
	var $tag;
	
	if(type == "link")
		$tag = $("<a href=\"#!/search/tagged/"+name+"\"></a>");
	else
		$tag = $("<div></div>");
		
	var $right = $tag.addClass("tag").append("<div class=\"right\"></div>").children()
		.append("<div class='tag_text'>"+name+"</div>");
	
	if(type == "remove")
		$right.append("<div class=\"tag_remove\">x</div>");
	else if(type == "number")
		$right.append("<div class=\"tag_num\">"+number+"</div>");
		
	return $tag;
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

function submitNewTag(event){
	var text = $(this).children().first().val();
	saveNewTag(text);
	return false;
}
/*function saveTag(text){
	
	
	if(text[0]=="," || text[0]==" ")
		text = text.substring(1,text.length);
	
	var tags = $(".tag_text");
	for(var i = 0; i<tags.length; i++){
		if($(tags[i]).text() == text){
			$(".tags_table_right input").val("");
			return ;
		}
	}
			
	removeInput();
	$(".tags_table_right").append("<div class='tag'><div class='tag_text'>"+text+"</div><div class='tag_remove'>x</div></div>");
	//$(".tags_table_right .tag_remove").last().click(function(event){removeTag(event.target.parentNode);});
	addTag(text);
}*/

function getDivLength(){
	var divs = $("#recipe_tags .tag");
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
			//make new input field
			$(".tags_table_right").append("<form><input type='text'/></form>");
			$(".tags_table_right input").keydown(keyTag);
			$(".tags_table_right input").focus();
			
			$(".tags_table_right input").autocomplete({
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
        				offset:"-3 1"
        			}, 
        			select:function(event, ui){        				
        				if(ui.item != undefined){
        					var text = ui.item.label;
	        				$(".tags_table_right input").autocomplete("destroy");
	        				search.addTag(text);
	        				search.flush();
	        				makeNewInput();
	        				return false;
        				}
        			}
	    	});
			$(".ui-autocomplete").last().addClass("tag-autocomplete");
			$(".tags_table_right form").submit(submitTag);
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

function removeTagfromSession(tag){
	search.removeTag(tag);
	search.flush();
}

function loadFamousTags(tags){
	for(tag in tags){
		$("#famous_tags_cloud").append("<span><a href=\"#!/search/tagged/"+tag+"\">"+tag+"</span></a> ");
		$("#famous_tags_cloud span a").last().css({"font-size":Math.round(tags[tag]*9.3),
				"opacity": tags[tag]/3
		});
	}
	//$("#famous_tags a span").click(clickFamousTag);
}

function clickFamousTag(event){
	var text = $(event.target).text();
	saveTag(text);
}

//tags
function addNewTag(event){
	
	
	var $this = $(this);
	var text = $this.find(".tag_text").text();
	$(".tagsbox").append(getTag(text, "remove"))
		.children(".tag").last()
		.hide().fadeIn(100);
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
	
	//saveNewTag(text);	
	
	/*var parameterNames = $.address.parameterNames();
	if( parameterNames.length == 2){
		var recipe = decodeURIComponent(parameterNames[1]);
		makeTagCloud(recipe);
	}
	else makeTagCloud();*/
}

function handleNewTagClick(event){
		makeNewRInput();
}

function removeNewTag(event){
	var target = $(event.target);
	target.parent().remove();
	removeNewInput();
	
	var count = $("#recipe_tags .tag").length;
	
	if(count<10)
		count = "0"+count;
	
	$("#nr_tagnumber").text(count);
}

function makeNewRInput(){
		if($("#recipe_tags input").length==0){
			//var divlength = getDivLength();
			//make new input field
			$("#recipe_tags").append("<input type='text'/>");
			$("#recipe_tags input").keydown(keyNewTag);
			$("#recipe_tags input").focus();
			$("#recipe_tags input").autocomplete({
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
        				var text = ui.item.label;
        				$("#recipe_tags input").autocomplete("destroy");
        				saveNewTag(text);
        				makeNewInput();
        				return false;
        			}
	    	});
			$(".ui-autocomplete").last().addClass("newtag-autocomplete");
			$(".tags_table_right form").submit(submitTag);
		}
		else 
			$("#recipe_tags input").focus();
}

function saveNewTag(text){
	if(text[0]=="," || text[0]==" ")
		text = text.substring(1,text.length);
	
	removeNewInput();	
	if($("#recipe_tags .tag_text:contains("+text+")").length == 0){		
		var htmlstring = "<div class='tag'><div class='tag_text'>"+text+"</div><div class='tag_remove'>x</div></div>";
		$("#recipe_tags").append(htmlstring);
		$("#recipe_tags .tag_remove").last().click(removeNewTag);
		
		var count = $("#recipe_tags .tag").length;
		
		if(count<10)
			count = "0"+count;
		
		$("#nr_tagnumber").text(count);
	}
}
