define([
	'jquery',
	'classes/User',
    'drafts',
    'messageStream'
], function($, User, drafts, messageStream){
	'use strict';

	return {
		load : function(){
            var self = this;
			$('#signin_btn').hide();
			$('.user_btn').show();

			$('#user_settings').click($.proxy(this.toggle, this));

			var $userMenu = $('#user_menu');
			var user = User.get();

			$userMenu.find('img').attr('src', user.getImage());
			$userMenu.find('.username').attr('href', user.getProfileURI()).text(user.name);
			$userMenu.find('#logout').click(function(){
				var user = User.get();
				$.when(user.logout()).then(function(){
                    self.remove();
                    $.address.update();
                });
			});

			if(user.level === 2){
				$userMenu.find('.admin').show();
			}

			$(document).click($.proxy(this.hide, this))
				.scroll($.proxy(this.hide, this));

            // wait ressources to complete loading and the wait another 500ms.
            // CHROME HACK: http://stackoverflow.com/questions/6287736/chrome-ajax-on-page-load-causes-busy-cursor-to-remain
            $(function(){
                setTimeout($.proxy(messageStream.checkNewMessageNum, messageStream),500);
                setTimeout($.proxy(drafts.num, drafts),500);
            });

		},
        remove : function(){
            $('#signin_btn').show();
            $('.user_btn, .admin').not('#user_home, #new_recipe').hide();
            $('#user_settings, #logout').unbind();
        },
		toggle : function(event){
			var $userMenu = $('#user_menu');
			var $target = $(event.target);
			if($userMenu.hasClass('visible')){
				$userMenu.removeClass('visible');
				$target.removeClass('focus');
			}else{
				var buttonOffset = $target.offset();
				$userMenu.css({top:buttonOffset.top+27,left:buttonOffset.left-150});
				$userMenu.addClass('visible');
				$target.addClass('focus');
			}
		},
		hide : function(event){
			var $userMenu = $('#user_menu');
			var $target = $(event.target);
			if (event.type === 'scroll' || !$target.parents().andSelf().is('#user_settings')|| $target.is('a')){
				$userMenu.removeClass('visible');
				$('#user_settings').removeClass('focus');
			}
		},
	};
});
