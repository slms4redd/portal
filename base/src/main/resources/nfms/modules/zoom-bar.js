define([ "jquery", "message-bus" , "layout" ], function($, bus , layout) {
	
	var div		= $( '<div class="zoom-bar" />' );
	layout.container.append( div );
	
	var zoomIn	= $( '<button class="btn"><i class="fa fa-plus"></i></button>' );
	zoomIn.click(function() {
		bus.send( "zoom-in" );
		zoomIn.blur();
	});
	div.append( zoomIn );
	
	
	var zoomOut	= $( '<button class="btn"><i class="fa fa-minus"></i></button>' );
	zoomOut.click(function() {
		bus.send( "zoom-out" );
		zoomOut.blur();
	});
	div.append( zoomOut );
	
	
	var zoomFull	= $( '<button class="btn"><i class="fa fa-crosshairs"></i></button>' );
	zoomFull.click(function() {
		bus.send( "initial-zoom" );
		zoomFull.blur();
	});
	div.append( zoomFull );
	
	
//	var btnZoomOut = $("<a/>").attr("id", "zoom_out").appendTo("body");
//	btnZoomOut.click(function() {
//		bus.send("zoom-out");
//	});
//	var btnZoomIn = $("<a/>").attr("id", "zoom_in").appendTo("body");
//	btnZoomIn.click(function() {
//		bus.send("zoom-in");
//	});
//	var btnZoomFull = $("<a/>").attr("id", "zoom_to_max_extent").appendTo("body");
//	btnZoomFull.click(function() {
//		bus.send("initial-zoom");
//	});
});
