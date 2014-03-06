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
	'AnycookAPI'
], function($, AnycookAPI){
	'use strict';

	//class User
	function User(){
		this.level = -1;
		this.name = null;
		this.mail = null;
		this.facebookID = null;
		this.schmeckt = null;
		this.recipes = null;
		this.text = null;
		this.following = null;
		this.follower = null;
		this.id = null;
		this.schmeckt = [];
		this.place = null;
	}

	User.init = function(){
		var dfd = $.Deferred();
		var user = new User();

		AnycookAPI.session(function(response){
			user.id = response.id;
			user.name = response.name;
			user.level = Number(response.level);
			user.mail = response.mail;
			user.facebookID = response.facebookID;
			user.text = response.text;
			user.followers = response.followers;
			user.following = response.following;
			user.place = response.place;
			user.emailCandidate = response.emailCandidate;
			$.when(user.getSchmecktRecipes()).then(function(schmeckt){
				user.schmeckt = schmeckt;
				$('html').data('user', user);
				dfd.resolve(user);
			});
		},
		function(response){
			console.error(response);
			dfd.resolve(user);
		});

		return dfd.promise();
	};



	User.initProfileInfo = function(id){
		var dfd = $.Deferred();


		$.when(AnycookAPI.user(id)).then(function(json){
			var profileUser = new User();
			profileUser.id = json.id;
			profileUser.name = json.name;
			profileUser.facebookID = json.facebookID;
			profileUser.schmeckt = json.schmeckt;
			profileUser.text = json.text;
			profileUser.date = json.createdate;
			profileUser.place = json.place;
			profileUser.discussionnum = json.discussionnum;
			profileUser.followers = json.followers;
			profileUser.following = json.following;

			dfd.resolve(profileUser);
		});

		return dfd.promise();
	};

	User.get = function(){
		return $('html').data('user') || new User();
	};

	User.getProfileURI = function(id){
		var uri = '#/profile/'+id;
		return uri;
	};

	User.prototype.getProfileURI = function(){
		var uri = '#/profile/'+this.id;
		return uri;
	};

	User.prototype.getFacebookProfileLink = function(){
		return 'http://www.facebook.com/people/@/'+this.facebookID;
	};

	User.prototype.getRecipes = function(callback){
		return User.getRecipes(this.id, callback);
	};

	User.getRecipes = function(userId, callback){
		var data = {userId:userId};
		return AnycookAPI.recipe(data,callback);
	};

	User.prototype.getSchmecktRecipes = function(callback){
		return User.getSchmecktRecipes(this.id, callback);
	};

	User.getSchmecktRecipes = function(userid, callback){
		return AnycookAPI.user.schmeckt(userid,callback);
	};

	User.getDiscussionNum = function(userid, callback){
		return AnycookAPI.user.discussionNum(userid, callback);
	};

	User.prototype.checkLogin = function(){
		return this.id !== null;
	};

	User.prototype.onlyUserAccess = function(){
		if(!this.checkLogin()) { $.address.value(''); }
		else { return true; }
		return false;
	};

	User.prototype.isFollowing = function(userid){
		for(var i in this.following) {
			if(this.following[i] === userid) { return true; }
		}
		return false;
	};

	User.prototype.isFollowedBy = function(userid){
		for(var i in this.followers) {
			if(this.followers[i] === userid) { return true; }
		}
		return false;
	};

	User.getUserImagePath = function(userid, type){
		return AnycookAPI.user.image(userid, type);
	};

	User.prototype.getUserImagePath = function(type){
		return AnycookAPI.user.image(this.id, type);
	};

	User.login = function(mail, pwd, stayloggedin){
		var callback = false;
		AnycookAPI.session.login(mail, pwd, stayloggedin, function(response){
			callback = response !== 'false';
			// checkNewMessageNum();
		});
		return callback;
	};

    User.facebookLogin = function(signedRequest){
        var callback = false;
        AnycookAPI.session.login.facebook(signedRequest, function(response){
            callback = response !== 'false';
            // checkNewMessageNum();
        });
        return callback;
    };

	User.prototype.logout = function(){
        var dfd = $.Deferred();
		this.level = -1;
		this.name = null;
		this.mail = null;
		this.facebookID = null;
		this.image = null;
		AnycookAPI.session.logout(function(){
            require(['FB'], function(FB){
                FB.getLoginStatus(function(response){
                    if(response.status === 'connected'){
                        FB.logout(function() { dfd.resolve(); });
                    } else { dfd.resolve(); }
                });
            });
		});
        return dfd.promise();
	};
	return User;
});


