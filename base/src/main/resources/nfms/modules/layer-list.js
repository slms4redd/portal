define([ "jquery", "message-bus", "layer-list-selector", "i18n", "jquery-ui", "fancy-box" , "bootstrap" ], function($, bus, layerListSelector, i18n) {
	
	// common id prexif 
	var groupHeadingPrefix			= "group-heading-";
	var groupCollapsePrefix			= "group-collapse-";
	var layerRowPrefix				= "row-layer-";
	var layerRowSettingsPrefix		= "row-layer-settings-";

	// map of active layers count
	var activeLayersCountMap		= {};

	
	// OLD
	var layerActions 	= new Array();
	var temporalLayers 	= new Array();
	var divLayers 		= null;
	bus.listen("register-layer-action", function (event, action) {
		layerActions.push(action);
	});

	divLayers = $("<div/>").attr("id", "all_layers");
	divLayers.addClass("ui-accordion-icons");
//	divLayers.accordion({
//		"animate" : false,
//		"heightStyle" : "content",
//		/*
//		 * Collapse all content since otherwise the accordion sets the 'display'
//		 * to 'block' instead than to 'table'
//		 */
//		"collapsible" : true,
//		"active" : false
//	});
	layerListSelector.registerLayerPanel("all_layers_selector", i18n.layers, divLayers);
	//	END OLD
	
	
	
	
	bus.listen("add-group", function(event, groupInfo) {
		
		// OLD 
		var divTitle, tblLayerGroup, parentId, tblParentLayerGroup, divContent;
		divTitle = $("<div/>").html(groupInfo.name).disableSelection();
		
		tblLayerGroup = $("<table/>");
		tblLayerGroup.attr("id", "group-content-table-" + groupInfo.id);
		
		// TODO
//		if (groupInfo.hasOwnProperty("infoLink")) {
//			infoButton = $('<a style="position:absolute;top:3px;right:4px;width:16px;height:16px;padding:0;" class="layer_info_button" href="' + groupInfo.infoLink + '"></a>');
//
//			// prevent accordion item from expanding
//			// when clicking on the info button
//			infoButton.click(function(event) {
//				event.stopPropagation()
//			});
//
//			infoButton.fancybox({
//				'autoScale' : false,
//				'openEffect' : 'elastic',
//				'closeEffect' : 'elastic',
//				'type' : 'ajax',
//				'overlayOpacity' : 0.5
//			});
//
//			divTitle.append(infoButton);
//		}

		if (groupInfo.hasOwnProperty("parentId")) {
			
			
//			var grp = layerListSelector.layersContainer.find( '.'+ groupCollapsePrefix + groupInfo.parentId );
//			var row = $( '<div class="row"/>' );
//			grp.append( row );
//			var col					= $( '<div class="col-md-12 sub-group-heading"></div>' );
//			col.html( groupInfo.name );
//			row.append( col );
//			
//			var rowLayers = $( '<div class="row"/>' );
//			grp.append( rowLayers );
//			
//			var colLayers	= $( '<div class="col-md-12" />' );
//			colLayers.addClass( groupCollapsePrefix + groupInfo.id );
//			rowLayers.append( colLayers );
			
			
			
			var groupContainer		= $( "#" + groupCollapsePrefix + groupInfo.parentId );
			var subGroupContainer	= $( '<div class="col-md-12 no-padding">' );
			subGroupContainer.attr( 'id' , groupCollapsePrefix + groupInfo.id );
			var subGroupPanel		= $( '<div class="panel-body no-padding">' );
			subGroupContainer.append( subGroupPanel );
			groupContainer.find( '.group-panel-body' ).append( subGroupContainer );
			
			var row					= $( '<div class="row" />' );
			subGroupPanel.append( row );
			var col					= $( '<div class="col-md-11 col-md-offset-1 sub-group-heading"></div>' );
			col.html( groupInfo.name );
			row.append( col );
//			
//			// OLD 
//			parentId = groupInfo.parentId;
//			tblParentLayerGroup = $("#group-content-table-" + parentId);
//			if (tblParentLayerGroup.length == 0) {
////				bus.send("error", "Group " + groupInfo.name + " references nonexistent group: " + parentId);
//			}
//			tblParentLayerGroup.append(divTitle).append(tblLayerGroup);
			
		} else {
//			var headingId	= groupHeadingPrefix + groupInfo.id;
//			var row = $( '<div class="row"/>' );
//			row.addClass( groupHeadingPrefix + groupInfo.id );
//			layerListSelector.layersContainer.append( row );
//			
//			var colLeft	= $( '<div class="col-md-1 col-sm-1" />' );
//			row.append( colLeft );
//			
//			var colBtn	= $( '<div class="col-md-10 col-sm-10 no-padding group-heading-btn" />' );
//			row.append( colBtn );
//			var btnGroup = $( '<button class="btn btn-default" />' );
//			btnGroup.click( function(){
//				bus.send( "group-toggle-visibility",  groupInfo.id );
//			});
//			btnGroup.append( '<i class="fa fa-caret-right" style="padding: 0 5px 3px 0; font-size:10px;opacity: 0.5;"></i>' );
//			btnGroup.append( groupInfo.name );
//			colBtn.append( btnGroup );
//			var colBadge	= $( '<div class="col-md-1 col-sm-1 no-padding group-count" />' );
//			row.append( colBadge );
//
//			
//			var rowLayers = $( '<div class="row"/>' );
//			layerListSelector.layersContainer.append( rowLayers );
//			
//			var colLayers	= $( '<div class="col-md-11 col-md-offset-1 group-content" />' );
//			colLayers.addClass( groupCollapsePrefix + groupInfo.id );
//			rowLayers.append( colLayers );
//			
			
			// see http://getbootstrap.com/javascript/#collapse-example-accordion
			var panel	= $( '<div class="panel width100" />' );
			layerListSelector.layersContainer.append( panel );
			
			
			var headingId	= groupHeadingPrefix + groupInfo.id;
			var heading 	= $( '<div class="panel-heading" role="tab" />' ).attr( 'id' , headingId ) ;
			panel.append( heading );
			
			var rowHeading = $( '<div class="row"/>' );
			heading.append( rowHeading );
			var h4 		= $( '<div class="col-md-10 col-md-offset-1 panel-title no-padding" />' );
			rowHeading.append( h4 );

			var collapseId 	= groupCollapsePrefix + groupInfo.id;
			var btn			= $( '<button class="btn btn-default" data-toggle="collapse" data-parent="#group-accordion" aria-expanded="true" />' );
			btn.attr( 'href' , "#" + collapseId );
			btn.attr( 'aria-controls' , collapseId );
			btn.append( '<i class="fa fa-caret-right" style="padding: 0 5px 3px 0; font-size:10px;opacity: 0.5;"></i>' );
			btn.append( groupInfo.name );
			btn.append( '<span class="badge">0</span>' );
			h4.append( btn );
			
			var content	= $( '<div class="panel-collapse collapse" role="tabpanel" />' );
			content.attr( 'id' , collapseId );
			content.attr( 'aria-labelledby' , headingId );
			panel.append( content );
			
			var panelBody = $( '<div class="panel-body group-panel-body" />' );
			content.append( panelBody );
			
			
			
			
			
		}
	});

	bus.listen("add-layer", function(event, portalLayer) {
		var group	= $( "#" + groupCollapsePrefix + portalLayer.groupInfo.id );
//		var group		= $( "." + groupCollapsePrefix + portalLayer.groupInfo.id );
		
		if (group.length == 0) {
			
			bus.send( "error", "Layer " + portalLayer.label + " references nonexistent group: " + portalLayer.groupInfo.id );
			
		} else {
			var groupContainerBody	= group.find( '.panel-body' );
			
			
			
			var row					= $( '<div class="row row-layer" />' );
			row.attr( 'id' , layerRowPrefix + portalLayer.id );
			groupContainerBody.append( row );

			var settings				= $( '<div class="col-md-1 settings no-padding" />' );
			row.append( settings );
			
			var layer				= $( '<div class="col-md-10 layer" />' );
			row.append( layer );
			
			var dashboard			= $( '<div class="col-md-1 no-padding dashboard" />' );
			row.append( dashboard );
			
			if ( portalLayer.isPlaceholder ){
				
				var divLabel	= $( '<div class="width100 layer-placeholder"/>' );
				divLabel.html( portalLayer.label );
				layer.append( divLabel );
				
			} else {
				//add settings button
				var settingsBtn     = $( '<button class="btn btn-transparent"><i class="fa fa-sliders"></i></button>');
				settings.append( settingsBtn );
				settingsBtn.click(function(){
					var toggle	= ! $( '#'+layerRowSettingsPrefix + portalLayer.id).is( ':visible' );
					bus.send( "layer-toggle-settings" , [portalLayer.id, toggle] );
					
					settingsBtn.blur();
				});
				
				// add layer button
				var btnLayer 			= $( '<button class="btn btn-default"></button>' );
				btnLayer.html( portalLayer.label );
				btnLayer.click(function(e){
					btnLayer.toggleClass( "active" );
					bus.send("layer-visibility", [ portalLayer.id, btnLayer.hasClass("active") ]);
					bus.send("layer-update-active-count" , [portalLayer.id ,  btnLayer.hasClass("active") , portalLayer.groupInfo] );

					btnLayer.blur();
				});
				layer.append( btnLayer );
				
				// add dashboard button
				if( portalLayer.hasDashboard ){
//					var dashboardBtn = $( '<button class="btn btn-transparent"><i class="fa fa-info-circle"></button>' );
//					var dashboardBtn = $( '<button class="btn btn-transparent"><span class="fa-stack"><i class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-tachometer fa-stack-1x"></i></span></button>' );
					var dashboardBtn = $( '<button class="btn btn-transparent"><i class="fa fa-tachometer"></i></button>' );
					dashboard.append( dashboardBtn );
					
					dashboardBtn.click(function(){
						bus.send( "open-layer-dashboard-info" , portalLayer );
						
						dashboardBtn.blur();
					});
					
				}
				
				// add settings row
				var rowLayerSettings	= $( '<div class="row row-layers-settings" />' );
				rowLayerSettings.attr( 'id' , layerRowSettingsPrefix + portalLayer.id );
				groupContainerBody.append( rowLayerSettings );
				
				// add transparency settings row
				var rowSettings = $( '<div class="row layer-transparency" />' );
				rowLayerSettings.append( rowSettings );
				
				var colSettingsIcon = $( '<div class="col-md-offset-1 col-md-1 row-layer-settings-icon no-padding" />' );
				colSettingsIcon.append( '<i class="fa fa-adjust"></i>' );
				rowSettings.append( colSettingsIcon );
				
				var colSettingsOpacitySlider = $( '<div class="col-md-9 row-layer-settings-slider no-padding" />' );
				rowSettings.append( colSettingsOpacitySlider );

				colSettingsOpacitySlider.slider({
					min : 0,
					max : 100,
					value : 100,
					slide : function(event, ui) {
						bus.send("transparency-slider-changed", [ portalLayer.id, ui.value / 100 ]);
					}
				});
	
				
				// after adding a layer, bus sends: layer-update-active-count , add-layer-timestamp
				bus.send( "layer-update-active-count" , [portalLayer.id , portalLayer.active||false , portalLayer.groupInfo, true] );
				bus.send( "add-layer-timestamp" , [portalLayer] );
				
			}
			
		}
		
		
		//OLD
		var tblLayerGroup, trLayer, tdLegend, tdVisibility, divCheckbox, tdName, tdInfo, aLink, inlineLegend;
		tblLayerGroup = $( "#group-content-table-" + portalLayer.groupInfo.id );
		if ( tblLayerGroup.length == 0 ){
//			bus.send("error", "Layer " + portalLayer.label + " references nonexistent group: " + portalLayer.groupInfo.id);
		} else {
			trLayer = $("<tr/>").attr("id", "layer-row-" + portalLayer.id).addClass("layer_row");

			tdLegend = $("<td/>").addClass("layer_legend");

			if (portalLayer.hasOwnProperty("inlineLegendUrl")) {
				// context has an inline legend
				// tdLegend = $('<td
				// style="width:20px">');
				// inlineLegend = $('<img
				// class="inline-legend" src="' +
				// UNREDD.wmsServers[0] +
				// contextConf.inlineLegendUrl + '">');
				inlineLegend = $('<img class="inline-legend" src="' + portalLayer.inlineLegendUrl + '">');
				tdLegend.append(inlineLegend);
			} else {
				var wmsLayersWithLegend = portalLayer.wmsLayers.filter(function(layer) {
					return layer.hasOwnProperty("legend");
				});
				var wmsLayerWithLegend = wmsLayersWithLegend[0];

				if (wmsLayerWithLegend) {
					inlineLegend = $("<td/>");
					inlineLegend.addClass("inline-legend-button");

					if (portalLayer.active) {
						inlineLegend.addClass("visible");
					}

					bus.listen("layer-visibility", function(event, layerId, visibility) {
						if (layerId != portalLayer.id) {
							return;
						}

						if (visibility) {
							inlineLegend.addClass("visible");
						} else {
							inlineLegend.removeClass("visible");
						}
					});

					inlineLegend.click(function() {
						if ($("#" + portalLayer.id + "_visibility_checkbox").hasClass("checked")) {
							bus.send("open-legend", wmsLayerWithLegend.id);
						}
					});

					tdLegend.append(inlineLegend);
				}
			}
			trLayer.append(tdLegend);

			tdVisibility = $("<td/>").css("width", "16px");
			divCheckbox = $("<div/>").attr("id", portalLayer.id + "_visibility_checkbox").addClass("layer_visibility");
			if (portalLayer.active) {
				divCheckbox.addClass("checked");
			}
			divCheckbox.mousedown(function() {
				divCheckbox.addClass("mousedown");
			}).mouseup(function() {
				divCheckbox.removeClass("mousedown");
			}).mouseenter(function() {
				divCheckbox.addClass("in");
			}).mouseleave(function() {
				divCheckbox.removeClass("in");
			}).click(function() {
				divCheckbox.toggleClass("checked");
				bus.send("layer-visibility", [ portalLayer.id, divCheckbox.hasClass("checked") ]);
			});

			if (!portalLayer.isPlaceholder) {
				tdVisibility.append(divCheckbox);
			}

			trLayer.append(tdVisibility);

			tdName = $("<td/>").addClass("layer_name");
			tdName.html(portalLayer.label);
			trLayer.append(tdName);

			for (var i = 0; i < layerActions.length; i++) {
				var layerAction = layerActions[i];
				var element = layerAction(portalLayer);
				tdAction = $("<td/>").addClass("layer_action").appendTo(trLayer);
				if (element != null) {
					tdAction.append(element);
				}
			}

			$.each(portalLayer.wmsLayers, function(index, wmsLayer) {
				if (wmsLayer.hasOwnProperty("timestamps")) {
					temporalLayers.push(wmsLayer);
				}
			});

			tblLayerGroup.append(trLayer);
			divLayers.accordion("refresh");
		}
	});

	bus.listen("layer-visibility", function(event, layerId, visible) {
		var row	= $( '#' + layerRowPrefix + layerId );
		var btn = row.find( '.layer button' );
		// enable/disable setting button
		var settingsBtn		= $( '#' + layerRowPrefix + layerId).find( '.settings button' );
		var dashboardBtn	= $( '#' + layerRowPrefix + layerId).find( '.dashboard button' );

		if( visible ){
			btn.addClass( "active" );
			
			// settings methods
			// enable settings button
			settingsBtn.prop( 'disabled' , false );
			dashboardBtn.prop( 'disabled' , false );
		} else {
			btn.removeClass( 'active' );
			
			// settings methods
			// hide settings button if visible
			bus.send( "layer-toggle-settings", [ layerId , false ] );
			// disable setting button
			settingsBtn.prop( 'disabled' , true );
			dashboardBtn.prop( 'disabled' , true );
		}
		
		// OLD
		var divCheckbox = $("#" + layerId + "_visibility_checkbox");
		if (visible) {
			divCheckbox.addClass("checked");
		} else {
			divCheckbox.removeClass("checked");
		}
		
	});
	
	// settings methods
	bus.listen( "layer-toggle-settings" , function( event, layerId, showLayer ){
		var settingsRow	= $( '#' + layerRowSettingsPrefix + layerId );
//		var settingsBtn		= $( '#' + layerRowPrefix + layerId).find( '.settings button' );

		if( showLayer ){
			settingsRow.slideDown();
		} else {
			settingsRow.slideUp();
		}
		
	});
	
	bus.listen("layer-update-active-count" , function(event, layerId , active , groupInfo, incrementOnly){
		var groupId = ( groupInfo.hasOwnProperty("parentId") ) ? groupInfo.parentId : groupInfo.id;
		var count = activeLayersCountMap[ groupId ];
		if(count){
			if( active ){
				count += 1;
			} else if(!incrementOnly) {
				count -=1;
			}
		} else {
			if( active ){
				count = 1;
			} else if(!incrementOnly) {
				count = 0;
			}
		}
		activeLayersCountMap[ groupId ] = count;
//		var span = $( '.' + groupHeadingPrefix + groupId ).find( '.group-count' );
		var span = $( '#' + groupHeadingPrefix + groupId ).find( 'button span[class=badge]' );

		span.stop().animate( {opacity: "0"}, 400 , function(){
			span.html( count );
			span.animate( {opacity: "1"}, 200);
		});
		
	});
	
	
//	bus.listen("time-slider.selection", function(event, date) {
//		for (var i = 0; i < temporalLayers.length; i++) {
//			var layer = temporalLayers[i];
//			var timestamps = layer.timestamps;
//			var closestPrevious = null;
//			timestamps.sort();
//			for (var j = 0; j < timestamps.length; j++) {
//				var timestampString = timestamps[j];
//				var timestamp = new Date();
//				timestamp.setISO8601(timestampString);
//				if (timestamp <= date) {
//					closestPrevious = timestamp;
//				} else {
//					break;
//				}
//			}
//
//			if (closestPrevious == null) {
//				closestPrevious = new Date();
//				closestPrevious.setISO8601(timestamps[0]);
//			}
//
//			var tdLayerName = $("#layer-row-" + layer.id + " .layer_name");
//			tdLayerName.find("span").remove();
//			$("<span/>").html(" (" + closestPrevious.getUTCFullYear() + ")").appendTo(tdLayerName);
//
//			bus.send("layer-timestamp-selected", [ layer.id, closestPrevious ]);
//		}
//	});
	
//	bus.listen("layer-time-slider.selection", function(event, layerid, date) {
//		var tdLayerName = $("#layer-row-" + layerid + " .layer_name");
//		tdLayerName.find("span").remove();
//		$("<span/>").html(" (" + date.getUTCFullYear() + ")").appendTo(tdLayerName);
//
//	});
	
	// returns settings layer
	return {
		layerRowPrefix				: layerRowPrefix ,
		layerRowSettingsPrefix		: layerRowSettingsPrefix
	};
});
