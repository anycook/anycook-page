//class Recipe

//c'tor
function Recipe(){
	this.name =null;
	this.kategorie = null;
	this.beschreibung = null;
	this.skill = null;
	this.calorie = null;
	this.time = {};
	this.personen = null;
	this.steps = new Array();
	this.ingredients = null;
	this.tags = new Array();
	this.authors = new Array();
	this.id = -1;
	this.created = null;
	this.active = false;
}

Recipe.getRecipeName = function(){
	var pathNames = $.address.pathNames();
	
	if(pathNames.length < 2 || pathNames[0] != "recipe")
		return null;
		
	return pathNames[1];
};

Recipe.loadJSON = function(json){
	var recipe = new Recipe();
	recipe.name = json.name;
	recipe.beschreibung = json.description;
	recipe.kategorie = json.categorie;
	recipe.personen = json.person;
	recipe.steps = json.steps;
	recipe.skill = json.skill;
	recipe.calorie = json.calorie;
	recipe.time.std = json.timestd;
	recipe.time.min = json.timemin;
	recipe.tags = json.tags;
	recipe.ingredients = json.ingredients;
	recipe.authors = json.authors;
	recipe.id = json.id;
	recipe.created = json.created;
	recipe.active = json.active;
	return recipe;
};

Recipe.prototype.checkRecipe = function(){
	var checker = false;
	$.ajax({
		url:"/anycook/CheckRecipe",
		async:false,
		success:function(response){
			if(response != "false")
				checker = true;
		}
	});
	return checker;
};


Recipe.prototype.resetSchritte = function(){
	this.schritte = new Array();
};

Recipe.prototype.resetZutaten = function() {
	this.zutaten = null;
};

Recipe.prototype.resetTags = function(){
	tags = new Array();
};

Recipe.prototype.getImageURL = function(type){
	if(type === undefined)
		type = "small";
	
	
	return "http://graph.anycook.de/recipe/"+this.name+"/image?type="+type;
};

Recipe.getImageURL = function(recipename, type){
	if(type === undefined)
		type = "small";
	
	
	return "http://graph.anycook.de/recipe/"+recipename+"/image?type="+type;
};


//setter
Recipe.prototype.setName = function(name){
	this.name = name;
	
};

Recipe.prototype.setKategorie = function(kategorie){
	this.kategorie = kategorie;
};

Recipe.prototype.setBeschreibung = function(beschreibung){
	this.beschreibung = beschreibung;
};

Recipe.prototype.setPersonen = function(personen){
	this.personen = personen;
};

Recipe.prototype.setSkill = function(skill) {
	this.skill = skill;
};

// Recipe.prototype.setImagename = function(imagename) {
	// this.imagename = imagename;
// };

Recipe.prototype.setKalorien = function(kalorien){
	this.kalorien = kalorien;
};

Recipe.prototype.setTime = function(std, min) {
	this.std = std;
	this.min = min;
};

Recipe.prototype.addSchritt = function(number, text){
	this.schritte[number] = text;
	
};

Recipe.prototype.addZutat = function(zutat, menge) {
	var temp = new Object();
	temp["menge"] = menge;
	if(this.zutaten==null)
		this.zutaten = new Object();
	
	this.zutaten[zutat] = temp;
};

Recipe.prototype.addZutaten = function(zutaten){
	for(var zutat in zutaten)
		this.addZutat(zutat, zutaten[zutat]);
};

Recipe.prototype.addTag = function(tag){
	this.tags[this.tags.length] = tag;
};

Recipe.prototype.addUsername = function(username){
	this.usernames[this.usernames.length] = username;
};


//send to Server
Recipe.prototype.sendRecipe = function(){
	this.sendRecipeData();
	this.sendSchritte();
	this.sendTags();
	this.sendZutaten();
	return this.saveRecipe();
};

Recipe.prototype.sendRecipeData = function(){
	$.ajax({
		url:"/anycook/AddtoNewRecipe",
		async:false,
		data:"recipe_name="+this.name+"&beschreibung="+this.beschreibung+
			"&kategorie="+this.kategorie+"&std="+this.std+"&min="+this.min+
			"&skill="+this.skill+"&kalorien="+this.kalorien+"&personen="+this.personen
	});
};
Recipe.prototype.sendSchritte = function(){
	$.ajax({
		url:"/anycook/ResetNewRecipe",
		async:false,
		data:"type=schritte"
	});
	for(var i = 0; i<this.schritte.length; i++){
		$.ajax({
			url:"/anycook/AddtoNewRecipe",
			data:"schritt="+this.schritte[i]+"&num="+(i+1)
		});
	}
};

Recipe.prototype.sendZutaten = function(){
	$.ajax({
		url:"/anycook/ResetNewRecipe",
		async:false,
		data:"type=zutaten"
	});
	for(var zutat in this.zutaten){
		$.ajax({
			url:"/anycook/AddtoNewRecipe",
			async:false,
			data:"zutat="+zutat+"&menge="+this.zutaten[zutat].menge
		});
	}
};

Recipe.prototype.sendTags = function(){
	$.ajax({
		url:"/anycook/ResetNewRecipe",
		async:false,
		data:"type=tags"
	});
	for(var i = 0; i<this.tags.length; i++){
		$.ajax({
			url:"/anycook/AddtoNewRecipe",
			async:false,
			data:"tag="+this.tags[i]
		});
	}
};

Recipe.prototype.saveRecipe = function(){
	var checker =false;
	$.ajax({
		async:false,
		url:"/anycook/SaveNewRecipe",
		success:function(response){
			if(response == "true")
				checker=true;
		}
	});
	return checker;
};
//getter

Recipe.prototype.getZutatOnPosition = function(position){
	var i = 0;
	for(var zutat in this.zutaten){
		if(i == position){
			var temp = new Object();
			temp["name"] = zutat;
			temp["menge"] = this.zutaten[zutat].menge;
			temp["singular"] = this.zutaten[zutat].singular;
			return temp;
		}
		i++;
	}
};

Recipe.prototype.getURI = function(){
	var uri = "#!/recipe/"+encodeURIComponent(this.name);
	return uri;
};

Recipe.getURI = function(name){
	var uri = "#!/recipe/"+encodeURIComponent(name);
	return uri;
};

/*Recipe.prototype.getName = function(){
	return this.name;
};

Recipe.prototype.getKategorie = function(){
	return this.kategorie = kategorie;
};

Recipe.prototype.getBeschreibung = function(){
	return this.beschreibung;
};

Recipe.prototype.getSkill = function() {
	return this.skill;
};

Recipe.prototype.getImagename = function() {
	return this.imagename;
};

Recipe.prototype.getPersonen = function(){
	return this.personen;
};

Recipe.prototype.getSchritte = function(){
	return this.schritte;
};

Recipe.prototype.getZutaten = function() {
	return this.zutaten;
};

Recipe.prototype.getTags = function(){
	return this.tags;
};

Recipe.prototype.getUsernames = function(){
	return this.usernames;
};*/

