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
    'drafts',
    'lightbox',
    'stringTools',
    'tpl!templates/newRecipe/ingredientStep',
    'tpl!templates/newRecipe/ingredientLine',
    'tpl!templates/lightboxContent/newIngredientsContent',
    'tpl!templates/lightboxContent/newIngredientsHeadline',
    'jquery.inputdecorator',
    'jquery.ui.sortable'
], function($, _, AnycookAPI, drafts, lightbox, stringTools, ingredientStepTemplate, ingredientLineTemplate, newIngredientsContentTemplate, newIngredientsHeadlineTemplate){
    'use strict';
    return {
        load : function(){
            var $firstStep = this.getIngredientStep(1);
            $('#new_step_container').append($firstStep)
                .sortable({
                    placeholder:'step-placeholder',
                    forcePlaceholderSize : true,
                    cursorAt : {bottom: 200},
                    distance: 15,
                    axis: 'y',
                    containment: 'parent',
                    opacity:0.75,
                    scroll:true,
                    tolerance:'pointer',
                    update: $.proxy(this.updateStepNumbers, this)
                });
                //.disableSelection();
            $firstStep.find('textarea').inputdecorator('maxlength', {
                color : '#878787',
                decoratorFontSize: '8pt',
                change : $.proxy(this.validate, this)
            });
            var self = this;
            $('#add_new_step').click(function(){
                var $newStep = self.getIngredientStep($('.new_ingredient_step').length+1);

                $('#new_step_container')
                .append($newStep);
                $newStep.find('textarea').inputdecorator('maxlength', {
                    color:'#878787',
                    decoratorFontSize:'8pt',
                    change:$.proxy(self.validate, self)
                });
                $('#step2').trigger($.Event('resize'));
            });

            $('#ingredient_overview').click($.proxy(this.makeIngredientLightBox, this));
            // watchSteps();

            $('#step2').on('focusout', 'input, textarea', $.proxy(this.draftSteps, this));
        },
        isValid : function(){
            var stepcheck = false;
            $('.new_step textarea').each(function(){
                if($(this).val().length > 0){
                    stepcheck = true;
                }
            });

            var ingredientcheck = false;
            $('#step2 .new_ingredient').each(function(){
                if($(this).val().length > 0){
                    ingredientcheck = true;
                }
            });
            return stepcheck && ingredientcheck;
        },
        validate : function(event){
            var self = this;
            var $target = $(event.target);
            var text = $target.val();
            var $step = $target.parents('.ingredient_step');
            if(!event.empty){
                var lastSentences = $target.data('sentences');
                if(!lastSentences){ lastSentences = []; }

                var currentSentences = text.split(/[!.?:;]+/g);

                var currentIngredients = this.getCurrentStepIngredients();
                $target.data('sentences', currentSentences);
                //console.log(currentSentences);
                var addIngredients = function(json){
                    var $stepIngredients = $step.find('.new_ingredient');
                    var $stepQuestions = $step.find('.new_ingredient_question .ingredient');
                    var ingredients = [];
                    for(var i = 0; i < $stepIngredients.length; i++){
                        ingredients[i] = $stepIngredients.eq(i).val();
                    }

                    for(var j = 0; j < $stepQuestions.length; j++){
                        var text = $stepQuestions.eq(j).text();
                        ingredients.push(text);
                    }

                    for(var k in json){
                        var ingredient = json[k].name;
                        if($.inArray(ingredient, ingredients) > -1){
                            continue;
                        }

                        if($.inArray(ingredient, currentIngredients) > -1){
                            var $ingredientQuestion = self.getIngredientQuestion(ingredient);
                            $step.find('.new_ingredient_list').append($ingredientQuestion);
                            continue;
                        }

                        self.addStepIngredient($step, ingredient);
                    }
                    self.draftSteps();
                };

                for(var i = 0; i < currentSentences.length; i++){
                    if(lastSentences.length > i && currentSentences[i] === lastSentences[i] || currentSentences[i].length === 0){
                        continue;
                    }

                    AnycookAPI.ingredient.extract(currentSentences[i], addIngredients);
                }

            }else{
                if(!this.isValid()){
                    $('#nav_step2').nextAll().addClass('inactive');
                }
            }
        },
        submit : function(event){
            event.preventDefault();

            var check = true;
            if(!this.checkValidateLightboxPersons()){
                check = false;
                $('#numberinput_error').fadeIn(300);
            }

            if(!this.checkValidateLightboxIngredients()){
                check = false;
                $('#ingredientoverview_error').fadeIn(300);
                this.watchForLightboxIngredients();
            }

            if(!check){
                $(event.target).find('input[type=\'submit\']').effect('shake', {distance:5, times:2}, 50);
                return;
            }

            this.saveLightbox();
            lightbox.hide();
            $.address.parameter('step', '3');
        },
        //steps
        fillSteps : function(steps){
            var $newStepContainer = $('#new_step_container').empty();
            for(var i in steps){
                var step = steps[i];
                var $step = this.getIngredientStep(step.id, step.text, step.ingredients);
                $newStepContainer.append($step);
                $step.find('textarea').inputdecorator('maxlength', {
                    color : '#878787',
                    decoratorFontSize : '8pt',
                    change : $.proxy(this.validate, this)
                });
            }
        },
        getIngredientStep : function(number, text, ingredients){
            var data = {
                number : number,
                text : text
            };

            var $template = $(ingredientStepTemplate(data));
            $template.find('.remove_new_step span').click($.proxy(this.removeStep, this));
            $template.find('.add_new_ingredient_line span').click($.proxy(this.addIngredientLine, this));
            $template.find('.new_ingredient_list').sortable({
                axis: 'y',
                // containment: 'parent',
                cursorAt:{top : 0},
                distance: 15,
                forcePlaceholderSize : true,
                opacity:0.75,
                placeholder: 'ingredient-placeholder',
                tolerance:'pointer',
                update: $.proxy(this.updateIngredients, this)
            });

            var $newIngredientList = $template.find('.new_ingredient_list');

            if(!ingredients || ingredients.length === 0){
                $newIngredientList.append(this.getIngredientLine());
            }
            else{
                for(var i in ingredients){
                    $newIngredientList.append(this.getIngredientLine(ingredients[i].name, ingredients[i].menge));
                }
            }
            return $template;
        },
        getIngredientLine : function(name, menge){
            var data = {
                name : name || '',
                menge : menge || ''
            };

            var $template = $(ingredientLineTemplate(data));
            $template.find('.new_ingredient_menge').focusout($.proxy(stringTools.formatAmount, stringTools));
            $template.find('.remove_new_ingredient_line').click($.proxy(this.removeIngredientLine, this));

            var $ingredient = $template.find('.new_ingredient');

            $ingredient.autocomplete({
                source:function(req,resp){
                    //var array = [];
                    var term = req.term;

                    var $list = $template.parent('ul');

                    var excludedIngredients = [];
                    $list.find('.new_ingredient').not($ingredient).each(function() {
                        excludedIngredients.push($(this).val());
                    });

                    AnycookAPI.autocomplete.ingredient(term,excludedIngredients,function(data){
                        resp($.map(data, function(item){
                            item = item.name;
                            return{
                                label:item,
                                data:item,
                                value:item
                            };
                        }));
                    });
                },
                minlength:1,
                autoFocus:true,
                position:{
                    offset:'-5 1'
                },
                select:function(event, ui){
                    var text = ui.item.data;
                    $ingredient.val(text);
                    return false;
                }
            }).data('ui-autocomplete')._renderMenu = function( ul, items ) {
                var that = this;
                $.each( items, function( index, item ) {
                    that._renderItemData( ul, item );
                });
                $( ul ).addClass('ingredient-autocomplete new-ingredient-autocomplete');
            };

            return $template;
        },
        fillPersons : function(persons){
            $('#new_num_persons').val(persons);
        },
        getPersons : function(){
            return $('#step2').data('numPersons');
        },
        updateStepNumbers : function(){
            this.draftSteps();

            $('.new_ingredient_step .number').each(function(i){
                $(this).text(i+1);
            });
        },
        getCurrentStepIngredients : function(){
            var stepingredients = [];
            var $ingredients = $('.new_ingredient_step .new_ingredient');
            for(var i =0; i<$ingredients.length; i++){
                stepingredients.push($ingredients.eq(i).val());
            }
            return stepingredients;
        },
        getIngredientQuestion : function(ingredient){
            var self = this;
            var $span = $('<span></span>').html('<span class=\'ingredient\'>'+ingredient+'</span> auch zu diesem Schritt hinzufügen?').addClass('new_ingredient_question');
            var $spanJa =  $('<a></a>').text('Ja').addClass('yes')
                .click(function(event){
                    var $this = $(this);
                    // var ingredient = $this.prev().text();
                    // ingredient = ingredient.substring(0, ingredient.length -35);
                    self.addStepIngredient($this.parents('.new_ingredient_step'), ingredient);
                    self.removeIngredientQuestion(event);
                });
            var $spanNein =  $('<a></a>').text('Nein').addClass('no')
                .click($.proxy(this.removeIngredientQuestion, this));

            var $li = $('<li></li>').addClass('ingredient_question')
                .append($span)
                .append($spanJa)
                .append($spanNein);

            return $li;
        },
        removeIngredientQuestion : function(event){
            $(event.target).parent().fadeOut(300);
        },
        draftSteps : function(){
            drafts.save('steps', this.getSteps());
        },
        getSteps : function(){
            var $newIngredientSteps = $('.new_ingredient_step');
            var steps = [];
            for(var i = 0; i < $newIngredientSteps.length; i++){
                var $ingredientStep = $($newIngredientSteps[i]);
                var stepText = $ingredientStep.find('textarea').val();
                var id = i+1;
                var $ingredients = $ingredientStep.find('.new_ingredient_line');
                var ingredients = [];
                for(var j = 0; j< $ingredients.length;  j++){
                    var $ingredient = $($ingredients[j]);
                    var ingredient = $ingredient.children('.new_ingredient').val();
                    var menge = $ingredient.children('.new_ingredient_menge').val();
                    var ingredientMap = {name:ingredient, menge:menge};
                    ingredients[ingredients.length] = ingredientMap;
                }
                var step = {id:id, text:stepText, ingredients:ingredients};
                steps[steps.length] = step;
            }
            return steps;
        },
        removeStep : function(event){
            var $step = $(event.target).parents('.ingredient_step');

            if($step.siblings().length > 0){
                $step.remove();
                this.makeStepNumbers();
                // resetNewRecipeHeight($('#step2'));
                this.draftSteps();
                $('#step2').trigger($.Event('resize'));
            }

        },
        makeStepNumbers : function(){
            $('.new_ingredient_step .number').each(function(i){
                $(this).text(i+1);
            });
        },
        addIngredientLine : function(event){
            var $list = $(event.target).parents('.ingredients').children('ul');
            var $newIngredientLine = this.getIngredientLine();
            $list.append($newIngredientLine);
            // if($.address.parameter('step') == 2)
            //  resetNewRecipeHeight($('#step2'));

            $newIngredientLine.children('.new_ingredient');
            $('#step2').trigger($.Event('resize'));
        },
        removeIngredientLine : function(event){

            var $li = $(event.target).parents('li.new_ingredient_line');
            if($li.siblings('.new_ingredient_line').length > 0){
                $li.remove();
                // resetNewRecipeHeight($('#step2'));
                this.draftSteps();
                this.draftIngredients();
                $('#step2').trigger($.Event('resize'));
            }

            return false;
        },
        draftIngredients : function(){
            drafts.save('ingredients', this.getIngredients());
        },
        getIngredients : function(){
            return $('#step2').data('ingredients');
        },
        addStepIngredient : function($step, ingredient){
            var $stepIngredients = $step.find('.new_ingredient');
            var $ingredientLine = null;
            for(var j = 0; j < $stepIngredients.length; j++){
                var $stepIngredient = $($stepIngredients[j]);
                if($stepIngredient.val().length === 0){
                    $ingredientLine = $stepIngredient.parent();
                }
            }

            if($ingredientLine === null){
                $ingredientLine = this.getIngredientLine().hide();
                $step.find('.new_ingredient_line').last().after($ingredientLine.fadeIn(300));
            }

            $ingredientLine.children('.new_ingredient').val(ingredient);
            $('#step2').trigger($.Event('resize'));
        },
        //lightbox
        makeIngredientLightBox : function(){
            //ingredientOverview
            var numPersons = $('#step2').data('numPersons');

            var headline = newIngredientsHeadlineTemplate({numPersons : !numPersons ? 0 : numPersons});

            $('<ul></ul>').addClass('new_ingredient_list');

            var content = newIngredientsContentTemplate();

            var $lightbox = lightbox.get(headline,
            'Dies sind alle Zutaten, die du in den Schritten angegeben hast. '+
            'Falls Zutaten fehlen, füge diese bitte noch zu den entsprechenden Schritten hinzu.', content, 'Rezept abschließen')
                .addClass('ingredient_overview');
            $('#main').append($lightbox);

            $lightbox.find('form').submit($.proxy(this.submit, this));

            var self = this;
            $lightbox.find('.numberinput input').keydown(function(e){
                var $this = $(this);
                if(e.which === 13){
                    //persCount = $this.val();
                    $this.blur();
                }else if(e.which === 38){ //up{
                    self.personsUp();
                    return false;
                }else if(e.which === 40){ //down
                    self.personsDown();
                    return false;
                }else if(!(event.which >= 48 &&  event.which <= 57) && !(event.which >= 96 &&  event.which <= 105) &&
                    event.which !== 8 && event.which !== 46){
                    return false;
                }

                if($this.val() !== '' && $this.val() !== '0'){
                    $('#numberinput_error').fadeOut(300);
                }
                drafts.save('persons', $this.val());
            });

            $lightbox.find('.numberinput .up').click($.proxy(this.personsUp, this));
            $lightbox.find('.numberinput .down').click($.proxy(this.personsDown, this));
            $lightbox.find('.new_ingredient_list').sortable({
                axis: 'y',
                // containment: 'parent',
                cursorAt:{top : 0},
                distance: 15,
                forcePlaceholderSize : true,
                opacity:0.75,
                placeholder: 'ingredient-placeholder',
                tolerance:'pointer',
                //update: $.proxy(this.updateLightboxIngredients, this)
            });

            this.showIngredientLightbox();

            return false;
        },
        saveLightbox : function(){
            var $lis = $('.lightbox').find('li');
            var ingredients = [];
            for(var i = 0; i<$lis.length; i++){
                var $li = $lis.eq(i);
                var name = $li.children('.new_ingredient').val();
                var menge = $li.children('.new_ingredient_menge').val();
                var ingredient =  {name:name, menge:menge};
                ingredients[ingredients.length] = ingredient;
            }

            $('#step2').data('ingredients', ingredients);
            drafts.save('ingredients', ingredients);

            var numPersons = $('#newRecipePersonsNumber').val();
            $('#step2').data('numPersons', numPersons);

        },
        personsUp : function(){
            var $input = $('#newRecipePersonsNumber');
            var currentNum = Number($input.val());
            var newNum = ((currentNum)%99)+1;
            drafts.save('persons', newNum);
            $('#step2').data('numPersons', newNum);
            $input.val(newNum);
            $('#numberinput_error').fadeOut(300);
        },
        personsDown : function(){
            var $input = $('#newRecipePersonsNumber');
            var currentNum = Number($input.val());
            var newNum = ((99 - 2 + currentNum)%99)+1;
            drafts.save('persons', newNum);
            $('#step2').data('numPersons', newNum);
            $input.val(newNum);
            $('#numberinput_error').fadeOut(300);
        },
        showIngredientLightbox : function(){
            var $this = $(this);
            var $lightbox = $('.lightbox');
            if(this.getIngrededientsForOverview()){
                this.draftIngredients();
                var $ingredientOverview = $('#ingredient_overview');
                var bottom = $ingredientOverview.offset().top - 60;
                lightbox.showFromBottom($lightbox, bottom);
                $lightbox.on('focusout', 'input', $.proxy(this.draftIngredients, this));
            }else{
                $('#no_ingredients_error').fadeIn(300);
                $this.effect('shake', {distance:5, times:2}, 50);
                //TODO watchForIngredients();
            }
            return false;
        },
        getIngrededientsForOverview : function(){
            var ingredients = {};
            if(!this.isValid()){
                return false;
            }

            $('#step2 .new_ingredient_line').each(function(){
                var $this = $(this);
                var ingredient = $this.children('.new_ingredient').val();
                if(ingredient.length === 0){
                    return;
                }
                var menge = $this.children('.new_ingredient_menge').val();
                if(ingredients[ingredient] !== undefined){
                    ingredients[ingredient] = stringTools.mergeAmount(ingredients[ingredient], menge);
                }
                else{
                    ingredients[ingredient] = menge;
                }

            });


            var $ul = $('.lightbox ul').empty();

            for(var ingredient in ingredients){
                var $ingredientLine = this.getIngredientLine();
                $ingredientLine.children('.new_ingredient').val(ingredient);
                $ingredientLine.children('.new_ingredient_menge').val(ingredients[ingredient]);
                $ul.append($ingredientLine);
            }



            return true;
        },
        checkValidateLightboxPersons : function(){
            var personcheck = false;
            var $lightbox = $('.lightbox');
            var persons = $lightbox.find('#newRecipePersonsNumber').val();
            if(persons !== ''  && Number(persons) > 0){
                personcheck = true;
            }

            return personcheck;
        },
        checkValidateLightboxIngredients : function(){
            var $lightbox = $('.lightbox');
            var ingredienttexts = $lightbox.find('.new_ingredient').val();
            for(var i in ingredienttexts){
                if(ingredienttexts[i].length > 0){
                    return true;
                }
            }
            return false;
        }
    };
});
