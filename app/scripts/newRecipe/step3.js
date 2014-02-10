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
	'time',
], function($, AnycookAPI, drafts, filters, time){
	'use strict';
	return {
		load : function(){
			var self = this;
			AnycookAPI.category.sorted(function(json){
				var $categorySelect = $('#category_select');
				for(var category in json){
					$categorySelect.append('<option>'+category+'</option>');
				}
			});
			$('#category_select').change(function(){
				var $this = $(this);
				var text = $this.val();
				$('#select_container span').text(text);
				drafts.save('category', text);
				self.isValid();
				$('#category_error').fadeOut(300);
			});
			
			$('#step3 .label_chefhats, #step3 .label_muffins').click(function(event){
				event.preventDefault();
				var $inputs = $(this).children('input');
				if($inputs.attr('checked')){
					$inputs.removeAttr('checked');
				} else {
					$inputs.attr('checked', 'checked');
				}

				var $this = $(this);
				filters.handleRadios($this);
				var name = $inputs.attr('name') === 'new_muffins' ? 'calorie' : 'skill';

				if($inputs.attr('checked')){
					drafts.save(name, $inputs.val());
				}
				else {
					drafts.save(name, '0');
				}

				self.isValid();
				if(name === 'calorie'){
					$('#muffin_error').fadeOut(300);
				}
				else{
					$('#skill_error').fadeOut(300);
				}
			}).mouseover(function(){
				filters.mouseoverRadio(this);
			});

			$('#step3 .label_container').mouseleave(function(){
				filters.handleRadios($(this).children());
			});

			$('#step3 .std,#step3 .min')
			.keydown($.proxy(this.keyTime, this))
			.change($.proxy(this.draftTime, this))
			.keyup($.proxy(this.draftTime, this))
			.focus(function(){
				self.isValid();
				$('#time_error').fadeOut(300);
			})
			.siblings('.up, .down')
			.click($.proxy(time.upDownListener, time))
			.click($.proxy(this.draftTime, this))
			.click(function(){
				self.isValid();
				$('#time_error').fadeOut(300);
			});
				
			$('.tagsbox').click($.proxy(this.makeNewTagInput, this));
			//this.makeTagCloud();
			$('#open_preview').click($.proxy(this.submit, this));
		},
		checkCategory : function(){
			var category = $('#select_container span').text();
			return category !== '' && category !== 'Kategorie auswählen';
		},
		checkTime : function(){
			var time = this.getTime();
			return time.std !== '0' || time.min !== '0';
		},
		checkSkill : function(){
			var skill = this.getSkill();
			return skill !== undefined;
		},
		checkCalorie : function(){
			return this.getCalorie() !== undefined;
		},
		getCategory : function(){
			return $('#select_container span').text();
		},
		getSkill : function(){
			return $('#step3 .chefhats:checked').val();
		},
		getCalorie : function(){
			return $('#step3 .muffins:checked').val();
		},
		getTime : function(){
			var std = $('#step3 .std').val();
			var min = $('#step3 .min').val();
			var time = {std:std, min:min};
			return time;
		},
		draftTags : function(){
			drafts.save('tags', this.getTags());
		},
		draftTime : function(){
			drafts.save('time', this.getTime());
		},
		getTags : function(){
			var $tags =  $('.tagsbox .tag_text');
			var tags = [];
			for(var i = 0; i<$tags.length; i++){
				var tag = $tags.eq(i).text();
				tags[tags.length] = tag;
			}
			return tags;
		},
		isValid: function(){
			if(this.checkCategory() && this.checkTime() && this.checkSkill() && this.checkCalorie()){
				$('#nav_step3').nextAll().removeClass('inactive');
				return true;
			}else{
				$('#nav_step3').nextAll().addClass('inactive');
				return false;
			}
		},
		submit : function(){
			var check = true;
			if(!this.checkCategory()){
				$('#category_error').fadeIn(300);
				check = false;
			}
			
			if(!this.checkTime()){
				$('#time_error').fadeIn(300);
				check = false;
			}
			
			if(!this.checkSkill()){
				$('#skill_error').fadeIn(300);
				check = false;
			}
			
			if(!this.checkCalorie()){
				$('#muffin_error').fadeIn(300);
				check = false;
			}
			
			if(!check){
				$('#open_preview').effect('shake', {distance:5, times:2}, 50);
			}else{
				$.address.parameter('step', '4');
			}
		}
	};
});