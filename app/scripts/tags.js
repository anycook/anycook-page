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
    'classes/Search'
], function($, AnycookAPI, Recipe, Search) {
    'use strict';
    return {
        get: function(name, type, number) {
            var $tag;

            if (type === 'link' || type === 'linknumber') {
                $tag = $('<a href="#/search/tagged/' + name + '"></a>');
            }
            else {
                $tag = $('<div></div>');
            }

            var $right = $tag.addClass('tag')
                .append('<div class="right"></div>')
                .children()
                .append('<div class="tag_text">' + name + '</div>');

            if (type === 'remove') {
                var $remove = $('<div>x</div>').addClass('tag_remove')
                    .click($.proxy(this.removeNewTag, this));
                $right.append($remove);
            }
            else if (type === 'number' || type === 'linknumber') {
                $right.append('<div class="tag_num">' + number + '</div>');
            }

            return $tag;
        },
        remove: function(event) {
            var $tag = $(event.target).parents('.tag');
            var text = $tag.find('.tag_text').text();
            $tag.remove();
            //this.removeInput();
            event.data.remove(text);
        },
        makeCloud: function(target, addTag) {
            var $tagcloud = $(target).empty();
            var data = '';

            var self = this;

            var recipe = Recipe.getRecipeName();
            if (recipe !== null) {
                data += 'recipe=' + recipe;
            }

            $tagcloud.on('click', '.tag', addTag);

            AnycookAPI.tag.popular(recipe, function(response) {
                for (var i in response) {
                    var tag = response[i];
                    $tagcloud
                        .append(self.get(tag.name, 'number', tag.recipeNumber));
                }
            });
        },
        //add fields 'add' and 'remove' for callbacks
        makeInput: function(event) {
            var self = this;
            var $target = $(event.target);

            if (!event.data) {
                event.data = {};
            }
            if (!event.data || !event.data.add || typeof event.data.add !== 'function') {
                console.error('no add function defined');
                $.extend(event.data, {
                    add: function(text) {
                        console.log(
                            'with callback ' + text + ' would be added');
                    }
                });
            }
            if (!event.data.remove || typeof event.data.remove !== 'function') {
                console.error('no remove function defined');
                $.extend(event.data, {
                    remove: function(text) {
                        console.log(
                            'with callback ' + text + ' would be removed');
                    }
                });
            }

            if (event !== undefined) {
                if ($target.parents().addBack().is('.tag')) {
                    return;
                }
            }

            if ($target.children('input').length === 0 && $target.parents(
                    '.blocked').length === 0) {
                //make new input field
                $target.append('<input type="text"/>')
                    .addClass('active')
                    .children('input')
                    .focus()
                    .autocomplete({
                        source: function(req, resp) {
                            var term = req.term;
                            AnycookAPI.autocomplete.tag(term, function(data) {
                                resp($.map(data, function(item) {
                                    return {
                                        label: item.name
                                    };
                                }));
                            });
                        },
                        autoFocus: true,
                        minlength: 1,
                        position: {
                            offset: '-1 1'
                        },
                        select: function(e, ui) {
                            e.preventDefault();
                            if (!ui.item) {
                                return false;
                            }
                            var text = ui.item.label;
                            $(this).autocomplete('destroy');

                            event.data.add(text);
                            self.makeInput(event);
                        }
                    }).data('ui-autocomplete')._renderMenu =
                    function(ul, items) {
                        var that = this;
                        $.each(items, function(index, item) {
                            that._renderItemData(ul, item);
                        });
                        $(ul).addClass(
                            'newtag-autocomplete lightbox-autocomplete');
                    };

                $target.children('input').keydown(event.data,
                    $.proxy(this.inputKeyListener, this));

                $('body').click(function(event) {
                    if ($(event.target).parents().addBack().is($($target))) {
                        return;
                    }

                    $target
                        .removeClass('active')
                        .children('input').remove();
                });
            }

            $target.children('input').focus();
        },
        removeInput: function(event) {
            var $target = $(event.target);
            $target.remove();
        },
        inputKeyListener: function(event) {
            var $target = $(event.target);
            var text = $target.val();
            var $tagsbox = $target.parent();

            if (event.keyCode === 8 && text === '') {
                event.preventDefault();
                var tagName = $target.prev().prev().find('.tag_text').text();
                event.data.remove(tagName);
                this.removeInput(event);
                this.makeInput({
                    target: $tagsbox[0],
                    data: event.data
                });
            }

        },
        //search
        searchTag: function(tag) {
            var search = Search.init();
            search.addTag(tag);
            search.flush();
        },
        searchRemoveTag: function(tag) {
            var search = Search.init();
            search.removeTag(tag);
            search.flush();
        }
    };
});


