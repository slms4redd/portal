define([ "jquery", "message-bus", "customization", "module" , "i18n" ], function($, bus, customization, module, i18n) {
	
	var groups = [];
	
	var findById = function(array, id) {
		return $.grep(array, function(l) {
			return l.id === id;
		});
	};

	var processGroup = function(layerRoot, parentId, group) {
		var item, portalLayers, portalLayer, wmsLayerIds,
			wmsLayers, wmsLayer, i, j, layerInfoArray;

		var groupInfo = {
			"id" 				: group.id,
			"name" 				: group.label,
			"visible"			: ( group.visible === false ) ? false : true,
			"mutuallyExclusive" : ( group.mutuallyExclusive === true ) ? true : false,
			"open"				: ( group.open === true ) ? true : false,
			"hasDashboard"		: false
		};
		groups[group.id] = groupInfo;
		
		if ( group.hasOwnProperty("infoFile") ){
			groupInfo.infoLink = "static/loc/" + customization.languageCode + "/html/" + group.infoFile;
			groupInfo.hasDashboard = true;
		}
		if ( group.hasOwnProperty("legendFile") ){
			groupInfo.legendLink = "static/loc/" + customization.languageCode + "/html/" + group.legendFile;
			groupInfo.hasDashboard = true;
		}

		if ( parentId !== null ){
			groupInfo.parentId = parentId;
			groupInfo.parentGroupInfo = groups[ parentId ];
		}

		bus.send( "add-group", groupInfo );

		for (i = 0; i < group.items.length; i++) {
			item = group.items[i];
			if (typeof item === 'object') {
				processGroup(layerRoot, group.id, item);
			} else {
				portalLayers = findById(layerRoot.portalLayers, item);
				if (portalLayers.length !== 1) {
					bus.send("error", "One (and only one) portal layer with id '" + item + "' expected");
					continue;
				}

				portalLayer = portalLayers[0];
				
				
				// CHECK IF the CURRENT portalLayer is a PLACEHOLDER
				// if no layers(wmsLayers) are defined in portalLayers means that the portalLayer
				// is just a placeholder in the layer menu, used to store generic info 
				portalLayer.isPlaceholder = (portalLayer.layers === undefined) || (portalLayer.layers.length === 0); 

				if (portalLayer.hasOwnProperty("infoFile")) {
					portalLayer.infoLink = "static/loc/" + customization.languageCode + "/html/" + portalLayer.infoFile;
				}
				
				if (portalLayer.hasOwnProperty("legendFile")) {
					portalLayer.legendLink = "static/loc/" + customization.languageCode + "/html/" + portalLayer.legendFile;
				} else if (portalLayer.hasOwnProperty("inlineLegendUrl") ){
					portalLayer.legendLink = portalLayer.inlineLegendUrl;
				}
				
				// check if layer has dashboard enabled
				portalLayer.hasDashboard = false;
				
				if (portalLayer.hasOwnProperty("legendLink") || portalLayer.hasOwnProperty("infoFile") ) {
					portalLayer.hasDashboard = true;
				}
				
				
				wmsLayerIds = (portalLayer.isPlaceholder)?null:portalLayer.layers;

				layerInfoArray = [];

				// Iterate over wms layers 
				for (j = 0; !portalLayer.isPlaceholder && j < wmsLayerIds.length; j++) {
					wmsLayers = findById(layerRoot.wmsLayers, wmsLayerIds[j]);
					if (wmsLayers.length === 0) {
						bus.send("error", "At least one layer with id '" + wmsLayerIds[j] + "' expected");
						continue;
					}
					wmsLayer = wmsLayers[0];
					if (wmsLayer.hasOwnProperty("wmsTime")) {
						wmsLayer.timestamps = wmsLayer.wmsTime.split(",")
					}
                    wmsLayer.zIndex = layerRoot.wmsLayers.indexOf(wmsLayer);

//                  if( wmsLayer.hasOwnProperty("legend") || wmsLayer.queryable){
                    if( wmsLayer.hasOwnProperty("legend") ){
                    	portalLayer.hasDashboard = true;
                    }
                    
					layerInfoArray.push(wmsLayer);
				}
				//deprecated
				portalLayer.groupId 	= group.id;
				
				portalLayer.groupInfo	= groupInfo;
				portalLayer.wmsLayers 	= layerInfoArray;

				bus.send("add-layer", portalLayer);
				bus.send("layer-visibility", [ portalLayer.id, portalLayer.active || false ]);
			}
			
		}
		
		if( group.helpMsg ){
			var groupDiv 	= $( "#group-collapse-" + group.id );
			var panel 		= groupDiv.find( '.panel-body:first-child' );
			var row 		= $( '<div class="row row-group-help-msg hidden-xs">' );
			panel.append( row );
			var col 		= $( '<div class="col-md-10 col-sm-12 col-md-offset-1">' ) ;
			row.append( col );
			col.html( i18n[ group.helpMsg ] );
		}
	};


	bus.listen("modules-loaded", function() {
		var layerRoot 	= module.config();
		var groups 		= layerRoot.groups;

		bus.send("before-adding-layers");
		
		for (var i = 0; i < groups.length; i++) {
			processGroup(layerRoot, null, groups[i]);
		}
		
		bus.send("layers-loaded");
	});

});
