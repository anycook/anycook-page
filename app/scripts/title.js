define(['jquery'], function($){
	'use strict';
	return {
        get : function(){
            return $(document).data('title') || 'anycook';
        },
		getPrefix : function(){
			var messageNum = $(document).data('messageNum') || 0;
			if(messageNum <= 0){
				return '';
			}
			return '('+messageNum+') ';
		},
		set : function(newTitle){
			if(!newTitle){
				newTitle = $(document).data('title') || 'anycook';
			}
			else{
				$(document).data('title', newTitle);
			}
			$.address.title(this.getPrefix() + newTitle);
		},
		setPrefix : function(newNum){
			$(document).data('messageNum', newNum);
			this.set();
		}
	};
});
