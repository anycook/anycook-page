function loadResetPasswordStep1(){
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
				var errortext;
				if(response == "true"){
					
				}else{
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
	$("#resetpwstep1").hide();
}