//parses into HTML from XML-Content

function parseXML(xml, name){
	if(name == "success"){
    var contentName = "home"; 
    var pathArray = $.address.pathNames();
    if(pathArray.length > 0)
        contentName=pathArray[0];
	}
	else
		contentName=name;
	
    $(xml).find("template").each(function(){
        var id = $(this).attr("id");
        if(id == contentName){
            var childs = $(this).children();
            for(var i = 0; i<childs.length; i++){
                var node = document.importNode(childs[i], true);
                getintocontent(node, document.getElementById("content_main"));
            }
        }
    });
}
function getintocontent(knoten, aktmasterknoten)
{
		if(aktmasterknoten != null && knoten != null)
		{
			switch (knoten.nodeType) {
				
			case 1 :
				var neuerknoten = document.createElement(knoten.nodeName);
				for(var i = 0; i<knoten.attributes.length; i++)	getintocontent(knoten.attributes[i], neuerknoten);
				aktmasterknoten.appendChild(neuerknoten);
				break;
			
			case 2 :
				aktmasterknoten.setAttribute(knoten.nodeName, knoten.nodeValue);
				break;
				
			case 3 :
				var Textknoten = document.createTextNode(knoten.nodeValue);
				aktmasterknoten.appendChild(Textknoten);
				break;
			}
			if(knoten.hasChildNodes())
			{
				for(var j=0; j<knoten.childNodes.length; ++j)
				{
					getintocontent(knoten.childNodes[j], aktmasterknoten.lastChild);
				}
			}
		}
}