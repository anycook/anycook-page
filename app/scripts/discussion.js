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
    'date',
    'drafts',
    'loginMenu',
    'tpl!templates/discussionElement',
    'tpl!templates/discussionEvent',
    'tpl!templates/discussionAnswerSmall',
    'jquery-autosize'
], function($, _, AnycookAPI, User, date, drafts, loginMenu, discussionElementTemplate, discussionEventTemplate, discussionAnswerSmallTemplate){
    'use strict';
    return {
        load : function(recipeName) {
            $.xml.append('recipe_discussion');

            //discussion
            $('.center_headline').html('Diskussion zum Rezept<br/>' + decodeURIComponent(recipeName));
            var user = User.get();
            var login = user.checkLogin();
            if(login) {
                $('#discussion_container')
                    .on('click', '.answer_btn', $.proxy(this.answerBtnClick, this))
                    .on('click', '.like', $.proxy(this.discussionLike, this));
                $('#discussion_footer .nologin').hide();
                $('#discussion_footer img').attr('src', user.getImage());
                $('.comment_btn').click($.proxy(this.comment, this));
            } else {
                $('#discussion_footer .login').hide();
                $('#no_comment').click($.proxy(loginMenu.toggle, loginMenu));
            }

            $('#edit_recipe').click(function(){ drafts.getDraftFromRecipe(recipeName); });

            $('#hide_discussion').click($.proxy(this.toggle, this));

            if(login) { $('#no_comment').hide(); }
            else { $('#yes_commit').hide(); }

            this.loadContent(recipeName, -1);
        },
        loadContent : function(recipeName, lastid){
            var self = this;
            var $commentDiscussion = $('#comment_discussion');

            AnycookAPI.discussion(recipeName, lastid, function(json){
                var pathNames = $.address.pathNames();
                if(pathNames[0] !== 'recipe' || decodeURI(pathNames[1]) !== recipeName){
                    return;
                }

                var user = User.get();
                var login = user.checkLogin();
                var newLastid = lastid;
                if(json) {
                    var discussion = $commentDiscussion.data('discussion') || {};

                    var $ul = $commentDiscussion.children('ul');

                    var elements = json.elements;
                    var $li;

                    var onComplete = function(){
                        $li.animate({opacity: 1});
                        $li.css('height', '');
                    };

                    for(var i in elements) {
                        newLastid = Math.max(newLastid, Number(elements[i].id));
                        var parentId = elements[i].parentId;
                        if(parentId === -1){
                            if(!elements[i].syntax) {
                                $li = self.getElement(false, login, elements[i]);
                            }
                            else {
                                $li = self.getEvent(recipeName, login, elements[i]);
                            }
                            discussion[i] = $li;
                            $ul.append($li);
                            $li.data('comment_id', elements[i].id);
                        } else{
                            $li = self.getElement(true, login, elements[i]);
                            discussion[parentId].children('ul').append($li);
                            $li.data('comment_id', parentId);
                        }
                        $li.data('id', elements[i].id);

                        if(lastid > -1){
                            var height = $li.height();
                            $li.css({'height': 0, 'opacity': 0});
                            $li.animate({'height': height},{complete: onComplete});
                        }
                    }
                    $('#comment_discussion').find('ul > li.comment:odd').addClass('odd');
                    self.centercommenteventlikes();
                    $commentDiscussion.data('discussion', discussion);
                }
                //setTimeout('loadDiscussion(\''+recipeName+'\', '+newLastid+')', 2000);
                self.loadContent(recipeName, newLastid);
            });
        },
        getElement : function(isChild, login, json) {
            $.extend(json, {
                isChild : isChild,
                login: login,
                datetime : date.getDateString(json.datetime)
            });

            return $(discussionElementTemplate(json));
        },
        getEvent : function(recipeName, login, json) {
            //json.syntax = json.syntax || null;

            $.extend(json, {
                datetime : date.getDateString(json.datetime,false),
                recipeName : recipeName,
                text : json.text || '',
            });

            var $li = $('<li></li>').addClass('event');

            var discussionEvent = discussionEventTemplate(json);
            $li.html(discussionEvent);

            return $li;
        },
        centercommenteventlikes : function() {
            $('.recipe_event .comment_like').each(function() {
                var $this = $(this);
                var elementHeight = $this.outerHeight();
                var parentHeight = $this.parents('.right').innerHeight();
                var newMargin = (parentHeight - elementHeight) / 2;
                $this.css('marginTop', newMargin);
            });
        },
        parseDiscussionEvent : function(recipename, syntax, eingefuegt, versionsId, nickname) {
            var text = syntax;

            var array = text.split('@u');
            text = '';
            for(var j = 0; j < array.length - 1; ++j) {
                text += array[j] + nickname;
            }
            text += array[array.length - 1];
            array = text.split('@r');
            text = '';
            for(var k = 0; k < array.length - 1; ++k) {
                text += array[k] + recipename;
            }
            text += array[array.length - 1];
            array = text.split('@d');
            text = '';
            for(var l = 0; l < array.length - 1; ++l) {
                text += array[l] + date.getDateString(eingefuegt);
            }
            text += array[array.length - 1];

            return text;
        },
        answerBtnClick : function(event) {
            var $target = $(event.target);
            var $li = $target.parents('li');
            var id = $li.data('comment_id');
            var $ul = $li.children('ul');
            if($ul.length === 0) { $ul = $target.closest('ul'); }
            var $childComment = $ul.children('.child_comment');

            if($childComment.length === 0) {
                var user = User.get();
                $ul.append(this.getChildComment(user,id)).find('textarea').focus();
                var $comment = $ul.children('.child_comment');
                var commentoffset = $comment.offset();
                var commentheight = $comment.height();
                var windowheight = $(window).height();
                var scrollTop = $(document).scrollTop();
                if(scrollTop + windowheight < commentoffset.top) {
                    $('body').animate({
                        scrollTop : commentoffset.top + commentheight - windowheight + 5
                    }, {
                        duration : 700,
                        easing : 'easeInOutQuart'
                    });
                }

                $('body').click(function(event) {
                    var $target = $(event.target);

                    if($('.child_comment').length > 0 && !$target.parents().addBack().is('.child_comment')) {
                        $('.child_comment').remove();
                    }
                });
            }else{
                $childComment.remove();
            }

            return false;
        },
        getChildComment : function(user){
            var $template = $(discussionAnswerSmallTemplate({
                profileUri : user.getProfileURI(),
                userImage : user.image.small
            }));

            $template.find('textarea').autosize().keydown($.proxy(this.childComment, this));

            return $template;
        },
        comment : function() {
            var $textarea = $('#discussion_footer textarea');
            if (this.sending) { return false; }
            var text = $textarea.val();
            if(text !== '') {
                this.sending = true;
                var self = this;
                var parameterNames = $.address.pathNames();
                var recipeName = parameterNames[1];
                AnycookAPI.discussion.answer(recipeName, text, function(){
                    $textarea.val('');
                    self.sending = false;
                });
            }
        },
        childComment : function(event) {
            if(event.which === 13){
                if (this.sending) { return false; }

                var $target = $(event.target);

                var pid = $target.parents('.comment').data('comment_id');
                var text = $target.val();
                if(text !== '') {
                    this.sending = true;
                    var parameterNames = $.address.pathNames();
                    var recipeName = parameterNames[1];
                    var self = this;
                    AnycookAPI.discussion.answer(recipeName, text, pid, function(){
                        $target.parents('.child_comment').fadeOut(200, function(){
                            $(this).remove();
                            self.sending = false;
                        });
                    });

                }
                return false;
            }
        },
        discussionLike : function(event) {
            var $target = $(event.target);
            var id = $target.parents('.comment').data('id');

            var parameterNames = $.address.pathNames();
            var recipeName = parameterNames[1];

            if(!$target.hasClass('liked_by_user')){
                AnycookAPI.discussion.like(recipeName, id, function(){
                    var $likeNr = $target.siblings('.like_nr');
                    var oldNum = Number($likeNr.text());
                    var newNum = oldNum +1;
                    $likeNr.text(newNum > 0 ? '+'+newNum : 0);
                    $target.addClass('liked_by_user');
                });
            }else{
                AnycookAPI.discussion.unlike(recipeName, id, function(){
                    var $likeNr = $target.siblings('.like_nr');
                    var oldNum = Number($likeNr.text());
                    var newNum = oldNum - 1;
                    $likeNr.text(newNum > 0 ? '+'+newNum : 0);
                    $target.removeClass('liked_by_user');
                });
            }
        },
        toggle : function(){
            $('#comment_discussion > ul > li.comment').toggle(500);
        }
    };
});
