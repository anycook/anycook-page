
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

function getDateString(fromdatetime){
	var datetime = fromdatetime.split(".")[0].split(" ");
	var date = datetime[0].split("-");
	var time = datetime[1].split(":");
	var discdate = new Date(date[0], Number(date[1])-1, date[2], time[0], time[1]);
	var today = new Date();
	var yeardifference = today.getFullYear() -discdate.getFullYear();
	var monthdifference = today.getMonth() - discdate.getMonth();
	var daydifference = today.getDate() - discdate.getDate();
	var hourdifference = today.getHours() - discdate.getHours();
	var minutedifference = today.getMinutes() - discdate.getMinutes();
	var hours = formatNumberLength(discdate.getHours(), 2);
	var minutes = formatNumberLength(discdate.getMinutes(), 2);
	var timestring = " um "+hours+":"+minutes;
	
	var date = discdate.getDate();
	var month = formatNumberLength(discdate.getMonth()+1, 2);
	var year = discdate.getFullYear();
	var daystring = getDayString(discdate.getDay());
	if(yeardifference > 0)
		return "am "+date+"."+month+"."+year+timestring;
	if(monthdifference > 0)
		return "am "+date+"."+month+"."+timestring;
	if(daydifference == 0){
		if(hourdifference == 0)
			return "vor "+minutedifference+" Minuten";
		return "heute"+timestring;
	}	
		
	if(daydifference == 1)
		return "gestern"+timestring;
	if(daydifference < 7)
		return "am "+daystring+timestring;
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