function loadDrafts(){
	var $db = $.couch.db("recipedrafts");
	$db.view("drafts/byUserid", {key:user.id,reduce:false,success:function(json){
		console.log(json);
		var $list = $("#draft_list");
		for(var i in json.rows){
			var id = json.rows[i].id;
			var data = json.rows[i].value;
			$list.append(getBigFrameDraft(id,data));
			
		}
	}});
	
	// $.getJSON("/anycook/GetDrafts", function(json){
		// var $draftList = $("#draft_list");
		// for(var i in json){
			// $draftList.append("<li>"+JSON.stringify(json[i])+"</li>");
		// }
	// });
}

function getBigFrameDraft(id, data){
	
	var date = data.date;
	var percent = data.percentage;

	var uri = encodeURI("/#!/recipeediting?id="+id+"&step=4");
	
	var $frame_big_left = $("<div></div>").addClass("frame_big_left");
	
	var $img = $("<img/>").attr("src", Recipe.getImageURL(data.image));
	var $recipe_img = $("<div></div>").addClass("recipe_img")
		.append($img);
	
	
		
	var $recipe_text = $("<div></div>").addClass("recipe_text")
		.append("<h3>"+data.name+"</h3>")
		.append("<p>"+data.description+"</p>");


	var $date = $("<div>"+date+"</div>").addClass("date");
	var $percent = $("<div>"+percent+"</div>").addClass("percent");
	var $datecontainer = $("<div></div>").addClass("date_container")
		.append($date)
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
		
	var $li = $("<li></li>")
		.append($frame_big)
		.append($("<div></div>").addClass("delete"));

	return $li;
}
