define([ "jquery" , "message-bus" , "layer-dashboard" ], function($, bus, layerDashbaord) {
	
	
	bus.listen( "add-feature-stats" , function( event ,feature){
		console.log( feature );
		
	});
	
});