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
    'classes/Search',
    'classes/User',
    'searchView',
    'stringTools',
    'tags',
    'time',
    'tpl!templates/filters/ingredientRow'
], function($, _, AnycookAPI, Search, User, searchView, stringTools, tags, time, ingredientRowTemplate){
    'use strict';
    // alle Filter
    return {
        setFromSession : function(){
            this.reset();

            var search = Search.init();

            if(search.kategorie){
                $('#kategorie_head').text(search.kategorie);
                $('#kategorie_filter_hidden').val(search.kategorie);
            }
            if(search.skill !== null){
                $('.chefhats').removeAttr('checked');
                this.checkOn($('#chef_'+search.skill));
                // handleRadios($('#filter_table .label_chefhats'));
            }
            if(search.kalorien !== null){
                $('.muffins').removeAttr('checked');
                this.checkOn($('#muffin_'+search.kalorien));
                // handleRadios($('#filter_table .label_muffins'));
            }
            if(search.time){
                $('#time_std').val(search.time.std);
                $('#time_min').val(search.time.min);
            }
            if(search.user){
                this.setUserfilter(search.user);
            }

            for(var num in search.zutaten) {
                this.addIngredientRow(search.zutaten[num]);
            }

            for(var num2 in search.excludedIngredients) {
                this.addExcludedIngredientRow(search.excludedIngredients[num2]);
            }

            for(var num3 in search.tags) {
                $('.tags_list').append(tags.get(search.tags[num3], 'remove'));
            }

            if(search.terms){
                searchView.addTerms(search.terms);
            }
        },
        reset : function(){
            $('#filter_main').removeClass('blocked');
            $('#zutat_head').text('Zutaten:');
            $('#userfilter').hide();
            $('#filter_main').show().css({paddingBottom: '20px', height: 'auto'});
            $('#filter_main *').not('ul.kategorie_filter, #userfilter, #userfilter *, label .active').show().css('opacity', 1);
            $('#filter_headline').text('Filter');

            $('#time_form > *').show();
            $('#time_form .time_text_end').text('h');

            $('#time_std, #time_min').val('0');
            this.removeChecked();
            //blockFilter(false);
            this.handleRadios($('#filter_table .label_chefhats, #filter_table .label_muffins'));
            // handleRadios('.label_chefhats, .label_muffins');
            var $ingredientList = $('#ingredient_list').empty();
            for(var i= 0; i<6; i++){
                $ingredientList.append('<li></li>');
            }

            $('.tags_list').empty();

            $('#kategorie_head').text('keine Kategorie');
            $('#kategorie_filter_hidden').val('keine Kategorie');

            $('#userfilter').hide();

            $('.search_term').remove();
            $('#terms_text').hide();
            $('.close_term').off('click', searchView.removeTerm);
        },
        //kategorie
        loadAllCategories : function($target){
            if($target.children().size() === 0){
                if($target.parents('.step_1_right').length === 0){
                    $target.append('<li><span class="left">alle Kategorien</span><span class="right"></span></li>');
                }

                AnycookAPI.category.sorted(function(json){
                    var totalrecipes = 0;
                    for(var k in json){
                        var category = json[k];
                        $target.append('<li><span class="left">'+category.name+'</span><span class="right">'+category.recipeNumber+'</span></li>');
                        totalrecipes += category.recipeNumber;
                    }
                    $($target.find('.right')[0]).text(totalrecipes);
                });
            }
        },
        handleCategories : function(){
            if(!$('#filter_main').is('.blocked')){
                this.animateCategory($('#kategorie_list'));
                $('#kategorie_filter').toggleClass('on');
            }
        },
        animateCategory : function($kategorieList){
            var newHeight = 9;
            if($kategorieList.height() === newHeight) {
                newHeight += $kategorieList.children('ul').height()+6;
            }

            $kategorieList.animate({
                height:newHeight
            }, {
                duration: 600,
                easing: 'swing'
            });
        },
        mouseoverCategory : function(event){
            var $target = $(event.target);
            if(!$target.is('.left')){
                $target = $target.children('.left');
            }
            $('#kategorie_head').text($target.text());
        },
        mouseleaveCategory : function(){
            var oldtext = $('#kategorie_filter_hidden').val();
            $('#kategorie_head').text(oldtext);
        },
        clickCategory : function(event){
            var $target = $(event.target);
            if(!$target.is('.left')){
                $target = $target.children('.left');
            }
            var text = $target.text();

            this.setKategorie(text);
            this.handleCategories(event);
        },
        setKategorie : function(text){
            var hiddenval = $('#kategorie_filter_hidden').val();
            if(hiddenval !== text){
                if(text === 'keine Kategorie'){
                    text = null;
                }

                var searchObject = Search.init();
                searchObject.setKategorie(text);
                searchObject.flush();
            }
        },
        closeCategories : function(event){
            var $target = $(event.target);

            if(!$target.parents().andSelf().is('#kategorie_filter') && $('#kategorie_filter').hasClass('on')){
                this.handleCategories();
            }
        },
        //radiobuttons
        handleRadios : function($obj){
            $obj.removeClass('on');
            $obj.each(function(){
                var $this = $(this);
                var $input = $this.children('input');
                if($input.attr('checked')) {
                    $this.prevAll().andSelf().addClass('on');
                }
            });
        },
        mouseoverRadio : function(obj){
            $(obj).nextAll().removeClass('on');
            $(obj).prevAll().andSelf().addClass('on');
        },
        removeChecked : function(){
            $('#filter_table label input[checked]').removeAttr('checked');
        },
        checkOnOff : function(obj){
            var $obj=$(obj).children('input').first();
            var value = $obj.val();

            var search = Search.init();

            switch($obj.attr('class')){
            case 'chefhats':
                search.setSkill(value);
                break;
            case 'muffins':
                search.setKalorien(value);
                break;
            }
            search.flush();
        },
        checkOn : function($obj){
            $obj.attr('checked', 'checked');
            this.handleRadios($obj.parent().siblings().andSelf());
        },
        textReplacement : function(input){
            var originalvalue = input.val();
            input.focus( function(){
                if( $.trim(input.val()) === originalvalue ){ input.val(''); }
            });
            input.blur( function(){
                if( $.trim(input.val()) === '' ){ input.val(originalvalue); }
            });
        },
        //zutaten
        ingredientListClick : function(){
            if(!$('#filter_main').is('.blocked')){
                var $target = $(event.target);
                var $input = $target.find('input');

                if($input.length > 0) {
                    $input.focus();
                }
                else{
                    var $li = null;
                    $target.children('li').each(function(){
                        if($li) { return; }
                        if($(this).children().length === 0) { $li = $(this); }
                    });

                    if(!$li){
                        $li = $('<div></div>');
                        $target.append($li);
                    }

                    $li.append('<input type="text" /><div class="close"></div>');

                    $input = $li.children('input');
                    $li.children('.close').hide();
                    $input
                        .focus()
                        .keypress($.proxy(this.addCloseBtn, this))
                        .autocomplete({
                            source : function(req,resp){
                                //var array = [];
                                var term = req.term;
                                var excluded = false;
                                if(term.charAt(0) === '-'){
                                    excluded = true;
                                    term = term.substr(1);
                                    if(term.length === 0) { return; }
                                }

                                var excludedIngredients = [];
                                $('#ingredient_list .ingredient').each(function() {
                                    excludedIngredients.push($(this).text());
                                });

                                AnycookAPI.autocomplete.ingredient(term,excludedIngredients,function(data){
                                    resp($.map(data, function(item){
                                        return{
                                            label:item,
                                            data:item,
                                            value:excluded?'-'+item:item,
                                            excluded:excluded
                                        };
                                    }));
                                });
                            },
                            minlength : 1,
                            autoFocus : true,
                            position : {
                                my : 'left top',
                                at : 'left-5 bottom'
                            },
                            select:function(event, ui){
                                var text = ui.item.data;
                                $('#ingredient_list input').autocomplete('destroy');

                                var search = Search.init();
                                if(ui.item.excluded) { search.excludeIngredient(text); }
                                else { search.addZutat(text); }
                                search.flush();
                                return false;
                            }
                        });
                    $('.ui-autocomplete').last().addClass('ingredient-autocomplete');
                }
            }
        },
        addCloseBtn : function(event){
            var $target = $(event.target);

            var val = $target.val();
            if(event.which === 13){
                $target.autocomplete('destroy');
                var search = Search.init();
                search.addZutat(val);
                search.flush();
            }else if((val + String.fromCharCode(event.which)).length > 0){
                $target.siblings().first().fadeIn(500);
            }
        },
        removeIngredientField : function(event){
            var $target = $(event.target);
            var  $input = $target.siblings('input');
            if($input.length === 1){
                $input.remove();
                $target.remove();
            }else{
                var $li = $target.parent();
                var ingredient = $target.siblings('.ingredient').text();
                var search = Search.init();
                if($li.hasClass('excluded')){
                    search.removeExcludedingredient(ingredient);
                }
                else {
                    search.removeZutat(ingredient);
                }
                search.flush();
            }
        },
        //userfilter
        setUserfilter : function(userId){
            var self = this;
            AnycookAPI.user(userId, function(user){
                var uri = User.getProfileURI(userId);
                var imagePath = AnycookAPI.user.image(userId);
                $('#userfilter a').attr('href', uri);
                $('#userfilter img').attr('src', imagePath);
                $('#userfilter_name').text(user.name);
                $('#userfilterremove').click(self.removeUserfilter);

                if($('#userfilter').css('display') === 'none'){
                    $('#userfilter').css({display:'block', opacity:0, height:0}).animate({height:50}, {
                        duration:300,
                        complete:function(){
                            $(this).animate({opacity:1}, 400);
                        }
                    });
                }
            });
        },
        removeUserfilter : function(){
            $('#userfilter').animate({opacity:0}, {duration:400, complete:function(){
                $(this).animate({height:0}, {duration:300, complete:function(){
                    $(this).css({display:'none', opacity:1, height:50});
                    //var username = $('#userfiltername').text();
                    $('#userfiltertext').html('');
                    var search = Search.init();
                    search.setUsername(null);
                    search.flush();
                }});
            }});
        },
        addIngredientRow : function(ingredient){
            var $ingredientList = $('#ingredient_list');
            var $li = null;
            $ingredientList.children('li').each(function(){
                var $this = $(this);
                if($li) { return; }
                if($this.children().length === 0) { $li = $this; }
            });

            if(!$li){
                $li = $('<li></li>');
                $ingredientList.append($li);
            }

            var template = ingredientRowTemplate({name : ingredient});
            $li.append(template);
            return $li;
        },
        addExcludedIngredientRow : function(ingredient){
            return this.addIngredientRow(ingredient).addClass('excluded');
        },
        clickExcludeIngredient : function(event){
            var ingredient = $(event.target).siblings('.ingredient').text();
            var search = Search.init();
            search.removeZutat(ingredient);
            search.excludeIngredient(ingredient);
            search.flush();
        },
        clickAddIngredient : function(event){
            var ingredient = $(event.target).siblings('.ingredient').text();
            var search = Search.init();
            search.addZutat(ingredient);
            search.removeExcludedingredient(ingredient);
            search.flush();
        },
        //recipe
        setFromRecipe : function(recipe){
            $('#filter_headline').text('Legende');
            $('#filter_main').addClass('blocked');
            $('#kategorie_head').text(recipe.category);

            $('#time_form > *').not('.time_text_end').hide();
            $('#time_form .time_text_end').text(time.fillStd(recipe.time.std)+' : '+time.fillMin(recipe.time.min)+' h');

            var persons = Number(recipe.persons);

            this.makeIngredientHeaderForRecipe(persons);

            this.checkOn($('#chef_' + recipe.skill));
            this.checkOn($('#muffin_' + recipe.calorie));
            //blockFilter(true);
        },
        makeIngredientHeaderForRecipe : function(personNum) {
            var $zutatHead = $('#zutat_head').empty().append('<span>Zutaten für </span>');

            var $personsForm = $('<div></div>').addClass('numberinput persons').append('<input type=\'text\'></input><div class=\'up\'></div><div class=\'down\'></div>');
            var $input = $personsForm.children('input').first().attr({
                id : 'persons_num',
                value : personNum,
                size : 2,
                maxlength : 2
            }).data('persons', personNum);

            var person = '<span>' + personNum === 1 ? 'Person:' : 'Personen:' + '</span>';
            $zutatHead.append($personsForm).append(person);

            var persCount = null;
            var self = this;
            $input.keydown(function(e) {
                var $this = $(this);
                if(e.which === 13) {
                    persCount = $this.val();
                    self.multiplyIngredients(persCount);
                    $this.blur();
                } else if(e.which === 38) {//up{
                    self.personsUp();
                    return false;
                } else if(e.which === 40) {//down
                    self.personsDown();
                    return false;
                } else if(!(event.which >= 48 && event.which <= 57) && !(event.which >= 96 && event.which <= 105) && event.which !== 8 && event.which !== 46){
                    return false;
                }

            });

            $personsForm.children('.up').click($.proxy(this.personsUp, this));

            $personsForm.children('.down').click($.proxy(this.personsDown, this));

        },
        personsUp : function() {
            var $input = $('#persons_num');
            var currentNum = Number($input.val());
            var newNum = ((currentNum) % 99) + 1;
            $input.val(newNum);
            this.multiplyIngredients(newNum);
        },
        personsDown : function() {
            var $input = $('#persons_num');
            var currentNum = Number($input.val());
            var newNum = ((99 - 2 + currentNum) % 99) + 1;
            $input.val(newNum);
            this.multiplyIngredients(newNum);
        },
        multiplyIngredients : function(perscount, recipe) {

            $('#ingredient_list .amount').each(function(i) {
                var amount = $(this).data('amount');
                if(amount === undefined){
                    amount = $(this).text();
                    $(this).data('amount', amount);
                }
                var newValue = stringTools.getNumbersFromString(amount, perscount);

                if(recipe){
                    var zutat = recipe.ingredients[i];
                    //var currentzutattext = $(this).prev().text();
                    if(zutat.singular) {
                        if(stringTools.getValuefromString(newValue) === 1) {
                            $(this).prev().text(zutat.singular);
                        } else {
                            $(this).prev().text(zutat.name);
                        }
                    }
                }
                $(this).text(newValue);
            });
        }
    };
});

