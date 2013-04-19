function loadAboutUs(){
	setTimeSinceStart();
	setWebsiteData();
	loadPeople();
}

function loadPeople(){
	$("#team").appendGitHub("anycook/anycook-content/contents/people.md");
}

function setWebsiteData(){
	if($.address.pathNames()[0] == "about_us"){
		$.when($.anycook.graph.user.number(),
			$.anycook.graph.tag.number(),
			$.anycook.graph.ingredient.number(),
			$.anycook.graph.recipe.number())
		.then(function(numUsers, numTags, numIngredients, numRecipes){
			$(".usercounter").text(numUsers[0]);
		  	$(".tagcounter").text(numTags[0]);
		  	$(".ingredientcounter").text(numIngredients[0]);
		  	$(".recipecounter").text(numRecipes[0]);
		  	setTimeout(setWebsiteData,5000);
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

function loadImpressum(){
	$("#content_main").appendGitHub("anycook/anycook-content/contents/impressum.md");
}
