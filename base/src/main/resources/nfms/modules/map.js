define([ "message-bus", "layout", "module", "openlayers" ], function(bus, layout, module) {
	
	var config = module.config();
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
	
	var mapOptions = {
			theme : null,
			projection : new OpenLayers.Projection("EPSG:900913"),
			displayProjection : new OpenLayers.Projection("EPSG:4326"),
			units : "m",
			allOverlays : true,
			controls : []
	};
	// read map options from configuration 
	if( config.options ){
		for (var optName in config.options) {
	        if ( config.options.hasOwnProperty(optName) ) {
	        	mapOptions[ optName ] = config.options[ optName ];
	        }
	    }
	}
	map = new OpenLayers.Map( mapId , mapOptions );

//	map.events.register('zoomend', map, function() {
//		  var zoomInfo = 'Zoom level=' + map.getZoom() + '/' + (map.numZoomLevels + 1);
//		  console.log( zoomInfo );
//		});
	map.addControl( new OpenLayers.Control.Navigation() );
	map.addControl( new OpenLayers.Control.Scale() );
//	map.addControl( new OpenLayers.Control.PanZoomBar() );
	
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

	
	bus.listen("info-popup-getfeatureinfo", function(control, x, y, text) {
		//console.log("sono qui");
		alert("sono qui");
	});
	
	
	//popup sample
	bus.listen("add-popup", function(portalLayerId) {
		//console.log("sono qui");
		var layer = "unredd:";
		layer = layer+portalLayerId;		
		console.log("add-popup: "+layer);
		
		map.events.register("click", map, function(e) {
			var popup = new OpenLayers.Popup(
					"popup",
					map.getLonLatFromPixel(event.xy),
	                new OpenLayers.Size(200,200),
	                '<div class="markerContent">'+"Example Popup with Div"+'</div>',
	                true, 
	                null);

			map.addPopup(popup);
		});
		
		
		
		
		//popup sample
		/*var info = new OpenLayers.Control.WMSGetFeatureInfo({
            url: 'http://178.33.8.121/diss_geoserver/wms', 
            title: 'Identify features by clicking',
            layers: layer,
            queryVisible: true,
            infoFormat: 'application/vnd.ogc.gml',
            hover: false,
            drillDown: true,
            maxFeatures: 5,
            handlerOptions: {
                "click": {
                    'single': true,
                    'double': false
                }
            },
            eventListeners: {
                getfeatureinfo: function(event) {
                	console.log("output getfeaturedinfo: "+showInfo(event, event.text));
                    map.addPopup(new OpenLayers.Popup.FramedCloud(
                        "chicken", 
                        map.getLonLatFromPixel(event.xy),
                        null,
                        event.text,
                        null,
                        true
                    ));
                }
            }
        });
        map.addControl(info);
        info.activate();*/
		//end popup sample
		
	});
	
	
	//test
	/**
	 * Add a click handler to hide the popup.
	 * @return {boolean} Don't follow the href.
	 */
	/**
	 * Create an overlay to anchor the popup to the map.
	 */
/*	var container = document.getElementById('popup');
	var content = document.getElementById('popup-content');
	var closer = document.getElementById('popup-closer');
	
	var overlay = new OpenLayers.Overlay(({
	  element: container,
	  autoPan: true,
	  autoPanAnimation: {
	    duration: 250
	  }
	}));
	
	
	closer.onclick = function() {
	  overlay.setPosition(undefined);
	  closer.blur();
	  return false;
	};*/
	
	
	/**
	 * Add a click handler to the map to render the popup.
	 */
/*	map.on('singleclick', function(evt) {
	  var coordinate = evt.coordinate;
	  var hdms = OpenLayers.coordinate.toStringHDMS(OpenLayers.proj.transform(
	      coordinate, 'EPSG:3857', 'EPSG:4326'));

	  content.innerHTML = '<p>You clicked here:</p><code>' + hdms +
	      '</code>';
	  overlay.setPosition(coordinate);
	});*/
	
	return map;
});