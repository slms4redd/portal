define([ "jquery", "message-bus", "toolbar", "jquery-ui","layer-list-selector" ], function($, bus, toolbar, ui, layerList) {

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
			var row = $( '<div class="row panel no-margin time-slider-container"></div>' );
			layerList.layersContainer.append( row );
			var colSlider = $( '<div class="col-md-8 time-slider"></div>' );
			row.append( colSlider );
			var colLabel = $( '<div class="col-md-4 time-slider-label"><i class="fa fa-calendar"></i><span></span></div>' );
			row.append( colLabel );
			
			colSlider.slider({
				change : function(event, ui) {
					var d = new Date();
					d.setISO8601(timestamps[ui.value]);
					bus.send("time-slider.selection", d);
				},
				slide : function(event, ui) {
					var span = colLabel.find( 'span' );
					colLabel.animate( {opacity:'0'} , 100 , function(e){
						span.text( Date.getLocalizedDate(timestamps[ui.value]) );
						colLabel.animate( {opacity:'1'} , 200 );
					});
				},
				max : lastTimestampIndex,
				value : lastTimestampIndex
			});

			colLabel.find( 'span' ).text( Date.getLocalizedDate(timestamps[lastTimestampIndex]) );


			// Send time-slider.selection message to show the date on the layer selection pane
			// right after page load
			colSlider.slider( "value" , lastTimestampIndex );
		}
	});
});
