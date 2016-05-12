define([ "jquery", "layout", "i18n", "message-bus", "module","portal-ui" ], function($, layout, i18n, bus, module) {

	var config = module.config();

	var footer = $( '<div class="row footer" />' );
	layout.container.append( footer );
	
//	var footerContainer = $( '<div class="col-md-12" />' );
//	footer.append( footerContainer );
	
	if( config.elements ){
		UI.parseElements(footer , config.elements );
	}
	
});
