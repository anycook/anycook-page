function loadContact(){
	loadCaptcha();
	$("#SendButton").click(function(){
		var responseField = $("#recaptcha_response_field").val();
		var challengeField = $("#recaptcha_challenge_field").val();
		sendForm(responseField, challengeField);
	});
}


function loadCaptcha(){
	Recaptcha.create("6Ldg7sASAAAAAOz6GnBiyL-LowhB_6PXF4pPQTb8",
		    "recaptcha_div",
		    {
		      theme: "clean",
		      callback: Recaptcha.focus_response_field
		    }
		  );
}
function sendForm(response, challenge){
	var name = "bla";
	var email = "bla";
	var message = "blabla";
	$.ajax({
		url:"/anycook/SendForm",
		data:"challenge="+challenge+"&response="+response+"&name="+name+"&email="+email+"&message="+message,
		success:function(response){
			if(response=="true"){
				alert("sucess!");
			}
			else{
				alert("error!");
			}
	}
	});
}
