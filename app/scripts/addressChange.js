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
    'classes/Search',
    'aboutus',
    'activation',
    'discussion',
    'drafts',
    'facebook',
    'filters',
    'header',
    'home',
    'messages',
    'messageStream',
    'newRecipe',
    'recipeView',
    'registration',
    'resetPassword',
    'settings',
    'title',
    'userProfile'
], function($, Search, aboutus, activation, discussion, drafts, facebook, filters, header, home, messages, messageStream, newRecipe, recipeView, registration, resetPassword, settings, title, userProfile){
    'use strict';
    return {
        clearContent : function(){
            $('#content_main > *').remove();
            $('#subnav').empty();
            $('#btn_container').find('.user_btn').removeClass('active');
            $('#main').find('.lightbox').remove();
            $('#search_background').val('');
        },
        // behandelt change bei $.address.path
        handleChange : function(event){
            var lastAddress = $(document).data('lastAddress');
            if (event.type === 'change') {
                $(document).data('lastAddress', event);
            }

            if(!lastAddress || event.type === 'login' || event.type === 'logout' || lastAddress.path !== event.path) {

                if (event.type === 'login' || event.type === 'logout') {
                    event = lastAddress;
                }

                var search;

                title.set('anycook');

                //resetSearchBar();
                filters.reset();

                $(document).scrollTop(0);

                $('#wertung_filter').show();
                $('#content_footer').show();
                this.clearContent();


                var path = event.pathNames;

                if (path.length > 0 && path[0].startsWith('!')) {
                    $.address.path(event.path.substr(2));
                    return;
                }
                //blockFilter(false);
                if(path.length > 0){
                    $('#search_reset, #filter_reset').addClass('on');
                }
                else{
                    $('#search_reset, #filter_reset').removeClass('on');
                }


                //$.xml.append(path.length == 0 ? 'home' : path[0]);
                $.xml.append(path[0], function(){
                    switch(path.length){
                    case 0:
                        $('#user_home').addClass('active');
                        home.load();
                        break;
                    case 1:
                        switch(path[0]){
                        case 'recipeediting':
                            title.set('Neues Rezept erstellen');
                            $('#new_recipe').addClass('active');
                            newRecipe.load();
                            break;
                        case 'about_us':
                            aboutus.load();
                            break;
                        case 'impressum':
                            title.set('Impressum');
                            break;
                        case 'fbregistration':
                            facebook.loadRegistrationMessage();
                            break;
                        case 'resetpassword':
                            resetPassword.loadStep1();
                            break;
                        case 'registration':
                            title.set('Registrierung');
                            registration.show();
                            break;
                        case 'settings':
                            settings.load();
                            break;
                        case 'newsstream':
                            $('#user_messages').addClass('active');
                            messageStream.loadNewsstream();
                            break;
                        case 'drafts':
                            drafts.load();
                            break;
                        }
                        break;
                    case 2:
                        switch(path[0]){
                        case 'confirmMail':
                            settings.confirmMail(path[1]);
                            break;
                        case 'recipe':
                            $('#subnav')
                                .append(header.buildLink('Rezept', '', 'recipe_btn'))
                                .append(header.buildLink('Diskussion', '', 'discussion_btn'));
                            recipeView.load(path[1]);
                            break;
                        case 'activate':
                            activation.activate(path[1]);
                            break;
                        case 'profile':
                            $('#user_profile').addClass('active');
                            userProfile.load(path[1]);
                            break;
                        case 'resetpassword':
                            resetPassword.loadStep2();
                            break;
                        case 'messagesession':
                            messages.show(path[1]);
                            break;
                        }
                        break;
                    case 3:
                        switch(path[0]){
                        case 'recipe':
                            $('#subnav')
                                    .append(header.buildLink('Rezept', '', 'recipe_btn'))
                                    .append(header.buildLink('Diskussion', '', 'discussion_btn'));
                            recipeView.load(path[1], path[2]);
                            break;
                        case 'search':
                            search = Search.init();
                            switch(path[1]){
                            case 'tagged':
                                search.addTag(decodeURIComponent(path[2]));
                                break;
                            case 'user':
                                search.setUsername(decodeURIComponent(path[2]));
                            }
                            search.flush();
                        }
                    }
                });
            }

            $('#subnav *').removeClass('active');

            if(event.pathNames[0] === 'recipeediting'){
                newRecipe.addressChange(event);
            }
            else if(event.parameters.page){
                this.changePage(event);
            }
            else{
                //wird aufgerufen wenn page=''
                if(event.pathNames.length === 0){
                    $('#content_main > div').hide();
                    $('#site1').show();
                    $('#home_button').addClass('on');
                    $('#startpage_button').addClass('active');
                }else{
                    switch(event.pathNames[0]){
                        case 'newrecipe':
                            $('#nr_general_btn').addClass('active');
                            //animateNewRecipe(0);
                            break;
                        case 'recipe':
                            $('#recipe_btn').addClass('active');
                            $('#discussion_container').hide();
                            $('#recipe_container').show();
                            break;
                        case 'search':
                            Search.init().search();
                            break;
                    }
                }
            }

            title.setPrefix();
        },
        // behandelt change bei $.address.parameters
        changePage : function(event){
            var page = event.parameters.page;
            var firstpath = event.pathNames[0];
            switch(event.pathNames.length){
            case 0:
                switch(page){
                case 'discover':
                    $('#site1').hide();
                    $('#discover_button').addClass('active');
                    if($('#discover').length === 0){
                        $.xml.append('home_discover');
                        home.discover();
                    }
                    else { $('#discover').show(); }
                    $('#discover_button').addClass('on');
                    break;
                default:
                    $.address.queryString('');
                }
                break;

            default:
                switch(firstpath){
                case 'recipe':
                    switch(page){
                    case 'discussion':
                        $('#recipe_container').hide();
                        var $discussionContainer = $('#discussion_container');
                        if($discussionContainer.length === 0){
                            discussion.load(decodeURI(event.pathNames[1]));
                        }
                        else{
                            $discussionContainer.show();
                        }

                        $('#discussion_btn').addClass('active');
                        break;
                    default:
                        $.address.queryString('');
                    }
                    break;
                case 'fbregistration':
                    //nothing
                    break;
                case 'search':
                    Search.init().search();
                    break;
                default:
                    $.address.queryString('');
                }
            }
        },
        resetSearchBar : function(){
            $('#search').blur();
            $('#search').val('Gerichte, Zutaten, Tags, ...').css({color : '#b5b5b5' , fontStyle : 'italic'}).removeAttr('readonly');
        },
        checkBrowser : function(){
            return navigator.appName;
        }
    };
});
