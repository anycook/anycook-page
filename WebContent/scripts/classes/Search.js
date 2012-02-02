function Search(){
	this.skill = null;
	this.kalorien = null;
	this.kategorie = null;
	this.time = null;
	this.zutaten = new Array();
	this.tags = new Array();
	this.terms = new Array();
	this.user = null;
}

Search.init = function(){
	var temp = new Search();
	var pNames = $.address.parameterNames();
	for(var i in pNames){
		var value = decodeURIComponent($.address.parameter(pNames[i]));
		switch(pNames[i]){
		case "tags":			
			temp.tags = value.split(",");
			break;
			
		case "kategorie":
			temp.kategorie = value;
			break;
		
		case "zutaten":
			temp.zutaten = value.split(",");
			break;
			
		case "skill":
			temp.skill = value;
			break;
			
		case "kalorien":
			temp.kalorien = value;
			break;
			
		case "user":
			temp.user = value;
			break;
			
		case "time":
			temp.time = value;
			break;
			
		case "terms":
			temp.terms = value.split(",");
			break;
		}
		
	}
	return temp;
};


Search.prototype.addTag = function(tag){	
	for(var i in this.tags){
		if(this.tags[i] == tag) return;
	}
	
	this.tags[this.tags.length] = tag;
};

Search.prototype.removeTag = function(tag){
	for(var i = 0; i<this.tags.length; i++){
		if(this.tags[i]==tag){
			this.tags.splice(i, 1);
			break;
		}
	}
};

Search.prototype.addZutat = function(zutat){
	for(var i in this.zutaten){
		if(this.zutaten[i] == zutat) return;
	}
	
	this.zutaten[this.zutaten.length] = zutat;
};

Search.prototype.removeZutat = function(zutat){
	for(var i = 0; i<this.zutaten.length; i++){
		if(this.zutaten[i]==zutat){
			this.zutaten.splice(i, 1);
			break;
		}
	}
};

Search.prototype.addTerm = function(term){
	for(var i in this.terms){
		if(this.terms[i] == term) return;
	}
	
	this.terms[this.terms.length] = term;
};

Search.prototype.removeTerm = function(term){
	for(var i = 0; i<this.terms.length; i++){
		if(this.terms[i]==term){
			this.terms.splice(i, 1);
			break;
		}
	}
};

Search.prototype.setKategorie = function(kategorie){
	this.kategorie = kategorie;
};

Search.prototype.setSkill = function(skill){
	if(this.skill == skill)
		this.skill = null;
	else
		this.skill = skill;
};

Search.prototype.setKalorien = function(kalorien){
	if(this.kalorien == kalorien)
		this.kalorien = null;
	else
		this.kalorien = kalorien;
};

Search.prototype.setUsername = function(username){
	if(username == "me"){
		if(user.checkLogin()) username = user.name;
		else username = null;
	}
	this.user = username;
};

Search.prototype.getData = function(){
	var data = {};
	if(this.tags.length > 0)
		data.tags = this.tags.toString();
	if(this.kategorie != null)
		data.category = this.kategorie;
	if(this.zutaten.length > 0)
		data.ingredients = this.zutaten.toString();
	if(this.terms.length > 0)
		data.terms = this.terms.toString();
	if(this.kalorien != null)
		data.calorie = this.kalorien;
	if(this.skill != null)
		data.skill = this.skill;
	if(this.user != null)
		data.user = this.user;
	if(this.time != null){
		data.time = this.time;
	}
	
	return data;
};

Search.prototype.search = function(){
	setFiltersfromSession();
	var data = this.getData();
	//if(data=="" ) return;
	// $.blockUI({message:null});
	
	$("#result_container").empty();
	
	$.anycook.graph.search(data,function(json){
		if(json && json.size > 0){
			$("#result_container").data("results", json);
			addResults();
			$(".frame_big:focus").live("keydown", searchKeyDown);
			$(".frame_big").live("mouseenter", function(){
				$(".frame_big:focus").blur();
			});
		}else
	  		$("#result_container").html("<div id='noresult_headline'>Uups! Nichts gefunden...</div><div id='noresult_subline'>Passe deine aktuelle Suche an oder schmier dir ein Brot.</div><a href='#/' id='noresult_reset'>Suche zurücksetzen</a>");
	});
};


Search.prototype.setTime = function(time){
	this.time = time;
};

Search.prototype.flush = function(){
	$.address.autoUpdate(false);
	
	if(this.hasData())		
		$.address.path("/search");
	else
		$.address.path("");
	
	$.address.parameter("tags" , this.tags);
	$.address.parameter("zutaten", this.zutaten);
	$.address.parameter("terms", this.terms);
	$.address.parameter("kategorie", this.kategorie);
	$.address.parameter("skill", this.skill);
	$.address.parameter("kalorien", this.kalorien);
	$.address.parameter("user", this.user);
	$.address.parameter("time", this.time);
	$.address.autoUpdate(true);
	$.address.update();
};

Search.prototype.hasData = function(){
	var check = this.skill != null || this.kalorien != null || this.kategorie != null 
		|| this.time != null || this.zutaten.length > 0 || this.tags.length > 0
		|| this.terms.length > 0 || this.user != null;
	return check;
};



