/**
 * @author Jan Grassegger
 */

function loadNewRecipe(){
	$(".toggle_headline").click(function(){
		$(this).next(".toggle").toggle();
	});
	
	$(".toggle").first().toggle();
}
