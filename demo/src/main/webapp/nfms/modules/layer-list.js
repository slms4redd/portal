define([ "jquery", "message-bus", "layer-list-selector", "i18n", "dashboard", "bootstrap" ], function($, bus, layerListSelector, i18n, dashboard) {
	
	// common id prexif 
	var groupHeadingPrefix			= "group-heading-";
	var groupCollapsePrefix			= "group-collapse-";
	var layerRowPrefix				= "row-layer-";
	var layerRowSettingsPrefix		= "row-layer-settings-";
	var layerRowDropdownPrefix		= "row-layer-dropdown-";

	// map of active layers count
	var activeLayersCountMap		= {};
	// map of active dropdown layers
	var activeDropDownLayers		= {};
	
	var defaultLayersOpenDashboard   = new Array();
	
	bus.listen("add-group", function(event, groupInfo) {
		
		if( groupInfo.visible === false ){
			// nothing
			
		} else {
			
			if( groupInfo.hasOwnProperty("parentId") ){
				
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
				
				// add drop-down menu in case it's mutually exclusive
				if( groupInfo.mutuallyExclusive === true ){

					row					= $( '<div class="row" />' );
					row.addClass( layerRowDropdownPrefix + groupInfo.id );
					subGroupPanel.append( row );

					var settings		= $( '<div class="col-md-1 col-sm-2 settings no-padding hidden-xs" />' );
					row.append( settings );
					var settingsBtn     = $( '<button class="btn btn-transparent"><i class="fa fa-sliders"></i></button>');
					settings.append( settingsBtn );
					settingsBtn.click(function(){
						bus.send( "layer-dropdown-settings-click" , groupInfo );
						settingsBtn.blur();
					});
					settingsBtn.hide();
					
					col					= $( '<div class="col-md-9 col-sm-8 col-xs-12 group-dropdown layer"></div>' );
					row.append( col );
					
					var btnGroup = $( '<div class="btn-group width100"><button type="button" class="btn label-btn">'+ i18n['none'] +'</button>'+
						      '<button type="button" class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">'+
						       '<span class="caret"></span>'+
						      '</button>'+
						      '<ul class="dropdown-menu" role="menu">'+
//						        '<li><button class="btn btn-default none">' + i18n['none'] + '</button></li>'+
						        '</ul>'+
						    '</div>' );
					col.append( btnGroup );
					
//					btnGroup.find( 'button.none' ).click( function(){
//						bus.send( "layer-dropdown-select" , [groupInfo , null] );
//					});
//					btnGroup.find( 'button.none' ).prop( 'disabled' , true );
					var btnLabel = btnGroup.find( 'button.label-btn' );
					btnLabel.click( function(e){
						e.preventDefault();
						var portalLayer = null;
						if( !btnLabel.hasClass('active') ){
							portalLayer = activeDropDownLayers[ groupInfo.id ];
						}
						bus.send( "layer-dropdown-select" , [groupInfo , portalLayer ] );
					});
				}
				
				// add dashboard link buttons
				var dashboardBtnsCol		= $( '<div class="col-md-2 hidden-xs hidden-sm no-padding dashboard-btn" />' );
				row.append( dashboardBtnsCol );
				
				var addDashboardBtn = function( id , btn , type ){
					btn.addClass( 'dashboard-group-btn-' + id );
					dashboardBtnsCol.append( btn );
					
					btn.click(function(){
						bus.send( "layer-dropdown-dashboard-click" , [groupInfo , type] );
						btn.blur();
					});
					btn.hide();
				};
				
				var legendBtn = $( '<button class="btn btn-transparent legend-btn"><i class="fa fa-list-ul"></i></button>' );
				addDashboardBtn( groupInfo.id, legendBtn , dashboard.TYPE.LEGEND );
				
				var infoBtn = $( '<button class="btn btn-transparent info-btn"><i class="fa fa-info-circle"></i></button>' );
				addDashboardBtn( groupInfo.id, infoBtn , dashboard.TYPE.INFO );
				
			} else {
				
				// see http://getbootstrap.com/javascript/#collapse-example-accordion
				var panel	= $( '<div class="panel width100" />' );
				layerListSelector.layersContainer.append( panel );
				
				
				var headingId	= groupHeadingPrefix + groupInfo.id;
				var heading 	= $( '<div class="panel-heading" role="tab" />' ).attr( 'id' , headingId ) ;
				panel.append( heading );
				
				var rowHeading = $( '<div class="row"/>' );
				heading.append( rowHeading );
				var colBtn 		= $( '<div class="col-md-9 col-md-offset-1 col-xs-12 col-sm-12 panel-title no-padding" />' );
				rowHeading.append( colBtn );
	
				var collapseId 	= groupCollapsePrefix + groupInfo.id;
				var btn			= $( '<button class="btn btn-default" data-toggle="collapse" aria-expanded="true" />' );
				btn.attr( 'href' , "#" + collapseId );
				btn.attr( 'aria-controls' , collapseId );
				btn.append( '<i class="fa fa-caret-right" style="padding: 0 5px 3px 0; font-size:10px;opacity: 0.5;"></i>' );
				btn.append( groupInfo.name );
				btn.append( '<span class="badge">0</span>' );
				colBtn.append( btn );
				
				
				// add dashboard link buttons
				var dashboardBtnsCol		= $( '<div class="col-md-2 hidden-xs hidden-sm no-padding dashboard-btn" />' );
				rowHeading.append( dashboardBtnsCol );
				
				var addDashboardBtn = function( id , btn , type ){
					btn.addClass( 'dashboard-group-btn-' + id );
					dashboardBtnsCol.append( btn );
					
					btn.click(function(){
						bus.send( 'highlight-dashboard-element' , [ id, type, dashboard.SOURCE.LAYERS] );
						btn.blur();
					});
				};
				
				if( groupInfo.legendLink ){
					var dashboardBtn = $( '<button class="btn btn-transparent"><i class="fa fa-list-ul"></i></button>' );
					addDashboardBtn( groupInfo.id, dashboardBtn , dashboard.TYPE.LEGEND );
				}
				if( groupInfo.infoLink ){
					var dashboardBtn = $( '<button class="btn btn-transparent"><i class="fa fa-info-circle"></i></button>' );
					addDashboardBtn( groupInfo.id, dashboardBtn , dashboard.TYPE.INFO );
				}
				
				// add layers container
				var content	= $( '<div class="panel-collapse collapse" role="tabpanel" />' );
				content.attr( 'id' , collapseId );
				content.attr( 'aria-labelledby' , headingId );
				panel.append( content );
				
				if( groupInfo.open ){
					setTimeout( function(){
						content.collapse(  'show' );
					}, 500 );
				}
				
				var panelBody = $( '<div class="panel-body group-panel-body" />' );
				content.append( panelBody );
			}
			
		}
	});
	
	bus.listen("add-layer", function(event, portalLayer) {
		
		var visible 			= true;
		var mutuallyExclusive 	= false;
		if( portalLayer.groupInfo.hasOwnProperty("parentGroupInfo") ){
			visible = portalLayer.groupInfo.parentGroupInfo.visible;
			mutuallyExclusive = portalLayer.groupInfo.mutuallyExclusive;
		} else {
			visible = portalLayer.groupInfo.visible;
		}

		if( visible ){
			
			var group	= $( "#" + groupCollapsePrefix + portalLayer.groupInfo.id );
			
			if (group.length == 0) {
				bus.send( "error", "Layer " + portalLayer.label + " references nonexistent group: " + portalLayer.groupInfo.id );
			} else {
				
				var groupContainerBody	= group.find( '.panel-body' );
				
				
				if( mutuallyExclusive ){
					var dropDownDiv = groupContainerBody.find( '.group-dropdown' );
					var dropDown	= dropDownDiv.find( 'ul.dropdown-menu' );

					var li 			= $( '<li></li>' );
					dropDown.append( li );

					var btnLi 		= $( '<button class="btn btn-default"></button>' );
					btnLi.addClass( portalLayer.id );
					btnLi.html( portalLayer.label );
					li.append( btnLi );
					
					// if it's first child
					if( dropDown.children().length == 1 ){
						// add first item to the drop down
						activeDropDownLayers[ portalLayer.groupInfo.id ] = portalLayer;
						var btnLabel	= dropDownDiv.find( 'button.label-btn' );
						btnLabel.html( portalLayer.label );
						
						btnLi.hide();
					}
					
					btnLi.click( function(){
//						console.log( portalLayer );
						bus.send( "layer-dropdown-select" , [portalLayer.groupInfo , portalLayer ] );
					});
					
				} else {
					
					var row					= $( '<div class="row row-layer" />' );
					row.attr( 'id' , layerRowPrefix + portalLayer.id );
					groupContainerBody.append( row );
					
					var settings				= $( '<div class="col-md-1 settings no-padding hidden-xs hidden-sm" />' );
					row.append( settings );
					
					var layer					= $( '<div class="col-md-9 col-sm-12 col-xs-12 layer" />' );
					row.append( layer );
					
					var dashboardBtnsCol		= $( '<div class="col-md-2 hidden-xs hidden-sm no-padding dashboard-btn" />' );
					row.append( dashboardBtnsCol );
					
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
						var addBtn = function( btn , id , type ){
							dashboardBtnsCol.append( btn );
							
							dashboardBtn.click(function(){
								bus.send( 'highlight-dashboard-element' , [ id, type, dashboard.SOURCE.LAYERS] );
								btn.blur();
							});
							
						};
						if( portalLayer.legendLink ){
							var dashboardBtn = $( '<button class="btn btn-transparent"><i class="fa fa-list-ul"></i></button>' );
							addBtn( dashboardBtn , portalLayer.id, dashboard.TYPE.LEGEND );
						}
						if( portalLayer.infoLink ){
							var dashboardBtn = $( '<button class="btn btn-transparent"><i class="fa fa-info-circle"></i></button>' );
							addBtn( dashboardBtn , portalLayer.id, dashboard.TYPE.INFO );
						}
						
					}
				}
				
				
				
				// add settings
				if( !portalLayer.isPlaceholder) {
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
					
					
					if( portalLayer.openDashboard ){
						defaultLayersOpenDashboard.push( portalLayer ); 
					}
				}
				
				
				
			}

		}
		
	});

	bus.listen("layer-visibility", function(event, layerId, visible) {
		var row	= $( '#' + layerRowPrefix + layerId );
		var btn = row.find( '.layer button' );
		// enable/disable setting button
		var settingsBtn		= $( '#' + layerRowPrefix + layerId).find( '.settings button' );
		var dashboardBtn	= $( '#' + layerRowPrefix + layerId).find( '.dashboard-btn button' );

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
		
		
	});
	
	
	bus.listen( "layer-dropdown-select" , function( event, group , layer ){
		
		var activeLayer = activeDropDownLayers[ group.id ];
		if( activeLayer ){
			// hide current active layer
			bus.send( "layer-visibility" , [activeLayer.id , false] );
			bus.send( "layer-update-active-count" , [activeLayer.id , false, group] );
			bus.send( "layer-toggle-settings" , [activeLayer.id , false] );
		}

		// init ui elements
		var row 		= $( '.' + layerRowDropdownPrefix + group.id );
		var btnGroup	= row.find( 'div.group-dropdown div.btn-group' );
		var btnLabel	= btnGroup.find( 'button.label-btn' );
		var btnDropdown	= btnGroup.find( 'button.dropdown-toggle' );
	
		// reset dropdown menu
		var layerBtns		= btnGroup.find( 'ul li button' );
//		layerBtns.prop( 'disabled' , false );
//		activeDropDownLayers[ group.id ] = null;
		
		row.find( 'div.settings button' ).hide();
		row.find( 'div.dashboard-btn button' ).hide();
		btnLabel.removeClass( 'active' );
		btnDropdown.removeClass( 'active' );
		
		if( layer ){
			activeDropDownLayers[ group.id ] = layer;
			bus.send( "layer-visibility" , [layer.id , true] );
			bus.send( "layer-update-active-count" , [layer.id , true, group] );
			
			btnLabel.addClass( 'active' );
			btnDropdown.addClass( 'active' );
			btnLabel.html( layer.label );
			
			var layerBtn	= btnGroup.find( 'ul li button.' + layer.id );
//			layerBtn.prop(  'disabled' , true );
			layerBtns.show();
			layerBtn.hide();
			
			row.find( 'div.settings button' ).fadeIn( 200 );
			if( layer.hasOwnProperty('legendLink') ){
				row.find( 'div.dashboard-btn button.legend-btn' ).fadeIn( 200 );
			}
			if( layer.hasOwnProperty('infoLink') ){
				row.find( 'div.dashboard-btn button.info-btn' ).fadeIn( 200 );
			}
//			if( layer.hasDashboard ){
//				row.find( 'div.dashboard-btn button' ).fadeIn( 200 );
//			}
		} else {
//			btnLabel.html( i18n['none'] );
			
//			var emptyBtn	= btnGroup.find( 'ul li button.none' );
//			emptyBtn.prop(  'disabled' , true );
		}
	});
	
	bus.listen( "layer-dropdown-settings-click" , function( event, group ){
		var activeLayer = activeDropDownLayers[ group.id ];
		if( activeLayer ){
			var toggle	= ! $( '#'+layerRowSettingsPrefix + activeLayer.id).is( ':visible' );
			bus.send( "layer-toggle-settings" , [activeLayer.id , toggle] );
		}
	});
	
	bus.listen( "layer-dropdown-dashboard-click" , function( event, group, type ){
		var activeLayer = activeDropDownLayers[ group.id ];
		if( activeLayer ){
			bus.send( 'highlight-dashboard-element' , [ activeLayer.id, type, dashboard.SOURCE.LAYERS] );
		}
	});
	
	// settings methods
	bus.listen( "layer-toggle-settings" , function( event, layerId, showLayer ){
		var settingsRow	= $( '#' + layerRowSettingsPrefix + layerId );

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
		var span = $( '#' + groupHeadingPrefix + groupId ).find( 'button span[class=badge]' );

		span.stop().animate( {opacity: "0"}, 400 , function(){
			span.html( count );
			span.animate( {opacity: "1"}, 200);
		});
		
		bus.send( "group-active-layers-changed" , [groupId , count] );
	});
	
	bus.listen( "group-active-layers-changed" , function(event , groupId , count){
		var disabled = ( count > 0 ) ? false : true;
		var dashboardBtn = $( '.dashboard-group-btn-' + groupId );
		dashboardBtn.prop( 'disabled' , disabled );
	});
	
	bus.listen( "layers-loaded" , function(event) {
		if( defaultLayersOpenDashboard.length > 0 ){
			setTimeout( function(){
			
				$.each( defaultLayersOpenDashboard , function(i, layer){
					bus.send( "open-layer-dashboard" , layer.id );
				});

			}, 500 );
		}
	});
	
	// returns settings layer
	return {
		layerRowPrefix				: layerRowPrefix ,
		layerRowSettingsPrefix		: layerRowSettingsPrefix
	};
});
