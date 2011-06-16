//class Settings
function Settings(){
	this.emailSettings = null;
}

Settings.init = function(){
	var settings = new Settings();
	settings.emailSettings = EMailSettings.init();
	
	return settings;
	
};

function EMailSettings(){
	this.RECIPEACTIVATION = null;
	this.TAGACTIVATION = null;
	this.RECIPEDISCUSSION = null;
	this.DISCUSSIONANWSER = null;
	this.SCHMECKT = null;
	this.NEWSLETTER = null;
}

EMailSettings.init = function(){
	var emailsettings = new EMailSettings();
	$.ajax({
		url: "/anycook/GetMailSettings",
		async: false,
		dataType: "json",
		type: "POST",
		success: function(response){
			if(response != false){
				emailsettings.RECIPEACTIVATION = response.RECIPEACTIVATION;
				emailsettings.TAGACTIVATION = response.TAGACTIVATION;
				emailsettings.RECIPEDISCUSSION = response.RECIPEDISCUSSION;
				emailsettings.DISCUSSIONANWSER = response.DISCUSSIONANWSER;
				emailsettings.SCHMECKT = response.SCHMECKT;
				emailsettings.NEWSLETTER = response.NEWSLETTER;
				
			}
		}
	});
	return emailsettings;
};

EMailSettings.prototype.setSetting = function(member, value){
	this[member] = value;
	$.ajax({
		url: "/anycook/ChangeMailSettings",
		data:"type="+member+"&property="+value
	});
};