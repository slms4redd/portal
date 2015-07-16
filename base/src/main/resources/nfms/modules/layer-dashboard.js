define([ "jquery", "message-bus", "layer-list-selector", "i18n" ], function($, bus, layerListSelector, i18n) {
	
	var iconOpened = '<span class="fa-stack"><i class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-angle-double-right fa-stack-1x"></i></span>' ;
	var iconClosed = '<span class="fa-stack"><i class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-tachometer fa-stack-1x"></i></span>' ;

	
	var dashboard = $( '<div class="row dashboard height100"></div>' );
	dashboard.css( 'opacity' , '0' );
	
	layerListSelector.layersDashboardContainer.append( dashboard );
		
	var dashboardToggle = $( '<div class="col-md-1 no-padding dashboard-toggle"></div>' )
	dashboard.append( dashboardToggle );
	
	var btnCollapse = $( '<button class="btn btn-collapse">' + iconClosed + '</button>' );
	dashboardToggle.append( btnCollapse );
	
	btnCollapse.click( function(e){
		bus.send( "layers-dashboard-toggle-visibility" );
		btnCollapse.blur();
	});
	
	
	var dashboardContainer	= $( '<div class="col-md-11 height100 dashboard-container"></div>' );
	dashboard.append( dashboardContainer );
	
	var rowHeader	= $( '<div class="row dashboard-header height10"></div>')
	dashboardContainer.append( rowHeader );
	var colHeader	= $( '<div class="col-md-12"></div>' );
	rowHeader.append( colHeader );
	
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
	
	dashboard.css( 'right' , '-' + (dashboard.width() - dashboardToggle.width() ) +'px' );
	dashboard.addClass( 'closed' );
	dashboard.animate( {'opacity':0.9}, 300 );
	
	
	// add dashboard content
	var dashboardBtnBar = $( '<div class="row dashboard-btn-bar"></div>' );
	dashboardContainer.append( dashboardBtnBar );
	var dashboardBtnBarCol	= $( '<div class="col-md-12 heigth100"></div>' );
	dashboardBtnBar.append( dashboardBtnBarCol );
	
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
	
	var info = $( '<div class="dashboard-content-item info"></div>' );
	info.hide();
	dashboardContent.append( info );
	
	var stats = $( '<div class="dashboard-content-item stats"></div>' );
	stats.hide();
	dashboardContent.append( stats );
	
	
	
	var resetDashboard = function(){
		
		btnGroup.find( 'ul' ).empty();
		btnGroup.hide();
		
		layerLabel.html( '' );
		layerLabel.hide();
		
		btnLegend.prop( 'disabled' , true );
		btnInfo.prop( 'disabled' , true );
		btnStats.attr( 'disabled' , true );
		
		legend.empty();
		info.empty();
		stats.empty();
		
	};
	
	var showLegend = function(){
		legend.hide();
		info.hide();
		stats.hide();
		
		dashboardBtnBar.find( 'button' ).removeClass( 'active' );
		btnLegend.addClass( 'active' );
		
		legend.fadeIn( 350 );
	};
	
	var showInfo = function(){
		legend.hide();
		info.hide();
		stats.hide();
		
		dashboardBtnBar.find( 'button' ).removeClass( 'active' );
		btnInfo.addClass( 'active' );
		
		info.fadeIn( 350 );
	};
	
	var showStats = function(){
		legend.hide();
		info.hide();
		stats.hide();
		
		dashboardBtnBar.find( 'button' ).removeClass( 'active' );
		btnStats.addClass( 'active' );
		
		stats.fadeIn( 350 );
	};
	
	resetDashboard();
	
	
	bus.listen("layer-visibility", function(event, layerId, visible) {
		
	});
	
	
	bus.listen( "layers-dashboard-toggle-visibility" , function(event , open){
		var icon = null;
		if( dashboard.hasClass('opened') && !open){
			dashboard.removeClass( 'opened' ).addClass( 'closed' );
			dashboard.stop().animate( {'right': '-' + (dashboard.width() - dashboardToggle.width() ) +'px' }, 500 );
			
			icon = iconClosed;
		} else {
			dashboard.removeClass( 'closed' ).addClass( 'opened' );
			dashboard.stop().animate( {'right': 0 }, 500 );
			
			
			icon = iconOpened;
		}
		
		icon = $( icon );
		icon.hide();
		setTimeout( function(){
			btnCollapse.empty();
			btnCollapse.append( icon );
			btnCollapse.blur();
			
			icon.fadeIn();
		}, 300 );
	});
	
	$( window ).resize(function() {
		var right = ( dashboard.hasClass( 'opened' ) ) ? "0" : "-"+(dashboard.width() - dashboardToggle.width() ) +"px";
		dashboard.stop().animate( {'right': right }, 200 );
//		if( dashboard.hasClass( 'opened' ) ) {
//			container.stop().animate( {width: container.parent().width() }, 300 );
//		}
	});
	
	bus.listen( "open-layer-dashboard-info" , function( event, portalLayer ){
//		console.log( portalLayer );
		
		resetDashboard();
		
		bus.send( "layers-dashboard-toggle-visibility" , true );
		
		layerLabel.html( portalLayer.label );
		layerLabel.fadeIn();
		
		var dashboardOpened = false;
		// add legend
		$.each( portalLayer.wmsLayers, function( i , wmsLayer){
			if( wmsLayer.hasOwnProperty("legend") || portalLayer.hasOwnProperty("legendLink") ){
	
				btnLegend.prop( 'disabled' , false );
				showLegend();
				
				if( portalLayer.hasOwnProperty("legendLink") ){
					$.ajax({
						url			: portalLayer.legendLink ,
						data		: {bust : (new Date()).getTime()},
						dataType 	: "html" ,
						success		: function(data){
							legend.append( data );
						}
					
					});
				}
				
				dashboardOpened = true;
			}
		});

		// open info
		if (portalLayer.hasOwnProperty("infoLink") ) {
			btnInfo.prop( 'disabled' , false );
		
			$.ajax({
				url			: portalLayer.infoLink ,
				data		: {bust : (new Date()).getTime()},
				dataType 	: "html" ,
				success		: function(data){
					info.append( data );
				}
			
			});
			
			if( !dashboardOpened ){
				showInfo();
				
				dashboardOpened = true;
			}
		
		}

	});
	
});
