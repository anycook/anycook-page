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
	
	//scrollListener
	$(document).scroll(infoScrollListener);
	
});

function changePage(event){
	$(".small_button, .big_button").removeClass("on");
	
	var sitename;
	if(event.pathNames.length == 0)
		sitename = "home";
	else
		sitename = event.pathNames[0];
	
	if(sitename != lastPage){
		$("#content_main").empty();
		$.ajax({
			url: "/backend/xml/template.xml",
			dataType: "xml",
			async:false,
			success: function(xml){parseXML(xml, sitename);}
		});
	}
	
	if(sitename == "home"){
		$("#home_button").addClass("on");
		loadHome();
	}
	else if(sitename == "rezepte"){
		$("#rezepte").addClass("on");
		loadRezTable();
	}
	else if(sitename == "user"){
		if(sitename != lastPage){
			$("#usertable th").click(orderUserTable);
			$(".confirm_buttons").click(confirmedClick);
			$("#info select").change(selectedUserAction);
		}
		$("#user").addClass("on");
		$("#usertable tr").not("#usertable tr:first").remove();
		$("#info table").empty();
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
		
		
	}else if(sitename == "zutaten"){
		$("#zutaten").addClass("on");
		$.ajax({
			url:"/anycook/GetZutaten",
			dataType:"json",
			success:loadZutaten
		});
	}
	else if(sitename == "tags"){
		$("#tags").addClass("on");
		$.ajax({
			url:"/anycook/GetTags",
			dataType:"json",
			success:loadTags
		});
	}
	
	lastPage = sitename;
}

function parseDate(toParse){
	toParse = toParse.split("-");
	return toParse[2]+"."+toParse[1]+"."+toParse[0];	
}

function infoScrollListener(){
	var scrollTop = $(document).scrollTop();
	if(scrollTop > 50 ){
		if($("#info").css("position") == "relative"){
			var left =$("#info").offset().left;
			$("#info").css("left", left);
			$("#info").css("top", 0);
			$("#info").css("position", "fixed");
		}
	}else{
		if($("#info").css("position") == "fixed"){
			$("#info").css("left", "0");
			$("#info").css("top", "0");
			$("#info").css("position", "relative");
		}
	}
}

function getDateString(fromdatetime){	
	var discdate = new Date(fromdatetime);
	var today = new Date();
	var yeardifference = today.getFullYear() -discdate.getFullYear();
	var monthdifference = today.getMonth() - discdate.getMonth();
	var daydifference = today.getDate() - discdate.getDate();
	var timestring = " um "+discdate.getHours()+":"+discdate.getMinutes();
	var date = discdate.getDate();
	var month = discdate.getMonth()+1;
	var year = discdate.getFullYear();
	var daystring = discdate.getDay();
	if(yeardifference > 0)
		return "am "+date+"."+month+"."+year+timestring;
	if(monthdifference > 0)
		return "am "+date+"."+month+"."+timestring;
	if(daydifference == 0)	
		return "heute"+timestring;
	if(daydifference == 1)
		return "gestern"+timestring;
	if(daydifference < 7)
		return daystring+timestring;
	return "vor "+difference+" Tagen";
}

function getTime(timestring){
	var split = timestring.split(".");
	var time = "um "+split[0];
	return time;
}

var lastPage;
