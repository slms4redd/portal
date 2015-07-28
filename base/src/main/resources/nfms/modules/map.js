define([ "message-bus", "layout", "openlayers" ], function(bus, layout) {

	/*
	 * keep the information about wms layers that will be necessary for
	 * visibility, opacity, etc.
	 */
	var mapLayersByLayerId = {};

	var map = null;
	var currentControl = null;
	var defaultExclusiveControl = null;

	var activateExclusiveControl = function(event, control) {
		if (currentControl != null) {
			currentControl.deactivate();
			map.removeControl(currentControl);
		}

		map.addControl(control);
		control.activate();

		currentControl = control;
	};

	OpenLayers.ProxyHost = "proxy?url=";
	var mapId = layout.map.attr("id"); 
//	var mapOptions =
//	   {
//	   .
//	   .
//	   .
//	   eventListeners:
//	      {
//	      featureover: function(e)
//	         {
//	         e.feature.renderIntent = "temporary";
//	         e.feature.layer.drawFeature(e.feature);
//	         },
//	      featureout: function(e)
//	         {
//	         e.feature.renderIntent = "default";
//	         e.feature.layer.drawFeature(e.feature);
//	         },
//	      featureclick: function(e)
//	         {
//	         e.feature.renderIntent = "select";
//	         e.feature.layer.drawFeature(e.feature);
//	         }
//	      }
//	   };
	map = new OpenLayers.Map( mapId , {
		theme : null,
		projection : new OpenLayers.Projection("EPSG:900913"),
		displayProjection : new OpenLayers.Projection("EPSG:4326"),
		units : "m",
		allOverlays : true,
		controls : [],
		eventListeners:
	      {
	      featureover: function(e)
	         {
	         e.feature.renderIntent = "temporary";
	         e.feature.layer.drawFeature(e.feature);
	         console.log( e.feature );
	         },
	      featureout: function(e)
	         {
	         e.feature.renderIntent = "default";
	         e.feature.layer.drawFeature(e.feature);
	         console.log( e.feature );
	         },
	      featureclick: function(e)
	         {
	         e.feature.renderIntent = "select";
	         e.feature.layer.drawFeature(e.feature);
	         console.log( e.feature );
	         }
	      }
	});
	map.addControl( new OpenLayers.Control.Navigation() );
	map.addControl( new OpenLayers.Control.Scale() );
//	map.addControl( new OpenLayers.Control.PanZoomBar() );
	
//	$('#' + mapId).on('mouseover', function() {
//        document.body.style.cursor = 'pointer';
//    });
//	$('#' + mapId).on('mouseout', function() {
//        document.body.style.cursor = 'default';
//    });
	
	bus.listen("add-layer", function(event, layerInfo) {
		var mapLayerArray = [];
		$.each(layerInfo.wmsLayers, function(index, wmsLayer) {
			var layer;
			if (wmsLayer.type == "osm") {
				layer = new OpenLayers.Layer.OSM(wmsLayer.id, wmsLayer.osmUrls);
			} else if (wmsLayer.type == "wfs") {
				layer = new OpenLayers.Layer.Vector("WFS", {
					strategies : [ new OpenLayers.Strategy.Fixed() ],
					protocol : new OpenLayers.Protocol.WFS({
						version : "1.0.0",
						url : wmsLayer.baseUrl,
						featureType : wmsLayer.featureType,
					}),
					projection : new OpenLayers.Projection("EPSG:4326")
				});
			} else {
				
				var wmsParams = {
						layers : wmsLayer.wmsName,
						buffer : 0,
						transitionEffect : "resize",
						removeBackBufferDelay : 0,
						isBaseLayer : false,
						transparent : true,
						format : wmsLayer.imageFormat || 'image/png',
//						tilesorigin: map.maxExtent.left + ',' + map.maxExtent.bottom
						singleTile: true
					};
				for (var paramName in wmsLayer.wmsParameters) {
			        if ( wmsLayer.wmsParameters.hasOwnProperty(paramName) ) {
			            wmsParams[ paramName ] = wmsLayer.wmsParameters[ paramName ];
			        }
			    }
				for (var paramName in layerInfo.wmsParameters) {
					if ( layerInfo.wmsParameters.hasOwnProperty(paramName) ) {
						wmsParams[ paramName ] = layerInfo.wmsParameters[ paramName ];
					}
				}
				
				var options = { noMagic : true };
				for (var optionName in wmsLayer.wmsOptions) {
					if ( wmsLayer.wmsOptions.hasOwnProperty(optionName) ) {
						options[ optionName ] = wmsLayer.wmsOptions[ optionName ];
					}
				}
				
				layer = new OpenLayers.Layer.WMS( wmsLayer.id,  wmsLayer.baseUrl, wmsParams, options );
			}
			layer.id = wmsLayer.id;
			
			if (map !== null) {
				map.addLayer(layer);
//				map.setLayerIndex(layer, wmsLayer.zIndex);
				layer.setZIndex(wmsLayer.zIndex);
//				console.log( "layer " + layer.id, "index "+ wmsLayer.zIndex);
			}
			mapLayerArray.push(wmsLayer);
		});
		if (mapLayerArray.length > 0) {
			mapLayersByLayerId[layerInfo.id] = mapLayerArray;
		}
	});

	bus.listen("layers-loaded", function() {
		
		// Add the vector layer for highlighted features on top of all the other
		// layers

		// StyleMap for the highlight layer
		var styleMap = new OpenLayers.StyleMap({
			'strokeWidth' : 5,
			fillOpacity : 0,
			strokeColor : '#ee4400',
			strokeOpacity : 0.5,
			strokeLinecap : 'round'
		});

		var highlightLayer = new OpenLayers.Layer.Vector("Highlighted Features", {
			styleMap : styleMap
		});
		highlightLayer.id = "Highlighted Features";
		map.addLayer(highlightLayer);
	});

	bus.listen("layer-visibility", function(event, layerId, visibility) {
		var mapLayers = mapLayersByLayerId[layerId];
		if (mapLayers) {
			$.each(mapLayers, function(index, mapLayerId) {
				var layer = map.getLayer(mapLayerId.id);
				layer.setVisibility(visibility);
			});
		}
	});

	bus.listen("activate-exclusive-control", function(event, control) {
		activateExclusiveControl(event, control);
	});

	bus.listen("activate-default-exclusive-control", function(event) {
		activateExclusiveControl(event, defaultExclusiveControl);
	});

	bus.listen("set-default-exclusive-control", function(event, control) {
		defaultExclusiveControl = control;
	});

	bus.listen("layer-timestamp-selected", function(event, layerId, timestamp) {
		var layer = map.getLayer(layerId);
		/*
		 * On application startup some events can be produced before the map has
		 * the reference to the layers so we have to check if layer is null
		 */
		if (layer !== null && timestamp !== null) {
			layer.mergeNewParams({
				'time' : timestamp.toISO8601String()
			});
		}
	});

	bus.listen("zoom-in", function(event) {
		map.zoomIn();
	});

	bus.listen("zoom-out", function(event) {
		map.zoomOut();
	});

	bus.listen("zoom-to", function(event, bounds) {
		map.zoomToExtent(bounds);
	});

	bus.listen("transparency-slider-changed", function(event, layerId, opacity) {
		var mapLayers = mapLayersByLayerId[layerId];
		if (mapLayers) {
			$.each(mapLayers, function(index, mapLayerId) {
				var layer = map.getLayer(mapLayerId.id);
				layer.setOpacity(opacity);
			});
		}
	});

	return map;
});