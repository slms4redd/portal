define([ "message-bus", "layout", "map", "module" ], function(bus, layout, map, module) {
			
	var config 		= module.config();

	var overviewMap	= $( '<div id="overviewmap"></div>' );
	layout.container.append(overviewMap);

	bus.listen("layers-loaded", function() {
		var ol = new OpenLayers.Layer.WMS("Overview Map",
				config.wmsurl,
				{
					layers : config.layername,
					bgcolor: '0x404040'
				});
		var overview1 = new OpenLayers.Control.OverviewMap({
			div : document.getElementById('overviewmap'),
			size: new OpenLayers.Size(config.width, config.height),
			layers: [ol],
			mapOptions: {
				numZoomLevels: 1,
				maxExtent: new OpenLayers.Bounds(config.bbox[0],config.bbox[1],config.bbox[2],config.bbox[3]),
				tileSize: new OpenLayers.Size(config.tile_width, config.tile_height)
			}
		});
		map.addControl(overview1);
		map.restrictedExtent = new OpenLayers.Bounds(10830821.1599,836526.8376,12831636.8123,2715043.2447);
	});
});