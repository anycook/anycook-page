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
	'AnycookAPI'
], function($, AnycookAPI){
	'use strict';
	return {
		recipe : function(event){
			var files = event.target.files;
			if (typeof files !== 'undefined') {
				this.addProgressBar();
				AnycookAPI.upload.recipeImage(files[0], this.nrProgress, $.proxy(event.data.complete, event.data.this));
			} else {
				window.alert('No support for the File API in this web browser');
			}
		},
		user : function(event){
			var files = event.target.files;
			if (typeof files !== 'undefined') {
				this.addProgressBar();
				AnycookAPI.upload.userImage(files[0], this.nrProgress, event.data.complete);
			} else {
				window.alert('No support for the File API in this web browser');
			}
		},
		addProgressBar : function(){
			$('.image_upload').hide();
			$('#progressbar').fadeIn(200).progressbar();
		},
		nrProgress : function(event){
			$('#progressbar').progressbar({value:(event.loaded/event.total*100)});
		}
	};
});