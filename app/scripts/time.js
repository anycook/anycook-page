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
	'classes/Search'
], function($, Search){
	'use strict';
	return {
		formSubmit : function(){
			var std = Number($('#time_std').val());
			var min = Number($('#time_min').val());
			
			var search = Search.init();
			if(std === 0 && min === 0) {
				search.setTime(null);
			}
			else {
				search.setTime({
					std : this.fillStd(std),
					min : this.fillMin(min)
				});
			}
				
			search.flush();
			return false;
		},
		key : function(event){
			var target = $(event.target);
			var val = $(target).val();
			
			var $timeform = $('#time_form');

			switch(event.which){
			case 13:
				if($timeform.length > 0) {
					$timeform.submit();
				}
				break;
			case 38:
				this.up(target);
				return false;
			case 40:
				this.down(target);
				return false;
			default:
				if((target.hasClass('std') && val.length === 2) || target.hasClass('min') && val.length === 2){
					return false;
				}
				if(!(event.which >= 48 &&  event.which <= 57) && !(event.which >= 96 &&  event.which <= 105) && event.which !== 8 && event.which !== 46){
					return false;
				}
			}
		},
		upDownListener : function(event){
			var $target = $(event.target);
			var $input = $target.siblings('input').first();
			var submit = $target.parents('#time_form').length > 0;
			if($target.hasClass('up')){
				this.up($input, submit);
			}
			else{
				this.down($input, submit);
			}
		},
		up : function($input, submit){
			var value = Number($input.val());
			if($input.hasClass('std')){
				value = (value +1)%100;
			}else{
				value = (value +5)%60;
			}
			$input.val(value);
			if(submit) {
				this.formSubmit();
			}
		},
		down : function($input, submit){
			var value = Number($input.val());
			if($input.hasClass('std')){
				value = (100+(value -1))%100;
			}else{
				value = (60+(value - 5))%60;
			}
			$input.val(value);
			if(submit) {
				this.formSubmit();
			}
		},
		fillStd : function(std){
			std = Number(std);
			if(std === 0 || std > 99){
				std = 0;
			}
			std = String(std);
			if(std.length === 1){
				std = '0'+std;
			}
			return std;
		},
		fillMin : function(min){
			min = Number(min);
			if(min === 0 || min > 59){
				min = 0;
			}
			
			min = String(min);
			if(min.length === 1){
				min = '0'+min;
			}
			return min;
		}
	};
});