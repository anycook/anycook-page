// alle Filter
function setFiltersfromSession(){
	resetFilter();
	
	if(search != null){
		if(search.kategorie!=null){
			$("#kategorie_filter_name").text(search.kategorie);
			$("#kategorie_filter_hidden").val(search.kategorie);
		}
		if(search.skill!=null){
			checkOn("#chef_"+search.skill);
			handleRadios(".label_chefhats");
		}
		if(search.wertung!=null){
			checkOn("#star_"+search.wertung);
			handleRadios(".label_stars");
		}
		if(search.kalorien!=null){
			checkOn("#muffin_"+search.kalorien);
			handleRadios(".label_muffins");
		}
		if(search.time != null){
			var time = search.time.split(":");
			$("#time_std").val(time[0]);
			$("#time_min").val(time[1]);
		}
		if(search.user !=null){
			setUserfilter(search.user);
		}
		
		for(num in search.zutaten)
			addZutatRow(search.zutaten[num]);
		
		for(num in search.tags)
			$(".tags_table_right").append("<div class='tag'><div class='tag_text'>"+search.tags[num]+"</div><div class='tag_remove'>x</div></div>");
		
		if(search.terms!=undefined){
			$("#search_terms").show();
			for(i in search.terms){
				addTerms(search.terms[i], false);
				}
		}
	}

}

function resetFilter(){
	$("#progress_1, #progress_2, #progress_3, #progress_4").remove();
	$("#userfilter").hide();
	$("#filter_main").show().css({paddingBottom: "20px", height: "auto"});
	$("#filter_main *").not("ul.kategorie_filter, #userfilter, #userfilter *").show().css("opacity", 1);
	$("#filter_headline").text("Filter");
	$("#time_std, #time_min").val("00");
	$("#time_std, #time_min").removeAttr("readonly");
	removeChecked();
	blockFilter(false);
	handleRadios(".label_stars, .label_chefhats, .label_muffins");
	
	$("#zutaten_table > *").remove();
	
	$(".tags_table_right > *").remove();
	
	$("#kategorie_filter_name").text("Keine Kategorie");
	$("#kategorie_filter_hidden").val("Keine Kategorie");
	
	$("#userfilter").hide();
	
	$(".search_term").remove();
	$("#terms_text").hide();
	$(".close_term").die("click", removeTerm);
	
}


//kategorie

function loadAllKategories(target){
	if(!target.children().size() > 0){
		if(target.parents(".step_1_right").length == 0)
			target.append("<li>Keine Kategorie</li>");
		$.ajax({
			url:"/anycook/GetAllKategories",
			async:false,
			dataType: 'json',
			success:function(json){
				for(var i=0; i<json.length; i++){
					target.append("<li>"+json[i]+"</li>");
				}
		}
		});
	}
}

function handleKategories(obj){
	if(blocked==false){
		$("ul.kategorie_filter").toggle();
		$("div.kategorie_filter").toggleClass("on");
		if($("div.kategorie_filter").hasClass("on")){
			$("ul.kategorie_filter li").mouseenter(kategorieOver).mouseout(kategorieOut).click(kategorieClick);
	    	$(document).click(closeKategorien);
	    	
		}
		else{
			$("ul.kategorie_filter li").unbind("mouseenter", kategorieOver).unbind("mouseout", kategorieOut).unbind("click", kategorieClick);
	    	$(document).unbind("click", closeKategorien);
		}
		return false;
	}
}

function kategorieOver(event){
	var target = $(event.target);	
	var text = target.text();
	target.parent().prev().children("#kategorie_filter_name").html(text);
}

function kategorieOut(event){
	var target = $(event.target);
	var oldtext = target.parent().prev().children("#kategorie_filter_hidden").val();
	target.parent().prev().children("#kategorie_filter_name").html(oldtext);
}

function kategorieClick(obj){
	var text = $(obj.target).text();
	
	setKategorie(text);
	
	
	handleKategories(obj);
}

function setKategorie(text){
	var hiddenval = $("#kategorie_filter_hidden").val();
	if(hiddenval != text){
		if(text == "Keine Kategorie")
			text = null;

		search.setKategorie(text);
		search.flush();
	}
	
}


function closeKategorien(obj){
	var menu = $('.kategorie_filter');
	var target = $(obj.target);
	if (target.parents().andSelf().not(menu) && $("div.kategorie_filter").hasClass("on"))
		handleKategories(obj);
}


//radiobuttons

var blocked = false;

function handleRadios(obj){
		$(obj).removeClass('on');
		$(obj).siblings().removeClass('on');
		
	    $('label input:checked').each(function(){ 
	        $(this).parent('label').addClass('on');
	        $(this).parent('label').prevAll().addClass('on');
	    });	
}

function blockFilter(onoff){
	var objs = $(".label_stars, .label_chefhats, .label_muffins, div.kategorie_filter");
	blocked = onoff;
	if(onoff){
		objs.css("cursor", "default");
		$("#time_std, #time_min").attr("disabled", "disabled");
		$("div.kategorie_filter > div").addClass("off");
	}
	else{
		objs.css("cursor", "pointer");
		$("#time_std, #time_min").removeAttr("disabled");
		$("div.kategorie_filter > div").removeClass("off");
	}
}

function mouseoverRadio(obj){
	$(obj).nextAll().removeClass('on');
	$(obj).prevAll().andSelf().addClass('on');
}

function removeChecked(){
	$('label input:checked').removeAttr("checked");
}

function checkOnOff(obj){
	obj=$(obj).children().first();
	if($.address.pathNames()[0]!="newrecipe"){
		var value = $(obj).val();
			
		switch($(obj).attr("class")){
		case "chefhats":
			search.setSkill(value);
			break;
		case "muffins":
			search.setKalorien(value);
			break;
		}
		search.flush();
	}
	else{
		if($(obj).attr("checked")){
			obj.removeAttr("checked");
		}
		else{
			$(obj).attr("checked", "checked");
		}
	}
}

function checkOn(obj){
	if($(obj).attr("ckecked")==null){
		$(obj).siblings().removeAttr("checked");
		$(obj).attr("checked", "checked");
	}
}

function textReplacement(input){
	var originalvalue = input.val();
	 input.focus( function(){
	  if( $.trim(input.val()) == originalvalue ){ input.val(''); }
	 });
	 input.blur( function(){
	  if( $.trim(input.val()) == '' ){ input.val(originalvalue); }
	 });
}


//zutaten
function zutatentableclick(){
	if(blocked == false){
		if($("#zutat_input").val()=="")
			$("#zutat_input").focus();
		else{
			$("#zutaten_table").append("<tr><td class='zutaten_table_left'><form id='zutat_form'><input type='text' id='zutat_input'/></form></td><td class='zutaten_table_right'></td></tr>");
			$("#zutat_input").focus();
			$("#zutat_input").keyup(function(event){
				if(event.keyCode>40)
					addRemoveZutat();
	    	});
	    	/*$("#zutat_input").focusout(function(obj){
	    			saveZutat();	    		
	    	});*/
	    	$("#zutat_input").autocomplete({
	    		source:function(req,resp){
        			var array = [];
        		var term = req.term;
        		$.ajax({
        			url:"/anycook/AutocompleteZutat",
        			dataType: "json",
        			async:false,
        			data:"q="+term,
        			success:function(data){
        				resp($.map(data, function(item){
        					return{
        						label:item
        						};
        					}));        			
        					}
        				});
        			},
        			minlength:1,
        			position:{
        				offset:"-5 2"
        			}, 
        			select:function(event, ui){
        				var text = ui.item.label;
        				$("#zutat_input").autocomplete("destroy");
        				$("#zutat_input").parents("tr").remove();
        				search.addZutat(text);
        				search.flush();
        				return false;
        			}
	    	});
	    	$(".ui-autocomplete").last().addClass("zutat-autocomplete");
	    	
	    	$("#zutat_form").submit(function(event){
	    		var zutat = $("#zutat_input").val();
	    		$("#zutat_input").autocomplete("destroy");
				$("#zutat_input").parents("tr").remove();
	    		search.addZutat(zutat);
	    		search.flush();
	    		//zutatentableclick();
	    		return false;
	    	});
	    	
	    	
		}
	}
}

function addRemoveZutat(){
	var obj = $("#zutat_input")[0];
	var tdright = obj.parentNode.parentNode.parentNode.children[1];
	if($(obj).val()!="" && $(tdright).children().size()==0){
		$(tdright).append("<div class='remove_zutat'></div>");
	}
	else if($(obj).val()==""){
		$(tdright).children().remove();
	}
}

function removeZutatField(event){
	var obj = event.target.parentNode.parentNode;
	var zutat = $(obj.children[0]).text();
	search.removeZutat(zutat);
	search.flush();
}


//userfilter

function setUserfilter(username){
	if($("#userfilter span>a").text() == username){
		$("#userfilter").css({display:"block", opacity:1, height:50});
	}else{
	
		$.ajax({
			  url: "/anycook/GetUserInformation",
			  data:"username="+username,
			  success: function(imagepath){
				  $("#userfilter a").attr("href", "/#!/profile/"+username);
				  $("#userfilter img").attr("src", imagepath);
				  var text = "<span><a href=\"/#!/profile/"+username+"\">"+username+"</a>'s<br/>Rezepte</span>";
				  $("#userfiltertext").html(text);
				  
				  if($("#userfilter").css("display")=="none"){
					  $("#userfilter").css({display:"block", opacity:0, height:0}).animate({height:50}, {duration:300, complete:function(){
						  $(this).animate({opacity:1}, 400);
					  }});
				  }
			  }
		});
	}
}

function showUserfilterremove(event){
	$("#userfilterremove").fadeIn(300);
}

function hideUserfilterremove(event){
	$("#userfilterremove").fadeOut(300);
}

function removeUserfilter(){
	$("#userfilter").animate({opacity:0}, {duration:400, complete:function(){
		$(this).animate({height:0}, {duration:300, complete:function(){
			$(this).css({display:"none", opacity:1, height:50});
			var username = $("#userfiltername").text();
			$("#userfiltertext").html("");
			search.setUsername(null);
			search.flush();
		}});
	}});
	
}

function addZutatRow(zutat){
	$("#zutaten_table").append("<tr><td class='zutaten_table_left'>"+zutat+"</td><td class='zutaten_table_right'><div class='remove_zutat'></div></td></tr>");
}
