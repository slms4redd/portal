define([ "jquery", "message-bus", "layer-list-selector", "i18n" ,"customization" ,"module", "i18nUtils","jquery-color","jquery-easing" ], function($, bus, layerListSelector, i18n, customization , module ) {
	
	
	
	var config = module.config();
//	var iconOpened = '<span class="fa-stack"><i class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-angle-double-right fa-stack-1x"></i></span>' ;
//	var iconClosed = '<span class="fa-stack"><i class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-tachometer fa-stack-1x"></i></span>' ;
	var iconOpened = '<i class="fa fa-angle-double-right"></i>' ;
	var iconClosed = '<i class="fa fa-tachometer"></i>' ;

	
	var dashboard = $( '<div class="row dashboard height100"></div>' );
	
	layerListSelector.layersDashboardContainer.append( dashboard );
		
//	var dashboardToggle = $( '<div class="col-md-1 no-padding"></div>' )
//	dashboard.append( dashboardToggle );
	
//	var btnCollapse = $( '<button class="btn btn-collapse">' + iconClosed + '</button>' );
	var btnCollapse = $( '<button class="btn btn-collapse">' + iconOpened + '</button>' );
//	dashboardToggle.append( btnCollapse );
	
	btnCollapse.click( function(e){
		bus.send( "layers-dashboard-toggle-visibility" );
		btnCollapse.blur();
	});
	
	var dashboardContainer	= $( '<div class="col-md-12 height100 dashboard-container"></div>' );
	dashboard.append( dashboardContainer );
	
	var rowHeader	= $( '<div class="row dashboard-header height10"></div>')
//	dashboardContainer.append( rowHeader );
	var colHeader	= $( '<div class="col-md-12"></div>' );
//	rowHeader.append( dashboardToggle );
	rowHeader.append( colHeader );
	
	colHeader.append( btnCollapse );
	
//	var dashboardToggle = $( '<div class="dashboard-toggle"></div>' );
//	dashboardToggle.append( btnCollapse );
//	colHeader.append( dashboardToggle );
//	
	var btnGroup = $( '<div class="btn-group"><button type="button" class="btn layer-label">- Select Layer</button>'+
      '<button type="button" class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">'+
       '<span class="caret"></span>'+
//        '<span class="sr-only">Toggle Dropdown</span>'+
      '</button>'+
      '<ul class="dropdown-menu" role="menu">'+
//        '<li><button class="btn btn-default">layer 1</button></li>'+
//        '<li><button class="btn btn-default">layer 2</button></li>'+
        '</ul>'+
    '</div>' );

	colHeader.append( btnGroup );
	btnGroup.hide();
	
	var layerLabel = $( '<div class="layer-label"></div>' );
	colHeader.append( layerLabel );
//	layerLabel.hi
	
	dashboard.css( 'right' , '-' + (dashboard.width() ) +'px' );
//	dashboard.css( 'right' , '-' + (dashboard.width() - dashboardToggle.width() ) +'px' );
	dashboard.addClass( 'closed' );
//	dashboard.animate( {'opacity':0.9}, 300 );
	
	
	// add dashboard content
	var dashboardBtnBar = $( '<div class="row dashboard-btn-bar"></div>' );
	dashboardContainer.append( dashboardBtnBar );
	var dashboardBtnBarCol	= $( '<div class="col-md-12 heigth100"></div>' );
	dashboardBtnBar.append( dashboardBtnBarCol );
	dashboardBtnBarCol.append( btnCollapse );
	
	var divNav = $( '<div class="width100 height100 dashboard-content-selector"></div>' );
	dashboardBtnBarCol.append( divNav );
	var ul = $( '<ul class="nav nav-tabs nav-justified"></ul>' );
	divNav.append( ul );
	
	var liLegend = $( '<li></li>' );
	ul.append( liLegend );
	var btnLegend = $( '<button class="btn btn-default"><i class="fa fa-th-list"></i> Legend</button>' );
	btnLegend.click( function(){
		showLegend();
	});
	liLegend.append( btnLegend );
	
	var liInfo = $( '<li></li>' );
	ul.append( liInfo );
	var btnInfo = $( '<button class="btn btn-default"><i class="fa fa-info-circle"></i> Info</button>' );
	btnInfo.click( function(){
		showInfo();
	});
	liInfo.append( btnInfo );

	var liStats = $( '<li></li>' );
	ul.append( liStats );
	var btnStats = $( '<button class="btn btn-default"><i class="fa fa-pie-chart"></i> Stats</button>' );
	btnStats.click( function(){
		showStats();
	});
	liStats.append( btnStats );
	
	
	
	var dashboardContentRow = $( '<div class="row dashboard-content"></div>' );
	dashboardContainer.append( dashboardContentRow );
	var dashboardContent	= $( '<div class="col-md-12 heigth100"></div>' );
	dashboardContentRow.append( dashboardContent );
	
	var legend = $( '<div class="dashboard-content-item legend"></div>' );
	legend.hide();
	dashboardContent.append( legend );
	
	var legendLayers = $( '<div class="dashboard-layers width100 height100"></div>')
	var legendFeatures = $( '<div class="dashboard-features width100 height100"></div>')
	legend.append( legendLayers );
	legend.append( legendFeatures );
	
	var info = $( '<div class="dashboard-content-item info"></div>' );
	info.hide();
	dashboardContent.append( info );
	var infoLayers = $( '<div class="dashboard-layers width100 height100"></div>')
	var infoFeatures = $( '<div class="dashboard-features width100 height100"></div>')
	info.append( infoLayers );
	info.append( infoFeatures );

	
	var stats = $( '<div class="dashboard-content-item stats"></div>' );
	stats.hide();
	dashboardContent.append( stats );
	var statsLayers = $( '<div class="dashboard-layers width100 height100"></div>')
	var statsFeatures = $( '<div class="dashboard-features width100 height100"></div>')
	stats.append( statsLayers );
	stats.append( statsFeatures );
	
	// reset the dashboard to its origianl state ( for layer from the left menu )
	var resetDashboard = function(){
		
		btnGroup.find( 'ul' ).empty();
		btnGroup.hide();
		
		layerLabel.html( '' );
		layerLabel.hide();
		
		btnLegend.prop( 'disabled' , false );
		btnInfo.prop( 'disabled' , false );
		btnStats.attr( 'disabled' , true );
		
		dashboardBtnBar.find( 'button' ).removeClass( 'active' );
		
		$( '.dashboard-features' ).hide();
		$( '.dashboard-layers' ).show();
//		legend.empty();
//		info.empty();
//		stats.empty();
		
	};
	
	var showLegend = function(){
		if( !legend.is(":visible") ){
			info.hide();
			stats.hide();
			legend.fadeIn( 350 );
		}
		
		dashboardBtnBar.find( 'button' ).removeClass( 'active' );
		btnLegend.addClass( 'active' );
		
	};
	
	var showInfo = function(){
		
		dashboardBtnBar.find( 'button' ).removeClass( 'active' );
		btnInfo.addClass( 'active' );
		
		if( !info.is(":visible") ){
			legend.hide();
			stats.hide();
			info.fadeIn( 350 );
		}

	};
	
	var showStats = function(){
		dashboardBtnBar.find( 'button' ).removeClass( 'active' );
		btnStats.addClass( 'active' );
		
		stats.fadeIn( 350 );
		if( !stats.is(":visible") ){
			legend.hide();
			info.hide();
			stats.fadeIn( 350 );
		}
		
	};
	
	resetDashboard();
	showLegend();
	
	
	var addDashboardItem = function( id , label , classPrefix , container , content , show ){
		
		var rowToggle = $( '<div class="row row-toggle closed"></div>' );
		rowToggle.addClass( classPrefix + '-toggle' );
		rowToggle.addClass( classPrefix + '-toggle-' +  id );
		
		var colToggleBtn	= $( '<div class="col-md-12 toggle-btn"></div>' );
		var btn 			= $( '<button class="btn btn-transparent"><i class="fa fa-caret-right"></i>&nbsp;' +label+'</button>' );
		
		colToggleBtn.append( btn );
		rowToggle.append( colToggleBtn );
		
		var row = $( '<div class="row row-toggle-content closed"></div>' );
		row.addClass( classPrefix + '-layer' );
		row.hide();
		row.addClass( classPrefix + '-layer-' +  id );
		var col	= $( '<div class="col-md-12"></div>' );
		row.append( col );
		col.append( content );
		
		container.append( rowToggle );
		if( !show ){
			rowToggle.hide();
		}
		container.append( row );
		
		btn.click( function(){
			var elem = $( '.' + classPrefix + '-layer-' +  id );
			toggleDashboardItem( classPrefix , id , !elem.is( ':visible' ) );
		});
	};
	
	var toggleDashboardItem = function( classPrefix , id , show ){
		var toggle = $( '.' + classPrefix + '-toggle-' +  id );
		var btnToggle = toggle.find( 'div.toggle-btn button' );
		var elem = $( '.' + classPrefix + '-layer-' +  id );
		if( show ){
			elem.slideDown( 400 );
			btnToggle.find( 'i').removeClass().addClass('fa fa-caret-down');
			toggle.removeClass( 'closed' ).addClass( 'opened' );
		} else {
			elem.stop().slideUp( 400 );
			btnToggle.find( 'i').removeClass().addClass('fa fa-caret-right');
			toggle.removeClass( 'opened' ).addClass( 'closed' );
		}
	};
	
	bus.listen("add-group", function(event, groupInfo) {
		// add legend
		if( groupInfo.hasOwnProperty("legendLink") ){
				$.ajax({
					url			: groupInfo.legendLink ,
					data		: {bust : (new Date()).getTime()},
					dataType 	: "html" ,
					success		: function(data){
						addDashboardItem( groupInfo.id, groupInfo.name , 'legend', legendLayers , data , true );
					}
				});
		}
		
		// add info
		if (groupInfo.hasOwnProperty("infoLink") ) {
			$.ajax({
				url			: groupInfo.infoLink ,
				data		: {bust : (new Date()).getTime()},
				dataType 	: "html" ,
				success		: function(data){
					addDashboardItem( groupInfo.id, groupInfo.name , 'info', infoLayers , data , true );
				}
			});
		}
		
	});
	
	bus.listen("add-layer", function(event, portalLayer) {
		
		// add legend
		$.each( portalLayer.wmsLayers, function( i , wmsLayer){
			if( wmsLayer.hasOwnProperty("legend") || portalLayer.hasOwnProperty("legendLink") ){
				if( portalLayer.hasOwnProperty("legendLink") ){
					$.ajax({
						url			: portalLayer.legendLink ,
						data		: {bust : (new Date()).getTime()},
						dataType 	: "html" ,
						success		: function(data){
							addDashboardItem( portalLayer.id, portalLayer.label , 'legend', legendLayers , data , portalLayer.active);
						}
					});
				}
			}
		});
		
		// add info
		if (portalLayer.hasOwnProperty("infoLink") ) {
			$.ajax({
				url			: portalLayer.infoLink ,
				data		: {bust : (new Date()).getTime()},
				dataType 	: "html" ,
				success		: function(data){
					addDashboardItem( portalLayer.id, portalLayer.label , 'info', infoLayers , data , portalLayer.active );
				}
			});
		}
	});
	
	var toggleDashboardElement = function( id , show ){
		if( show === true ){
			$( '.legend-toggle-' + id ).fadeIn( 200 );
			$( '.info-toggle-' + id ).fadeIn( 200 );
		} else {
			// close dashboard item for the given layer
			$( '.legend-layer-' + id ).fadeOut( 300 );
			$( '.legend-toggle-' + id ).fadeOut( 300 );
			$( '.legend-toggle-' + id ).find( 'button i' ).removeClass().addClass('fa fa-caret-right');
			$( '.info-layer-' + id ).fadeOut( 300 );
			$( '.info-toggle-' + id ).fadeOut( 300 );
			$( '.info-toggle-' + id ).find( 'button i' ).removeClass().addClass('fa fa-caret-right');
		}
	};
	
	bus.listen( "group-active-layers-changed" , function(event , groupId , count){
		var show = ( count > 0 ) ? true : false;
		toggleDashboardElement( groupId , show );
	});
	
	bus.listen("layer-visibility", function(event, layerId, visible) {
		toggleDashboardElement( layerId, visible );
	});
	
	
	bus.listen( "layers-dashboard-toggle-visibility" , function(event , open){
//		var icon = null;
		if( dashboard.hasClass('opened') && !open){
			dashboard.removeClass( 'opened' ).addClass( 'closed' );
//			dashboard.stop().animate( {'right': '-' + (dashboard.width() - dashboardToggle.width() ) +'px' }, 500 );
			dashboard.stop().animate( {'right': '-' + (dashboard.width()) +'px' }, 700 ,'easeOutQuad');
			
//			icon = iconClosed;
		} else {
			dashboard.removeClass( 'closed' ).addClass( 'opened' );
			dashboard.animate( {'right': 0 }, 700 ,'easeInOutQuad');
			
			
//			icon = iconOpened;
		}
		
//		icon = $( icon );
//		icon.hide();
//		setTimeout( function(){
//			btnCollapse.empty();
//			btnCollapse.append( icon );
//			btnCollapse.blur();
//			
//			icon.fadeIn();
//		}, 300 );
	});
	
	$( window ).resize(function() {
		var right = ( dashboard.hasClass( 'opened' ) ) ? "0" : "-"+(dashboard.width() ) +"px";
//		var right = ( dashboard.hasClass( 'opened' ) ) ? "0" : "-"+(dashboard.width() - dashboardToggle.width() ) +"px";
		dashboard.stop().animate( {'right': right }, 200 );
	});
	
	// click from layer list
	bus.listen( "open-layer-dashboard" , function( event, id ){
		
		event.preventDefault();
		
		resetDashboard();
		
		var legendItem = $( '.legend-toggle-' + id );
		var infoItem = $( '.info-toggle-' + id );
		var targetItem = null; 
		if( legendItem.length ){
			showLegend();
			targetItem = $( '.legend-layer-' + id );;
		} else if( infoItem.length ){
			showInfo();
			targetItem = $( '.info-layer-' + id );;
		}
		
		toggleDashboardItem( 'legend' , id , true );
		toggleDashboardItem( 'info' , id , true );

		setTimeout( function(){
//			console.log( "top-position" +  $( targetItem ).position().top );
			var scrollTop = 0;
			if(  $( targetItem ).position().top < 40 ){
				scrollTop = 0; 
			} else {
				scrollTop = $( targetItem ).position().top - dashboardContentRow.position().top;
				scrollTop = Math.abs( scrollTop );				
			}
			
//			console.log( scrollTop );
//			if( scrollTop > 0 ){
				dashboardContentRow.animate(
						{ scrollTop: scrollTop }
						, 200 
						,'easeInOutQuad'
						, function(){
							highlightItem( id , targetItem );
						}
					);			
//			} else {
//				highlightItem( id , targetItem );
//			}
			
		}, 250);

		bus.send( "layers-dashboard-toggle-visibility" , true );
		
	});
	
	var highlightItem = function( id , targetItem ){
		var legendItem = $( '.legend-toggle-' + id );
		var infoItem = $( '.info-toggle-' + id );

		var items = $( legendItem , infoItem ) ;
		var color = $.Color( "rgba(50, 153, 187, 0.2)" );
//		var color = $.Color( "rgba(251, 252, 166, 0.10)" );
		items.animate(
				{ 'backgroundColor': color }
				, 300 
				, function(){
					items.animate(
						{ 'backgroundColor': "transparent" }
						, 2000 )
		});
		targetItem.animate(
				{ 'backgroundColor': color }
				, 300 
				, function(){
					targetItem.animate(
						{ 'backgroundColor': "transparent" }
						, 2000 )
		});
	};
	
	bus.listen( "open-dashboard-info-feature" , function( event, feature ){
		// init ui for features
		$( '.dashboard-layers' ).hide();
		$( '.dashboard-features' ).show();
		$( '.dashboard-features' ).empty();
		btnLegend.prop( 'disabled' , true );
		btnInfo.prop( 'disabled' , true );
		btnStats.prop( 'disabled' , true );

		bus.send( "layers-dashboard-toggle-visibility" , true );
		
		layerLabel.html( feature.attributes.name );
//		console.log( feature.attributes.name );
		layerLabel.fadeIn();
//		
		var dashboardOpened = false;
		
//		// add legend
//		$.each( portalLayer.wmsLayers, function( i , wmsLayer){
			if( feature.attributes.hasOwnProperty("legend_file") ) {
//	
				btnLegend.prop( 'disabled' , false );
				showLegend();
				var url =  "static/loc/" + customization.languageCode + "/html/" + feature.attributes.legend_file;
//				if( portalLayer.hasOwnProperty("legendLink") ){
				$.ajax({
					url			: url ,
					data		: {bust : (new Date()).getTime()},
					dataType 	: "html" ,
					success		: function(data){
						legendFeatures.append( data );
					}
				
				});
//				}
//				
				dashboardOpened = true;
			}
//		});
//
//		// open info
		if ( feature.attributes.hasOwnProperty("info_file")  ) {
			btnInfo.prop( 'disabled' , false );
			var url =  "static/loc/" + customization.languageCode + "/html/" + feature.attributes.info_file;
			$.ajax({
				url			: url ,
				data		: {bust : (new Date()).getTime()},
				dataType 	: "html" ,
				success		: function(data){
					infoFeatures.append( layerLabel );
					infoFeatures.append( data );
				}
			
			});
			
			if( !dashboardOpened ){
				showInfo();
				
				dashboardOpened = true;
			}
		
		}

	});
	
});
