//class Recipe

//c'tor
function Recipe(){
	this.name;
	this.kategorie;
	this.beschreibung;
	this.imagename;
	this.skill;
	this.personen;
	this.schritte = new Array();
	this.zutaten = new Object();
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
	this.tags = json.tags;
	this.zutaten = json.zutaten;
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

Recipe.prototype.setImagename = function(imagename) {
	this.imagename = imagename;
};

Recipe.prototype.addSchritt = function(number, text){
	this.schritte[number] = text;
};

Recipe.prototype.addZutat = function(zutat, menge) {
	this.zutaten[zutat] = menge;
};

Recipe.prototype.addTag = function(tag){
	this.tags[this.tags.length] = tag;
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