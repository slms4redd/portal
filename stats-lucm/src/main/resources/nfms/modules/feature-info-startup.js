/**
 * 
 */
define([ "module", "jquery", "message-bus", "map", "i18n", "customization", "dashboard", "portal-string-utils" ], 
		function(module, $, bus, map, i18n, customization, layerDashboard ) {
	
	var config = module.config();
	
	var serverUrl 	= customization['info.serverUrl'] ;
	var wmsUri 		= customization['info.wmsUri'] ;
	
	bus.listen('layers-loaded', function(e){

		// load feature info
		if( config.queryParams ){
			var requestUrl		= serverUrl + wmsUri+ '?' + config.queryParams;

			var sameOrigin = StringUtils.startsWith( window.location.origin , serverUrl );
			if( !sameOrigin ){
				requestUrl 	= "proxy?url=" + encodeURIComponent( requestUrl );
			} 
			
			bus.send("ajax", {
				type 	: 'GET',
				url 	: requestUrl,
				success : function(data, textStatus, jqXHR) {
					var features = data.features;
					$.each( features, function(i, feature){
						feature.fid = feature.id;
						feature.attributes = feature.properties;
					});
					bus.send( "info-features", [ features , false ] );
				}
			});
		}
		
		
		
	});
	
	
});
	
