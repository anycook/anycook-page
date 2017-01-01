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
    'jquery'
], function($) {
    'use strict';
    $.extend($.easing, {
        easeInOutQuad: function(pos) {
            if ((pos /= 0.5) < 1) {
                return 0.5 * Math.pow(pos, 2);
            }
            return -0.5 * ((pos -= 2) * pos - 2);
        }
    });

    return {
        init: function() {
            $('#backtothetop').click(this.backToTheTop);
        },
        listen: function() {
            var $backToTheTop = $('#backtothetop');

            var filterheight = $('#filter_box').css('height');
            filterheight = Number(filterheight.substr(0, filterheight.length - 2)) + 50;
            var scrollTop = $(document).scrollTop();
            if (scrollTop > filterheight) {
                var containerleft = $('#container').offset().left;
                $backToTheTop.css('left', containerleft + 20).fadeIn(1000);
            }
            else if (scrollTop < filterheight) {
                $backToTheTop.fadeOut(700);
            }
        },
        backToTheTop: function(time, callback) {
            if (time === undefined || !(time instanceof Number)) {
                time = 1000;
            }
            callback = callback || function() {
                };
            $('body').animate(
                {scrollTop: 0},
                {duration: time, easing: 'easeInOutQuad', complete: callback});
        }
    };
});
