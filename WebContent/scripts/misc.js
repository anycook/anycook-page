
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
	var timestring = " um "+discdate.getHours()+":"+discdate.getMinutes();
	var date = discdate.getDate();
	var month = discdate.getMonth()+1;
	var year = discdate.getFullYear();
	var daystring = discdate.getDay();
	if(yeardifference > 0)
		return "am "+date+"."+month+"."+year+timestring;
	if(monthdifference > 0)
		return "am "+date+"."+month+"."+timestring;
	if(daydifference == 0)	
		return "heute"+timestring;
	if(daydifference == 1)
		return "gestern"+timestring;
	if(daydifference < 7)
		return daystring+timestring;
	return "vor "+difference+" Tagen";
}