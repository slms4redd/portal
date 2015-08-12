define([ "message-bus", "module", "jquery" , "layout" ], function(bus, module, $ , layout) {
	
	var divContainer 	= $( '<div id="message-box"></div>' );
	layout.container.append( divContainer );
	
	var divClose 		= $( '<div class="close-message-box"><i class="fa fa-times"></i></div>' );
	divContainer.append( divClose );
	
	divClose.click( function(){
		divContainer.stop().fadeOut( 1000 );
	});
	
	var divMessage 		= $( '<div class="message-text"></div>' );
	divContainer.append( divMessage );
	
	var messageHandler = function( msg , level ) {
		divContainer.removeClass().addClass( level );
		divMessage.empty().html(msg);
		
		divContainer.stop().fadeIn( 400 , function(){
			setTimeout( function(){
				divContainer.fadeOut( 3000 );
			} , 3000 );
		});
	};
	
	bus.listen("error", function(event , msg){ 
		messageHandler( msg , 'error' );
	});

	bus.listen("info", function(event , msg){ 
		messageHandler( msg , 'info' );
	});
});
