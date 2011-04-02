
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
	var discdate = new Date(fromdatetime);
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
	var daystring = formatNumberLength(discdate.getDay(), 2);
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
		return daystring+timestring;
	return "vor "+difference+" Tagen";
}

function formatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}