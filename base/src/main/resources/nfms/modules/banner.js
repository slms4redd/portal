define([ "jquery", "layout", "i18n", "message-bus", "module" ], function($, layout, i18n, bus, module) {

	var config = module.config();
	
	var addElements 	= function( parent , elements ){
		$.each( elements , function( i , element ){
			
			var domElem = $( '<' + element.name + '/>' );
			
			// add styles
			if( element.styles ){
				for (var name in element.styles) {
			        if ( element.styles.hasOwnProperty( name) ) {
			        	domElem.css( name , element.styles[name] );
			        }
			    }
			}
			
			// add attributes
			if( element.attributes ){
				for (var name in element.attributes) {
			        if ( element.attributes.hasOwnProperty( name) ) {
			        	domElem.attr( name , element.attributes[name] );
			        }
			    }
			}
			
			// add css classes
			if( element.cssClasses ){
				for (var cssClass in element.cssClasses ) {
					domElem.addClass( element.cssClasses[cssClass] );
			    }
			} 
			
			// add i18n label
			if( element.label ){
				domElem.append( i18n[element.label] );
			}
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
