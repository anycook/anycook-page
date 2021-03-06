/**
 * @license This file is part of anycook. The new internet cookbook
 * Copyright (C) 2014 Jan Graßegger
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see [http://www.gnu.org/licenses/].
 * 
 * @author Jan Graßegger <jan@anycook.de>
 */
define([
	'jquery',
	'AnycookAPI',
	'classes/User'
], function($, AnycookAPI, User){
	'use strict';

	function Search(){
		this.skill = null;
		this.kalorien = null;
		this.kategorie = null;
		this.time = null;
		this.zutaten = [];
		this.excludedIngredients = [];
		this.tags = [];
		this.terms = null;
		this.user = null;
	}

	Search.init = function(){
		var temp = new Search();
		var pNames = $.address.parameterNames();
		for(var i in pNames){
			var value = decodeURIComponent($.address.parameter(pNames[i]));
			switch(pNames[i]){
			case 'tags':
				temp.tags = value.split(',');
				break;
			case 'kategorie':
				temp.kategorie = value;
				break;
			case 'excludedIngredients':
				temp.excludedIngredients = value.split(',');
				break;
			case 'zutaten':
				temp.zutaten = value.split(',');
				break;
			case 'skill':
				temp.skill = value;
				break;
			case 'kalorien':
				temp.kalorien = value;
				break;
			case 'user':
				temp.user = value;
				break;
			case 'time':
				var splits =  value.split(':');

				temp.time = {
					std : Number(splits[0]),
					min : Number(splits[1])
				};
				break;
			case 'terms':
				temp.terms = value;
				break;
			}
		}
		return temp;
	};


	Search.prototype.addTag = function(tag){
		for(var i in this.tags){
			if(this.tags[i] === tag) { return; }
		}
		this.tags[this.tags.length] = tag;
	};

	Search.prototype.removeTag = function(tag){
		for(var i = 0; i<this.tags.length; i++){
			if(this.tags[i] === tag){
				this.tags.splice(i, 1);
				break;
			}
		}
	};

	Search.prototype.addZutat = function(zutat){
		for(var i in this.zutaten){
			if(this.zutaten[i] === zutat) { return; }
		}
		this.zutaten[this.zutaten.length] = zutat;
	};


	Search.prototype.removeZutat = function(zutat){
		for(var i = 0; i<this.zutaten.length; i++){
			if(this.zutaten[i] === zutat){
				this.zutaten.splice(i, 1);
				break;
			}
		}
	};

	Search.prototype.excludeIngredient = function(excludedIngredient){
		for(var i in this.excludedIngredients){
			if(this.excludedIngredients[i] === excludedIngredient) { return; }
		}
		this.excludedIngredients[this.excludedIngredients.length] = excludedIngredient;
	};

	Search.prototype.removeExcludedingredient = function(zutat){
		for(var i = 0; i<this.excludedIngredients.length; i++){
			if(this.excludedIngredients[i] === zutat){
				this.excludedIngredients.splice(i, 1);
				break;
			}
		}
	};

	Search.prototype.setTerms = function(terms){
		this.terms = terms;
	};

	Search.prototype.setKategorie = function(kategorie){
		this.kategorie = kategorie;
	};

	Search.prototype.setSkill = function(skill){
		if(this.skill === skill) { this.skill = null; }
		else { this.skill = skill; }
	};

	Search.prototype.setKalorien = function(kalorien){
		if(this.kalorien === kalorien) { this.kalorien = null; }
		else { this.kalorien = kalorien; }
	};

	Search.prototype.setUsername = function(username){
		if(username === 'me'){
			var user = User.get();
			if(user.checkLogin()) { username = user.name; }
			else { username = null; }
		}
		this.user = username;
	};

	Search.prototype.getData = function(){
		var data = {};
		if(this.tags.length > 0) { data.tags = this.tags; }
		if(this.kategorie !== null) { data.category = this.kategorie; }
		if(this.zutaten.length > 0) { data.ingredients = this.zutaten; }
		if(this.excludedIngredients.length > 0) { data.excludedIngredients = this.excludedIngredients; }
		if(this.terms !== null) { data.terms = this.terms; }
		if(this.kalorien !== null) { data.calorie = this.kalorien; }
		if(this.skill !== null) { data.skill = this.skill; }
		if(this.user !== null) { data.user = this.user; }
		if(this.time !== null){ data.time = this.time; }
		return data;
	};

	Search.prototype.search = function(start, num){
		if(!start) { start = 0; }
		if(!num){ num = 10; }
		
		//setFiltersfromSession();
		$('html').trigger('startSearch');

		var data = this.getData();
		data.num = num;
		data.start = start;
		
		if(start === 0){ $('#result_container').empty(); }
		// $.when($.anycook.graph.search(data),user.getSchmecktRecipes()).then(function(json, schmeckt){
		AnycookAPI.search(data,function(json){
			if(json && json.size > 0){
				$('html').trigger('searchResults', json);
			}else {
				$('html').trigger('emptySearchResult');
			}
		});
	};


	Search.prototype.setTime = function(time){
		this.time = time;
	};

	Search.prototype.flush = function(){
		$.address.autoUpdate(false);
		
		if(this.hasData()) { $.address.path('/search'); }
		else { $.address.path(''); }
		
		$.address.parameter('tags' , this.tags);
		$.address.parameter('zutaten', this.zutaten);
		$.address.parameter('excludedIngredients', this.excludedIngredients);
		$.address.parameter('terms', this.terms);
		$.address.parameter('kategorie', this.kategorie);
		$.address.parameter('skill', this.skill);
		$.address.parameter('kalorien', this.kalorien);
		$.address.parameter('user', this.user);
		$.address.parameter('time', this.time !== null ? this.time.std+':'+this.time.min : null);
		$.address.autoUpdate(true);
		$.address.update();
	};

	Search.prototype.hasData = function(){
		var check = this.skill !== null || this.kalorien !== null || this.kategorie !== null ||
			this.time !== null || this.zutaten.length > 0 || this.excludedIngredients.length > 0 ||
			this.tags.length > 0 || this.terms !== null || this.user !== null;
		return check;
	};

	return Search;
});



