define([ "jquery" ], function($) {

	var body 			= $( "body" );
	
	var divContainer	= $( '<div class="container-fluid height100"></div>' );
	body.append( divContainer );

	var divHeader 		= $( '<div class="row header" ></div>' );
	divContainer.append( divHeader );
	var contentHeader 		= $( '<div class="col-md-12" ></div>' );
	divHeader.append( contentHeader );
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
		"header"	: contentHeader,
		"map"		: divMap,
		"container"	: divContainer
	};
});
