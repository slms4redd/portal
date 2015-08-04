define( ["jquery"], function($) {
	
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
	
});