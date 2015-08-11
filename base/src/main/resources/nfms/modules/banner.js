define([ "jquery", "layout", "i18n", "message-bus", "module", "portal-ui" ], function($, layout, i18n, bus, module) {

	var config = module.config();
	
	var addElements 	= function( parent , elements ){
		$.each( elements , function( i , element ){
			
			var domElem = $( '<' + element.name + '/>' );
			
			// add styles
			UI.parseStyle( domElem , element );
			
			//append to dom
			parent.append( domElem );
			
			// append sub elements 
			if( element.elements ){
				addElements( domElem, element.elements);
			}
		});
	}
	
	if( config.elements ){
		var bannerRow = $( '<div class="row banner"></div>' ); 
		layout.header.append( bannerRow );
		
		var banner = $( '<div class="col-md-12"></div>' ); 
		bannerRow.append( banner );
		
		addElements( banner, config.elements);
	}
	
});
