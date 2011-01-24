function loadUsers(json){
	var usercounter = 0;
	var facebookcounter = 0;
	var inactivecounter = 0;
	
	for(var i in json){
		
		usercounter++;
		
		if(json[i].facebook_id != 0) facebookcounter++;
		var lastlogin;
		if(json[i].lastlogin == null){
			lastlogin = "noch nie";
			inactivecounter++;
		}
		else{
			var split = json[i].lastlogin.split(" ");
			lastlogin = split[1].split(".")[0]+" ";
			lastlogin+=parseDate(split[0]);
		}
		var createdate = parseDate(json[i].createdate);
		
		var versions = json[i].versions;
		if(versions == null)
			versions = 0;
		$("#usertable").append("<tr><td><input type=\"checkbox\" value=\""+json[i].mail+"\"/></td><td>"+json[i].name+"</td><td>"+json[i].mail+"</td><td>"+
				createdate+"</td><td>"+lastlogin+"</td><td>"+json[i].facebook_id+"</td><td>"+json[i].level+"</td><td>"+versions+"</td></tr>");
	}
	$("#user_info table").append("<tr><td>User gesamt:</td><td>"+usercounter+"</td></tr>");
	$("#user_info table").append("<tr><td>Facebookuser:</td><td>"+facebookcounter+"</td></tr>");
	$("#user_info table").append("<tr><td>Inaktive User:</td><td>"+inactivecounter+"</td></tr>");
	
	$("#usertable td input").click(checkBoxClick);
	$("#user_info ul").empty();
	
	
}



function orderUserTable(event){
	
	var target = $(event.target);
	if(target.children().length == 0 && !target.is("input")){
		$("#usertable th+th").removeClass("on");
		target.addClass("on");
		
		var oldOrder = $.address.parameter("orderBy");
		var oldDesc = $.address.parameter("desc");
		var order;
		var desc = 0;
		switch(target.text()){
		case "Username":
			order = "nickname";
			break;
		case "Mail":
			order = "email";
			break;
		case "Registrierung":
			order = "createdate";
			break;
		case "last login":
			order = "lastlogin";
			break;
		case "facebook id":
			order = "facebook_id";
			break;
		case "Rezepte":
			order = "versions";
			break;
		case "Userlevel":
			order = "fullname";
			break;
		}
		if(oldOrder==undefined && order == "nickname")
			desc=1;
		
		if(order==oldOrder && oldDesc == "0") desc = 1;
		
		$.address.value("user?orderBy="+order+"&desc="+desc);
	
	}else{
		$("#confirm ul").empty();
		var checked = $($("#usertable input")[0]).attr("checked");
		if(checked == false){
			$("#usertable input").removeAttr("checked");			
		}
		else{
			$("#usertable input").attr("checked", "checked");
			var tds = $("#usertable td input");
			for(var i = 0; i<tds.length; i++){
				$("#confirm ul").append("<li>"+$(tds[i]).val()+"</li>");
			}
		}
		
	}
	
}

function checkBoxClick(event){
	var target = $(event.target);
	if(target.attr("checked") == false && $($("#usertable input")[0]).attr("checked") == true){
		$($("#usertable input")[0]).removeAttr("checked");		
	}
	if(target.attr("checked") == false){
		var lis = $("#confirm li");
		for(var i = 0; i<lis.length; i++){
			if($(lis[i]).text() == target.val()) $(lis[i]).remove();
		}
	}else{
		$("#confirm ul").append("<li>"+target.val()+"</li>");
	}
		
		
}

function selectedUserAction(event){
	var option = $("#user_info select option:selected").val();
	var checked = $("#usertable input:checked");
	
	if(option == "in Ruhe lassen"){
		$("#user_info select option:selected").removeAttr("selected");
		$("#user_info select option:first").attr("selected", "selected");
		if($("#confirm").css("display")!="none"){
			var confirmheight = $("#confirm").css("height");
			confirmheight = Number(confirmheight.substring(0, confirmheight.length-2))+30;
			$("#confirm").fadeOut(500, function(){
				$("#user_info h3").css("marginTop", confirmheight+30);
				$("#user_info h3").animate({"marginTop": 30},{duration:500});
			});
		}
		return false;
	}
	
	if($("#confirm").css("display")=="none"){
		var confirmheight = $("#confirm").css("height");
		confirmheight = Number(confirmheight.substring(0, confirmheight.length-2))+30+30;
		$("#user_info h3").animate({"marginTop": confirmheight},{duration:500, complete:function(){
			$("#user_info h3").css("marginTop", 30);
			$("#confirm").fadeIn(500);
		}});
	}
	
	
}

function confirmedClick(event){
	var target = $(event.target);
	if(target.attr("id") == "confirm_yes"){
		var option = $("#user_info select option:selected").val();
		var mails = $("#confirm_text li");
		for(var i = 0; i<mails.length; i++){
			var val = $(mails[i]).text();
			$.ajax({
				url:"/anycook/EditUsers",
				data:"todo="+option+"&mail="+val
			});			
		}
		$("#usertable tr").not("#usertable tr:first").remove();
		$("#user_info table").empty();
		
		if($.address.parameterNames.length > 0)
			$.address.value("user");
		else{
			$.ajax({
				url:"/anycook/GetUsers",
				dataType:"json",
				success:loadUsers
			});
		}
	}
	var confirmheight = $("#confirm").css("height");
	confirmheight = Number(confirmheight.substring(0, confirmheight.length-2))+30;
	$("#confirm").fadeOut(500, function(){
		$("#user_info h3").css("marginTop", confirmheight+30);
		$("#user_info h3").animate({"marginTop": 30},{duration:500});
	});
	
	$("#user_info select option:selected").removeAttr("selected");
	$("#user_info select option:first").attr("selected", "selected");
}