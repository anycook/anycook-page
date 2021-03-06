define([
    'jquery',
    'AnycookAPI'
], function($, AnycookAPI){
    'use strict';
    //class Recipe

    //c'tor
    function Recipe(){
        this.name =null;
        this.image = null;
        this.category = null;
        this.beschreibung = null;
        this.skill = null;
        this.calorie = null;
        this.time = {};
        this.persons = null;
        this.steps = [];
        this.ingredients = null;
        this.tags = [];
        this.authors = [];
        this.id = -1;
        this.created = null;
        this.active = false;
        this.tasty = false;
    }

    Recipe.getRecipeName = function(){
        var pathNames = $.address.pathNames();

        if(pathNames.length < 2 || pathNames[0] !== 'recipe') {
            return null;
        }

        return pathNames[1];
    };

    Recipe.loadJSON = function(json){
        var recipe = new Recipe();
        recipe.name = json.name;
        recipe.beschreibung = json.description;
        recipe.category = json.category;
        recipe.persons = json.person;
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
        recipe.image = json.image;
        recipe.tasty = json.tasty;
        return recipe;
    };

    Recipe.prototype.checkRecipe = function(){
        var checker = false;
        $.ajax({
            url:'/anycook/CheckRecipe',
            async:false,
            success:function(response){
                if(response !== 'false'){
                    checker = true;
                }
            }
        });
        return checker;
    };

    Recipe.prototype.getImageURL = function(type){
        return this.image[type];
    };

    Recipe.getImageURL = function(recipename, type){
        return AnycookAPI.recipe.image(recipename, type);
    };

    Recipe.prototype.getURI = function(){
        var uri = '#/recipe/'+encodeURIComponent(this.name);
        return uri;
    };

    Recipe.getURI = function(name){
        var uri = '#/recipe/'+encodeURIComponent(name);
        return uri;
    };

    return Recipe;
});
