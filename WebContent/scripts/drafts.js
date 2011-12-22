function loadDrafts(){
	var $db = $.couch.db("recipedrafts");
	$db.view("drafts/byUserid", {key:user.id,reduce:false,success:function(json){
		if(json.rows.length == 0){
			$("#nodrafts").show();
			return;
		}
		
		var $list = $("#draft_list");
		for(var i in json.rows){
			var id = json.rows[i].id;
			var data = json.rows[i].value;
			$list.append(getBigFrameDraft(id, data));
		}
	}});
	
	// $.getJSON("/anycook/GetDrafts", function(json){
		// var $draftList = $("#draft_list");
		// for(var i in json){
			// $draftList.append("<li>"+JSON.stringify(json[i])+"</li>");
		// }
	// });
}


function deleteDraft(event){
	var $this = $(this);
	var $li = $this.parent("li");
	var $db = $.couch.db("recipedrafts");
	$db.removeDoc(event.data);
	$li.animate({height:0, opacity:0},{duration:500, complete:function(){
		$(this).remove();
		if($("#draft_list").children().length == 0){
			$("#nodrafts").fadeIn(500);
		}
	}});
}

function getBigFrameDraft(id, data){
	
	var date = parseDraftDate(data.date);
	var percent = data.percentage*100+"%";
	var name = !data.name ? "Noch kein Titel" : data.name;
	var description = !data.description ? "Noch keine Beschreibung" : data.description;
	var image = !data.image ? "nopicture.png" : data.image;

	var uri = encodeURI("/#!/recipeediting?id="+id);
	
	var $frame_big_left = $("<div></div>").addClass("frame_big_left");
	
	var $img = $("<img/>").attr("src", "/gerichtebilder/small/"+image);
	var $recipe_img = $("<div></div>").addClass("recipe_img")
		.append($img);
	
	
		
	var $recipe_text = $("<div></div>").addClass("recipe_text")
		.append("<h3>"+name+"</h3>")
		.append("<p>"+description+"</p>");


	var $date = $("<div>"+date+"</div>").addClass("date");
	var $year = $("<div>"+data.date.substring(1,5)+"</div>").addClass("year");
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
		
		
	var $deletebtn =  $("<div><span></span></div>").addClass("delete").on("click", {_id:id, _rev:data._rev}, deleteDraft);
	var $li = $("<li></li>")
		.append($frame_big)
		.append($deletebtn);

	return $li;
}

function parseDraftDate(datestring){
	var datestring = datestring.substring(1,11);
	var month = Number(datestring.substring(5,7));
	var day = Number(datestring.substring(8));
	switch(month){
		case 1:
			month = "Jan";
			break;
		case 2:
			month = "Feb";
			break;
		case 3:
			month = "Mär";
			break;
		case 4:
			month = "Apr";
			break;
		case 5:
			month = "Mai";
			break;
		case 6:
			month = "Jun";
			break;
		case 7:
			month = "Jul";
			break;
		case 8:
			month = "Aug";
			break;
		case 9:
			month = "Sep";
			break;
		case 10:
			month = "Okt";
			break;
		case 11:
			month = "Nov";
			break;
		case 12:
			month = "Dez";
			break;
	}	
	
	//console.log(year, month, day);
	return day+". "+month;
	
	
}
