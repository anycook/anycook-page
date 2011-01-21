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
	
	$("#rezepte").click(function(){
		$.address.value("rezepte");
		});
	
	$("#user").click(function(){
		$.address.value("user");
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
		$.ajax({
			url:"/anycook/GetUsers",
			dataType:"json",
			success:loadUsers
		});
	}
	
}


