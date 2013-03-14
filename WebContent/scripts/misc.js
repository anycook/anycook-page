
function UnCryptMailto( s )
    {
        var n = 0;
        var r = "";
        for( var i = 0; i < s.length; i++)
        {
            n = s.charCodeAt( i );
            if( n >= 8364 )
            {
                n = 128;
            }
            r += String.fromCharCode( n - 1 );
        }
        return r;
    }

function linkTo_UnCryptMailto( s )
{
    location.href=UnCryptMailto( s );
}

function getDateTimeString(fromdatetime, prefix){
	if(prefix === undefined)
		prefix = true;
	// var datetime = fromdatetime.split(".")[0].split(" ");
	
	var today = new Date();
	var discdate = new Date(fromdatetime);
	
	
	var yeardifference = today.getFullYear() -discdate.getFullYear();
	var monthdifference = today.getMonth() - discdate.getMonth();
	var daydifference = today.getDate() - discdate.getDate();
	var hourdifference = today.getHours() - discdate.getHours();
	var minutedifference = today.getMinutes() - discdate.getMinutes();
	var hours = formatNumberLength(discdate.getHours(), 2);
	var minutes = formatNumberLength(discdate.getMinutes(), 2);
	var timestring = " "+hours+":"+minutes+" Uhr";
	if(prefix)
		timestring = " um"+timestring;

	
	var date = discdate.getDate();
	var month = formatNumberLength(discdate.getMonth()+1, 2);
	var year = discdate.getFullYear();
	var daystring = getDayString(discdate.getDay());
	if(yeardifference > 0){
		
		return (prefix?"am ":"")+date+"."+month+"."+year;
	}
		
	if(monthdifference > 0)
		return (prefix?"am ":"")+date+"."+month+".";
	if(daydifference == 0){
		if(hourdifference == 0){
			if(minutedifference<5)
				return "vor kurzem";
			return "vor "+minutedifference+" Minuten";
		}
		if(hourdifference == 1)
			return "vor einer Stunde";
		return "vor "+hourdifference+" Stunden";
	}	
		
	if(daydifference == 1)
		return "gestern"+timestring;
	if(daydifference < 7)
		return (prefix?"am ":"")+daystring;
	return "vor "+daydifference+" Tagen";
	
	// return getDateString(fromdatetime, prefix);
	
}

function getDateString(fromdatetime, prefix){
	var discdate = new Date(fromdatetime);
	var today = new Date();
	var yeardifference = today.getFullYear() -discdate.getFullYear();
	var monthdifference = today.getMonth() - discdate.getMonth();
	var daydifference = today.getDate() - discdate.getDate();
	
	var date = discdate.getDate();
	var month = formatNumberLength(discdate.getMonth()+1, 2);
	var year = discdate.getFullYear();
	var daystring = getDayString(discdate.getDay());
	if(yeardifference > 0)
		return (prefix?"am ":"")+date+"."+month+"."+year;
	if(monthdifference > 0)
		return (prefix?"am ":"")+date+"."+month+".";
	if(daydifference == 0){
		return "heute"
	}	
		
	if(daydifference == 1)
		return "gestern";
	if(daydifference < 7)
		return "am "+daystring;
	return "vor "+daydifference+" Tagen";
}

function formatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}

function getDayString(daynumber){
	switch(daynumber){
	case 0:
		return "Sonntag";
	case 1:
		return "Montag";
	case 2:
		return "Dienstag";
	case 3:
		return "Mittwoch";
	case 4:
		return "Donnerstag";
	case 5:
		return "Freitag";
	case 6:
		return "Samstag";
	}
}

function updateWidth(){
	var minWidth = 1024;
	var bodyWidth = $("body").width();
	var width = Math.max(minWidth, bodyWidth);
	var $headerRight = $("#container_head_right");
	var left = $headerRight.offset().left;
	$headerRight.width(width-left);
	var $right  = $("#right");
	left = $right.offset().left;
	$right.width(width-left);
}

function onReady(callback) {
	if(document.readyState === "complete"){
		callback();
		return;
	}

	$(window).load(callback);
}
