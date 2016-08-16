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
	'tpl!templates/lightbox'
], function($, _, lightboxTemplate){
	'use strict';
	return {
		get : function(headline, subhead, content, inputValue){
			var data = {
				headline : headline,
				subhead : subhead,
				content : content,
				inputValue : inputValue
			};
			var $lightbox = $(lightboxTemplate(data));
			$('#main').append($lightbox);

			$lightbox.css('left', this.getLeft()).hide();
			return $lightbox;
		},
		show : function($lightbox, top, callback){
			callback = callback || function(){};

			$lightbox.show();
			this.resize();


			$lightbox.css({
				top : top,
				left : this.getLeft()
			})
			.find('.dogear').animate({
				right:0,
				top:0
			},
			{
				duration:150,
				easing: 'swing',
				complete:function(){
					$('.contentbox').animate({
						left: 3
					}, {
						duration: 500,
						complete: function(){
							callback.call($lightbox);
						}
					});
				}
			});

			var self = this;
			$('body').click(function(event){
				var $target = $(event.target);
				if($target.parents().addBack().is('.lightbox') || $target.parents().addBack().is('.lightbox-autocomplete')) {
					return;
				}

				self.hide($lightbox);

				$(this).unbind('click');
			});
		},
		showFromBottom : function($lightbox, bottom) {
			$lightbox.show();
			this.resize();
			var top = bottom - $lightbox.outerHeight();
			$lightbox.css({
				top : top,
				left : this.getLeft()
			})
			.find('.dogear').animate({
				right:0,
				top:0
			},
			{
				duration: 150,
				easing: 'swing',
				complete:function(){
					$('.contentbox').animate({
						left: 3
					}, {duration: 500});
				}
			});

			var self = this;

			$('body').click(function(event){
                //var $lightbox = $(event.target).parents('.lightbox, .lightbox-autocomplete');
                var $lightbox = $('.lightbox, .lightbox-autocomplete').has($(event.target));
                //var $lightbox = $(event.target).parents('.lightbox');
				if($lightbox.length){
					return;
				}

				self.hide($lightbox);

				$(this).unbind('click');
			});
		},
		hide : function(){
			var self = this;
			$('.lightbox').fadeOut(200, function(){
				$(this).css({
					left : self.getLeft()
				}).remove();
			});
		},
		resize : function(){
			var $lightbox = $('.lightbox');
			var $contentBox = $lightbox.children('.contentbox');
			var contentHeight = $contentBox.outerHeight();
			$lightbox.height(contentHeight + $contentBox.position().top);
		},
		getLeft : function(){
			var $container = $('#container');
			var $lightbox = $('.lightbox');
			var containerposition = $container.offset();
			// var left = containerposition.left + $container.innerWidth() + 9 - $lightbox.innerWidth();
			var left = containerposition.left + $container.innerWidth() + 9 - $lightbox.innerWidth();
			return left;
		}
	};
});



