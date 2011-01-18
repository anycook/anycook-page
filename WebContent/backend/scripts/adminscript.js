$(document).ready(function(){
	$.ajaxSetup({
    	type:"POST", 
        scriptCharset: "utf8" , 
        contentType: "application/x-www-form-urlencoded; charset=utf8"
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
	if(event.pathNames.length == 0){
		$("#home_button").addClass("on");
		$("#content_main").empty();
		$.ajax({
			url: "/zombiecooking/backend/xml/template.xml",
			dataType: "xml",
			async:false,
			success: function(xml){parseXML(xml, "home");}
		});
	}
	if(event.pathNames[0] == "rezepte"){
		$("#rezepte").addClass("on");
		$("#content_main").empty();
		$.ajax({
			url: "/zombiecooking/backend/xml/template.xml",
			dataType: "xml",
			async:false,
			success: function(xml){parseXML(xml, "rezepte");}
		});
		loadRezTable();
	}
	if(event.pathNames[0] == "user"){
		$("#user").addClass("on");
		$("#content_main").empty();
	}
}


