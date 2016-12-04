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
    'drafts',
    'filters',
    'tags',
    'time'
], function($, AnycookAPI, drafts, filters, tags, time) {
    'use strict';
    return {
        load: function() {
            var self = this;
            AnycookAPI.category.sorted(function(json) {
                var $categorySelect = $('#category_select');
                for (var i in json) {
                    $categorySelect.append('<option>' + json[i].name + '</option>');
                }
            });
            $('#category_select').change(function() {
                var $this = $(this);
                var text = $this.val();
                $('#select_container').find('span').text(text);
                drafts.save('category', text);
                self.isValid();
                $('#category_error').fadeOut(300);
            });

            $('#step3 .label_chefhats, #step3 .label_muffins').click(function(event) {
                event.preventDefault();
                var $this = $(this);
                var $input = $this.children('input');

                var check = !$input.prop('checked');
                $this.parent().find('input').prop('checked', false);

                if (check) {
                    $input.prop('checked', true);
                }

                filters.handleRadios($this);
                var name = $input.attr('name') === 'new_muffins' ? 'calorie' : 'skill';

                if ($input.prop('checked')) {
                    drafts.save(name, $input.val());
                }
                else {
                    drafts.save(name, '0');
                }

                self.isValid();
                if (name === 'calorie') {
                    $('#muffin_error').fadeOut(300);
                }
                else {
                    $('#skill_error').fadeOut(300);
                }
            }).mouseover(function() {
                filters.mouseoverRadio(this);
            });

            $('#step3').find('.label_container').mouseleave(function() {
                filters.handleRadios($(this).children());
            });

            $('#step3 .std,#step3 .min')
                .keydown($.proxy(this.keyTime, this))
                .change($.proxy(this.draftTime, this))
                .keyup($.proxy(this.draftTime, this))
                .focus(function() {
                    self.isValid();
                    $('#time_error').fadeOut(300);
                })
                .siblings('.up, .down')
                .click($.proxy(time.upDownListener, time))
                .click($.proxy(this.draftTime, this))
                .click(function() {
                    self.isValid();
                    $('#time_error').fadeOut(300);
                });

            $('#new_recipe_tagsbox').click({
                add: $.proxy(this.addTag, this),
                remove: $.proxy(this.removeTag, this)
            }, $.proxy(tags.makeInput, tags))
                .on('click', '.tag_remove', function() {
                    var tag = $(this).prev().text();
                    self.removeTag(tag);
                    return false;
                });
            tags.makeCloud('#new_recipe_tagcloud', function(event) {
                var $clickedTag = $(event.target).parents('.tag');
                var tag = $clickedTag.find('.tag_text').text();
                self.addTag(tag);

                $clickedTag.animate({
                    opacity: 0
                }, {
                    duration: 150,
                    complete: function() {
                        $(this).animate({
                            width: 0,
                            margin: 0,
                            padding: 0
                        }, {
                            duration: 300,
                            easing: 'swing',
                            complete: function() {
                                $(this).remove();
                            }
                        });
                    }
                });
            });

            $('#open_preview').click($.proxy(this.submit, this));
        },
        addTag: function(tag) {
            var $tag = tags.get(tag, 'remove');
            var $tagsBox = $('#new_recipe_tagsbox');
            $tagsBox.find('input').remove();
            $tagsBox.append($tag);
            this.draftTags();
        },
        removeTag: function(tag) {
            $('#new_recipe_tagsbox').find('.tag_text').each(function() {
                if ($(this).text() === tag) {
                    $(this).parents('.tag').remove();
                }
            });
            this.draftTags();
        },
        checkCategory: function() {
            var category = $('#select_container').find('span').text();
            return category !== '' && category !== 'Kategorie auswählen';
        },
        checkTime: function() {
            var time = this.getTime();
            return time.std !== '0' || time.min !== '0';
        },
        checkSkill: function() {
            var skill = this.getSkill();
            return skill !== undefined;
        },
        checkCalorie: function() {
            return this.getCalorie() !== undefined;
        },
        getCategory: function() {
            return $('#select_container').find('span').text();
        },
        getSkill: function() {
            return $('#step3').find('.chefhats:checked').val();
        },
        getCalorie: function() {
            return $('#step3').find('.muffins:checked').val();
        },
        getTime: function() {
            var $step3 = $('#step3');
            var std = $step3.find('.std').val();
            var min = $step3.find('.min').val();
            return {std: std, min: min};
        },
        draftTags: function() {
            drafts.save('tags', this.getTags());
        },
        draftTime: function() {
            drafts.save('time', this.getTime());
        },
        getTags: function() {
            var $tags = $('.tagsbox .tag_text');
            var tags = [];
            for (var i = 0; i < $tags.length; i++) {
                tags[tags.length] = $tags.eq(i).text();
            }
            return tags;
        },
        isValid: function() {
            if (this.checkCategory() && this.checkTime() && this.checkSkill() &&
                this.checkCalorie()) {
                $('#nav_step3').nextAll().removeClass('inactive');
                return true;
            } else {
                $('#nav_step3').nextAll().addClass('inactive');
                return false;
            }
        },
        submit: function() {
            var check = true;
            if (!this.checkCategory()) {
                $('#category_error').fadeIn(300);
                check = false;
            }

            if (!this.checkTime()) {
                $('#time_error').fadeIn(300);
                check = false;
            }

            if (!this.checkSkill()) {
                $('#skill_error').fadeIn(300);
                check = false;
            }

            if (!this.checkCalorie()) {
                $('#muffin_error').fadeIn(300);
                check = false;
            }

            if (!check) {
                $('#open_preview').effect('shake', {distance: 5, times: 2}, 50);
            } else {
                $.address.parameter('step', '4');
            }
        }
    };
});
