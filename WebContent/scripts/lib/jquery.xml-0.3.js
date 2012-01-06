/*
 * jQuery XML Plugin v0.3
 * http://anycook.de
 *
 * Copyright (c) 2011 Jan Grassegger
 * Dual licensed under the MIT license.
 * http://jquery.org/license
 * 
 * Changes:
 * --------- v0.3 -----------------
 * - "append" method supports callback method
 * - added option to submit error method for settings on init
 * - error method is called if access to template is restricted (403) or template doesn't exist (404)
 * - restricted access is detected if template tag has an "access" attribute. value is submitted in event.access
 * 
 * --------- v0.2 -----------------
 * - fixed error with double <br>'s
 * 
 */

(function( $ ){
	
	if(!$.xml)
		$.xml = {};

  var methods = {
    init : function( options ) {  
    	return this.each(function(){
             var $this = $(this),
                 data = $this.data('xml');
             
             // If the plugin hasn't been initialized yet
             if ( ! data ) {
             
        	 var settings = {
			      xml         : '/xml/template.xml',
			      async: false,
			      error: function(){}
        	};
        	 
		      // If options exist, lets merge them
		      // with our default settings
		      if ( options ) { 
		        $.extend( settings, options );
		      }
		      
		      var $xmlDoc = null;
		      if(settings.async == false)
		    	  $xmlDoc = $.xml.loadXml(settings.xml);
		      
               $(this).data("xml", {
                   target : $this,
                   $xmlDoc : $xmlDoc,
                   settings : settings
               });

             }
    	});
    },
    append : function(contentName, callback) {
    	return this.each(function(){
    		 if(!contentName)
    			 contentName = "home";
    		 
             var $this = $(this),
             data = $this.data("xml"); 
             
             //var $appendTo = data.$appendTo;
             
             var $xmlDoc = data.$xmlDoc;
             if(data.settings.async == true)
            	 $xmlDoc = $.xml.loadXml(settings.xml);
             
             $xmlDoc.find("template#"+contentName).each(function(){
             	var access = $(this).attr("access");
             	if(access){
             		var event = $.Event("error", {type:403, access:access});
             		if(!data.settings.error.apply(data.target, [event]))
             			return;
             	}
             	
             	var obj = $(this).clone().contents();
                 var $div = $("<div/>").append(obj);
                 
                 //fixes bug with double br's
                 $div.find("br").replaceWith("<br/>");
                 $this.append($div.html());
                 
                 if(callback)
                 	callback.apply($this.target);
             });
    	});
    }
    
  };

  $.fn.xml = function( method ) {
    
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.xml' );
    }    
  
  };
  
  $.xml.loadXml = function(xml){
	  var xmlDoc =null;
	  
	  $.ajax({
			url: xml,
			dataType: $.browser.msie ? "text" : "xml",
			async:false,
			success: function(data){
				if (typeof data == "string") {
					var div = $("<div/>").html(data);
					xmlDoc =  div.html();
				} else {
					xmlDoc = data;
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				console.error(jqXHR.responseText);
			}
    });
	  $xmlDoc = $(xmlDoc);
	  return $xmlDoc;
  };
  
})( jQuery );