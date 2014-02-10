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
	'AnycookAPI',
	'classes/User',
	'date',
	'lightbox',
	'messageStream',
	'title'
], function($, AnycookAPI, User, date, lightbox, messageStream, title){
	'use strict';
	return {
		follow : function(event){
			var $target = $(event.target);
			var userid = $.address.pathNames()[1];
			var $follower = $('.follower .count');
			var numFollowers = Number($follower.text());
			if(!$target.hasClass('on')){
				AnycookAPI.user.follow(userid);
				$target.addClass('on').text('- Entfolgen');
				$('#stamp').fadeIn(500);
				$follower.text(numFollowers+1);
			}else{
				AnycookAPI.user.unfollow(userid);
				$target.removeClass('on').text('+ Folgen');
				$('#stamp').fadeOut(500);

				$follower.text(numFollowers-1);
			}
		},
		load : function(userid){
			var self = this;
			var user = User.get();

			if(userid === 'me' && user.onlyUserAccess()){
				userid = user.id;
			}
			$.when(User.initProfileInfo(userid)).then(function(profileData){
				title.set(profileData.name);
				var image = User.getUserImagePath(profileData.id, 'large');
				$('.profile_image').attr('src', image);
				$('.profile_title h1').text(profileData.name);

				var dateString = date.getDateString(profileData.date);
				$('.profile_date span').text(dateString);
				
				$('.profile_buttons #showRecipes').attr('href', '#/search?user='+userid);

				if(user.checkLogin()){
					if(user.id !== userid){
						$('#follow').click($.proxy(self.follow, self)).show();

						if(profileData.isFollowedBy(user.id)){
							$('#stamp').show();
							$('#follow').text('- Entfolgen').addClass('on');
						}

						//lightbox	
						$('#sendmessage').show().click(function(){
							var $lightbox = messageStream.getNewMessageLightbox();
							var top = $(this).offset().top-313;
							lightbox.show($lightbox, top, function(){
								this.find('textarea').focus();
							});
							messageStream.addRecipient(profileData.name, profileData.id);
							return false;
						});
					} else{
						$('.profile_buttons #preferences').show();
						
					}

					//$('.profile_buttons').show();
					
				}


				
				if(profileData.place !== null){
					$('.profile_place').show().children('span').text(profileData.place);
				}
				
				$('.profile_achievements .follower .count').text(profileData.followers.length);
				
				if(profileData.text !== null && profileData.text.length > 0){
					$('.profile_text').show().text('»'+profileData.text+'«');
				}
				
				// if(profileData.facebook_id>0){
				// 	var fblink = $('.profile_facebook');
				// 	fblink.attr('href', profileData.getFacebookProfileLink());
				// 	fblink.css('display', 'block');		
				// }
				
				$('.profile_search').attr('href', '#!/search/user/'+encodeURIComponent(profileData.name));
				
				User.getRecipes(userid, function(recipes){
					$('.profile_achievements .recipes .count').text(recipes.length);
					if(recipes.length > 0){
						
						var headline;
						if(userid === user.id){
							headline = 'Deine Rezepte ('+recipes.length+')';
						}
						else{
							headline = 'Rezepte von '+profileData.name+' ('+recipes.length+')';
						}
						$('#profile_recipes').recipeoverview(headline, recipes).show();
					}
				});
				
				AnycookAPI.user.schmeckt(userid, function(schmeckt){
					$('.profile_achievements .likes .count').text(schmeckt.length);
					if(schmeckt.length > 0){
						var headline;

						if(userid === user.id){
							headline = 'Deine Lieblingsrezepte ('+schmeckt.length+')';
						}
						else{
							headline = 'Lieblingsrezepte von '+profileData.name+' ('+schmeckt.length+')';
						}
						$('#profile_schmeckt').recipeoverview(headline, schmeckt).show();
					}
				});

				
				
				User.getDiscussionNum(userid, function(discussionNum){
					$('.profile_achievements .discussions .count').text(discussionNum);
				});
			});
				
			if(userid === user.id){
				AnycookAPI.user.recommendations (function(json){
					if(json.length>0){
						var headline = 'Diese Rezepte könnten dir auch schmecken';
						$('#profile_recommendation').recipeoverview(headline, json).show();
					}
				});
			}
			
		},
		gotoProfile : function(username){
			$.address.value('profile/'+encodeURIComponent(username));
		}
	};
});
