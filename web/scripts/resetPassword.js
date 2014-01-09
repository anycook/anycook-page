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

function loadResetPasswordStep1(){
	$.address.title("Passwort zurücksetzen | anycook");
	$("#resetpwstep2").hide();
	
	$("#resetpwform1").submit(submitResetForm1);
		
}

function submitResetForm1(){
	var errorfield = $("#resetpwmail").parent("td").siblings(".error");
	errorfield.text("");
	
	var mailorname = $("#resetpwmail").val();
	if(mailorname == "" || mailorname == " "){
		//fehler
	}else{
		$.ajax({
			url: "/anycook/ResetPassword",
			data:"mail="+mailorname,
			success: function(response){
				if(response == "true"){
					$("#content_main>*").fadeOut(500, function(){
						$("#content_main").append("<div id=\"new_activation\" class=\"content_message\">" +
								"<h5>Email verschickt</h5>"+
								"<p>Wir haben dir eine Mail mit geschickt. Folge dem dort enthaltenen Link, um dein Passwort zurückzusetzen.");
						window.setTimeout(fadeActivationOut, 3000);
						$("#content").click(fadeActivationOut);
					});
					
				}else{
					var errortext = null;
					if(response=="wrong")
						errortext = "Falscher Username/Mail";
					else if(response == "fbuser")
						errortext = "Passwort eines FB-Users kann nicht geändert werden";							
					errorfield.text(errortext);
				}
				
			}
		});
	}
	return false;
}
function loadResetPasswordStep2(){
	$.address.title("Passwort zurücksetzen | anycook");	
	$("#resetpwstep1").hide();
	$("#resetpwform2").submit(submitResetForm2);
	
	var id = $.address.pathNames()[1];
	$.ajax({
		url: "/anycook/ResetPassword",
		data:"resetpwid="+id,
		success:function(response){
			if(response=="false"){
				$.address.value("/resetpassword");
			}
		}
	});
	
	
	
	
	
}

function submitResetForm2(){
	var errorfield = $("#resetpw1").parent("td").siblings(".error");
	errorfield.text("");
	var pw1 = $("#resetpw1").val();
	var pw2 = $("#resetpw2").val();
	
	
	if(pw1.length<5){
		errorfield.text("Passwort zu kurz! Min. 5 Stellen.");
		return false;
	}
	if(pw1!=pw2){
		errorfield.text("Passwörter nicht gleich!");
	}
	
	var id = $.address.pathNames()[1];
	$.ajax({
		url: "/anycook/ResetPassword",
		data:"resetpwid="+id+"&newpw="+pw1,
		success:function(response){
			if(response == "true"){
				$("#content_main>*").fadeOut(500, function(){
					$("#content_main").append("<div id=\"new_activation\" class=\"content_message\">" +
							"<h5>Passwort wurde geändert</h5>"+
							"<p>Dein Passwort wurde geändert. Weiterhin viel Spass!");
					window.setTimeout(fadeActivationOut, 3000);
					$("#content").click(fadeActivationOut);
				});
				
			}else{
				errorfield.text("Fehler! Bitte versuche es nocheinmal");
			}
		}
	});
	return false;
}