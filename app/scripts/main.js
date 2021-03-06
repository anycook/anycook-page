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
'use strict';
// Require.js allows us to configure shortcut alias
require.config({
    baseUrl: 'scripts',
    paths: {
        'AnycookAPI': '../bower_components/anycook-api-js/src/anycookapi',
        'AnycookAPI.autocomplete': '../bower_components/anycook-api-js/src/anycookapi.autocomplete',
        'AnycookAPI.category': '../bower_components/anycook-api-js/src/anycookapi.category',
        'AnycookAPI.discover': '../bower_components/anycook-api-js/src/anycookapi.discover',
        'AnycookAPI.discussion': '../bower_components/anycook-api-js/src/anycookapi.discussion',
        'AnycookAPI.ingredient': '../bower_components/anycook-api-js/src/anycookapi.ingredient',
        'AnycookAPI.life': '../bower_components/anycook-api-js/src/anycookapi.life',
        'AnycookAPI.mailproviders': '../bower_components/anycook-api-js/src/anycookapi.mailproviders',
        'AnycookAPI.message': '../bower_components/anycook-api-js/src/anycookapi.message',
        'AnycookAPI.recipe': '../bower_components/anycook-api-js/src/anycookapi.recipe',
        'AnycookAPI.registration': '../bower_components/anycook-api-js/src/anycookapi.registration',
        'AnycookAPI.search': '../bower_components/anycook-api-js/src/anycookapi.search',
        'AnycookAPI.session': '../bower_components/anycook-api-js/src/anycookapi.session',
        'AnycookAPI.setting': '../bower_components/anycook-api-js/src/anycookapi.setting',
        'AnycookAPI.tag': '../bower_components/anycook-api-js/src/anycookapi.tag',
        'AnycookAPI.upload': '../bower_components/anycook-api-js/src/anycookapi.upload',
        'AnycookAPI.user': '../bower_components/anycook-api-js/src/anycookapi.user',
        'FB': '//connect.facebook.net/de_DE/all',
        'jquery': '../bower_components/jquery/dist/jquery',
        'jquery.address': '../bower_components/jquery-address/src/jquery.address',
        'jquery.autoellipsis': '../bower_components/jquery.autoellipsis/src/jquery.autoellipsis',
        'jquery-autosize': '../bower_components/jquery-autosize/dist/autosize',
        'jquery-ui': '../bower_components/jquery-ui/ui',
        'jquery.inputdecorator': 'lib/jquery.inputdecorator-0.1.2',
        'jquery.migrate': '../bower_components/jquery-migrate/jquery-migrate',
        'jquery.mousewheel': '../bower_components/jquery-mousewheel/jquery.mousewheel',
        'jquery.recipeoverview': 'lib/jquery.recipeoverview',
        'jquery.xml': 'lib/jquery.xml-0.4.1.min',
        'jscrollpane': '../bower_components/jScrollPane/script/jquery.jscrollpane',
        'mwheelintent': '../bower_components/jScrollPane/script/mwheelIntent',
        'plusone': 'lib/plusone',
        'text': '../bower_components/requirejs-text/text',
        'templates': '../templates',
        'tpl': '../bower_components/requirejs-tpl-jfparadis/tpl',
        'underscore': '../bower_components/underscore/underscore'
    },
    shim: {
        'AnycookAPI': {
            deps: ['jquery'],
            exports: 'AnycookAPI'
        },
        'AnycookAPI.autocomplete': {
            deps: ['AnycookAPI'],
            exports: 'AnycookAPI'
        },
        'AnycookAPI.category': {
            deps: ['AnycookAPI'],
            exports: 'AnycookAPI'
        },
        'AnycookAPI.discover': {
            deps: ['AnycookAPI'],
            exports: 'AnycookAPI'
        },
        'AnycookAPI.discussion': {
            deps: ['AnycookAPI'],
            exports: 'AnycookAPI'
        },
        'AnycookAPI.ingredient': {
            deps: ['AnycookAPI'],
            exports: 'AnycookAPI'
        },
        'AnycookAPI.life': {
            deps: ['AnycookAPI'],
            exports: 'AnycookAPI'
        },
        'AnycookAPI.mailproviders': {
            deps: ['AnycookAPI'],
            exports: 'AnycookAPI'
        },
        'AnycookAPI.message': {
            deps: ['AnycookAPI'],
            exports: 'AnycookAPI'
        },
        'AnycookAPI.recipe': {
            deps: ['AnycookAPI'],
            exports: 'AnycookAPI'
        },
        'AnycookAPI.registration': {
            deps: ['AnycookAPI'],
            exports: 'AnycookAPI'
        },
        'AnycookAPI.search': {
            deps: ['AnycookAPI'],
            exports: 'AnycookAPI'
        },
        'AnycookAPI.session': {
            deps: ['AnycookAPI'],
            exports: 'AnycookAPI'
        },
        'AnycookAPI.setting': {
            deps: ['AnycookAPI'],
            exports: 'AnycookAPI'
        },
        'AnycookAPI.tag': {
            deps: ['AnycookAPI'],
            exports: 'AnycookAPI'
        },
        'AnycookAPI.upload': {
            deps: ['AnycookAPI'],
            exports: 'AnycookAPI'
        },
        'AnycookAPI.user': {
            deps: ['AnycookAPI'],
            exports: 'AnycookAPI'
        },
        'FB': {
            exports: 'FB'
        },
        'jquery.address': {
            deps: ['jquery'],
            exports: '$'
        },
        'jquery.autoellipsis': {
            deps: ['jquery'],
            exports: '$'
        },
        'jquery.inputdecorator': {
            deps: ['jquery'],
            exports: '$'
        },
        'jquery.migrate': {
            deps: ['jquery'],
            exports: '$'
        },
        'jquery.recipeoverview': {
            deps: ['jquery'],
            exports: '$'
        },
        'jquery.xml': {
            deps: ['jquery'],
            exports: '$'
        },
        'plusone': {
            exports: 'gapi'
        },
        'underscore': {
            exports: '_'
        }
    },
    tpl: {
        extension: '.erb' // default = '.html'
    }
});

require([
    'jquery',
    'AnycookAPI',
    'classes/Search',
    'classes/User',
    'addressChange',
    './drafts',
    'loginMenu',
    'searchView',
    'scroll',
    'facebook',
    'filters',
    'messageStream',
    'tags',
    'time',
    'userMenu',
    'userProfile',
    'jquery.address',
    'jquery-ui/widgets/autocomplete',
    'jquery.migrate',
    'jquery.xml',
    'AnycookAPI.autocomplete',
    'AnycookAPI.category',
    'AnycookAPI.discover',
    'AnycookAPI.discussion',
    'AnycookAPI.ingredient',
    'AnycookAPI.life',
    'AnycookAPI.message',
    'AnycookAPI.recipe',
    'AnycookAPI.registration',
    'AnycookAPI.search',
    'AnycookAPI.session',
    'AnycookAPI.setting',
    'AnycookAPI.tag',
    'AnycookAPI.upload',
    'AnycookAPI.user'
], function($, AnycookAPI, Search, User, addressChange, drafts, loginMenu, searchView,
            scroll, facebook, filters, messageStream, tags, time, userMenu, userProfile) {

    //CORS
    //source: http://api.jquery.com/jQuery.support/
    $.support.cors = true;

    //makeWidth
    var updateWidth = function() {
        var minWidth = 1024;
        var bodyWidth = $('body').width();
        var width = Math.max(minWidth, bodyWidth);
        var $right = $('#right');
        var left = $right.offset().left;
        $right.width(width - left);
    };

    updateWidth();
    $(window).resize(updateWidth);

    $.ajaxSetup({
        global: true,
        scriptCharset: 'utf8',
        contentType: 'application/x-www-form-urlencoded; charset=utf8'
    });

    $(document)
        .ajaxStart(function() {
            $('#loadpoints').find('span').addClass('loading');
        })
        .ajaxStop(function() {
            $('#loadpoints').find('span').removeClass('loading');
        });

    //anycookapi
    $.when(AnycookAPI.init({
        baseUrl: 'https://api.anycook.de',
        imageBase: 'https://images.anycook.de'
    })).then(function() {
        filters.loadAllCategories($('#kategorie_filter').find('ul'));

        var xmlErrorFunction = function(event) {
            switch (event.type) {
                case 403:
                    var user = User.get();
                    if (!user.checkLogin()) {
                        console.log('access only for logged-in users');
                        $.address.path('');
                        return false;
                    }
                    break;
                case 404:
                    $.address.path('notfound');
            }
            return true;
        };

        var xmlOptions = {
            xml: 'xml/template.xml',
            error: xmlErrorFunction
        };

        $.when($('#content_main').xml(xmlOptions)).then(function() {
            $.when(User.init()).then(function(userinit) {
                var user = userinit;

                loginMenu.buildLogin();

                var handleChange = $.proxy(addressChange.handleChange,
                    addressChange);

                $('body').on('login', handleChange).on('logout', handleChange);
                $.address.bind('change', handleChange);
                $.address.tracker(function() {
                    /* global _gaq */
                    if (window._gaq !== undefined) {
                        _gaq.push(['_trackPageView']);
                    }
                });

                $.address.update();

                if (user.checkLogin()) {
                    userMenu.load();
                }
            });
        });
    });

    //startfadeIn
    if ($.address.pathNames().length === 0) {
        $('#filter_container').delay(1000).animate({opacity: 1}, 1500);
    }
    else {
        $('#filter_container').css('opacity', 1);
    }

    jQuery.extend(jQuery.expr[':'], {
        focus: function(element) {
            return element === document.activeElement;
        }
    });

    var searchObject = new Search();

    //searchbar
    var $search = $('#search');
    $search.autocomplete({
        source: $.proxy(searchView.searchAutocomplete, searchView),
        minLength: 1,
        autoFocus: true,
        select: function(event, ui) {
            event.preventDefault();
            var text = ui.item.value;
            var type = ui.item.data;
            $('#search').val('');
            switch (type) {
                case 'recipes':
                    $.address.path('recipe/' + text);
                    break;
                case 'ingredients':
                    searchObject.addZutat(text);
                    searchObject.flush();
                    break;
                case 'excludeIngredients':
                    searchObject.excludeIngredient(text.substr(1));
                    searchObject.flush();
                    break;
                case 'categories':
                    searchObject.setKategorie(text);
                    searchObject.flush();
                    break;
                case 'tag':
                    searchObject.addTag(text);
                    searchObject.flush();
                    break;
                case 'user':
                    userProfile.gotoProfile(ui.item.id);
            }
        },
        position: {
            of: '#searchbar',
            my: 'right top-1',
            at: 'right bottom'
        },
        response: function(event, ui) {
            var content = ui.content;
            if (content.length > 0) {
                // TODO replace first chars with original.
                var completion = content[0].value;
                var input = $('#search').val();
                completion = input + completion.substr(input.length);
                $('#search_background').val(completion);
            }
        }
    }).data('ui-autocomplete')._renderItem = function(ul, item) {
        return $('<li></li>')
            .data('ui-autocomplete-item', item)
            .append('<a>' + item.label + '</a>')
            .appendTo(ul);
    };

    $search.keydown(function(event) {

        if (event.keyCode === 13) {
            $('ul.ui-autocomplete').hide();
            $('#search_form').submit();
        } else if (event.keyCode === 39) {
            $('#search').val($('#search_background').val());
        } else {
            $('#search_background').val('');
        }
    }).focusout(function() {
        $('#search_background').val('');
    });

    $('.ui-autocomplete').addClass('search-autocomplete');

    $('#search_form').submit(function(event) {
        event.preventDefault();
        var data = $('#search').val();

        if (data === '') {
            return;
        }
        var search = Search.init();
        search.setTerms(data);
        search.flush();
    });

    $('#search_reset').click(function() {
        if ($.address.pathNames().length > 0) {
            $.address.path('');
        }
        else {
            filters.reset();
        }
    });

    $('#filter_reset').click(function() {
        history.back();
    });

    $search.focusout(searchView.focusoutSearch);

    //Kategoriefilter
    $('#kategorie_head').click($.proxy(filters.handleCategories, filters));
    $('#kategorie_list').on('click', 'li',
        $.proxy(filters.clickCategory, filters))
        .on('mouseenter', 'li', $.proxy(filters.mouseoverCategory, filters))
        .on('mouseleave', 'li', $.proxy(filters.mouseleaveCategory, filters));
    $(document).click($.proxy(filters.closeCategories, filters));
    //loadAllKategories($('#kategorie_filter ul'));

    filters.removeChecked();
    $('#filter_table .label_chefhats, #filter_table .label_muffins').click(
        function() {
            if (!$('#filter_main').is('.blocked')) {
                filters.checkOnOff(this);
            }

            // must return false or function is sometimes called twice
            return false;
        }).mouseover(function() {
        if (!$('#filter_main').is('.blocked')) {
            filters.mouseoverRadio(this);
        }
    });

    $('.filter_table_right').mouseleave(function() {
        if (!$('#filter_main').is('.blocked')) {
            filters.handleRadios($(this).children());
        }
    });

    //zutatentabelle

    $('#ingredient_list').click($.proxy(filters.ingredientListClick, filters))
        .on('click', '.close', $.proxy(filters.removeIngredientField, filters))
        .on('click', '.plus', $.proxy(filters.clickExcludeIngredient, filters))
        .on('click', '.minus', $.proxy(filters.clickAddIngredient, filters));

    //tagsfilter
    var tagData = {
        add: $.proxy(tags.searchTag, tags),
        remove: $.proxy(tags.searchRemoveTag, tags)
    };
    $('.tags_list').submit($.proxy(tags.submitTags, tags))
        .click(tagData, $.proxy(tags.makeInput, tags))
        .on('click', '.tag_remove', tagData, $.proxy(tags.remove, tags));

    //timefilter
    $('#time_form').submit($.proxy(time.formSubmit, time));
    $('#time_std,#time_min').keydown($.proxy(time.key, time));
    $('.time .up, .time .down').click($.proxy(time.upDownListener, time));

    //scrollListener
    scroll.init();
    $(document).scroll($.proxy(scroll.listen, scroll));

    // search events
    $('html').on('startSearch', $.proxy(filters.setFromSession, filters))
        .on('searchResults', $.proxy(searchView.addResults, searchView))
        .on('emptySearchResult',
            $.proxy(searchView.showEmptyResult, searchView));

    require(['FB'], function(FB) {
        //Facebook
        FB.init({
            appId: '143100952399957',
            status: true, // check login status
            cookie: true, // enable cookies to allow the server to access the
                          // session
            xfbml: false //, // parse XFBML
            //oauth  : true // enable OAuth 2.0
        });

        FB.Event.subscribe('auth.authResponseChange',
            $.proxy(facebook.sessionChange, facebook));
        $('body').on('click', '.facebookLogin',
            $.proxy(facebook.login, facebook));
    });

});
