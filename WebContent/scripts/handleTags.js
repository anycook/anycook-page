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
	saveTag(text);
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
        			var array = [];
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
	        				saveTag(text);
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

function makeTagCloud(recipe){
	
	var data = "num=14";
	if(recipe != undefined)
		data+="&recipe="+recipe;
	
	var json = null;
	
	$.ajax({
		  url: "/anycook/GetPopularTags",
		  dataType: 'json',
		  data: data,
		  async:false,
		  success: function(response){
				if(response != "false")
					json=response;
	}
		});
	
	for(tag in json){
		$("#tagcloud").append("<span><span>"+tag+"</span></span> ");
		$("#tagcloud span span").last().css({"font-size":json[tag]*8,
				"opacity": json[tag]/3
		});
	}
}

//tags
function addNewTag(event){
	
	var target = $(event.target);
	var text = target.text();
	saveNewTag(text);	
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

function removeNewInput(){
	$("#recipe_tags input").remove();
}

function keyNewTag(event) {
	var text = $(event.target).val();

	if((event.keyCode == 13 || event.keyCode == 188 || event.keyCode == 32) && text!="" ){
		saveNewTag(text);
		makeNewRInput();		
	}
	else if(event.keyCode == 8 && text ==""){
		$("#recipe_tags .tag").last().remove();
		removeNewInput();
		makeNewRInput();
		
		var count = $("#recipe_tags .tag").length;
		
		if(count<10)
			count = "0"+count;
		
		$("#nr_tagnumber").text(count);
		
		return false;
	}
	
}

function makeNewRInput(){
		if($("#recipe_tags input").length==0){
			var divlength = getDivLength();
			//make new input field
			$("#recipe_tags").append("<input type='text'/>");
			$("#recipe_tags input").keydown(keyNewTag);
			$("#recipe_tags input").focus();
			$("#recipe_tags input").autocomplete({
	    		source:function(req,resp){
        			var array = [];
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
