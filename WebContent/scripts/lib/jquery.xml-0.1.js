(function( $ ){

  var methods = {
    init : function( options ) {  
    	return this.each(function(){
             var $this = $(this),
                 data = $this.data('xml');
             
             // If the plugin hasn't been initialized yet
             if ( ! data ) {
             
        	 var settings = {
			      'xml'         : '/xml/template.xml'
        	};
        	 
		      // If options exist, lets merge them
		      // with our default settings
		      if ( options ) { 
		        $.extend( settings, options );
		      }
		      
		      var xml;
		      $.ajax({
					url: settings.xml,
					dataType: $.browser.msie ? "text" : "xml",
					async:false,
					success: function(data){
						if (typeof data == "string") {
							var div = $("<div/>").html(data);
						    xml =  div.html();
						} else {
							xml = data;
						}
					},
					error: function(jqXHR, textStatus, errorThrown){
						alert(jqXHR, textStatus, errorThrown);
					}
		      });
		      
               $(this).data("xml", {
                   target : $this,
                   $xmlDoc : $(xml)
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
             
             $xmlDoc.find("template#"+contentName).each(function(){
             	var obj = $(this).clone().contents();
                 var div = $("<div/>").append(obj);
                 $this.append(div.html());
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
  
})( jQuery );