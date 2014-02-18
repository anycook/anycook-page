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
'use strict';
// Require.js allows us to configure shortcut alias
require.config({
	paths : {
		'AnycookAPI' : ['//10.1.0.200/js/anycookapi','//api.anycook.de/js/anycookapi'],
		'FB' : '//connect.facebook.net/de_DE/all',
		'jquery' : '../bower_components/jquery/jquery',
		'jquery.address' : '../bower_components/jquery-address/src/jquery.address',
		'jquery.autoellipsis' : '../bower_components/jquery.autoellipsis/src/jquery.autoellipsis',
		'jquery-autosize' : '../bower_components/jquery-autosize/jquery.autosize',
		'jquery.inputdecorator' : 'lib/jquery.inputdecorator-0.1.2',
		'jquery.mousewheel' : '../bower_components/jscrollpane/script/jquery.mousewheel',
		'jquery.recipeoverview' : 'lib/jquery.recipeoverview',
		'jquery.ui.core' : '../bower_components/jquery.ui/ui/jquery.ui.core',
		'jquery.ui.effect' : '../bower_components/jquery.ui/ui/jquery.ui.effect',
		'jquery.ui.menu' : '../bower_components/jquery.ui/ui/jquery.ui.menu',
		'jquery.ui.mouse' : '../bower_components/jquery.ui/ui/jquery.ui.mouse',
		'jquery.ui.position' : '../bower_components/jquery.ui/ui/jquery.ui.position',
		'jquery.ui.progressbar' : '../bower_components/jquery.ui/ui/jquery.ui.progressbar',
		'jquery.ui.sortable' : '../bower_components/jquery.ui/ui/jquery.ui.sortable',
		'jquery.ui.widget' : '../bower_components/jquery.ui/ui/jquery.ui.widget',
		'jquery.ui.autocomplete' : '../bower_components/jquery.ui/ui/jquery.ui.autocomplete',
		'jquery.xml' : 'lib/jquery.xml-0.4.1.min',
		'jscrollpane' : '../bower_components/jscrollpane/script/jquery.jscrollpane',
		'plusone' : 'lib/plusone',
		'text' : '../bower_components/requirejs-text/text',
		'templates' : '../templates',
		'underscore' : '../bower_components/underscore/underscore'
	},
	shim : {
		'AnycookAPI' : {
			deps : ['jquery'],
			exports : 'AnycookAPI'
		},
		'FB' : {
			exports : 'FB'
		},
		'jquery.address' : {
			deps : ['jquery'],
			exports : '$'
		},
		'jquery.autoellipsis' : {
			deps : ['jquery'],
			exports : '$'
		},
		'jquery-autosize' : {
			deps : ['jquery'],
			exports : '$'
		},
		'jquery.inputdecorator' : {
			deps : ['jquery'],
			exports : '$'
		},
		'jquery.recipeoverview' : {
			deps : ['jquery'],
			exports : '$'
		},
		'jquery.ui.core' : {
			deps : ['jquery'],
			exports : '$'
		},
		'jquery.ui.effect' : {
			deps : ['jquery'],
			exports : '$'
		},
		'jquery.ui.sortable' : {
			deps : ['jquery', 'jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.mouse'],
			exports : '$'
		},
		'jquery.ui.widget' : {
			deps : ['jquery', 'jquery.ui.core'],
			exports : '$'
		},
		'jquery.ui.menu' : {
			deps : ['jquery', 'jquery.ui.widget'],
			exports : '$'
		},
		'jquery.ui.mouse' : {
			deps : ['jquery', 'jquery.ui.widget'],
			exports : '$'
		},
		'jquery.ui.position' : {
			deps : ['jquery', 'jquery.ui.core'],
			exports : '$'
		},
		'jquery.ui.progressbar' : {
			deps : ['jquery', 'jquery.ui.core', 'jquery.ui.widget'],
			exports : '$'
		},
		'jquery.ui.autocomplete' : {
			deps : ['jquery', 'jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.menu', 'jquery.ui.position'],
			exports : '$'
		},
		'jquery.xml' : {
			deps : ['jquery'],
			exports : '$'
		},
		'jscrollpane' : {
			deps : ['jquery', 'jquery.mousewheel'],
			exports : '$'
		},
		'plusone' : {
			exports : 'gapi'
		},
		'underscore' : {
			exports : '_'
		}
	}
});

require([
	'jquery',
	'AnycookAPI',
	'FB',
	'classes/Search',
	'classes/User',
	'addressChange',
	'drafts',
	'loginMenu',
	'searchView',
	'scroll',
	'facebook',
	'filters',
	'messageStream',
	'tags',
	'time',
	'userMenu',
	'userProfile',
	'jquery.address',
	'jquery.ui.autocomplete',
	'jquery.xml'
], function($, AnycookAPI, FB, Search, User, addressChange, drafts, loginMenu, searchView,
	scroll, facebook, filters, messageStream, tags, time, userMenu, userProfile){
	//setup
	// if($.browser.msie){
		// var version = Number($.browser.version);
		// if(version<9)
			// document.location.href='http://news.anycook.de/tagged/internet_explorer';
	// }

	//CORS
	//source: http://api.jquery.com/jQuery.support/
	$.support.cors = true;


	//makeWidth
	var updateWidth = function(){
		var minWidth = 1024;
		var bodyWidth = $('body').width();
		var width = Math.max(minWidth, bodyWidth);
		/*var $headerRight = $('#container_head_right');
		var left = $headerRight.offset().left;
		$headerRight.width(width-left);*/
		var $right  = $('#right');
		var left = $right.offset().left;
		$right.width(width-left);
	};

	updateWidth();
	$(window).resize(updateWidth);

	$.ajaxSetup({
		global:true,
		scriptCharset: 'utf8',
		contentType: 'application/x-www-form-urlencoded; charset=utf8'
	});

    $(document).ajaxStart(function(){
		$('#loadpoints span').addClass('loading');
	})
	.ajaxStop(function(){
		$('#loadpoints span').removeClass('loading');
	});

	//anycookapi
	var baseUrl = 'http://10.1.0.200';
	$.when(AnycookAPI.init({appId:2, baseUrl: baseUrl})).then(function(){
		filters.loadAllCategories($('#kategorie_filter ul'));

		var xmlErrorFunction = function(event){
			switch(event.type){
				case 403:
					var user = User.get();
					if(!user.checkLogin()){
						console.log('access only for logged-in users');
						$.address.path('');
						return false;
					}
					break;
				case 404:
					$.address.path('notfound');
			}
			return true;
		};

		var xmlOptions = {
			error:xmlErrorFunction
		};

		$.when($('#content_main').xml(xmlOptions)).then(function(){
			$.when(User.init()).then(function(userinit){
				var user = userinit;

				loginMenu.buildLogin();

				$.address.bind('change', $.proxy(addressChange.handleChange, addressChange));
				$.address.update();

				if(user.checkLogin()){ userMenu.load(); }
			});
		});
	});


	//startfadeIn
	if($.address.pathNames().length === 0){
		$('#filter_container').delay(1000).animate({opacity:1},1500);
	}
	else {
		$('#filter_container').css('opacity', 1);
	}

	jQuery.extend(jQuery.expr[':'], {
	    focus: function(element) { return element === document.activeElement; }
	});

	var searchObject = new Search();

    //searchbar
	$('#search').autocomplete({
		source		: $.proxy(searchView.searchAutocomplete, searchView),
		minLength	: 1,
		autoFocus	: true,
		select		: function(event, ui){
			event.preventDefault();
			var text = ui.item.value;
			var type = ui.item.data;
			$('#search').val('');
			switch(type){
			case 'recipes':
				$.address.path('recipe/'+text);
				break;
			case 'ingredients':
				searchObject.addZutat(text);
				searchObject.flush();
				break;
			case 'excludeIngredients':
				searchObject.excludeIngredient(text.substr(1));
				searchObject.flush();
				break;
			case 'categories':
				searchObject.setKategorie(text);
				searchObject.flush();
				break;
			case 'tag':
				searchObject.addTag(text);
				searchObject.flush();
				break;
			case 'user':
				userProfile.gotoProfile(ui.item.id);
			}
		},
		position:{
			of : '#searchbar',
			my : 'right top-1',
			at : 'right bottom'
		}
	}).data( 'ui-autocomplete' )._renderItem = function( ul, item ) {
		return $( '<li></li>' )
		.data( 'ui-autocomplete-item', item )
		.append('<a>'+item.label+'</a>')
		.appendTo( ul );
	};

	$('#search').keydown(function (event) {
		if(event.keyCode === 13){
			$('ul.ui-autocomplete').hide();
			$('#search_form').submit();
		}
	});


	$('.ui-autocomplete').addClass('search-autocomplete');

	$('#search_form').submit(function(event){
		event.preventDefault();
		var data = $('#search').val();

		if(data === '') { return; }
		var search = Search.init();
		search.setTerms(data);
		search.flush();
	});

	$('#search_reset').click(function(){
		if($.address.pathNames().length > 0) { $.address.path(''); }
		else { filters.reset(); }
	});

	$('#filter_reset').click(function(){history.back();});

	$('#search').focusout(searchView.focusoutSearch);


	//Kategoriefilter
	$('#kategorie_head').click($.proxy(filters.handleCategories, filters));
	$('#kategorie_list').on('click', 'li', $.proxy(filters.clickCategory, filters))
		.on('mouseenter', 'li', $.proxy(filters.mouseoverCategory, filters))
		.on('mouseleave', 'li', $.proxy(filters.mouseleaveCategory, filters));
	$(document).click($.proxy(filters.closeCategories, filters));
	//loadAllKategories($('#kategorie_filter ul'));

	filters.removeChecked();
	$('#filter_table .label_chefhats, #filter_table .label_muffins').click(function(){
		if(!$('#filter_main').is('.blocked')){
			filters.checkOnOff(this);
			// handleRadios(this);
		}

		// must return false or function is sometimes called twice
		return false;
	}).mouseover(function(){
		if(!$('#filter_main').is('.blocked')) { filters.mouseoverRadio(this); }
	});

	$('.filter_table_right').mouseleave(function(){
		if(!$('#filter_main').is('.blocked')) { filters.handleRadios($(this).children()); }
	});

	//zutatentabelle

	$('#ingredient_list').click($.proxy(filters.ingredientListClick, filters))
		.on('click', '.close', $.proxy(filters.removeIngredientField, filters))
		.on('click', '.plus', $.proxy(filters.clickExcludeIngredient, filters))
		.on('click', '.minus', $.proxy(filters.clickAddIngredient, filters));


	//tagsfilter
	var tagData = {
		add : $.proxy(tags.searchTag, tags),
		remove : $.proxy(tags.searchRemoveTag, tags)
	};
	$('.tags_list').submit($.proxy(tags.submitTags, tags))
		.click(tagData, $.proxy(tags.makeInput, tags))
		.on('click', '.tag_remove', tagData, $.proxy(tags.remove, tags));
	// $('.tags_table_right').click(makeNewTagInput);

	//timefilter
	$('#time_form').submit($.proxy(time.formSubmit, time));
	$('#time_std,#time_min').keydown($.proxy(time.key, time));
	$('.time .up, .time .down').click($.proxy(time.upDownListener, time));

	//userfilter
	//$('#userfilter').mouseenter(showUserfilterremove);
	//$('#userfilter').mouseleave(hideUserfilterremove);
	//$('#userfilterremove').click(removeUserfilter);

	//scrollListener
	$(document).scroll($.proxy(scroll.listen, scroll));

	//ellipsis for .big_rezept p
	// $('.big_rezept p').ellipsis({live:true});

	// search events
	$('html').on('startSearch', $.proxy(filters.setFromSession, filters))
		.on('searchResults', $.proxy(searchView.addResults, searchView))
		.on('emptySearchResult', $.proxy(searchView.showEmptyResult, searchView));

	//Facebook
	FB.init({
		appId  : '143100952399957',
		status : true, // check login status
		cookie : true, // enable cookies to allow the server to access the session
		xfbml  : true //, // parse XFBML
		//oauth  : true // enable OAuth 2.0
	});

	FB.Event.subscribe('auth.sessionChange', $.proxy(facebook.sessionChange, facebook));
	//FB.Event.subscribe('auth.authResponseChange', fbSessionChange);
	//FB.getLoginStatus(fbSessionChange);
});
