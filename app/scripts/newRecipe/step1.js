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
	'drafts',
	'imageUpload',
	'jquery-ui/widgets/progressbar',
	'jquery.inputdecorator'
], function($, drafts, imageUpload){
	'use strict';
	return {
		load : function(){
			var decoratorSettings = {
				color : '#878787',
				change : $.proxy(this.validate, this)
			};
			$('#step1 input[type=\'text\']').inputdecorator('required', decoratorSettings).focusout(function(){
				drafts.save('name', $(this).val());
			});
			$('#step1 textarea').inputdecorator('required', decoratorSettings).focusout(function(){
				drafts.save('description', $(this).val());
			});
			$('#step1 form').submit($.proxy(this.submit, this));

			var data = {
				complete : this.completeUpload,
				this : this
			};
			$('#file_upload').change(data, $.proxy(imageUpload.recipe, imageUpload));


			$('#upload_button').click(function(event){
				event.preventDefault();
				$('#file_upload').trigger('click');
			});
		},
		//checks if current state is valid. if returns true, else false
		isValid : function(){
			var check = true;
			var $name = $('#new_recipe_name');
			if($name.val().length === 0){
				check=false;
			}

			var $introduction = $('#new_recipe_introduction');
			if($introduction.val().length === 0){
				check=false;
			}
			return check;
		},
		validate : function(event){
			var $container = event.$container;
			//var $name = $step1.find('#new_recipe_name');
			if(!event.empty){
				$container.next('.error').fadeOut(300);
				if(this.isValid()){
					$('#nav_step1').next().removeClass('inactive');
				}

			}else{
				$('#nav_step1').nextAll().addClass('inactive');
			}
		},
		submit : function(event){
			event.preventDefault();
			var check = true;
			var $target = $(event.target);
			var $name = $target.find('#new_recipe_name');
			if($name.val().length === 0){
				$target.find('#new_recipe_name_error').fadeIn(300);
				check=false;
			}

			var $introduction = $target.find('#new_recipe_introduction');
			if($introduction.val().length === 0){
				$target.find('#new_recipe_introduction_error').fadeIn(300);
				check=false;
			}

			if(check){
				$.address.parameter('step', '2');
			}
			else{
				$target.find('input[type="submit"]').effect('shake', {distance:5, times:2}, 50);
				//watchIntroduction();
			}
		},
		getImageName : function(){
			var image = $('#step1 .recipe_image_container img').attr('src').split('/');
			var imageName = image[image.length-1];
			return imageName === 'sonstiges.png' ? undefined : imageName;
		},
		getRecipeName : function(){
			var name = $('#new_recipe_name').val();
			return name;
		},
		getDescription : function(){
			var description = $('#new_recipe_introduction').val();
			return description;
		},
		completeUpload : function(location){
			if(location){
				var splits = location.split('/');
				var filename = splits[splits.length-1];
				drafts.save('image', filename);
				this.showImage(location);
			}
		},
		showImage : function(location){
			var $recipeImageContainer = $('.recipe_image_container');
			$recipeImageContainer.children('img').remove();
			$recipeImageContainer.removeClass('visible').children('#progressbar').hide();
			$recipeImageContainer.children('.image_upload').show();

			var $img = $('<img/>').addClass('recipe_image').attr('src', location);
			$recipeImageContainer.append($img);
			$img.load(function(){
				$('#step1').trigger($.Event('resize'));
			});
		}
	};
});
