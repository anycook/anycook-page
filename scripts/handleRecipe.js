function profileRecipe(recipe){
	var uri = "#!/recipe/"+encodeURIComponent(recipe);
	
	var $img = $("<img/>").attr("src", $.anycook.graph.recipe.image(recipe));
	var $div =$("<div></div>").append("<span>"+recipe+"</span>");
	
	var $link = $("<a></a>").addClass("profile_rezept_bild").attr("href", uri)
		.append($img)
		.append($div);
	return $link;
}

function loadRecipe(recipeName, versionid) {
	resetFilter();
	recipeName = decodeURIComponent(recipeName);

	var rezepturi = "#!/recipe/"+recipeName;
	$("#content_header #recipe_btn").attr("href", rezepturi);
	$("#content_header #discussion_btn").attr("href", rezepturi + "?page=discussion");

	$.anycook.graph.recipe(recipeName, versionid, function(recipe){
		$.address.title(recipe.name + " | anycook");
		$("#recipe_headline").append(recipe.name);
		$("#introduction").append(recipe.description);
		var $author = $("<a></a>").attr("href", User.getProfileURI(recipe.author.id))
			.text(recipe.author.name);
		$("#autoren").append($author);
		loadFilter(recipe);
	});
	
	$(".recipe_image").attr("src", $.anycook.graph.recipe.image(recipeName, "large"));

	$.anycook.graph.recipe.ingredients(recipeName, versionid, loadIngredients);
	$.anycook.graph.recipe.tags(recipeName, versionid, loadTags);
	$.anycook.graph.recipe.steps(recipeName, versionid, loadSteps);

	//recipe_image
	

	// var steps = recipe.steps;
	// loadSteps(steps);
	// loadFilter(recipe);
	//$("#search").attr("value", recipe.name);

	//schmeckt-button
	if(user.checkLogin()) {
		$.anycook.graph.recipe.schmeckt(recipeName, function(schmeckt){
			if(!schmeckt) {
				$("#schmecktmir").click(schmecktmir);
			} else {
				$("#schmecktmir").addClass("on");
				$("#schmecktmir").click(schmecktmirnicht);
			}
		});		
	}

	

	// if($.address.pathNames().length == 3 && user.level > 0){
	// addEditingHandler();
	// }

	//Autoren
	// var num_autoren = recipe.authors.length;
	// var $autoren = $("#autoren span");
// 
	// for(var i in recipe.authors) {
		// var author = recipe.authors[i];
		// $autoren.append("<a href='#!/profile/" + author.id + "'>" + author.name + "</a>");
		// if(i <= num_autoren - 3)
			// $autoren.append(", ");
		// if(i == num_autoren - 2)
			// $autoren.append(" und ");
	// }

	//bezeichner
	//$("#zubereitung").addClass("on");
	//$("#zubereitung").attr("href", "#!/recipe/"+encodeURI(recipe.name));
	//$("#addtags").attr("href", "#!/recipe/"+encodeURI(recipe.name)+"?page=addtags");
	//$("#zubereitung").click(showZubereitung);
	//$("#addtags").click(showaddTags);

	//icons
	$("#share").click(showShare);
	$("#tags").click(showaddTags);

	$("#print").click(function() {
		window.print();
	});
	//addtagsbox
	// makeAddTags();
}

function loadSteps(steps) {
	var $stepContainer = $("#step_container").empty();
	for(var j = 0; j < steps.length; j++) {
		var $step = getIngredientStep(steps[j]);
		$stepContainer.append($step);
		var stepheight = $step.children(".step").innerHeight();
		var $text = $step.find(".text");
		var newMargin = (stepheight - $text.height()) / 2;
		$text.css("marginTop", newMargin);
	}
	return true;
}

function loadIngredients(ingredients){
	var $ingredientList = $("#ingredient_list").empty();
	for(var i in ingredients) {
		var zutat = ingredients[i].name;
		var menge = ingredients[i].menge;
		var singular = ingredients[i].singular;
		if(singular !== undefined && singular != null && getValuefromString(menge) == 1)
			zutat = singular;

		var $li = $("<li></li>").append("<div></div>").append("<div></div>");
		$li.children().first().addClass("ingredient").text(zutat);
		$li.children().last().addClass("amount").text(menge);
		$ingredientList.append($li);
	}
	
	if($ingredientList.children().length <6){
		var length = $ingredientList.children().length;
		for(var i = 0; i<= 6-length; i++){
			var $li = $("<li></li>");
			$ingredientList.append($li);
		}
	}
}

function loadTags(tags){
	var $tags_list = $(".tags_list").empty();
	
	if(tags === undefined) return;
	
	for(var i = 0; i < tags.length; i++)
		$tags_list.append(getTag(tags[i], "link"));
}

function loadFilter(filter) {
	
	$("#filter_headline").text("Legende");
	$("#filter_main").addClass("blocked");
	$("#kategorie_head").text(filter.category);
	
	$("#time_form > *").not(".time_text_end").hide();
	$("#time_form .time_text_end").text(fillStd(filter.time.std)+" : "+fillMin(filter.time.min)+" h");
	
	var persons = Number(filter.persons);

	makeIngredientHeaderForRecipe(persons);

	

	checkOn($("#chef_" + filter.skill));
	checkOn($("#muffin_" + filter.calorie));
	//blockFilter(true);
}

function getIngredientStep(step) {
	//step-part
	var $left = $("<div></div>").addClass("left");
	var $number = $("<div></div>").addClass("number").text(step.id);
	var $numberContainer = $("<div></div>").addClass("number_container").append($number);

	var $text = $("<div></div>").addClass("text").text(step.text);
	var $mid = $("<div></div>").addClass("mid").append($numberContainer).append($text);

	var $right = $("<div></div>").addClass("right");
	var $step = $("<div></div>").addClass("step").append($left).append($mid).append($right);

	var $ingredientStep = $("<li></li>").addClass("ingredient_step").append($step);
	var ingredients = step.ingredients;

	//TODO testdaten
	// ingredients["Tomaten"] = "300g";
	// ingredients["Mehl"] = "500g";
	// ingredients["Knoblauch"] = "2 Zehen";
	// ingredients["Salz"] = "";

	var text = "";
	for(var i in ingredients) {
		if(ingredients[i].name.length == 0)
			continue;
		text += ingredients[i].menge + " " + ingredients[i].name + ", ";
	}
	text = text.substring(0, text.length - 2);

	if(text.length > 0) {
		var $ingredients = $("<div></div>").addClass("ingredients").text(text);
		$ingredientStep.append($ingredients);
	}

	//all

	return $ingredientStep;
}

function makeIngredientHeaderForRecipe(personNum) {
	var $zutatHead = $("#zutat_head").empty().append("<span>Zutaten für </span>");

	var $personsForm = $("<div></div>").addClass("numberinput persons").append("<input type=\"text\"></input><div class=\"up\"></div><div class=\"down\"></div>");
	var $input = $personsForm.children("input").first().attr({
		id : "persons_num",
		value : personNum,
		size : 2,
		maxlength : 2
	}).data("persons", personNum);

	var person = "<span>" + personNum == 1 ? "Person:" : "Personen:" + "</span>";
	$zutatHead.append($personsForm).append(person);

	var persCount = null;
	$input.keydown(function(e) {
		var $this = $(this);
		if(e.which == 13) {
			persCount = $this.val();
			multiZutaten(persCount);
			$this.blur();
		} else if(e.which == 38) {//up{
			personsUp();
			return false;
		} else if(e.which == 40) {//down
			personsDown();
			return false;
		} else if(!(event.which >= 48 && event.which <= 57) && !(event.which >= 96 && event.which <= 105) && event.which != 8 && event.which != 46)
			return false;

	});

	$personsForm.children(".up").click(personsUp);

	$personsForm.children(".down").click(personsDown);

}

function personsUp() {
	var $input = $("#persons_num");
	var currentNum = Number($input.val());
	var newNum = ((currentNum) % 99) + 1;
	$input.val(newNum);
	multiZutaten(newNum);
}

function personsDown() {
	var $input = $("#persons_num");
	var currentNum = Number($input.val());
	var newNum = ((99 - 2 + currentNum) % 99) + 1;
	$input.val(newNum);
	multiZutaten(newNum);
}

function showShare() {
	var recipeURI = Recipe.getURI($.address.pathNames()[1]);
	var $this = $(this).unbind("click");
	$this.children(".img").hide();
	var $left = $this.children(".left").empty();

	$left.append("<div id=\"fb\"><fb:like colorscheme=\"dark\" width=\"80\" font=\"verdana\" action=\"like\" layout=\"button_count\"></fb:like></div>");

	var anycookuricomponent = encodeURIComponent("http://anycook.de/" + recipeURI);
	var twittertarget = "https://twitter.com/share?url=" + anycookuricomponent + "";
	$left.append("<div id=\"twitter\"></div>").children("div").last().append("<a href=\"" + twittertarget + "\" target=\"_blank\"><span></span></a>");

	$left.append("<div id=\"gplus\"></div>").children("div").last().append("<g:plusone size=\"small\" count=\"false\" href=\"http://anycook.de/" + recipeURI + "\"></g:plusone>");

	$left.children("div").addClass("share_container");

	$("#twitter").click(function() {
		window.open(twittertarget, 'child', 'height=420,width=550');
		return false;
	});

	FB.XFBML.parse(document.getElementById('share'));
	gapi.plusone.go();

	$this.addClass("on");

	$("body").click(function(event) {

		if($(event.target).parents().andSelf().is("#share"))
			return;

		$this.removeClass("on").children(".img").show();

		$left.empty().text("teilen");

		$(this).unbind("click");
		$this.click(showShare);
	});
	// $(".connect_widget_summary").remove();
}

function showaddTags() {

	//TODO show signin
	if(!user.checkLogin())
		return;

	

	var $lightbox = getAddTagsLightbox();

	var top = $("#tags").offset().top - 113;
	showLightbox($lightbox, top);

	$lightbox.find(".tagsbox").click(makeNewTagInput);

	$lightbox.find("form").submit(submitSuggestTags);

	return false;
}

function getAddTagsLightbox() {
	var $content = $("<div class=\"tagsbox\"></div>" + "<p>Die bekanntesten Tags:</p>" + "<div id=\"tagcloud\"></div>")

	var $lightbox = getLightbox("Tags hinzufügen:", "Hilf den anderen beim finden, in dem du neue Tags vorschlägst.", $content, "einreichen");
	makeTagCloud();
	$("#main").append($lightbox);

	return $lightbox;
}

function multiZutaten(perscount, recipe) {

	$("#ingredient_list .amount").each(function(i) {
		var amount = $(this).data("amount");
		if(amount === undefined){
			amount = $(this).text();
			$(this).data("amount", amount);
		}
		var newValue = getNumbersFromString(amount, perscount);
		
		if(recipe!=null){
			var zutat = recipe.ingredients[i];
			//var currentzutattext = $(this).prev().text();
			if(zutat.singular != null) {
				if(getValuefromString(newValue) == 1) {
					$(this).prev().text(zutat.singular);
				} else
					$(this).prev().text(zutat.name);
			}
		}
		$(this).text(newValue);
	});
}

function getNumbersFromString(inputstring, factor) {
	var beginString = "";
	var valueFromString = "";
	var restString = "";

	var postProc = false;
	var i = null;

	for(var n = 0; n < inputstring.length; n++) {
		i = inputstring.substring(n, n + 1);
		if(i.match(/\d/)) {
			valueFromString += i;
			for(var m = n + 1; m < inputstring.length; m++) {
				i = inputstring.substring(m, m + 1);
				if(i.match(/\d/))
					valueFromString += i;
				else if(i == "," || i == ".") {
					valueFromString += ".";
				} else if(i == "-" || i == "/") {
					valueFromString += i;
					postProc = true;
				} else {
					restString += inputstring.substring(m, inputstring.length);
					break;
				}
			}
			break;
		} else
			beginString += i;
	}
	factor = factor / $("#persons_num").data("persons");
	if(beginString.length == inputstring.length)
		return beginString;
	if(postProc)
		return beginString + postProcessString(valueFromString, factor).toString().replace(".", ",") + restString;
	var finalValue = parseFloat(valueFromString) * factor;
	return beginString + handleTrailingNumbers(finalValue).toString().replace(".", ",") + restString;

}

function getValuefromString(inputstring) {
	var valueFromString = "";
	for(var n = 0; n < inputstring.length; n++) {
		var i = inputstring.substring(n, n + 1);
		if(i == "1" || i == "2" || i == "3" || i == "4" || i == "5" || i == "6" || i == "7" || i == "8" || i == "9" || i == "0") {
			valueFromString += i;
			for(var m = n + 1; m < inputstring.length; m++) {
				var i = inputstring.substring(m, m + 1);
				if(i == "1" || i == "2" || i == "3" || i == "4" || i == "5" || i == "6" || i == "7" || i == "8" || i == "9" || i == "0")
					valueFromString += i;
				else if(i == "," || i == ".") {
					valueFromString += ".";
				} else if(i == "-" || i == "/") {
					valueFromString += i;
				} else {
					break;
				}
			}
			break;
		}
	}
	return Number(valueFromString);
}

function handleTrailingNumbers(string) {
	var count = 0;
	string = string.toString();
	for(var n = 0; n < string.length; n++) {
		var i = string.substring(n, n + 1);
		if(i == ".")
			count = string.substring(n + 1, string.length).length;
	}
	if(count < 2)
		return parseFloat(string);
	return parseFloat(string).toFixed(2);
}

function postProcessString(string, factor) {
	var first = "";
	var delimiter = "";
	var second = "";
	var trail = false;
	for(var n = 0; n < string.length; n++) {
		var i = string.substring(n, n + 1);

		if(i == "-" || i == "/") {
			delimiter = i;
			trail = true;
		} else if(trail)
			second += i;
		else
			first += i;
	}
	if(delimiter == "-") {
		var mean = (parseInt(first) + parseInt(second)) / 2;
		return handleTrailingNumbers((mean * factor).toString());
	}
	if(delimiter == "/") {
		var quotient = parseInt(first) / parseInt(second);
		return handleTrailingNumbers((quotient * factor).toString());
	}

}


function schmecktmir(){
		var gericht = $.address.pathNames()[1];
		$("#schmecktmir").unbind("click");
		$.anycook.graph.recipe.makeSchmeckt(gericht, function(response){
				if(response != "false"){
					$("#schmecktmir").addClass("on");
					$("#schmecktmir").click(schmecktmirnicht);
				}				
		});
}

function schmecktmirnicht(){
	var gericht = $.address.pathNames()[1];
	$("#schmecktmir").unbind("click");
	$.anycook.graph.recipe.unmakeSchmeckt(gericht,function(response){
			if(response != "false"){
				$("#schmecktmir").removeClass("on");
				$("#schmecktmir").click(schmecktmir);
			}				
	});
}