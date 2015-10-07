/**
 * 
 */
define([ "module", "jquery", "message-bus", "i18n" ], 
		function(module, $, bus, i18n ) {
	
			bus.listen('time-slider.selection', function(e, date){

				if( date.getFullYear() == 2015 ){
					var offset = $( '.time-slider-container' ).offset();
					offset.top = offset.top- 300;
//					console.log(offset);
					bus.send("info" , [ i18n['time_slider_change_2015_alert'] , offset]);
//					bus.send("info" , [ i18n['time_slider_change_2015_alert'] ]);
				}
				
			});
			
		});
	
