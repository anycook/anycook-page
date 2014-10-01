/**
 * @license This file is part of anycook. The new internet cookbook
 * Copyright (C) 2014 Jan Graßegger
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see [http://www.gnu.org/licenses/].
 *
 * @author Jan Graßegger <jan@anycook.de>
 */
define([
	'jquery'
], function($){
	'use strict';
	return {
		getNumbersFromString : function(inputstring, factor) {
			var beginString = '';
			var valueFromString = '';
			var restString = '';

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
						else if(i === ',' || i === '.') {
							valueFromString += '.';
						} else if(i === '-' || i === '/') {
							valueFromString += i;
							postProc = true;
						} else {
							restString += inputstring.substring(m, inputstring.length);
							break;
						}
					}
					break;
				} else {
					beginString += i;
				}
			}
			factor = factor / $('#persons_num').data('persons');
			if(beginString.length === inputstring.length){
				return beginString;
			}
			if(postProc){
				return beginString + this.postProcessString(valueFromString, factor).toString().replace('.', ',') + restString;
			}
			var finalValue = parseFloat(valueFromString) * factor;
			return beginString + this.handleTrailingNumbers(finalValue).toString().replace('.', ',') + restString;

		},
		getValuefromString : function(inputstring) {
			var valueFromString = '';
			var numberRegEx = /\d/;

			for(var n = 0; n < inputstring.length; n++) {
				var i = inputstring.substring(n, n + 1);
				if(numberRegEx.test(i)) {
					valueFromString += i;
					for(var m = n + 1; m < inputstring.length; m++) {
						i = inputstring.substring(m, m + 1);
						if(numberRegEx.test(i)){
							valueFromString += i;
						}
						else if(i === ',' || i === '.') {
							valueFromString += '.';
						} else if(i === '-' || i === '/') {
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
				if(i === '.') {
					count = string.substring(n + 1, string.length).length;
				}
			}
			if(count < 2){
				return parseFloat(string);
			}
			return parseFloat(string).toFixed(2);
		},
		postProcessString : function(string, factor) {
			var first = '';
			var delimiter = '';
			var second = '';
			var trail = false;
			for(var n = 0; n < string.length; n++) {
				var i = string.substring(n, n + 1);

				if(i === '-' || i === '/') {
					delimiter = i;
					trail = true;
				} else if(trail){
					second += i;
				}
				else {
					first += i;
				}
			}
			if(delimiter === '-') {
				var mean = (parseInt(first) + parseInt(second)) / 2;
				return this.handleTrailingNumbers((mean * factor).toString());
			}
			if(delimiter === '/') {
				var quotient = parseInt(first) / parseInt(second);
				return this.handleTrailingNumbers((quotient * factor).toString());
			}
		},
        mergeAmount : function(menge1, menge2){
            //TODO falls z.B. kg und g zusammen auftreten etc...

            if(menge2.length === 0){
                return menge1;
            }
            var newMenge;
            menge1 = menge1.replace(/,/, '.');
            menge2 = menge2.replace(/,/, '.');
            var confirmRegex1 = /(\d+\/\d+|\d+|\d+\.\d+) ([a-zäüöß]+)/i;
            var confirmRegex2 = /(\d+\/\d+)|(\d+)|(\d+\.\d+)/i;
            if(menge1.match(confirmRegex1) && menge2.match(confirmRegex1)){
                var menge1EinheitPos = menge1.search(/[a-z]+/i);
                var menge2EinheitPos = menge2.search(/[a-z]+/i);
                var menge1Einheit = menge1.substring(menge1EinheitPos);
                var menge2Einheit = menge2.substring(menge2EinheitPos);

                if(menge1Einheit === menge2Einheit){
                    var newAmount = this.sumNumbers(menge1.substring(0, menge1EinheitPos-1), menge2.substring(0, menge1EinheitPos-1));

                    newMenge = newAmount + ' ' + menge1Einheit;
                }

            }else if(menge1.match(confirmRegex2) && menge2.match(confirmRegex2)){
                newMenge = this.sumNumbers(menge1, menge2);
            }
            if(newMenge === undefined){
                newMenge = menge1+' + '+menge2;
            }

            if(typeof newMenge === 'string') {
                newMenge = newMenge.replace('.', ',');
            }

            return newMenge;
        },
        //based on java implementation
        sumNumbers : function(number1, number2) {
            if(number1.indexOf('/') !== -1 && number2.indexOf('/') !== -1) {
                return this.sumFractions(number1, number2);
            } else if (number1.indexOf('/') !== -1) {
                return this.sumFractionAndDecimal(number1, number2);
            } else if (number2.indexOf('/') !== -1) {
                return this.sumFractionAndDecimal(number2, number1);
            }
            return this.sumDecimals(number1, number2);
        },
        sumFractions : function(fraction1, fraction2) {
            var split1 = fraction1.split('/');
            var split2 = fraction2.split('/');

            var numerator1 = Number(split1[0]);
            var denominator1 = Number(split1[1]);

            var numerator2 = Number(split2[0]);
            var denominator2 = Number(split2[1]);

            return this.getFractionString(numerator1 * denominator2 + numerator2 * denominator1, denominator1 * denominator2);
        },
        sumFractionAndDecimal : function(fraction, decimalString) {
            var split = fraction.split('/');
            var fractionDecimal = Number(split[0]) / Number(split[1]);
            return this.sumDecimals(fractionDecimal, decimalString);
        },
        sumDecimals : function(decimalString1, decimalString2) {
            var decimal1 = Number(decimalString1);
            var decimal2 = Number(decimalString2);
            return this.formatNumber(decimal1 + decimal2);
        },
        getFractionString : function(numerator, denominator) {
            var gcd = this.euclideanGCD(numerator, denominator);
            numerator /= gcd;
            denominator /= gcd;

            if (denominator === 1) { return numerator; }
            return numerator + '/' + denominator;
        },
        euclideanGCD : function(a, b) {
            if (a === 0) { return b; }

            while (b !== 0) {
                if (a > b) {
                    a -= b;
                } else {
                    b -= a;
                }
            }
            return a;
        },
        formatNumber : function(number) {
            if(number % 1 === 0) { return number; }
            if(number * 10 % 1 === 0) { return number.toFixed(1); }
            return number.toFixed(2);
        },
        formatAmount : function(event){
            var $target = $(event.target);
            var text = $target.val();
            if(text.length === 0){
                return;
            }
            var textArr = $target.val().split('');
            var newText = textArr[0];
            for(var i = 0; i<textArr.length -1; i++){
                if(textArr[i].match(/\d/) && textArr[i+1].match(/[a-z]/i)){
                    newText += ' ';
                }
                if(textArr[i+1].match(/\./)){
                    newText +=',';
                }
                else{
                    newText += textArr[i+1];
                }
            }
            $target.val(newText);
        }
	};
});
