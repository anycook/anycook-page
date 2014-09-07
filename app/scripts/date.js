define([], function(){
	'use strict';
	return {
		getDateTimeString : function(fromdatetime, prefix){
			if(prefix === undefined) { prefix = true; }
			// var datetime = fromdatetime.split('.')[0].split(' ');

			var today = new Date();
			var discdate = new Date(fromdatetime);


			var yeardifference = today.getFullYear() -discdate.getFullYear();
			var monthdifference = today.getMonth() - discdate.getMonth();
			var daydifference = today.getDate() - discdate.getDate();
			var hourdifference = today.getHours() - discdate.getHours();
			var minutedifference = today.getMinutes() - discdate.getMinutes();
			var hours = this.formatNumberLength(discdate.getHours(), 2);
			var minutes = this.formatNumberLength(discdate.getMinutes(), 2);
			var timestring = ' '+hours+':'+minutes+' Uhr';
			if(prefix) { timestring = ' um'+timestring; }


			var date = discdate.getDate();
			var month = this.formatNumberLength(discdate.getMonth()+1, 2);
			var year = discdate.getFullYear();
			var daystring = this.getDayString(discdate.getDay());
			if(yeardifference > 0){

				return (prefix?'am ':'')+date+'.'+month+'.'+year;
			}

			if(monthdifference > 0) { return (prefix?'am ':'')+date+'.'+month+'.'; }
			if(daydifference === 0){
				if(hourdifference === 0){
					if(minutedifference<5) { return 'vor kurzem'; }
					return 'vor '+minutedifference+' Minuten';
				}
				if(hourdifference === 1) { return 'vor einer Stunde'; }
				return 'vor '+hourdifference+' Stunden';
			}

			if(daydifference === 1) { return 'gestern'+timestring; }
			if(daydifference < 7) { return (prefix?'am ':'')+daystring; }
			return 'vor '+daydifference+' Tagen';

			// return getDateString(fromdatetime, prefix);

		},
		getDateString : function(fromdatetime, prefix){
            if (typeof fromdatetime === 'string') { fromdatetime = fromdatetime.replace(' ', 'T'); }
			var discdate = new Date(fromdatetime);
			var today = new Date();
			var yeardifference = today.getFullYear() - discdate.getFullYear();
			var monthdifference = today.getMonth() - discdate.getMonth();
			var daydifference = today.getDate() - discdate.getDate();

			var date = discdate.getDate();
			var month = this.formatNumberLength(discdate.getMonth()+1, 2);
			var year = discdate.getFullYear();
			var daystring = this.getDayString(discdate.getDay());
			if(yeardifference > 0) { return (prefix?'am ':'')+date+'.'+month+'.'+year; }
			if(monthdifference > 0) { return (prefix?'am ':'')+date+'.'+month+'.'; }
			if(daydifference === 0){ return 'heute'; }
			if(daydifference === 1) { return 'gestern'; }
			if(daydifference < 7) { return 'am '+daystring; }
			return 'vor '+daydifference+' Tagen';
		},
		formatNumberLength : function(num, length) {
		    var r = '' + num;
		    while (r.length < length) {
		        r = '0' + r;
		    }
		    return r;
		},
		getDayString : function(daynumber){
			switch(daynumber){
			case 0:
				return 'Sonntag';
			case 1:
				return 'Montag';
			case 2:
				return 'Dienstag';
			case 3:
				return 'Mittwoch';
			case 4:
				return 'Donnerstag';
			case 5:
				return 'Freitag';
			case 6:
				return 'Samstag';
			}
		}
	};
});
