function activateUser(id){
	$.anycook.registration.activate(id, addActivationStuff);
}

function addActivationStuff(response){
	if(response!="false"){
		$("#new_activation h5").text("Account aktiviert!");
		$("#new_activation p").text("Du kannst dich nun einloggen");
	}else{
		$("#new_activation h5").text("Aktivierung fehlgeschlagen!");
		$("#new_activation p").text("Versuch es doch noch einmal");
	}
	window.setTimeout(fadeActivationOut, 3000);
	$("#content").click(fadeActivationOut);
	
}
function fadeActivationOut(){
	$("#content").unbind("click", fadeActivationOut);
	$("#new_activation").animate({opacity:0.2},{duration:300, complete:function(){$.address.value("");}});
}