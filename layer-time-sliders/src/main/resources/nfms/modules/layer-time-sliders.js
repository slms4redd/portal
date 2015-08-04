define([ "jquery" , "message-bus" , "map", "layer-list", "jquery-ui-slider" ], function($, bus, map, layerList) {

	var aTimestampsLayers={};
    var layerInfoWithTime={};
	
	bus.listen("add-layer-timestamp", function( event, layerInfo ){
		if( !layerInfo.isPlaceholder ){
		
			var timestamps = getTimestamps( layerInfo );
		
			if (timestamps.length > 0) {
				
				aTimestampsLayers[ layerInfo.id ] 	= timestamps;
				layerInfoWithTime[ layerInfo.id ]	= layerInfo;
				// add badge to layer button
				var layerRow			= $( '#' + layerList.layerRowPrefix + layerInfo.id );
				var layerRowSettings	= $( '#' + layerList.layerRowSettingsPrefix + layerInfo.id );
				
				var div 				= $( '<div class="layer-badge-timestamp" />' );
				layerRow.find( '.layer button' ).append( div );

				div.append( '<i class="fa fa-calendar"></i>' );
				
				var layerBadgeTimestamp = $( '<span class="layer-badge-timestamp-text" />' );
				layerBadgeTimestamp.html( timestamps[timestamps.length - 1].getFullYear() );
				div.append( layerBadgeTimestamp );
			
			
				// add time-slider row
				var row = $( '<div class="row layer-time-slider" />' );
				
				layerRowSettings.append( row );
				
				var colIcon = $( '<div class="col-md-offset-1 col-md-1 row-layer-settings-icon no-padding" />' );
				colIcon.append( '<i class="fa fa-calendar"></i>' );
				row.append( colIcon );

				var colSlider = $( '<div class="col-md-9 row-layer-settings-slider no-padding"  />' );
				colSlider.addClass( 'layer-time-slider-'+layerInfo.id );
				row.append( colSlider );
				
				if( layerInfo.showTimeSlider === false ){
					colSlider.hide();
					colIcon.hide();
					row.addClass( 'no-padding' );
				}
				
//				$.each(timestamps,function( i, timestamp ){
//					var btn = $( '<button class="btn btn-default layer-time-btn"></button>' );
//					btn.addClass( timestamp.getTime() +'' );
//					btn.html( timestamp.getFullYear() );
//					
//					
//					btn.click( function(){
//						colSlider.find( '.layer-time-btn' ).removeClass( 'active' );
//						btn.addClass( 'active' );
//						
//						$.each(layerInfo.wmsLayers, function(index, wmsLayer) {
//							var layer = map.getLayer(wmsLayer.id);
//							layer.mergeNewParams({
//								'time' : timestamp.toISO8601String()
//							});
//							bus.send( "layer-time-slider.selection", [layerInfo.id,timestamp] );
//							
//							layerBadgeTimestamp.stop().animate( {opacity:'0'} , 100 , function(e){
//								layerBadgeTimestamp.text( timestamp.getFullYear() );
//								layerBadgeTimestamp.animate( {opacity:'1'} , 200 );
//							});
//						});
//					});
//					colSlider.append( btn );
//					
//				});
				
				colSlider.slider({
					change : function(event, ui) {
						var date = timestamps[ui.value];
						$.each(layerInfo.wmsLayers, function(index, wmsLayer) {
							var layer = map.getLayer(wmsLayer.id);
							layer.mergeNewParams({
								'time' : date.toISO8601String()
							});
							bus.send("layer-time-slider.selection", [layerInfo.id,date]);
							
							layerBadgeTimestamp.stop().animate( {opacity:'0'} , 100 , function(e){
								layerBadgeTimestamp.text( date.getFullYear() );
								layerBadgeTimestamp.animate( {opacity:'1'} , 200 );
							});
						});
					},
					slide : function(event, ui) {
						var date 		= timestamps[ui.value];
						
						layerBadgeTimestamp.stop().animate( {opacity:'0'} , 100 , function(e){
							layerBadgeTimestamp.text( date.getFullYear() );
							layerBadgeTimestamp.animate( {opacity:'1'} , 200 );
						});
					},
					max : timestamps.length - 1,
					value : timestamps.length - 1
				})
				.each(function() {
						// Add labels and markers to time slider
						$.each(timestamps,function( i, timestamp ){
							var label = $(
									'<label>' + ( timestamp.getFullYear() ) + '</label>')
									.css( 'left', ( (i/( timestamps.length-1 ) * 100) ) + '%' );

							colSlider.append( label );

							var marker = $( '<div class="marker"></div>' )
									.css( 'left', ( (i/( timestamps.length-1 ) * 100) ) + '%' );
							
							colSlider.append( marker );
						});

					});
			}
		}
	});
	
	
	/**
	 * Returns an array of time stamps for the given layerInfo
	 */
	var getTimestamps = function( layerInfo ){
		var timestamps = [];
		
		$.each(layerInfo.wmsLayers, function(index, wmsLayer) {
			if (wmsLayer.hasOwnProperty("timestamps")) {
				for (var i = 0; i < wmsLayer.timestamps.length; i++) {
					var d = new Date();
//					console.log( wmsLayer.timestamps[i] );
					d.setISO8601(wmsLayer.timestamps[i]);
//					console.log( d );
					timestamps.push(d);
				}
			}
		});
		
		if (timestamps.length > 0) {
			timestamps.sort(function(a, b) {
				return a - b;
			});
		}
		
		return timestamps;
	};
	
//	bus.listen("add-layer", function(event, layerInfo) {
//		var timestamps = [];
//		$.each(layerInfo.wmsLayers, function(index, wmsLayer) {
//			if (wmsLayer.hasOwnProperty("timestamps")) {
//				for (var i = 0; i < wmsLayer.timestamps.length; i++) {
//					var d = new Date();
//					console.log( wmsLayer.timestamps[i] );
//					d.setISO8601(wmsLayer.timestamps[i]);
//					console.log( d );
//					timestamps.push(d);
//				}
//			}
//		});
//
//		if (timestamps.length > 0) {
//			timestamps.sort(function(a, b) {
//				return a - b;
//			});
//			$("<div/>").html(layerInfo.label).addClass("layer-time-slider-title").appendTo(divTimeSliders);
//			var divTimeSliderLabel = $("<span id='layer_time_slider_label_" + layerInfo.id + "'/>").appendTo(divTimeSliders);
//			var divTimeSlider = $("<div id='layer_time_slider_" + layerInfo.id + "' class='layers_time_slider' />").appendTo(divTimeSliders);
//			divTimeSlider.addClass("layer-time-slider");
//
//			divTimeSlider.slider({
//				change : function(event, ui) {
//					if (event.originalEvent) {
//						var date = timestamps[ui.value];
//						$.each(layerInfo.wmsLayers, function(index, wmsLayer) {
//							var layer = map.getLayer(wmsLayer.id);
//							layer.mergeNewParams({
//								'time' : date.toISO8601String()
//							});
//							bus.send("layer-time-slider.selection", [layerInfo.id,date]);
//						});
//					}else{ //Programatic change
//						//alert('programatic');
//					};
//					
//				},
//				slide : function(event, ui) {
//					var date = timestamps[ui.value];
//					divTimeSliderLabel.text(date.getLocalizedDate());
//				},
//				max : timestamps.length - 1,
//				value : timestamps.length - 1
//			});
//
//			divTimeSliderLabel.text(timestamps[timestamps.length - 1].getLocalizedDate());
//		
//		   aTimestampsLayers[layerInfo.id]=timestamps;
//		}
//
//	});
	
	bus.listen("time-slider.selection",function(obj,date){

		$.each(aTimestampsLayers, function(layerid,steps){
			var position_i= -1 , 
				position_min = -1 , 
				position_max = -1;

			$.each(steps,function( position, date_value){
				if (date_value.valueOf() == date.valueOf()) {
					position_i=position;
					
				} else if( date_value.valueOf() < date.valueOf() ) {
					position_min=position;
//					console.log(date_value+' menor');
				}else{
					if (position_max==-1) {position_max=position;};
//					console.log(date_value+' mayor');
				};
			});
//			console.log(layerid+' -> '+position_i+', '+position_min+', '+position_max);
			var pos;
			if (position_i>-1) { 
				pos=position_i;
			} else { 
				pos = position_min;
			}
			$(  '.layer-time-slider-' + layerid ).slider( 'value' , pos );
		
			
			
			
//			var div = $(  '.layer-time-slider-' + layerid );
//			div.find( '.layer-time-btn' ).removeClass( 'active' );
//			var btn = div.find( '.'+date.getTime() );
//			btn.addClass( 'active' );
//			
//			
//			$.each(layerInfoWithTime[layerid].wmsLayers, function(index, wmsLayer) {
//				var layer = map.getLayer(wmsLayer.id);
//				layer.mergeNewParams({
//					'time' : date.toISO8601String()
//				});
//				bus.send("layer-time-slider.selection", [layerid, date]);
//
//				var layerRow			= $.find( '#' + layerList.layerRowPrefix + layerid );
//				var layerBadgeTimestamp = $( layerRow).find( '.layer-badge-timestamp-text' );
//				
//				
//				layerBadgeTimestamp.stop().animate( {opacity:'0'} , 100 , function(e){
//					layerBadgeTimestamp.text( date.getFullYear() );
//					layerBadgeTimestamp.animate( {opacity:'1'} , 200 );
//				});
//			});
			
		});
	});
});