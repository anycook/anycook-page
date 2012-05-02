 $(document).ready(function(){
	 //setup
	 if($.browser.msie){
		 var version = Number($.browser.version);		
		 if(version<9)
			 document.location.href="http://news.anycook.de/tagged/internet_explorer";
	 }
	 
	 
	 //makeWidth
	 var $headerRight = $("#container_head_right");
	 var left = $headerRight.offset().left;
	 $headerRight.width($("body").width()-left);
	 var $right  = $("#right");
	 left = $right.offset().left;
	 $right.width($("body").width()-left);
	 
	 	
	 
    	$.ajaxSetup({
        	type:"POST", 
            scriptCharset: "utf8" , 
            contentType: "application/x-www-form-urlencoded; charset=utf8",
            // error:function(error){
            	// console.error(error.responseText);
            // }
        }); 
    	
    	//anycookgraph
			 $.anycook.graph.init({appid:2});
    //couchdb
    $.couch.urlPrefix = "http://test.anycook.de/couchdb";
    
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
    	
    	 //xml
		 $("#content_main").xml("init", {error:function(event){
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
		 	 }});
			 	 
    	

            //Login
            
    	$.when(User.init()).then(function(userinit){
    		user = userinit;
    		buildLogin();
    		
			$.address.bind("change",handleChange);
    		$.address.crawlable(true);
    		$.address.update();
    		
    		//drafts
	    	if(user.checkLogin()){
			    $.anycook.drafts.init(function(){
			    	$.anycook.drafts.num();
			    });
			    
			}
    	});
    	
    	search = new Search();
    	
    	


            //searchbar 

            
            
            
        	$("#search").autocomplete({
        		source:function(req,resp){
        			var array = [];
        		var term = req.term;
        		$.ajax({
        			url:"/anycook/getAutocompleteData",
        			dataType: "json",
        			async:false,
        			data:"q="+term,
        			success:function(data){
        				if(data.gerichte!=undefined){
	        				for(var i=0;i<data.gerichte.length;i++){
	        	                if(i==0)
	        			 			array[array.length] = { label: "<div class='autocomplete-h1'>Gerichte</div><div class='autocomplete-p'>"+data.gerichte[i]+"</div>", value: data.gerichte[i],data:"gericht"};
	        			 		else
	        			 			array[array.length] = { label: "<div class='autocomplete-p'>"+data.gerichte[i]+"</div>", value: data.gerichte[i],data:"gericht"};
	        	            }
        				}
        				if(data.zutaten!=undefined){
	        			 	for(var i=0;i<data.zutaten.length;i++){
	        			 		if(i==0)
	        			 			array[array.length] = { label: "<div class='autocomplete-h1'>Zutaten</div><div class='autocomplete-p'>"+data.zutaten[i]+"</div>", value: data.zutaten[i],data:"zutaten"};
	        			 		else
	        			 			array[array.length] = { label: "<div class='autocomplete-p'>"+data.zutaten[i]+"</div>", value: data.zutaten[i],data:"zutaten"};
	        	            }
        				}
        			 	if(data.kategorien!=undefined){        			 		
	        			 	for(var i=0;i<data.kategorien.length;i++){
	        	                    if(i==0)
	        	    		 			array[array.length] = { label: "<div class='autocomplete-h1'>Kategorien</div><div class='autocomplete-p'>"+data.kategorien[i]+"</div>", value: data.kategorien[i],data:"kategorie"};
	        	    		 		else
	        	    		 			array[array.length] = { label: "<div class='autocomplete-p'>"+data.kategorien[i]+"</div>", value: data.kategorien[i],data:"kategorie"};
	        	            }
        			 	}
        			 	if(data.tags!=undefined){
	        	            for(var i=0; i<data.tags.length; i++)
	        	            {
	        	            	if(i==0)
	        			 			array[array.length] = { label: "<div class='autocomplete-h1'>Tags</div><div class='autocomplete-p'>"+data.tags[i]+"</div>", value: data.tags[i], data:"tag"};
	        			 		else
	        			 			array[array.length] = { label: "<div class='autocomplete-p'>"+data.tags[i]+"</div>", value: data.tags[i], data:"tag"};
	        	            }
        			 	}
        			 	if(data.user!=undefined){
	        	            for(var i=0; i<data.user.length; i++)
	        	            {
	        	            	if(i==0)
	        			 			array[array.length] = { label: "<div class='autocomplete-h1'>User</div><div class='autocomplete-p'>"+data.user[i].name+"</div>", value: data.user[i].name, data:"user", id :data.user[i].id};
	        			 		else
	        			 			array[array.length] = { label: "<div class='autocomplete-p'>"+data.user[i].name+"</div>", value: data.user[i].name, data:"user", id :data.user[i].id};
	        	            }
        			 	}
        			}
        		});
        		resp(array);},
        		minLength:1,   
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
					offset:"-31 0"
				}
				}).data( "autocomplete" )._renderItem = function( ul, item ) {
					return $( "<li></li>" )
					.data( "item.autocomplete", item )
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
				
            	$("#search_form").submit(function(){
                	var data = $("input:first").val();
                	$.ajax({
                		  url: "/anycook/ValidateSearch",
                		  dataType: 'json',
                		  data: "q="+data,
                		  success: function(result){
                			  handleSearchResults(result, data);
                		  }
                		});
                	return false;
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
            	loadAllKategories($("#kategorie_filter ul"));
            	
            	removeChecked();
            	$("#filter_table .label_chefhats, #filter_table .label_muffins").click(function(){
                	if(!$("#filter_main").is(".blocked")){
	                	checkOnOff(this);
	                	handleRadios(this);
                	}
                	
                	// must return false or function is sometimes called twice
                	return false;
                }).mouseover(function(){
                	if(!$("#filter_main").is(".blocked"))
                		mouseoverRadio(this);
            	}).mouseleave(function(){
            		if(!$("#filter_main").is(".blocked"))
            			handleRadios(this);
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
            	$(".big_rezept p").ellipsis({live:true});
            	
            	
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
            	
            	
 });