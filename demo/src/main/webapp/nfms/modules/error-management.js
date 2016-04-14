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
	
	var messageHandler = function( msg , level, offset ) {
		divContainer.removeClass().addClass( level );
		divMessage.empty().html(msg);
		
		divContainer.removeAttr( 'style' );
		if( offset ){
			divContainer.css('top',offset.top+'px');
			divContainer.css('left',offset.left+'px');
		}
		
		divContainer.stop().fadeIn( 300 , function(){
			setTimeout( function(){
				divContainer.fadeOut( 6000 );
			} , 7000 );
		});
	};
	
	bus.listen("error", function(event , msg, offset){ 
		messageHandler( msg , 'error', offset );
	});

	bus.listen("info", function(event , msg, offset){ 
		messageHandler( msg , 'info', offset );
	});
	
	var getPopoverHtmlTemplate = function(){
		return $( '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>' );
	};
	
	// popover message on a target element
	var messageHandlerPopover= function( msg , level, targetElem ) {
		var template = getPopoverHtmlTemplate();
		targetElem.removeAttr('data-style').attr('data-style',level);

		targetElem.popover({
			placement:'top',
			content: msg, 
			trigger:'manual', 
			delay: { "show": 500, "hide": 3000 } 
		});
		targetElem.popover('show');
		
		targetElem.on('shown.bs.popover' , function(){
			setTimeout( function(){
				targetElem.popover( 'destroy' );
			} , 3000 );
		});
		
	};
	
	bus.listen("error-popover", function(event , msg, targetElem){ 
		messageHandlerPopover( msg , 'error', targetElem );
	});

	bus.listen("info-popover", function(event , msg, targetElem){ 
		messageHandlerPopover( msg , 'info', targetElem );
	});
	
});
