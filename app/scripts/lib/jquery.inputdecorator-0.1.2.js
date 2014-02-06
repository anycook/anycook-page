/*
 * jQuery Input Decorator Plugin v0.1
 * http://anycook.de
 *
 * Copyright (c) 2014 Jan Grassegger
 * Dual licensed under the MIT license.
 * http://jquery.org/license
 * 
 * Changes:
 * v0.1.1
 * - renamed container to $target and added target to event object
 * v0.1
 * - first alpha
 * 
 * 
 */

(function( $ ){
	var inputdecorator = {};
	
	var methods = {
		required:function(options){
			return this.each(function(){
				var $this = $(this);
				var data = $this.data("inputdecorator-required");
				if(!data){
					var settings = {
						color: "grey",
						transitiontime: 500,
						backgroundColor: $this.css("backgroundColor"),
						symbol: "*",
						fontSize:$this.css("fontSize"),
						paddingRight:$this.css("paddingRight"),
						paddingTop: $this.css("paddingTop"),
						intervalId: -1,
						float: $this.css("float"),
						marginTop: $this.css("marginTop"),
						marginRight: $this.css("marginRight"),						
						marginBottom: $this.css("marginBottom"),
						marginLeft: $this.css("marginLeft"),
						decoratorFontSize: $this.css("fontSize"),
						change:function(){}
						
					};
					if ( options ) 
				        $.extend( settings, options );
		        	
		        	data = {
	                   target : this,
	                   settings : settings
               		};
		        	$this.data("inputdecorator-required", data);
               		
               		inputdecorator.decorate("required", data);
				}
			});
		},
		maxlength:function(options){
			return this.each(function(){
				var $this = $(this);
				var data = $this.data("inputdecorator-maxlength");
				if(!data){
					var settings = {
						color: "grey",
						transitiontime: 500,
						backgroundColor: $this.css("backgroundColor"),
						maxlength: $this.attr("maxlength"),
						fontSize:$this.css("fontSize"),
						paddingRight:$this.css("paddingRight"),
						paddingBottom: $this.css("paddingTop"),
						intervalId: -1,
						float:$this.css("float"),
						marginTop: $this.css("marginTop"),
						marginRight: $this.css("marginRight"),						
						marginBottom: $this.css("marginBottom"),
						marginLeft: $this.css("marginLeft"),
						decoratorFontSize: $this.css("fontSize")
						
					};
					if ( options ) 
				        $.extend( settings, options );
		        	
		        	data = {
	                   target : this,
	                   settings : settings
               		};
		        	$(this).data("inputdecorator-maxlength", data);
               		
               		inputdecorator.decorate("maxlength", data);
				}
			});
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
		
		var $decorator = $("<div></div>")
			.addClass("decorator")
			.css({
				position: "absolute",
				color:settings.color,
				paddingRight: settings.paddingRight,
				fontSize: settings.decoratorFontSize
			});
		$this.css({
			background:"none",
			position:"absolute",
			marginTop: 0,
			marginRight:0,
			marginBottom: 0,
			marginLeft:0})
			.focus(inputdecorator.focus)
			.focusout(inputdecorator.focusout);
		
		var $container = $this.parent(".inputdecorator-container");
		if( $container.length == 0){	
			$container = $("<div></div>").addClass("inputdecorator-container")
				.css({
					height: $this.outerHeight(),
					width: $this.outerWidth(),
					borderRadius: $this.css("borderRadius"),
					position: "relative",
					float:settings.float,
					marginTop: settings.marginTop,
					marginRight: settings.marginRight,
					marginBottom:settings.marginBottom,
					marginLeft:settings.marginLeft})
			.append($decorator)
			.insertBefore($this)
			.append($this);
			if($this.hasClass("light"))
				$container.addClass("light");
			
		}else{
			$container.prepend($decorator);
		}
		
		switch(type){
		case "required":
			$decorator.text(settings.symbol)
				.css({top:0,right:0, paddingTop:settings.paddingTop});
			break;
		
		case "maxlength":
			$decorator.html("noch <span>"+settings.maxlength+"</span> Zeichen")
				.css({bottom:0, right:0, paddingBottom:settings.paddingBottom});
		}
		
		data.$container = $container;
		inputdecorator.addChecker(type, data);
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
			break;
			
		case "maxlength":
			data.intervalId = window.setInterval(function(){inputdecorator.checkMaxlength(data);}, 200);
			$this.data("inputdecorator-maxlength", data);
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
		
		var event;
		var $decorator =  $parent.children().first();
		if(!$decorator.is(":visible") && $this.val().length == 0){
			$decorator.fadeIn(settings.transitiontime);
			event = jQuery.Event("change", {
				visible : true,
				empty : true, 
				$container : data.$container,
				target : data.target
			});
		}else if($decorator.is(":visible") && $this.val().length > 0){
			$decorator.fadeOut(settings.transitiontime);
			event = jQuery.Event("change", {
				visible : false,
				empty : false,
				$container : data.$container,
				target : data.target
			});
		}
		if(event !== undefined)
			settings.change.apply(data.target, [event]);
	}
	
	inputdecorator.checkMaxlength = function(data){
		var $this = $(data.target);
		if($("body").find(data.target).length == 0){
			window.clearInterval(data.intervalId);
			$this.data("inputdecorator-maxlength", undefined);
			return;
		}
		
		var settings = data.settings;
		var $parent = $this.parent();
		var $decoratorSpan = $parent.find(".decorator span");
		var currentVal = Number($decoratorSpan.text());
		var newVal = Number($this.attr("maxlength")) - $this.val().length;
		
		if(newVal != currentVal){
			var event = jQuery.Event("change", {
				empty : $this.val().length == 0,
				$container : data.$container,
				target : data.target
			});			
			$decoratorSpan.text(newVal);
			settings.change.apply(data.target, [event]);
		}
	}
	
	

})( jQuery );