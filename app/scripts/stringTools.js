define([
	'jquery'
], function($){
	return {
		getNumbersFromString : function(inputstring, factor) {
			var beginString = "";
			var valueFromString = "";
			var restString = "";

			var postProc = false;
			var i = null;

			for(var n = 0; n < inputstring.length; n++) {
				i = inputstring.substring(n, n + 1);
				if(i.match(/\d/)) {
					valueFromString += i;
					for(var m = n + 1; m < inputstring.length; m++) {
						i = inputstring.substring(m, m + 1);
						if(i.match(/\d/)){
							valueFromString += i;
						}
						else if(i == "," || i == ".") {
							valueFromString += ".";
						} else if(i == "-" || i == "/") {
							valueFromString += i;
							postProc = true;
						} else {
							restString += inputstring.substring(m, inputstring.length);
							break;
						}
					}
					break;
				} else
					beginString += i;
			}
			factor = factor / $("#persons_num").data("persons");
			if(beginString.length == inputstring.length)
				return beginString;
			if(postProc)
				return beginString + this.postProcessString(valueFromString, factor).toString().replace(".", ",") + restString;
			var finalValue = parseFloat(valueFromString) * factor;
			return beginString + this.handleTrailingNumbers(finalValue).toString().replace(".", ",") + restString;

		},
		getValuefromString : function(inputstring) {
			var valueFromString = '';
			var numberRegEx = /\d/;

			for(var n = 0; n < inputstring.length; n++) {
				var i = inputstring.substring(n, n + 1);
				if(numberRegEx.test(i)) {
					valueFromString += i;
					for(var m = n + 1; m < inputstring.length; m++) {
						var i = inputstring.substring(m, m + 1);
						if(numberRegEx.test(i)){
							valueFromString += i;
						}
						else if(i == "," || i == ".") {
							valueFromString += ".";
						} else if(i == "-" || i == "/") {
							valueFromString += i;
						} else {
							break;
						}
					}
					break;
				}
			}
			return Number(valueFromString);
		},
		handleTrailingNumbers : function(string) {
			var count = 0;
			string = string.toString();
			for(var n = 0; n < string.length; n++) {
				var i = string.substring(n, n + 1);
				if(i == ".")
					count = string.substring(n + 1, string.length).length;
			}
			if(count < 2)
				return parseFloat(string);
			return parseFloat(string).toFixed(2);
		},
		postProcessString : function(string, factor) {
			var first = "";
			var delimiter = "";
			var second = "";
			var trail = false;
			for(var n = 0; n < string.length; n++) {
				var i = string.substring(n, n + 1);

				if(i == "-" || i == "/") {
					delimiter = i;
					trail = true;
				} else if(trail)
					second += i;
				else
					first += i;
			}
			if(delimiter == "-") {
				var mean = (parseInt(first) + parseInt(second)) / 2;
				return this.handleTrailingNumbers((mean * factor).toString());
			}
			if(delimiter == "/") {
				var quotient = parseInt(first) / parseInt(second);
				return this.handleTrailingNumbers((quotient * factor).toString());
			}

		}
	};
})