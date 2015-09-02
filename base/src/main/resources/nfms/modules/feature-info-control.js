define([ "map", "message-bus", "customization", "module", "openlayers" ], function(map, bus, customization ,module) {

	var config = module.config();
	
	var layerIds = new Array();
	var layerWmsNames = new Array();
	var queryableLayers = new Array();

	var lastTimestamp = null;
	
	var control = new OpenLayers.Control.WMSGetFeatureInfo({
		url : customization["info.queryUrl"],
//		layerUrls : [ customization["info.layerUrl"] ],
		//AA adding layers
		//AAlayers: layerIds,
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
				//AAconsole.log("qui 2");
				if (evt.features) {
					
					//AAconsole.log("evt.features: "+evt.features);
					
					//AAconsole.log("portalLayer.id: "+layerIds);
					//bus.send("add-popup", layerIds);
					//AAvar popup = new OpenLayers.Popup(
					//AA		"popup",
					//AA		map.getLonLatFromPixel(event.xy),
					//AA       new OpenLayers.Size(200,200),
					//AA       '<div class="markerContent">'+"Example Popup with Div"+'</div>',
					//AA       true, 
					//AA        null);

					//AAmap.addPopup(popup);
					
					
					bus.send("info-features", [ evt.features, evt.xy.x, evt.xy.y ]);
//					bus.send("info-features", [ features, evt.xy.x, evt.xy.y ]);
					
					//AA
					bus.send("info-popup-getfeatureinfo", [ control, evt.xy.x, evt.xy.y, evt.text ]);
				}
			},
			beforegetfeatureinfo : function() {
				//AAconsole.log("qui 1");
				UI.lock();
				
				var layerNames = new Array();
				control.layers = new Array();
				//AAconsole.log("qui 5: "+layerId);
				
				var getLayer = function( layerId ){
					
					//AAconsole.log("qui 6");
					
					var layer 	= map.getLayersByName( layerId )[0];
					//AAconsole.log("layer: "+layer);
					var layerNamespace = layer.params.LAYERS;
					if( layerNames.indexOf(layerNamespace) < 0 ){
						layerNames.push( layerNamespace );
						return layer;
					}
					//AAconsole.log("qui 4");
				};
				//AAconsole.log("qui 7");
				for (var i = 0; i < layerIds.length; i++) {
					var layerId = layerIds[i];
					
					var layer = getLayer( layerId );
					//AAconsole.log("layer 1: "+layer);
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
						//AAconsole.log("layer 2: "+layer);
						control.layers.push(layer);
//						console.log( control.layers );
					}
					
				}
				//AAonsole.log("qui 8");
//				
//				if (lastTimestamp != null) {
//					control.vendorParams = {
//						"time" : lastTimestamp.toISO8601String()
//					};
//				}
			},
			nogetfeatureinfo : function(evt){
				//AAconsole.log("qui 3");
				UI.unlock();
			}
		},
		formatOptions : {
			typeName : 'XXX',
			featureNS : 'http://www.openplans.org/unredd'
		}
	});
	//console.log("url "+url);
	control.vendorParams['buffer'] = 1;
	
	bus.send("set-default-exclusive-control", [ control ]);
	bus.send("activate-default-exclusive-control");

	bus.listen("add-layer", function(event, layerInfo) {
		$.each(layerInfo.wmsLayers, function(index, wmsLayer) {
			if (wmsLayer.queryable) {
				console.log("layer: "+ wmsLayer);
				console.log("layer name: "+ wmsLayer.wmsName);
				
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
