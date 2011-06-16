var settings = Settings.init();

function loadSettings(){
	
	$("#settings_notification h2").click(function(event){
		$("#settings_notification_content").toggle();
		showNotificationSettings();
		});
	
	fillAccountSettings();
	fillNotificationSettings();
}


function showNotificationSettings(){
	$("input").change(saveSettings);
}

function saveSettings(event){
	var target = $(event.target);
	var checked = target.is(":checked") ? true : false;
	var value = target.val();
	settings.emailSettings.setSetting(value, checked);
	$("#settings_saved").fadeIn(1000).delay(5000).fadeOut(1000);
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
	$("#profile_image img").attr("src", user.getLargeImage());
	$("#account_name").val(user.name).attr("size", user.name.length+5);
	$("#account_mail").val(user.mail).attr("size", user.mail.length+5);
	if(user.facebook_id == 0)
		$("#no_facebook").show();
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