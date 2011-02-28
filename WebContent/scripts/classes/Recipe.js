//class Recipe

//c'tor
function Recipe(){
	this.name;
	this.kategorie;
	this.beschreibung;
	this.imagename;
	this.skill;
	this.kalorien;
	this.std;
	this.min;
	this.personen;
	this.schritte = new Array();
	this.zutaten = null;
	this.tags = new Array();
	this.usernames = new Array();
}

Recipe.prototype.loadJSON = function(json){
	this.name = json.name;
	this.beschreibung = json.beschreibung;
	this.kategorie = json.kategorie;
	this.imagename = json.imagename;
	this.personen = json.personen;
	this.schritte = json.schritte;
	this.skill = json.skill;
	this.kalorien = json.kalorien;
	this.std = json.std;
	this.min = json.min;
	this.tags = json.tags;
	this.zutaten = json.zutaten;
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
	$.ajax({
		url:"/anycook/ResetNewRecipe",
		async:false,
		data:"type=schritte"
	});
};

Recipe.prototype.resetZutaten = function() {
	this.zutaten = null;
	$.ajax({
		url:"/anycook/ResetNewRecipe",
		async:false,
		data:"type=zutaten"
	});
};

Recipe.prototype.resetTags = function(){
	tags = new Array();
	$.ajax({
		url:"/anycook/ResetNewRecipe",
		async:false,
		data:"type=tags"
	});
};



//setter
Recipe.prototype.setName = function(name){
	this.name = name;
	$.ajax({
		url:"/anycook/AddtoNewRecipe",
		data:"recipe_name="+name
	});
};

Recipe.prototype.setKategorie = function(kategorie){
	this.kategorie = kategorie;
	$.ajax({
		url:"/anycook/AddtoNewRecipe",
		data:"kategorie="+kategorie
	});
};

Recipe.prototype.setBeschreibung = function(beschreibung){
	this.beschreibung = beschreibung;
	$.ajax({
		url:"/anycook/AddtoNewRecipe",
		data:"beschreibung="+beschreibung
	});
};

Recipe.prototype.setPersonen = function(personen){
	this.personen = personen;
	$.ajax({
		url:"/anycook/AddtoNewRecipe",
		data:"personen="+personen
	});
};

Recipe.prototype.setSkill = function(skill) {
	this.skill = skill;
	$.ajax({
		url:"/anycook/AddtoNewRecipe",
		data:"skill="+skill
	});
};

Recipe.prototype.setImagename = function(imagename) {
	this.imagename = imagename;
};

Recipe.prototype.setKalorien = function(kalorien){
	this.kalorien = kalorien;
	$.ajax({
		url:"/anycook/AddtoNewRecipe",
		data:"kalorien="+kalorien
	});
};

Recipe.prototype.setTime = function(std, min) {
	this.std = std;
	this.min = min;
	$.ajax({
		url:"/anycook/AddtoNewRecipe",
		data:"std="+std+"&min="+min
	});
};

Recipe.prototype.addSchritt = function(number, text){
	this.schritte[number] = text;
	$.ajax({
		async:false,
		url:"/anycook/AddtoNewRecipe",
		data:"schritt="+text+"&num="+number
	});
};

Recipe.prototype.addZutat = function(zutat, menge) {
	if(this.zutaten == null)
		this.zutaten = new Object();
	this.zutaten[zutat] = menge;
	$.ajax({
		url:"/anycook/AddtoNewRecipe",
		data:"zutat="+zutat+"&menge="+menge
	});
};

Recipe.prototype.addZutaten = function(zutaten){
	for(var zutat in zutaten)
		this.addZutat(zutat, zutaten[zutat]);
};

Recipe.prototype.addTag = function(tag){
	this.tags[this.tags.length] = tag;
	$.ajax({
		url:"/anycook/AddtoNewRecipe",
		async:false,
		data:"tag="+tag
	});
};

Recipe.prototype.addUsername = function(username){
	this.usernames[this.usernames.length] = username;
};

//getter

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

