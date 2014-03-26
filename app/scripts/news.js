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
    'classes/Recipe',
    'classes/User'
], function($, AnycookAPI, Recipe, User){
    'use strict';
    return {
        updateLiveAtHome : function(){
            var path = $.address.path();
            var newestid = this.getNewestId();

            if(path === '/'){
                var data = {newestid:newestid};
                var self = this;
                AnycookAPI.life(data,function(response){
                    self.parseAndAddLiveAtHome(response);
                    window.setTimeout($.proxy(self.updateLiveAtHome, self), 5000);
                });
            }
        },
        getNewestId : function(){
            var newestid = $('#news li').first().data('id');
            if(!newestid){
                newestid = 0;
            }
            return Number(newestid);
        },
        parseAndAddLiveAtHome : function(json){
            var $ul = $('#news ul');
            if(json.length>0)
            {
                var newestid = this.getNewestId();
                var $container = $ul.find('.jspPane');
                if($container.length === 0){
                    $container = $ul;
                }

                var empty = false;
                if($ul.find('li').length === 0){
                    empty = true;
                }

                var newestRecipes = [];
                var recipes = {};

                for(var i in json){
                    var $li = this.parseLife(json[i]);
                    if(json[i].id > newestid){

                        $container.prepend($li);
                        /*if(!empty){
                            $li.css('height', 0).hide();
                            $li.animate({height : '49px'}, {duration : 200, complete : function() {
                                $li.fadeIn(500);
                            }});
                        }*/
                        var recipe = json[i].recipe;
                        if(recipe){
                            var index = $.inArray(recipe.name, newestRecipes);
                            if(index > -1) { newestRecipes.splice(index, 1); }
                            else { recipes[recipe.name] = recipe; }

                            newestRecipes.unshift(recipe.name);

                            if(newestRecipes.length > 3) { newestRecipes.splice(newestRecipes.length -1, 1); }
                        }
                    } else{
                        $container.append($li);
                        var recipe2 = json[i].recipe;
                        if(recipe2 && newestRecipes.length < 3 && $('#newestRecipes p a').length < 3 && newestRecipes.indexOf(recipe2.name) === -1){
                            newestRecipes.push(recipe2.name);
                            recipes[recipe2.name] = recipe2;
                        }
                    }

                    /*if(!empty){
                        var oldMarginTop = $('#news_inhalt div:first').css('margin-top');
                        var newMarginTop = 0 - $('#news_inhalt div:first').outerHeight();
                        $ul.find('li').first().css({'margin-top': newMarginTop, 'opacity': 0})
                            .animate({marginTop: oldMarginTop, opacity: 1});
                    }*/
                }
                var active = $('#news .jspDrag').hasClass('jspActive');
                $ul.jScrollPane();
                if(active){
                    $('#news .jspDrag').addClass('jspActive');
                }

                var $p = $('#newestRecipes p');

                for(var k = 0; k < newestRecipes.length; k++) { $p.children().last().remove(); }

                for(var j = newestRecipes.length - 1; j >= 0; j--){
                    //see jquery.recipeoverview.js
                    var recipe3 = recipes[newestRecipes[j]];
                    var img = recipe3.image.small;

                    var $img = $('<img src="'+img+'"/>');

                    var href = Recipe.getURI(recipe3.name);
                    var $a = $('<a></a>').attr('href', href)
                        .append($img).append('<div><span>'+recipe3.name+'</span></div>');

                    $p.prepend($a);
                }
            }
        },
        parseLife : function(life){
            var text = life.syntax;
            var regex = /#[ug]/;
            var pos = text.search(regex);
            var userid = -1;
            while(pos>=0){
                var array;
                var uri;
                var link;
                if(text[pos+1] === 'u'){
                    array = text.split('#u');
                    text = '';
                    for(var i = 0; i<array.length-1; ++i){
                        uri = User.getProfileURI(life.user.id);
                        userid = life.user.id;
                        link = '<a href="'+uri+'">'+life.user.name+'</a>';
                        text+=array[i]+link;
                    }
                    text+=array[array.length-1];
                }
                else if(text[pos+1] === 'g'){
                    array = text.split('#g');
                    text = '';
                    for(var j = 0; j<array.length-1; ++j){
                        uri = encodeURI('/#/recipe/'+life.recipe.name);
                        link = '<a href="'+uri+'">'+life.recipe.name+'</a>';
                        text+=array[j]+link;
                    }
                    text+=array[array.length-1];
                }

                pos = text.search(regex);
            }

            var imagePath = life.user.image.small;

            var $li = $('<li></li>').append('<div class="left"><img src="'+imagePath+'"></div><div class="right"></div>').data('id', life.id);

            var user = User.get();
            if(user.checkLogin() && user.isFollowing(userid)){
                $li.addClass('following');
            }

            $li.children('.right').html(text);
            return $li;
        },
        scrollListener : function(e){
            var $target = $(e.target);
            var $last = $target.find('li').last();
            var delta = $last.offset().top-($target.offset().top+ $target.height());
            if(delta < 40){
                $target.unbind('scroll');
                var oldestid = $last.data('id');
                var data = {oldestid:oldestid};
                var self = this;

                AnycookAPI.life(data,function(response){
                    self.parseAndAddLiveAtHome(response);
                    $target.scroll($.proxy(self.scrollListener, self));
                });
            }
            return false;
        }
    };
});
