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
    'underscore',
    'AnycookAPI',
    'classes/Recipe',
    'classes/Search',
    'classes/User',
    'tpl!templates/emptySearchResult',
    'tpl!templates/searchResult',
    'jquery.autoellipsis'
], function($, _, AnycookAPI, Recipe, Search, User, emptySearchResultTemplate, searchResultTemplate){
    'use strict';
    return {
        addResults : function(event, json){
            var recipes = json.results;

            var currentRecipes = $('#result_container').data('recipes');
            if(!currentRecipes || $('.frame_big').length === 0){
                currentRecipes = [];
                $(document).scroll($.proxy(this.moreResultsScrollListener, this));
            }

            // var start = $('.frame_big').length;
            var self = this;
            $.each(recipes, function(i, recipe){
                var $frameBig = $(self.getBigFrame(recipe));
                $frameBig = $frameBig.appendTo('#result_container');
                // $('#result_container').append($frameBig);
                var $text = $frameBig.find('.recipe_text');
                var $p = $text.children('p');
                var $h3 = $text.children('h3');
                var height = $text.innerHeight()-($h3.outerHeight(true)+($p.outerHeight(true)-$p.innerHeight()));
                $p.css('height',height).ellipsis();
            });

            currentRecipes = currentRecipes.concat(recipes);
            $('#result_container').data('recipes', currentRecipes).data('size', json.size);
        },
        searchAutocomplete: function(req,resp){
            var term = req.term;
            if(term.charAt(0) === '-'){
                if(term.length > 1){
                    this.autocompleteExcludedIngredients(term.substr(1), resp);
                }
            }
            else{
                this.autocomplete(term,resp);
            }
        },
        autocompleteExcludedIngredients : function(term, resp){
            AnycookAPI.autocomplete.ingredient(term, function(data){
                var array = [];
                for(var i=0;i<data.length;i++){
                    if(i === 0){
                        array[array.length] = {label: '<div class="autocomplete-h1">Zutaten</div><div class="autocomplete-p">'+data[i]+'</div>', value: '-'+data[i],data:'excludedIngredients'};
                    }
                    else{
                        array[array.length] = { label: '<div class="autocomplete-p">'+data[i]+'</div>', value: '-'+data[i],data:'excludedIngredients'};
                    }
                }
                resp(array);
            });
        },
        autocomplete : function(term, resp){
            var search = Search.init();
            var categorie = search.kategorie;
            var ingredients = search.zutaten;
            var tags = search.tags;
            var user = search.user;

            AnycookAPI.autocomplete(term, categorie, ingredients, tags, user, function(data){
                var array = [];
                if(data.recipes){
                    for(var i=0; i < data.recipes.length; i++){
                        if(i === 0){
                            array[array.length] = { label: '<div class="autocomplete-h1">Gerichte</div><div class="autocomplete-p">'+data.recipes[i]+'</div>', value: data.recipes[i],data:'recipes'};
                        }
                        else{
                            array[array.length] = { label: '<div class="autocomplete-p">'+data.recipes[i]+'</div>', value: data.recipes[i],data:'recipes'};
                        }
                    }
                }
                if(data.ingredients){
                    for(var j=0; j<data.ingredients.length; j++){
                        if(j === 0){
                            array[array.length] = { label: '<div class="autocomplete-h1">Zutaten</div><div class="autocomplete-p">'+data.ingredients[j].name+'</div>', value: data.ingredients[j].name,data:'ingredients'};
                        }
                        else{
                            array[array.length] = { label: '<div class="autocomplete-p">'+data.ingredients[j].name+'</div>', value: data.ingredients[j].name,data:'ingredients'};
                        }
                    }
                }
                if(data.kategorien){
                    for(var k=0; k<data.kategorien.length; k++){
                        if(k === 0){
                            array[array.length] = { label: '<div class="autocomplete-h1">Kategorien</div><div class="autocomplete-p">'+data.kategorien[k]+'</div>', value: data.kategorien[k],data:'kategorie'};
                        }
                        else{
                            array[array.length] = { label: '<div class="autocomplete-p">'+data.kategorien[k]+'</div>', value: data.kategorien[k],data:'kategorie'};
                        }
                    }
                }
                if(data.tags){
                    for(var l=0; l<data.tags.length; l++){
                        if(l===0){
                            array[array.length] = { label: '<div class="autocomplete-h1">Tags</div><div class="autocomplete-p">'+data.tags[l]+'</div>', value: data.tags[l], data:'tag'};
                        }
                        else{
                            array[array.length] = { label: '<div class="autocomplete-p">'+data.tags[l]+'</div>', value: data.tags[l], data:'tag'};
                        }
                    }
                }
                if(data.user){
                    for(var m=0; m<data.user.length; m++){
                        if(m===0){
                            array[array.length] = { label: '<div class="autocomplete-h1">User</div><div class="autocomplete-p">'+data.user[m].name+'</div>', value: data.user[m].name, data:'user', id :data.user[m].id};
                        }
                        else{
                            array[array.length] = { label: '<div class="autocomplete-p">'+data.user[m].name+'</div>', value: data.user[m].name, data:'user', id :data.user[m].id};
                        }
                    }
                }
                resp(array);
            });
        },
        searchKeyDown : function(event){
            var newFocus;
            switch(event.keyCode){
                case 40: // down
                    newFocus = $(this).next();
                    break;
                case 38:
                    newFocus = $(this).prev();
                    break;

            }
            if(newFocus !== undefined){
                newFocus.focus();
                return false;
            }

        },
        moreResultsScrollListener : function(){
            var $bigFrames = $('.frame_big');
            if($.address.pathNames()[0] !== 'search' || $bigFrames.length === $('#result_container').data('size')){
                $(document).unbind('scroll', $.proxy(this.moreResultsScrollListener, this));
                return;
            }

            var scrollTop = $(window).scrollTop() + $(window).height();
            var top = $bigFrames.last().position().top;
            if(scrollTop > top +100){
                // addResults();
                var start = $('.frame_big').length;
                var search = Search.init();
                search.search(start);
            }

        },
        makeSearchHeader : function(){
            if($('#first_search_layout').length === 0){
                var headertext = '<div class="float_right_header">' +
                        '<div id="first_search_layout" class="small_button"><div></div></div>' +
                        //'<div id='second_search_layout' class='small_button'><div></div></div>' +
                        //'<div id='third_search_layout' class='small_button'><div></div></div>' +
                        '</div>';
                $('#content_header').html(headertext);
                $('#recipe_general_btn').click(function(){
                    $.address.parameter('page', '');
                });
            }
        },
        /*handleSearchResults : function(result, terms){
            $('#search').val('');
            if(terms === 'Gerichte, Zutaten, Tags, ...')
                return;

            if(result.gerichte){
                gotoGericht(result.gerichte);
            }
            else if(result.kategorien){
                search.setKategorie(result.kategorien[0]);
                search.flush();
            }
            else if(result.tags!){
                search.addTag(result.tags[0]);
                search.flush();
            }
            else if(result.zutaten){
                search.addZutat(result.zutaten[0]);
                search.flush();
            }
            else if(result.excludedingredients){
                search.excludeIngredient(result.excludedingredients[0]);
                search.flush();
            }
            else if(result.user){
                gotoProfile(result.user[0]);
            }
            else if(terms !== ''){
                search.addTerm(terms);
                search.flush();
            }
            return false;
        },*/
        addTerms : function(terms){
            /*if($('.search_term').length === 0){
                $('#terms_text').show();
                $('.close_term').live('click', removeTerm);
            }


            for(var i in search.terms){
                if(search.terms[i]!= ''){
                    $('#search_terms').append('<div class=\'search_term\'><span>'+search.terms[i]+'</span><div class=\'close_term\'>x</div></div>');
                }
            }*/
            $('#search').val(terms);
        },
        focusoutSearch : function(){
            $('#search').val('');
        },
        getBigFrame : function(json){
            var std = json.time.std.toString();
            if(std.length === 1){
                std = '0' + std;
            }

            var min = json.time.min.toString();
            if(min.length === 1){
                min = '0' + min;
            }

            var user = User.get();
            var schmeckt = $.inArray(json.name, user.schmeckt)>=0;

            $.extend(json, {
                uri : encodeURI('/#/recipe/' + json.name),
                imageURL : json.image.small,
                time : {
                    std : std,
                    min : min
                },
                schmeckt : schmeckt
            });

            var template = searchResultTemplate(json);
            return template;

        },
        showEmptyResult : function(){
            $('#result_container').html(emptySearchResultTemplate());
            AnycookAPI.discover.recommended(function(json){
                $('#discover_recommended').recipeoverview('diese Rezepte könnten dir auch schmecken...', json);
            });
        }
    };
});
