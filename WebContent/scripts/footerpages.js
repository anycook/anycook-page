function loadAboutUs(){
	setTimeSinceStart();
	setWebsiteData();
}

function setWebsiteData(){
	if($.address.pathNames()[0] == "about_us"){
		$.ajax({
		  url: "/anycook/LoadSide1Data",
		  dataType: "json",
		  success: function(json){
		  	$(".usercounter").text(json.users);
		  	$(".tagcounter").text(json.tags);
		  	$(".ingredientcounter").text(json.ingredients);
		  	$(".recipecounter").text(json.recipes);
		  	setTimeout("setWebsiteData()",7000);
		  	
		  }
		});
	}
}

function setTimeSinceStart(){
	
	if($.address.pathNames()[0] == "about_us"){
		var now = new Date();
		var startDate = new Date(2011, 1, 20, 13,14);
		var difference = now - startDate;
		var one_year=1000*60*60*24*365;
		var one_day=1000*60*60*24;
		var one_hour=1000*60*60;
		var one_min= 1000*60;
		var one_sec= 1000;
		
		var years = Math.floor(difference/one_year);
		difference = difference % one_year;		
		var days = Math.floor(difference/one_day);
		difference = difference % one_day;
		var hours = Math.floor(difference/one_hour);
		difference = difference % one_hour;
		var min = Math.floor(difference/one_min);
		difference = difference % one_min;
		var sec = Math.floor(difference/one_sec);
		
		var $onlinetime = $("#online_time");
		
		if(years>0){
			$onlinetime.children(".years").show().children("span").text(years);			
		}
		$onlinetime.children(".days").text(days);
		$onlinetime.children(".hours").text(hours);
		$onlinetime.children(".minutes").text(min);
		$onlinetime.children(".seconds").text(sec);
		
		setTimeout("setTimeSinceStart()",1000);
	}
	
	
	
}
