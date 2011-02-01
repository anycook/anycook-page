function loadContact(){
	if(logindata == null&&!loginChecker()){
		loadCaptcha();
		$("#conname_login").hide();
		$("#conemail_login").hide();
	}
	else{
		$("#conname").hide();
		$("#conemail").hide();
		$("#conname_login").show();
		$("#conemail_login").show();
		fillLoginFields();
	}
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

function fillLoginFields(){
	var nameString = "<div id='formUserPicture'><img src='"+logindata.image+"'></div>" +
			"<div id='absInfo'>"+
			"<div id='formUserName'>"+logindata.nickname+"</div>" +
			"<div id='formUserEmail'>"+logindata.email+"</div>"+
					"</div><div id='formDeleteBtn'></div>"; 
	$("#conname_login").html(nameString);
	$("#conname").val(logindata.nickname);
	$("#conemail").val(logindata.email);
}

function sendForm(){
	var response = $("#recaptcha_response_field").val();
	var challenge = $("#recaptcha_challenge_field").val();
	var message = $("#conmessage").val();
	var subject = $("#conbetreff").val();
	var email = $("#conemail").val();
	var name = $("#conname").val();
	
	$.ajax({
		url:"/anycook/SendForm",
		data:"challenge="+challenge+"&response="+response+"&name="+name+"&email="+email+"&message="+message+"&subject="+subject,
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
