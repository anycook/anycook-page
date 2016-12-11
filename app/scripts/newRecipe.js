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
    'classes/User',
    'drafts',
    'filters',
    'popup',
    'recipeView',
    'scroll',
    'newRecipe/step1',
    'newRecipe/step2',
    'newRecipe/step3',
    'tags'
], function($, _, AnycookAPI, User, drafts, filters, popup, recipeView, scroll, step1, step2, step3,
            tags) {
    'use strict';
    return {
        load: function() {
            //navigation
            var path = $.address.path();
            for (var i = 1; i <= 4; i++) {
                $('#nav_step' + i).attr('href', '#' + path + '?step=' + i);
            }
            $('.nav_button').click(function() {
                if ($(this).hasClass('inactive')) {
                    return false;
                }
            });

            //if resizing
            $('.sliding_container').resize(function() {
                var id = $(this).attr('id');
                var stepNum = id.substring(4);
                var currentStep = $.address.parameter('step') || 1;
                if (stepNum !== currentStep) {
                    return;
                }

                var height = $(this).height();
                $('#recipe_editing_container').height(height);
            });

            //step1
            step1.load();

            //step2
            step2.load();

            //step3
            step3.load();

            //preview (step4)
            $('#submit_recipe').click($.proxy(this.saveRecipe, this));

            //draft
            var user = User.get();
            if (user.checkLogin()) {
                var id = $.address.parameter('id');
                if (!id) {
                    drafts.init(function(id) {
                        $.address.parameter('id', id);
                    });
                    return;
                } else {
                    //link
                    drafts.open(id, $.proxy(this.fillNewRecipe, this));
                    $('.nav_button, #step4 a').not('#cancel_recipe').attr('href',
                        function(i, attr) {
                            return attr + '&id=' + id;
                        });

                    $('#cancel_recipe').show();
                }
            }
        },
        saveRecipe: function() {
            var ingredients = step2.getIngredients();
            var ingredientsCheck = ingredients !== undefined && ingredients.length > 0;

            var persons = step2.getPersons();
            var personCheck = persons !== undefined && persons > 0;

            if (step1.isValid() && step2.isValid() &&
                ingredientsCheck && personCheck && step3.isValid()) {

                var recipe = {
                    name: step1.getRecipeName(),
                    steps: step2.getSteps(),
                    image: step1.getImageName(),
                    description: step1.getDescription(),
                    ingredients: ingredients,
                    category: step3.getCategory(),
                    time: step3.getTime(),
                    skill: step3.getSkill(),
                    calorie: step3.getCalorie(),
                    persons: persons,
                    tags: step3.getTags()
                };

                var id = $.address.parameter('id');
                if (id) {
                    recipe.mongoId = id;
                }

                AnycookAPI.recipe.save(recipe, function() {
                    popup.show('Vielen Dank!',
                        'Dein Rezept wurde eingereicht und wird überprüft.<br/>' +
                        'Wir benachrichtigen dich, sobald dein Rezept akiviert wurde.<br/>' +
                        '<br/>Dein anycook-Team');
                    $('body').on('click', function() {
                        $.address.path('');
                        $('.fixedpopup').remove();
                    });

                    $('.fixedpopup').show(1).delay(5000).fadeOut(500, function() {
                        $(this).remove();
                        var pathNames = $.address.pathNames();
                        if (pathNames.length > 0 && pathNames[0] === 'recipeediting') {
                            $.address.path('');
                        }
                    });
                });

                return false;
            }
        },
        addressChange: function(event) {
            filters.reset();
            var $editingContainer = $('#recipe_editing_container');
            $editingContainer.removeClass('step2 step3');
            var $navigation = $('.navigation');
            $navigation.children().removeClass('active');

            var stepNum = Number(event.parameters.step);
            if (!stepNum) {
                stepNum = 1;
            }

            var step1Left = 0;
            switch (stepNum) {
                case 4:
                    $navigation.children('#nav_step4').removeClass('inactive');
                    var id = $.address.parameter('id');
                    //draft
                    var user = User.get();

                    if (user.checkLogin() && id) {
                        drafts.open(id, $.proxy(this.loadPreview, this));
                    }
                    else {
                        var data = {
                            time: step3.getTime(),
                            skill: step3.getSkill(),
                            calorie: step3.getCalorie(),
                            category: step3.getCategory(),
                            persons: step2.getPersons(),
                            ingredients: step2.getIngredients(),
                            steps: step2.getSteps(),
                            name: step1.getRecipeName(),
                            image: step1.getImageName(),
                            tags: step1.getTags()
                        };
                        this.loadPreview(data);
                    }
                    step1Left -= 655;
                /* falls through */
                case 3:
                    $navigation.children('#nav_step3').removeClass('inactive');
                    step1Left -= 655;
                /* falls through */
                case 2:
                    $navigation.children('#nav_step2').removeClass('inactive');
                    step1Left -= 655;
                /* falls through */
                default:
                    $navigation.children('#nav_step' + stepNum).addClass('active');
                    var $step1 = $('#step1');
                    var $step2 = $('#step2');
                    var $step3 = $('#step3');
                    var $step4 = $('#step4');

                    var animate = function() {
                        $step1.animate({left: step1Left}, {
                            duration: 800,
                            easing: 'easeInOutCirc',
                            step: function(now) {
                                $step2.css('left', now + 655);
                                $step3.css('left', now + 2 * 655);
                                $step4.css('left', now + 3 * 655);
                            },
                            complete: function() {
                                if (stepNum === 1) {
                                    $step1.trigger($.Event('resize'));
                                }
                                if (stepNum === 2) {
                                    $step2.trigger($.Event('resize'));
                                }
                                if (stepNum === 4) {
                                    $step4.trigger($.Event('resize'));
                                }
                            }
                        });
                    };

                    var scrollTop = $(document).scrollTop();
                    if (scrollTop > 10) {
                        scroll.backToTheTop(1000, animate);
                    }
                    else {
                        animate();
                    }

            }
            return false;
        },
        //drafts
        fillNewRecipe: function(json) {
            //step1
            if (json.image) {
                step1.showImage(AnycookAPI.upload.imagePath(json.image));
            }
            if (json.name) {
                $('#new_recipe_name').val(json.name);
            }
            if (json.description) {
                $('#new_recipe_introduction').val(json.description);
            }

            //step2
            var $step2 = $('#step2');
            if (json.steps) {
                step2.fillSteps(json.steps);
            }
            if (json.ingredients) {
                $step2.data('ingredients', json.ingredients);
            }
            if (json.persons) {
                $step2.data('numPersons', json.persons);
            }

            //step3
            var $step3 = $('#step3');

            if (json.category) {
                var $container = $('#select_container');
                $container.find('span').text(json.category);
                $container.find('option').each(function() {
                    var $this = $(this);
                    if ($this.val() === json.category) {
                        $this.attr('selected', 'selected');
                    }
                });
            }
            if (json.time) {
                $step3.find('.std').val(json.time.std);
                $step3.find('.min').val(json.time.min);
            }

            if (json.skill) {
                step3.find('.label_chefhats input[value=\'' + json.skill + '\']')
                    .prop('checked', true);
                filters.handleRadios($step3.find('.label_chefhats'));
            }

            if (json.calorie) {
                $step3.find('.label_muffins input[value=\'' + json.calorie + '\']')
                    .prop('checked', true);
                filters.handleRadios($step3.find('.label_muffins'));
            }

            if (json.tags) {
                var $tagsbox = $('.tagsbox');
                for (var i  in json.tags) {
                    $tagsbox.append(tags.get(json.tags[i], 'remove'));
                }
            }
        },
        resetNewRecipeHeight: function($container) {
            var height = $container.height() + 20;
            $('#recipe_editing_container').animate({height: height}, {duration: 500});
        },
        watchForIngredients: function() {
            var id = $(document).data('watchForIngredients');
            var $newIngredients = $('.new_ingredient');
            if ($newIngredients.length === 0) {
                $(document).removeData('watchForIngredients');
                window.clearInterval(id);
                return;
            }
            if (!id) {
                id = window.setInterval($.proxy(this.watchForIngredients, this), 1000);
                $(document).data('watchForIngredients', id);
            }

            for (var i = 0; i < $newIngredients.length; i++) {
                if (step2.isValid()) {
                    $(document).removeData('watchForIngredients');
                    window.clearInterval(id);
                    $('#no_ingredients_error').fadeOut(300);
                    break;
                }
            }

        },
        loadPreview: function(data) {
            var $step4 = $('#step4');
            var image = data.image || 'category/sonstiges.png';
            $step4.find('.recipe_image_container img')
                .attr('src', AnycookAPI.upload.imagePath(image))
                .load(function() {
                    $('#step4').trigger($.Event('resize'));
                });
            $('#recipe_headline').text(step1.getRecipeName());
            $('#introduction').text(step1.getDescription());

            recipeView.loadSteps(data.steps);
            filters.setFromRecipe(data);
            recipeView.loadIngredients(data.ingredients);

            var tagObjects = [];
            for (var i in data.tags) {
                tagObjects.push({name: data.tags[i]});
            }

            recipeView.loadTags(tagObjects);
            var id = $.address.parameter('id');
            $('.tags_list a').attr('href', function() {
                if (id) {
                    return '#/recipeediting?step=3&id=' + id;
                }
                return '#/recipeediting?step=3';
            });
            $('#filter_main.blocked').one('click', function() {
                $.address.parameter('step', 3);
            });

            $step4.trigger($.Event('resize'));
            // if($.address.parameter('step') == 4)
            // 	resetNewRecipeHeight($('#step4'));
            //var height = $('#step4').height()
            //$('#recipe_editing_container').css('height', height+20);
        }
    };
});
