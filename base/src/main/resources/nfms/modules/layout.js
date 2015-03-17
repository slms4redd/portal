define([ "jquery" ], function($) {

	var body 			= $( "body" );
	
	var divContainer	= $( '<div class="container-fluid no-padding height100"></div>' );
	body.append( divContainer );

	var divHeader 		= $( '<div class="row header no-margin" ></div>' );
	divContainer.append( divHeader );
	//	var divCenter = $("<div/>").attr("id", "center");
//	body.append(divCenter);
	var divMap 			= $("<div/>").attr("id", "map");
	divContainer.append( divMap );
//	divCenter.append(divMap);

	// disable text selection on Explorer (done with CSS in other browsers)
	$(function() { 
		document.body.onselectstart = function() { 
										return false; 
										}
	});

	return {
		"header"	: divHeader,
		"map"		: divMap,
		"container"	: divContainer
	};
});
