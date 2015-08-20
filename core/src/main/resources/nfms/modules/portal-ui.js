define( ["jquery" , "i18n" ], function($ , i18n ) {
	
	var modalWindow = $( "#ui-lock-modal" );
	
	UI = {};
	
	UI.lock = function() {
		modalWindow.modal( {keyboard:false, backdrop:"static"} );
		$('body').addClass('locked');
	};
	
	UI.unlock = function() {
		modalWindow.modal('hide');
		modalWindow.modal('removeBackdrop');
		$('body').removeClass('locked');
		
	};
	
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

	UI.parseElements = function( parent , elements ){
		addElements( parent, elements);
	}
	
	/**
	 * Parse a JSON object style to give to the domElem
	 * The JSON style object has the format:
	 * {
	 * 		"name"		: "div" ,
	 * 		"styles"	: { "position": "absolute" , "color" : "#142022", "font-size" : "60px",
	 * 						"z-index" : "1001" , "text-align" : "center" , "left" : "30%" ,
	 * 						"width": "40%" , "background-color": "rgba(157, 157, 157, 0.66)"
	 * 				  		} ,
	 *		"label"		: "demo",
	 *		"attributes": [],	
	 *		"cssClasses": ["test","test2"]
	 *	}
	 */
	UI.parseStyle = function( domElem , jsonStyle ){
		// add styles
		if( jsonStyle.styles ){
			for (var name in jsonStyle.styles) {
	        	domElem.css( name , jsonStyle.styles[name] );
		    }
		}
		
		// add attributes
		if( jsonStyle.attributes ){
			for (var name in jsonStyle.attributes) {
	        	domElem.attr( name , jsonStyle.attributes[name] );
		    }
		}
		
		// add css classes
		if( jsonStyle.cssClasses ){
			for (var cssClass in jsonStyle.cssClasses ) {
				domElem.addClass( jsonStyle.cssClasses[cssClass] );
		    }
		} 
		
		// add i18n label
		if( jsonStyle.label ){
			domElem.append( i18n[jsonStyle.label] );
		}
	};
	
});