define([
	'jquery',
	'classes/User',
    'drafts',
    'messageStream'
], function($, User, drafts, messageStream){
	'use strict';

	return {
		load : function(){
			$('#signin_btn').hide();
			$('.user_btn').show();

			$('#user_settings').click($.proxy(this.toggle, this));

			var $userMenu = $('#user_menu');
			var user = User.get();

			$userMenu.find('img').attr('src', User.getUserImagePath(user.id));
			var $profileLink = $('<a></a>').text(user.name).attr('href', user.getProfileURI());
			$userMenu.find('.username').append($profileLink);
			$userMenu.find('#logout').click(function(){
				var user = User.get();
				user.logout();
			});

			if(user.level === 2){
				$userMenu.find('.admin').show();
			}

			$(document).click($.proxy(this.hide, this))
				.scroll($.proxy(this.hide, this));

            // wait ressources to complete loading and the wait another 500ms.
            // CHROME HACK: http://stackoverflow.com/questions/6287736/chrome-ajax-on-page-load-causes-busy-cursor-to-remain
            //onReady(function(){

            //});
            setTimeout($.proxy(messageStream.checkNewMessageNum, messageStream),500);
            setTimeout($.proxy(drafts.num, drafts),500);
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
