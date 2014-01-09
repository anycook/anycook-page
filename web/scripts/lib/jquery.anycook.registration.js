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
 
(function( $ ){
	
	if(!$.anycook)
		$.anycook = {};
	
	$.anycook.registration = function(mail, username, password,callback){
		var graph = "/user";
		var data = {username:username, mail:mail, password:password};
		return $.anycook.api._post(graph,data,callback);
	}
		
	$.anycook.registration.checkMail =function(mail, callback){
		var graph = "/user/mail";
		var data = {mail:mail};
		return $.anycook.api._get(graph, data, callback);		
	}
	
	$.anycook.registration.checkUsername =function(username, callback){
		var graph = "/user/name";
		var data = {username:username};
		return $.anycook.api._get(graph, data, callback);		
	}
	
	$.anycook.registration.activate = function(activationKey, callback){
		var graph = "/session/activate";
		var data = {activationkey:activationKey};
		return $.anycook.api._post(graph, data, callback);
	}
	
})(jQuery);