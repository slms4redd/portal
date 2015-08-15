/**
 * 
 */
define([ "module", "jquery", "message-bus", "map", "i18n", "customization", "dashboard" ], 
		function(module, $, bus, map, i18n, customization, layerDashboard) {
	
	var config = module.config();
//	console.log( config );
	
	var wmsUrl = customization['info.wmsUrl'] ;
	var url = "proxy?url=" + wmsUrl;
	
	bus.listen('layers-loaded', function(e){

		if( config.queryParams ){

			var encodedParams 	= encodeURIComponent( config.queryParams );
			var requestUrl		= url+ '?' + encodedParams;
			
//			console.log( requestUrl );
			bus.send("ajax", {
				type 	: 'GET',
				url 	: url+ '?' + encodedParams,
				success : function(data, textStatus, jqXHR) {
					var features = data.features;
					$.each( features, function(i, feature){
//						console.log( feature.properties.name );
						feature.fid = feature.id;
						feature.attributes = feature.properties;
					});
//					console.log( features );
					bus.send( "info-features", [ features , false ] );
				}
			});
		}
		
	});
	
});
	
