define([ "jquery", "message-bus", "toolbar", "jquery-ui-slider","layout" , "module" , "portal-ui"], function($, bus, toolbar, ui ,layout , module ) {
	
	var config = module.config();
	var timestampSet = {};
	
	bus.listen("add-layer", function(event, layerInfo) {
		$.each(layerInfo.wmsLayers, function(index, wmsLayer) {
			if (wmsLayer.hasOwnProperty("timestamps")) {
				var layerTimestamps = wmsLayer.timestamps;

				for (var i = 0; i < layerTimestamps.length; i++) {
					timestampSet[layerTimestamps[i]] = true;
				}
			}
		});
	});

	bus.listen("layers-loaded", function() {
		
		var timestamps = $.map(timestampSet, function(value, key) {
			return key;
		}).sort();
		var lastTimestampIndex = timestamps.length - 1;

		if (timestamps.length > 0) {
			var row = $( '<div class="row time-slider-container hidden-xs hidden-sm"></div>' );
			layout.container.append( row );
			
			UI.parseStyle( row , config );
			
			var viewPortWidth =  $( window ).width() ;
			if( viewPortWidth < 768 ){
				row.css( {width:'50%' , left :'50%' , top : '80%'} );
			}
			
			var colSlider = $( '<div class="col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1  time-slider"></div>' );
			row.append( colSlider );
//			var colLabel = $( '<div class="col-md-3 time-slider-label"><i class="fa fa-calendar"></i><span></span></div>' );
//			row.append( colLabel );
			
			colSlider.slider({
				change : function(event, ui) {
					var selection = ui.value;
					var d = new Date();
					d.setISO8601(timestamps[selection]);
//					console.log( ui.value );
					bus.send("time-slider.selection", d);
					
					colSlider.find( '.slider-label' ).removeClass( 'active' );
					colSlider.find( '.slider-label-' + selection ).addClass( 'active' );
					
				},
				slide : function(event, ui) {
//					var span = colLabel.find( 'span' );
//					colLabel.animate( {opacity:'0'} , 100 , function(e){
//						span.text( Date.getFullYear(timestamps[ui.value]) );
//						colLabel.animate( {opacity:'1'} , 200 );
//					});
				},
				max : lastTimestampIndex,
				value : lastTimestampIndex
			})
			.each(function() {
						// Add labels and markers to time slider
						$.each(timestamps,function( i, t ){
							var timestamp = new Date();
							timestamp.setISO8601( t );
							
							var label = $(
									'<label>' + ( timestamp.getFullYear() ) + '</label>')
									.css( 'left', ( (i/( timestamps.length-1 ) * 100) ) + '%' );
							label.addClass( 'slider-label' );
							label.addClass( 'slider-label-' + i );
							
							colSlider.append( label );

							var marker = $( '<div class="marker"></div>' )
									.css( 'left', ( (i/( timestamps.length-1 ) * 100) ) + '%' );
							
							colSlider.append( marker );
						});

					});
			
			
			;

//			colLabel.find( 'span' ).text( Date.getFullYear(timestamps[lastTimestampIndex]) );


			// Send time-slider.selection message to show the date on the layer selection pane
			// right after page load
			var index = (config.defaultItemIndex) ? config.defaultItemIndex : lastTimestampIndex;
			colSlider.slider( "value" , index );
		}
	});
});
