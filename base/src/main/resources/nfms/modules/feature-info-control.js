define([ "map", "message-bus", "customization"  ], function(map, bus, customization ) {

	var layerIds = new Array();
	var layerWmsNames = new Array();
	var queryableLayers = new Array();

	var lastTimestamp = null;

	var control = new OpenLayers.Control.WMSGetFeatureInfo({
		url : customization["info.queryUrl"],
//		layerUrls : [ customization["info.layerUrl"] ],
		title : 'Identify features by clicking',
		queryVisible : true,
		infoFormat : 'application/vnd.ogc.gml',
		hover : false,
		drillDown : true,
		maxFeatures : 10,
		handlerOptions : {
			"click" : {
				'single' : true,
				'double' : false
			}
		},
		eventListeners : {
			getfeatureinfo : function(evt) {
				UI.unlock();
				if (evt.features) {
					
					bus.send("info-features", [ evt.features, evt.xy.x, evt.xy.y ]);
//					bus.send("info-features", [ features, evt.xy.x, evt.xy.y ]);
				}
			},
			beforegetfeatureinfo : function() {
				UI.lock();
//				control.layers = queryableLayers;
				control.layers = new Array();
				for (var i = 0; i < layerIds.length; i++) {
					var layer = map.getLayersByName(layerIds[i])[0];
					control.layers.push(layer);
				}
//				
//				if (lastTimestamp != null) {
//					control.vendorParams = {
//						"time" : lastTimestamp.toISO8601String()
//					};
//				}
			},
			nogetfeatureinfo : function(evt){
				UI.unlock();
			}
		},
		formatOptions : {
			typeName : 'XXX',
			featureNS : 'http://www.openplans.org/unredd'
		}
	});
	
	control.vendorParams['buffer'] = 1;
	
	bus.send("set-default-exclusive-control", [ control ]);
	bus.send("activate-default-exclusive-control");

	bus.listen("add-layer", function(event, layerInfo) {
		$.each(layerInfo.wmsLayers, function(index, wmsLayer) {
			if (wmsLayer.queryable) {
				
//				if( layerWmsNames.indexOf(wmsLayer.wmsName) < 0 ){
				layerIds.push( wmsLayer.id );
//					layerWmsNames.push( wmsLayer.wmsName );
//				}
				
			}
		});
	});
	
	bus.listen("time-slider.selection", function(event, timestamp) {
		lastTimestamp = timestamp;
	});
	
	bus.listen("layers-loaded", function(event, timestamp) {
		for (var i = 0; i < layerIds.length; i++) {
			var layer = map.getLayersByName(layerIds[i])[0];
			queryableLayers.push ( layer );
		}
	});
	
});
