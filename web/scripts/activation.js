/**
 * @license This file is part of anycook. The new internet cookbook
 * Copyright (C) 2014 Jan Graßegger
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see [http://www.gnu.org/licenses/].
 * 
 * @author Jan Graßegger <jan@anycook.de>
 */

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