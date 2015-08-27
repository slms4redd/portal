/**
 * 
 */
define([ "module", "jquery", "message-bus", "map", "i18n", "features" ], 
		function(module, $, bus, map, i18n ) {
	
//	var config = module.config();
	
	
	
	bus.listen('layers-loaded', function(e){
		
		Features.getFeatureInfo( false,  'unredd:country', 'name,area,info_file', 291, 154 , 801 , 1031 ,"10815463.885992,921454.138336,13186287.946754,2763384.37371" );
		
		
		map.events.register( 'click', map, function (e) {
			
			Features.getFeatureInfo(  
					true,
					'unredd:country,unredd:province', 
					'(name,area,info_file)(name,area,info_file,province_c)',
					e.xy.x ,   e.xy.y , map.size.h , map.size.w ,
					 map.getExtent().toBBOX()
			 );
		});

	});	
	
});
	
