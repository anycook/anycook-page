'use strict';
define([
	'jquery'
], function($){
	return {
		recipe : function(event){
			var files = event.target.files;
			if (typeof files !== "undefined") {
				this.addProgressBar();
				AnycookAPI.upload.recipeImage(files[0], this.nrProgress, $.proxy(event.data.complete, event.data.this));
			} else {
				alert("No support for the File API in this web browser");
			}  
		},
		user : function(event){
			var files = event.target.files;
			if (typeof files !== "undefined") {
				this.addProgressBar();
				AnycookAPI.upload.userImage(files[0], this.nrProgress, $.proxy(event.data.complete, event.data.this));
			} else {
				alert("No support for the File API in this web browser");
			}  
		},
		addProgressBar : function(){
			$(".image_upload").hide();
			$("#progressbar").fadeIn(200).progressbar();
		},
		nrProgress : function(event){
			$("#progressbar").progressbar({value:(event.loaded/event.total*100)});
		}
	};
});