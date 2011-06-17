var settings = Settings.init();

function loadSettings(){
	
	fillAccountSettings();
	fillNotificationSettings();
	$("#settings_notification input").change(saveSettings);
	
	$(".settings h2").click(showSettings);
	$("#account_form").submit(saveAccountSettings);
}

function showSettings(event){
	var $this = $(this);	
	var $content = $this.next();
	var height = $content.css("height");
	var marginBottom = $content.css("marginBottom");
	
	if($content.css("display")=="none"){		
		$content.css({height: 0, marginBottom: 0});
		$content.show();
		$content.animate({height : height, marginBottom : marginBottom}, 1000);
	}else{
		$content.animate({height: 0, marginBottom: 0}, {duration: 1000, complete: function(){
			$content.hide().css({height : height, marginBottom : marginBottom});
			
		}
		});
	}
}


function showNotificationSettings(){
	$("input").change(saveSettings);
}

function saveSettings(event){
	var target = $(event.target);
	var checked = target.is(":checked") ? true : false;
	var value = target.val();
	settings.emailSettings.setSetting(value, checked);
	showSaveNotification($("#settings_notification"));
	//$("#settings_saved").fadeIn(1000).delay(5000).fadeOut(1000);
}

function fillNotificationSettings(){
	$('input[name=notification_activation]').attr('checked', settings.emailSettings.RECIPEACTIVATION);
	$('input[name=notification_tag]').attr('checked', settings.emailSettings.TAGACTIVATION);
	$('input[name=notification_discussion]').attr('checked', settings.emailSettings.RECIPEDISCUSSION);
	$('input[name=notification_reply]').attr('checked', settings.emailSettings.DISCUSSIONANWSER);
	$('input[name=notification_schmeckt]').attr('checked', settings.emailSettings.SCHMECKT);
	$('input[name=notification_newsletter]').attr('checked', settings.emailSettings.NEWSLETTER);
	
}

function fillAccountSettings(){
	$("#account_image img").attr("src", user.getLargeImage());
	$("#account_name").val(user.name);
	$("#account_mail").val(user.mail);
	$("#account_aboutme").val(user.text);
	if(user.facebook_id == 0)
		$("#no_facebook").show();
 }

function saveAccountSettings(event){
	var username = $("#account_name").val();
	var mail = $("#account_mail").val();
	var text = $("#account_aboutme").val();
	
	var newData = "";
	
	if(username != user.name){
		newData+="username="+username;
		user.name = username;
	}
	if(mail!=user.mail){
		newData+="&mail="+mail;
		user.mail = mail;
	}
	if(text!=user.text){
		newData+="&text="+text;
		user.text = text;
	}
	
	$.ajax({
		url: "/anycook/ChangeAccountSettings",
		data: newData
	});
	
	
	showSaveNotification($("#settings_account"));
	return false;
}

function showSaveNotification($container){
	var $span = $container.find(".settings_saved").first();
	var containerid = $container.attr("id");
	if($span.css("display") != "none"){
		var data = $span.data("timeout");
		clearTimeout(data.timeout);
	}else{
		$span.fadeIn(1000);		
	}
	$span.data("timeout", {
		timeout : setTimeout("hideSaveNotification(\"#"+containerid+"\")", 5000)
	});
}

function hideSaveNotification(containerid){
	$(containerid).find(".settings_saved").fadeOut(1000);
}

/*function settingsOpen(event){
	var newheight;
	var p = $(this).siblings("p").first();
	if($(this).text() == "mehr anzeigen"){
		var numelements = p.children().length;	
		
		var rest = numelements % 5;
		newheight = ((numelements-rest)/5)*120;
		if(rest>0) newheight+=120;
		
		$(this).text("weniger anzeigen");
		$(this).animate({height:0, opacity:0},{duration:1000, complete:function(){
			$(this).remove();
			}});
	}else{
		newheight = 240;
		$(this).text("mehr anzeigen");
	}
	
	p.animate({height:newheight}, 1000);
}

RECIPEACTIVATION, RECIPEDISCUSSION, TAGACTIVATION, NEWSLETTER, DISCUSSIONANWSER, SCHMECKT;
*/