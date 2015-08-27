define([ "map", "message-bus", "customization","module"  ], function(map, bus, customization ,module) {

	var config 		= module.config();
	var disabled 	= ( config.disabled ) ? config.disabled : false;

	if( !disabled ){
		
			var layerIds = new Array();
			var layerWmsNames = new Array();
			var queryableLayers = new Array();
		
			var lastTimestamp = null;
		
			var control = new OpenLayers.Control.WMSGetFeatureInfo({
				url : customization["info.queryUrl"],
		//		layerUrls : [ customization["info.layerUrl"] ],
				title : 'Identify features by clicking',
				queryVisible : false,
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
						
						if (evt.features) {
							
							bus.send("info-features", [ evt.features, evt.xy.x, evt.xy.y ]);
		//					bus.send("info-features", [ features, evt.xy.x, evt.xy.y ]);
						}
					},
					beforegetfeatureinfo : function() {
						UI.lock();
						
						var layerNames = new Array();
						control.layers = new Array();
						
						var getLayer = function( layerId ){
							var layer 	= map.getLayersByName( layerId )[0];
							var layerNamespace = layer.params.LAYERS;
							if( layerNames.indexOf(layerNamespace) < 0 ){
								layerNames.push( layerNamespace );
								return layer;
							}
						};
						
						for (var i = 0; i < layerIds.length; i++) {
							var layerId = layerIds[i];
							
							var layer = getLayer( layerId );
							if( layer ){
								if( config.linkedLayers[layerId] ){
									var linkedLayerId = config.linkedLayers[layerId];
									if( linkedLayerId ){
										var linkedLayer = getLayer( linkedLayerId );
										if( linkedLayer ){
											control.layers.push(linkedLayer);
										}
									}
								}
								
								control.layers.push(layer);
							}
							
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
			
			if( config.vendorParams ){
				for( var paramName in config.vendorParams){
					control.vendorParams[ paramName ] = config.vendorParams[ paramName ];
				}
			}
		
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
	}
});
