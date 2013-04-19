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