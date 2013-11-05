(function( $ ){
	
	if(!$.anycook)
		$.anycook = {};
	
	if(!$.anycook.drafts)
		$.anycook.drafts = {};
	
	var queue = [];
	
	$.anycook.drafts.newDraft = function(callback){
		$.anycook.graph._put("/drafts",{}, callback);
	}
	
	$.anycook.drafts.load = function(){
		$.anycook.graph._get("/drafts", {}, function(drafts){
			if(drafts.length == 0){
				$("#nodrafts").show();
				return;
			}			
			var $list = $("#draft_list");
			for(var i in drafts){
				var draft = drafts[i];
				$list.append($.anycook.drafts.getBigFrameDraft(draft._id.$oid,draft.value));
			}
		});
	}
	
	$.anycook.drafts.num = function(lastnum){
		if(lastnum === undefined) lastnum = -1;

		if(user.checkLogin()){
			$.anycook.graph._get("/drafts/num", {lastNum:lastnum}, function(num){
				$("#drafts #draftnum").text(num);
				var $messageBubble = $("#settings_btn_container .new_messages_bubble");
				if(num>0)			
					$messageBubble.fadeIn(200).children().text(num);
				else
					$messageBubble.fadeOut(200);
				
				// $.anycook.drafts.num(num);	
				setTimeout("$.anycook.drafts.num("+num+")", 2000);	
			});
		}
	};
	
	$.anycook.drafts.open = function(id, callback){
		return $.anycook.graph._get("/drafts/"+id, {}, callback);
	}
	
	
	$.anycook.drafts.remove = function(event){
		var $this = $(this);
		var $li = $this.parent("li");
		$.anycook.graph._delete("/drafts/"+event.data._id,{}, function(){
			$li.animate({height:0, opacity:0},{duration:500, complete:function(){
				$(this).remove();
				if($("#draft_list").children().length == 0){
					$("#nodrafts").fadeIn(500);
				}
			}});
		});
		
	}
	
	$.anycook.drafts.getBigFrameDraft = function(id,draft){
		
		var date = new Date(draft.timestamp);
		var dateString = $.anycook.drafts.parseDraftDate(date);
		// var percent = draft.percentage+"%";
		var percent = 0+"%";
		var name = !draft.name ? "Noch kein Titel" : draft.name;
		var description = !draft.description ? "Noch keine Beschreibung" : draft.description;
		var image = !draft.image ? "category/sonstiges.png" : draft.image;
	
		var uri = encodeURI("/#!/recipeediting?id="+id);
		
		var $frame_big_left = $("<div></div>").addClass("frame_big_left");
		
		var $img = $("<img/>").attr("src", baseUrl+"/images/recipe/small/"+image);
		var $recipe_img = $("<div></div>").addClass("recipe_img")
			.append($img);
		
		
			
		var $recipe_text = $("<div></div>").addClass("recipe_text")
			.append("<h3>"+name+"</h3>")
			.append("<p>"+description+"</p>");
	
	
		var $date = $("<div>"+dateString+"</div>").addClass("date");
		var $year = $("<div>"+date.getFullYear()+"</div>").addClass("year");
		var $percent = $("<div>"+percent+"</div>").addClass("percent");
		var $datecontainer = $("<div></div>").addClass("date_container")
			.append($date)
			.append($year)
			.append($percent);
		
	
		var $frame_big_main = $("<div></div>").addClass("frame_big_main")
			.append($datecontainer)
			.append($recipe_img)
			.append($recipe_text);
	
		var $frame_big_right = $("<div></div>").addClass("frame_big_right");
		
		var $frame_big = $("<a></a>").addClass("frame_big draft").attr("href", uri)
			.append($frame_big_left)
			.append($frame_big_main)
			.append($frame_big_right);
			
			
		var $deletebtn =  $("<div><span></span></div>").attr("title", "Entwurf löschen").addClass("delete").on("click", {_id:id}, $.anycook.drafts.remove);
		var $li = $("<li></li>")
			.append($frame_big)
			.append($deletebtn);
	
		return $li;
	}
	
	$.anycook.drafts.parseDraftDate = function(date){
		
		var month = date.getMonth();
		var day = date.getDate();
		switch(month){
			case 0:
				month = "Jan";
				break;
			case 1:
				month = "Feb";
				break;
			case 2:
				month = "Mär";
				break;
			case 3:
				month = "Apr";
				break;
			case 4:
				month = "Mai";
				break;
			case 5:
				month = "Jun";
				break;
			case 6:
				month = "Jul";
				break;
			case 7:
				month = "Aug";
				break;
			case 8:
				month = "Sep";
				break;
			case 9:
				month = "Okt";
				break;
			case 10:
				month = "Nov";
				break;
			case 11:
				month = "Dez";
				break;
		}	
		
		//console.log(year, month, day);
		return day+". "+month;
		
		
	}
	
	$.anycook.drafts.save = function(type, data){
		var id = $.address.parameter("id");
		if(!user.checkLogin || id === undefined) return;
		
		
		var newData = {id:id, data:{}};
		newData.data[type] = data;
		queue.push(newData);
		if(queue.length == 1)
			$.anycook.drafts.saveDoc();
	};
	
	$.anycook.drafts.saveDoc = function(){
		if(queue.length > 0){
			var data = queue[0];
			var newData = JSON.stringify(data.data);
			$.anycook.graph._post("/drafts/"+data.id,{data:newData}, function(){
				queue.shift();
					$.anycook.drafts.saveDoc();
			});
		}
	};

	$.anycook.drafts.getDraftFromRecipe = function(recipename){
		var graph = "/drafts/"+encodeURIComponent(recipename);
		var data = {};

		$.anycook.graph._put(graph, {}, function(draft_id){
			if(draft_id != null)
				$.address.value("/recipeediting?step=4&id="+draft_id);
		})
	}
		
})(jQuery);
