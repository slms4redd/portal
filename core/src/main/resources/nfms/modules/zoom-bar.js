define([ "jquery", "message-bus" , "layout" , "i18n", "map", "bootstrap" ], function($, bus , layout , i18n,map) {
	
	var tooltipTemplate = '<div class="tooltip portal-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>';
	
	var div		= $( '<div class="zoom-bar hidden-xs" />' );
	layout.container.append( div );
	
	var zoomIn	= $( '<button class="btn btn-default" data-html="true"><i class="fa fa-plus"></i></button>' );
	zoomIn.click(function() {
		bus.send( "zoom-in" );
		zoomIn.blur();
	});
	div.append( zoomIn );
	zoomIn.tooltip( {title:i18n['zoombar_zoom_in'], container: 'body', placement:'top', template:tooltipTemplate , delay: { "show": 0, "hide": 20 }, html:true} );
	
	var zoomOut	= $( '<button class="btn btn-default data-html="true""><i class="fa fa-minus"></i></button>' );
	zoomOut.click(function() {
		bus.send( "zoom-out" );
		zoomOut.blur();
	});
	div.append( zoomOut );
	zoomOut.tooltip( {title:i18n['zoombar_zoom_out'], container: 'body', placement:'top', template:tooltipTemplate , delay: { "show": 0, "hide": 20 }, html:true} );
	
	
	var zoomFull	= $( '<button class="btn btn-default data-html="true""><i class="fa fa-crosshairs"></i></button>' );
	zoomFull.click(function() {
		bus.send( "initial-zoom" );
		zoomFull.blur();
	});
	div.append( zoomFull );
	zoomFull.tooltip( {title:i18n['zoombar_zoom_default'], container: 'body', placement:'top', template:tooltipTemplate , delay: { "show": 0, "hide": 20 }, html:true});
	
	
//	bus.listen('layers-loaded', function(){
//		console.log( map );
//	});
	
});
