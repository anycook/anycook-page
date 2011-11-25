/*
 * jQuery Input Decorator Plugin v0.1
 * http://anycook.de
 *
 * Copyright (c) 2011 Jan Grassegger
 * Dual licensed under the MIT license.
 * http://jquery.org/license
 * 
 * Changes:
 * --------- v0.1 -----------------
 * - first alpha
 * 
 */

(function( $ ){
	var inputdecorator = {};
	
	var methods = {
		required:function(options){
			return this.each(function(){
				var $this = $(this);
				var data = $this.data("inputdecorator");
				if(!data){
					var settings = {
						color: "grey",
						transitiontime: 500,
						backgroundColor: $this.css("backgroundColor"),
						symbol: "*",
						fontSize:$this.css("fontSize"),
						paddingRight:$this.css("paddingRight"),
						paddingTop: $this.css("paddingTop"),
						intervalId: -1
						
					};
					if ( options ) 
				        $.extend( settings, options );
		        	
		        	data = {
	                   target : this,
	                   settings : settings
               		};
		        	$(this).data("inputdecorator-required", data);
               		
               		inputdecorator.decorate("required", data);
				}
			});
		},
		maxLength:function(options){
			
		}
	};
	
	 $.fn.inputdecorator = function( method ) {
    
	    // Method calling logic
	    if ( methods[method] ) {
	      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	      return methods.init.apply( this, arguments );
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on jquery.inputdecorator' );
	    }    
	  
	  };
	
	
	inputdecorator.decorate = function(type, data){
		var $this = $(data.target);
		var settings = data.settings;
		
		var $decorator = $("<div></div>").css({
			position: "absolute",
			color:settings.color,
			paddingRight: settings.paddingRight,
			paddingTop:settings.paddingTop
		});
		$this.css({
			background:"none",
			position:"absolute"})
			.focus(inputdecorator.focus)
			.focusout(inputdecorator.focusout);
		
		var $container = $("<div></div>").addClass("inputdecorator-container")
			.css({
				height: $this.outerHeight(),
				width: $this.outerWidth(),
				borderRadius: $this.css("borderRadius"),
				position: "relative"})
			.append($decorator)
			.insertBefore($this)
			.append($this);
		
		switch(type){
		case "required":
			$decorator.text(settings.symbol)
				.css({top:0,right:0});
			inputdecorator.addChecker(type, data);
			break;
				
		}
	};
	
	inputdecorator.focus = function(event){
		var $this = $(this);
		$this.parent().addClass("focus");
	}
	
	inputdecorator.focusout = function(event){
		var $this = $(this);
		$this.parent().removeClass("focus");
	}
	
	inputdecorator.addChecker = function(type,data){
		var $this = $(data.target);
		switch(type){
		case "required":
			data.intervalId = window.setInterval(function(){inputdecorator.checkRequired(data);}, 200);
			$this.data("inputdecorator-required", data);
		}
	}
	
	inputdecorator.checkRequired = function(data){
		var $this = $(data.target);
		if($("body").find(data.target).length == 0){
			window.clearInterval(data.intervalId);
			$this.data("inputdecorator-required", undefined);
			return;
		}
		
		var settings = data.settings;
		var $parent = $this.parent();
		if($this.val().length == 0)
			$parent.children().first().fadeIn(settings.transitiontime);
		else
			$parent.children().first().fadeOut(settings.transitiontime);
	}
	
	

})( jQuery );