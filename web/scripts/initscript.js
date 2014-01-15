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

 $(document).ready(function(){
	//setup
	// if($.browser.msie){
		// var version = Number($.browser.version);		
		// if(version<9)
			// document.location.href="http://news.anycook.de/tagged/internet_explorer";
	// }
	 
	//CORS
	//source: http://api.jquery.com/jQuery.support/	 
	$.support.cors = true;
	 
	 
	//makeWidth
	updateWidth();
	$(window).resize(updateWidth);	 
	 	
	$.ajaxSetup({
    	global:true,
        scriptCharset: "utf8" , 
        contentType: "application/x-www-form-urlencoded; charset=utf8"
    });

    $(document).ajaxStart(function(){
		$("#loadpoints span").addClass("loading");
	})
	.ajaxStop(function(){
		$("#loadpoints span").removeClass("loading");
	});

    //anycookapi
    baseUrl = "http://10.1.0.200";
	$.when($.anycook.api.init({appId:2, baseUrl: baseUrl})).then(function(){
    	loadAllKategories($("#kategorie_filter ul"));
    	
    	var xmlErrorFunction = function(event){
		 	switch(event.type){
		 		case 403:
		 			if(!user.checkLogin()){
		 				console.log("access only for logged-in users");
		 				$.address.path("");
		 				return false;
		 			}
		 			break;
		 		case 404:
		 			$.address.path("notfound");
		 	}
		 	return true;
	 	};
    	
    	var xmlOptions = {
    		error:xmlErrorFunction
    	}
    	
    	$.when($("#content_main").xml(xmlOptions)).then(function(){
	    	$.when(User.init()).then(function(userinit){
	    		user = userinit;
	    		buildLogin();
	    		    		 
	    		 
		 	 	$.address.bind("change",handleChange);
	    		$.address.crawlable(true);
	    		$.address.update();
	    		
	    		//drafts
		    	if(user.checkLogin()){
		    		makeUsermenuText();
		    		
		    		// wait ressources to complete loading and the wait another 500ms.
		    		// CHROME HACK: http://stackoverflow.com/questions/6287736/chrome-ajax-on-page-load-causes-busy-cursor-to-remain
		    		onReady(function(){
		    			setTimeout(checkNewMessageNum,500);
		    			setTimeout($.anycook.drafts.num,500);
		    		});
				}
	 	 	});
				
    	});
    	
	});
	
    
	//startfadeIn
	if($.address.pathNames().length == 0)
		$("#filter_container").delay(1000).animate({opacity:1},1500);
	else
		$("#filter_container").css("opacity", 1);
	
	jQuery.extend(jQuery.expr[':'], {
	    focus: function(element) { 
	        return element == document.activeElement; 
	    }
	});
	
	search = new Search();

    //searchbar 
	$("#search").autocomplete({
		source:searchAutocomplete,
		minLength:1,
		autoFocus:true,
		select:function(event, ui){
			var text = ui.item.value;
			var type = ui.item.data;
			$("#search").val("");
			if(type == "gericht"){
				gotoGericht(text);
			}
			else if(type == "zutaten"){
				search.addZutat(text);
				search.flush();
			}
			else if(type == "excludedingredients"){
				search.excludeIngredient(text.substr(1));
				search.flush();
			}
			else if(type == "kategorie"){
				search.setKategorie(text);
				search.flush();
			}
			else if(type == "tag"){
				//saveTag(text);
				search.addTag(text);
				search.flush();
			}
			else if(type == "user"){
				/*search.setUsername(text);
				search.flush();*/
				gotoProfile(ui.item.id);
			}
			
			return false;
		},
		position:{
			of : "#searchbar",
			my : "right top-1", 
			at: "right bottom"
		}
	}).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
		return $( "<li></li>" )
		.data( "ui-autocomplete-item", item )
		.append("<a>"+item.label+"</a>")
		.appendTo( ul );
	};

    $("#search").keydown(function (event) {
	  	if (event.keyCode == 13){
		  	$("ul.ui-autocomplete").hide();
		  	$("#search_form").submit();
	  	}						  
	});
			
			
	$(".ui-autocomplete").addClass("search-autocomplete");
	
	$("#search_form").submit(function(event){
		event.preventDefault();
    	var data = $("#search").val();
    	search.setTerms(data);
    	search.flush();
	});

	$("#search_reset").click(function(){
		var val = $("#search").val();
		if($.address.pathNames().length > 0)
			$.address.path("");
		else
			resetAll();
	});
	
	$("#filter_reset").click(function(){history.back();});
	
	
	$("#search").focusout(focusoutSearch);
	
	
	//Kategoriefilter
	$("#kategorie_head").click(handleKategories);
	//loadAllKategories($("#kategorie_filter ul"));
	
	removeChecked();
	$("#filter_table .label_chefhats, #filter_table .label_muffins").click(function(){
    	if(!$("#filter_main").is(".blocked")){
        	checkOnOff(this);
        	// handleRadios(this);
    	}
    	
    	// must return false or function is sometimes called twice
    	return false;
    }).mouseover(function(){
    	if(!$("#filter_main").is(".blocked"))
    		mouseoverRadio(this);
	})
	
	$(".filter_table_right").mouseleave(function(){
		if(!$("#filter_main").is(".blocked"))
			handleRadios($(this).children());
	});

	//zutatentabelle
	
	$("#ingredient_list").click(ingredientListClick).on('click', ".close", removeZutatField);
	
	
	//tagsfilter
	$(".tags_list").submit(submitTags).click(makeNewTagInput);
	// $(".tags_table_right").click(makeNewTagInput);
	
	//$(".tags_table_right .tag_remove").live('click', function(event){removeTag(event.target.parentNode);});
	
	
	//timefilter
	$("#time_form").submit(timeFormSubmit);
	$("#time_std,#time_min").keydown(keyTime);
	$(".time .up, .time .down").click(timeUpDownListener);
	
	//loginform
	//$("#login_mail.wrong + #email_end, #login_pwd.wrong + #password_end, #login_username.wrong + #username_end").live("mouseenter", showLoginErrorPopups);
	//$("#login_mail.wrong + #email_end, #login_pwd.wrong + #password_end, #login_username.wrong + #username_end").live("mouseleave", hideLoginErrorPopups);
	
	//userfilter
	$("#userfilter").mouseenter(showUserfilterremove);
	$("#userfilter").mouseleave(hideUserfilterremove);
	$("#userfilterremove").click(removeUserfilter);
	
	//scrollListener
	$(document).scroll(scrollListener);
    	
    	
    	//ellipsis for .big_rezept p
    	// $(".big_rezept p").ellipsis({live:true});
    	
    	
	//Facebook
	FB.init({
	    appId  : '143100952399957',
	    status : true, // check login status
	    cookie : true, // enable cookies to allow the server to access the session
	    xfbml  : true //, // parse XFBML
	    //oauth  : true // enable OAuth 2.0
  	});

	FB.Event.subscribe("auth.sessionChange", fbSessionChange);
	//FB.Event.subscribe("auth.authResponseChange", fbSessionChange);
	//FB.getLoginStatus(fbSessionChange);
	
	//marked
	// Set default options
	marked.setOptions({
  		gfm: true,
	  	tables: true,
	  	breaks: false,
	  	pedantic: false,
	  	sanitize: true,
	  	smartLists: true,
	  	langPrefix: 'language-',
	  	highlight: function(code, lang) {
		    if (lang === 'js') {
		      	return highlighter.javascript(code);
		    }
	    	return code;
	  	}
	});
            	
 });