$(document).ready(function(){
	$.ajaxSetup({
    	type:"POST", 
        scriptCharset: "utf8" , 
        contentType: "application/x-www-form-urlencoded; charset=utf8"
	});
	
	 //Login
    $.ajax({
		url:"/anycook/Login",
		dataType:"json",
		success:checkLogin
	});
	
	$.address.change(changePage);
	
	$("#home_button").click(function(){
		$.address.value("");
		});
	
	
	
});

function changePage(event){
	$(".small_button, .big_button").removeClass("on");
	
	var sitename;
	if(event.pathNames.length == 0)
		sitename = "home";
	else
		sitename = event.pathNames[0];
	
	
	$("#content_main").empty();
	$.ajax({
		url: "/backend/xml/template.xml",
		dataType: "xml",
		async:false,
		success: function(xml){parseXML(xml, sitename);}
	});
	
	if(sitename == "home"){
		$("#home_button").addClass("on");
	}
	if(sitename == "rezepte"){
		$("#rezepte").addClass("on");
		loadRezTable();
	}
	if(sitename == "user"){
		$("#user").addClass("on");
		if(event.parameterNames == 0){
			$.ajax({
				url:"/anycook/GetUsers",
				dataType:"json",
				success:loadUsers
			});
		}else{
			var orderBy = event.parameters["orderBy"];
			var desc = event.parameters["desc"];
			if(orderBy != null && desc != null){
				$.ajax({
					url:"/anycook/GetUsers",
					data: "order="+orderBy+"&desc="+desc,
					dataType:"json",
					success:loadUsers
				});
			}
		}
		
		$("#usertable th").click(orderUserTable);
	}
	
}


