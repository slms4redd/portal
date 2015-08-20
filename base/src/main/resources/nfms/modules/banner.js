define([ "jquery", "layout", "i18n", "message-bus", "module", "portal-ui" ], function($, layout, i18n, bus, module) {

	var config = module.config();
	
	if( config.elements ){
		var bannerRow = $( '<div class="row banner"></div>' ); 
		layout.header.append( bannerRow );
		
		var banner = $( '<div class="col-md-12"></div>' ); 
		bannerRow.append( banner );
		
		UI.parseElements( banner, config.elements);
	}
	
});
