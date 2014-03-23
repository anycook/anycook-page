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
    'jquery.recipeoverview',
    'AnycookAPI',
    'classes/Recipe',
    'classes/User',
    'header',
    'loginMenu',
    'news',
    'jscrollpane'
], function($, AnycookAPI, Recipe, User, header, loginMenu, news){
    'use strict';
    return {
        load : function(){
            // var headertext = '<a href=\'/#!\' id='home_button' class='small_button'><div></div></a>' +
                    // '<a href=\'/#!/?page=discover\' id='discover_button' class='big_button'>Entdecken</a>';
            // $('#content_header').html(headertext);
            // //new stuff

            $('#subnav').empty()
                .append(header.buildLink('Startseite', '/#', 'startpage_button').addClass('active'))
                .append(header.buildLink('Entdecken', '/#?page=discover', 'discover_button').addClass('active'));
                //.append(getHeaderLink('Küchengeplapper', '/#!/?page=stream', 'discussion_btn'));

            AnycookAPI.recipe.ofTheDay(function(recipeOfTheDay){
                var recipeName = recipeOfTheDay.name;
                $('#recipe_of_the_day').attr('href', Recipe.getURI(recipeName))
                    .text(recipeName);
            });

            AnycookAPI.recipe.number(function(num){
                $('#num_recipes').text(num);
            });

            AnycookAPI.tag.number(function(num){
                $('#num_tags').text(num);
            });

            AnycookAPI.ingredient.number(function(num){
                $('#num_ingredients').text(num);
            });

            var user = User.get();

            if(user.checkLogin()){
                $('.login_or_register').hide();
            } else {
                $('.login_btn').click(loginMenu.toggle);
            }


            //liveupdatestuff
            $('#news ul').jScrollPane().scroll(function(e){ news.scrollListener(e); });

            news.updateLiveAtHome();
        },
        discover : function(){
            AnycookAPI.discover(function(json){
                $('#discover_tasty').recipeoverview('leckerste Rezepte', json.tasty);
                $('#discover_new').recipeoverview('neueste Rezepte', json.newest);
                $('#discover_recommended').recipeoverview('diese Rezepte könnten dir auch schmecken...', json.recommended);
            });
        }
    };
});
