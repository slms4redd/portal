define([ "jquery" , "message-bus" , "map", "layer-list", "jquery-ui" ], function($, bus, map, layerList) {
//    var aLayers=[];
    var aTimestampsLayers={};
//	var divTimeSliders = $("<div/>").attr("id", "layerTimeSliders").addClass("layer_container_panel");
//	layerListSelector.registerLayerPanel("layer_slider_selector", "Temporal", divTimeSliders);
	
	bus.listen("add-layer-timestamp", function( event, layerInfo ){
		if( !layerInfo.isPlaceholder ){
//			console.log( layerList.layerRowPrefix );
			var timestamps = getTimestamps( layerInfo );
		
			if (timestamps.length > 0) {
				
				aTimestampsLayers[layerInfo.id]=timestamps;
				
				// add badge to layer button
				var layerRow			= $( '#' + layerList.layerRowPrefix + layerInfo.id );
				var layerRowSettings	= $( '#' + layerList.layerRowSettingsPrefix + layerInfo.id );
				
				var div 				= $( '<div class="layer-badge-timestamp" />' );
				layerRow.find( '.layer button' ).append( div );

				div.append( '<i class="fa fa-calendar"></i>' );
				
				var layerBadgeTimestamp = $( '<span class="layer-badge-timestamp-text" />' );
				layerBadgeTimestamp.html( timestamps[timestamps.length - 1].getLocalizedDate() );
				div.append( layerBadgeTimestamp );
			
			
				// add time-slider row
				var row = $( '<div class="row layer-time-slider" />' );
				layerRowSettings.append( row );
				
				var colIcon = $( '<div class="col-md-offset-1 col-md-1 row-layer-settings-icon no-padding" />' );
				colIcon.append( '<i class="fa fa-calendar"></i>' );
				row.append( colIcon );
				
				var colSlider = $( '<div class="col-md-9 row-layer-settings-slider no-padding" />' );
				colSlider.addClass( 'layer-time-slider-'+layerInfo.id );
				row.append( colSlider );

				
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
								layerBadgeTimestamp.text( date.getLocalizedDate() );
								layerBadgeTimestamp.animate( {opacity:'1'} , 200 );
							});
						});
					},
					slide : function(event, ui) {
						var date 		= timestamps[ui.value];
						
						layerBadgeTimestamp.stop().animate( {opacity:'0'} , 100 , function(e){
							layerBadgeTimestamp.text( date.getLocalizedDate() );
							layerBadgeTimestamp.animate( {opacity:'1'} , 200 );
						});
					},
					max : timestamps.length - 1,
					value : timestamps.length - 1
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
	
	bus.listen("time-slider.selection",function(obj,d){

//		console.log(aTimestampsLayers);
		$.each(aTimestampsLayers, function(layerid,steps){
			var position_i= -1 , 
				position_min = -1 , 
				position_max = -1;

			$.each(steps,function( position, date_value){
				if (date_value.valueOf()==d.valueOf()) {
					position_i=position;
					
				} else if (date_value.valueOf()<d.valueOf()) {
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
		}
		);
	});
});