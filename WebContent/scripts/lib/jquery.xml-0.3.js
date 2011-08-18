/*
 * jQuery XML Plugin v0.2
 * http://anycook.de
 *
 * Copyright (c) 2011 Jan Grassegger
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 * 
 * Changes:
 * 
 * 
 * --------- v0.2 -----------------
 * - fixed error with double <br>'s
 * 
 */

(function( $ ){

  var methods = {
    init : function( options ) {  
    	return this.each(function(){
             var $this = $(this),
                 data = $this.data('xml');
             
             // If the plugin hasn't been initialized yet
             if ( ! data ) {
             
        	 var settings = {
			      xml         : '/xml/template.xml',
			      async: false
        	};
        	 
		      // If options exist, lets merge them
		      // with our default settings
		      if ( options ) { 
		        $.extend( settings, options );
		      }
		      
		      var $xmlDoc = null;
		      if(settings.async == false)
		    	  $xmlDoc = $.fn.xml.loadXml(settings.xml);
		      
               $(this).data("xml", {
                   target : $this,
                   $xmlDoc : $xmlDoc,
                   settings : settings
               });

             }
    	});
    },
    append : function(contentName) {
    	return this.each(function(){
    		 if(!contentName)
    			 contentName = "home";
    		 
             var $this = $(this),
             data = $this.data("xml"); 
             
             //var $appendTo = data.$appendTo;
             
             var $xmlDoc = data.$xmlDoc;
             if(data.settings.async == true)
            	 $xmlDoc = $.fn.xml.loadXml(settings.xml);
             
             $xmlDoc.find("template#"+contentName).each(function(){
             	var obj = $(this).clone().contents();
                 var $div = $("<div/>").append(obj);
                 
                 //fixes bug with double br's
                 $div.find("br").replaceWith("<br/>");
                 $this.append($div.html());
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
  
  $.fn.xml.loadXml = function(xml){
	  var xmlDoc =null;
	  
	  $.ajax({
			url: xml,
			dataType: $.browser.msie ? "text" : "xml",
			async:false,
			success: function(data){
				if (typeof data == "string") {
					if(Number($.browser.version)>=9){
						var div = $("<div/>").html(data);
						xmlDoc =  div.html();
					}else{
						xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
						xmlDoc.async = false;
						xmlDoc.loadXML(data);
					}
				} else {
					xmlDoc = data;
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				alert(jqXHR, textStatus, errorThrown);
			}
    });
	  $xmlDoc = $(xmlDoc);
	  return $xmlDoc;
  };
  
})( jQuery );