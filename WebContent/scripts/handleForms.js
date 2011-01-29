function loadContact(){
	loadCaptcha();
	$("#SendButton").click(sendForm);
	$("#contactform").submit(sendForm);
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
function sendForm(){
	var responseField = $("#recaptcha_response_field").val();
	var challengeField = $("#recaptcha_challenge_field").val();
	var message = $("#message").val();
	var subject = $("#betreff").val();
	var email = $("#email").val();
	var name = $("#name").val();
	
	$.ajax({
		url:"/anycook/SendForm",
		data:"challenge="+challenge+"&response="+response+"&name="+name+"&email="+email+"&message="+message,
		success:function(response){
			if(response=="true"){
				alert("message send!");
			}
			else{
				alert("message not send!");
			}
	}
	});
	
	return false;
}
