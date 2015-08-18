define([ "jquery", "message-bus", "layer-list-selector", "i18n" ,"customization" ,"module", "i18nUtils","jquery-color","jquery-easing" ], function($, bus, layerListSelector, i18n, customization , module ) {
	
	
	var DashboardType = function(name){
		this.name = name;
		
		this.toString = function(){
			return this.name;
		};
	};
	
	var DashboardSources 	= { FEATURES: new DashboardType('features') , LAYERS: new DashboardType('layer')  };
	var DashboardTypes 		= { INFO: new DashboardType('info') , LEGEND: new DashboardType('legend') , STATS: new DashboardType('stats')  };

	
	var config = module.config();

	var iconOpened = '<i class="fa fa-angle-double-right"></i>' ;
	var iconClosed = '<i class="fa fa-tachometer"></i>' ;
	
	var dashboard = $( '<div class="row dashboard height100"></div>' );
	layerListSelector.layersDashboardContainer.append( dashboard );
	
	// dashbaord toggle 
	var dashboardToggle = $( '<div class="col-md-1 dashboard-toggle no-padding "></div>' )
	dashboard.append( dashboardToggle );
	
	var dashboardToggleBtn = $( '<div class="dashboard-toggle-btn"></div>' )
	dashboardToggle.append( dashboardToggleBtn );
	var btnCollapse = $( '<button class="btn btn-collapse">' + iconOpened + '</button>' );
	dashboardToggleBtn.append( btnCollapse );
	var dashboardToggleEmptyCol = $( '<div class="dashboard-toggle-empty-col"></div>' )
	dashboardToggle.append( dashboardToggleEmptyCol );
	
	btnCollapse.click( function(e){
		bus.send( "dashboard-toggle-visibility" );
		btnCollapse.blur();
	});
	
	
	// main dashbaord container
	var dashboardContainer	= $( '<div class="col-md-11 height100 dashboard-container"></div>' );
	dashboard.append( dashboardContainer );
		
	dashboard.css( 'right' , '-' + (dashboard.width() ) +'px' );
//	dashboard.css( 'right' , '-' + (dashboard.width() - dashboardToggle.width() ) +'px' );
	dashboard.addClass( 'closed' );
//	dashboard.animate( {'opacity':0.9}, 300 );
	
	
	// add dashboard content
	var dashboardBtnBar = $( '<div class="row dashboard-btn-bar"></div>' );
	dashboardContainer.append( dashboardBtnBar );
	var dashboardBtnBarCol	= $( '<div class="col-md-12 heigth100"></div>' );
	dashboardBtnBar.append( dashboardBtnBarCol );
//	dashboardBtnBarCol.append( btnCollapse );
	
	var divNav = $( '<div class="width100 height100 dashboard-content-selector"></div>' );
	dashboardBtnBarCol.append( divNav );
	var ul = $( '<ul class="nav nav-tabs nav-justified"></ul>' );
	divNav.append( ul );
	
	// dashboard type buttons 
	var liLegend = $( '<li></li>' );
	ul.append( liLegend );
	var btnLegend = $( '<button class="btn btn-default"><i class="fa fa-th-list"></i> </button>' );
	btnLegend.append( i18n['dashboard_legend_button'] );
	btnLegend.click( function(){
		showLegend();
	});
	liLegend.append( btnLegend );
	
	var liInfo = $( '<li></li>' );
	ul.append( liInfo );
	var btnInfo = $( '<button class="btn btn-default"><i class="fa fa-info-circle"></i> </button>' );
	btnInfo.append( i18n['dashboard_info_button'] );
	btnInfo.click( function(){
		showInfo();
	});
	liInfo.append( btnInfo );

	var liStats = $( '<li></li>' );
	ul.append( liStats );
	var btnStats = $( '<button class="btn btn-default"><i class="fa fa-pie-chart"></i> </button>' );
	btnStats.append( i18n['dashboard_stats_button'] );
	btnStats.click( function(){
		showStats();
	});
	liStats.append( btnStats );
	
	
	
	var dashboardContentRow = $( '<div class="row dashboard-content"></div>' );
	dashboardContainer.append( dashboardContentRow );
	var dashboardContent	= $( '<div class="col-md-12 heigth100"></div>' );
	dashboardContentRow.append( dashboardContent );
	
	
	// type: legend
	var legend = $( '<div class="dashboard-content-item legend"></div>' );
	legend.hide();
	dashboardContent.append( legend );
	
	var legendLayers 	= $( '<div class="dashboard-layer width100 height100"></div>')
	var legendFeatures = $( '<div class="dashboard-features width100 height100"></div>')
	legend.append( legendLayers );
	legend.append( legendFeatures );
	
	
	// type: INFO
	var info = $( '<div class="dashboard-content-item info"></div>' );
	info.hide();
	dashboardContent.append( info );
	
	var infoLayers = $( '<div class="dashboard-layer width100 height100"></div>')
	var infoFeatures = $( '<div class="dashboard-features width100 height100"></div>')
	info.append( infoLayers );
	info.append( infoFeatures );

	// type: stats
	var stats = $( '<div class="dashboard-content-item stats"></div>' );
	stats.hide();
	dashboardContent.append( stats );
	var statsLayers = $( '<div class="dashboard-layer width100 height100"></div>')
	var statsFeatures = $( '<div class="dashboard-features width100 height100"></div>')
	stats.append( statsLayers );
	stats.append( statsFeatures );
	
	
	
	
	// reset the dashboard to its origianl state
	var resetDashboard = function(){
		
		btnLegend.prop( 'disabled' , true );
		btnInfo.prop( 'disabled' , true );
		btnStats.attr( 'disabled' , true );
		
		dashboardBtnBar.find( 'button' ).removeClass( 'active' );
		
		$( '.dashboard-features' ).hide();
		$( '.dashboard-layer' ).hide();
	};
	
	// ?????
	var resetDashboardStats = function(){
		dashboardBtnBar.find( 'button' ).removeClass( 'active' );
		
		btnInfo.prop( 'disabled' , true );
		btnStats.attr( 'disabled' , true );
		
		$( '.dashboard-layer' ).hide();
		$( '.dashboard-features' ).empty();
		$( '.dashboard-features' ).show();
		
	};
	
	var showLegend = function(){
		dashboardBtnBar.find( 'button' ).removeClass( 'active' );
		btnLegend.addClass( 'active' );

		if( !legend.is(":visible") ){
			info.hide();
			stats.hide();
			legend.fadeIn( 350 );

			dashboardContentRow.animate( { scrollTop: 0 } , 200  ,'easeInOutQuad' );	
		}
		
	};
	
	var showInfo = function(){
		
		dashboardBtnBar.find( 'button' ).removeClass( 'active' );
		btnInfo.addClass( 'active' );
		
		if( !info.is(":visible") ){
			legend.hide();
			stats.hide();
			info.fadeIn( 350 );

			dashboardContentRow.animate( { scrollTop: 0 } , 200  ,'easeInOutQuad' );	
		}
	};
	
	var showStats = function(){
		dashboardBtnBar.find( 'button' ).removeClass( 'active' );
		btnStats.addClass( 'active' );
		
		if( !stats.is(":visible") ){
			legend.hide();
			info.hide();
			stats.fadeIn( 350 );

			dashboardContentRow.animate( { scrollTop: 0 } , 200  ,'easeInOutQuad' );	
		}
	};
	
	resetDashboard();
	showLegend();
	
	// DASHBOARD events
	/**
	 * It opens or closes the dashboard based on the open parameter
	 * 
	 * open [boolean]: true | false
	 */
	bus.listen( "dashboard-toggle-visibility" , function(event , open){
		var icon = null;
		if( dashboard.hasClass('opened') && open ){
			//nothing happens 
		}
		else {
			
			if( dashboard.hasClass('opened') && !open){
				dashboard.removeClass( 'opened' ).addClass( 'closed' );
				dashboard.stop().animate( {'right': '-' + (dashboard.width() - dashboardToggle.width() + 1 ) +'px' }, 500 );
				
				icon = iconClosed;
			} else {
				dashboard.removeClass( 'closed' ).addClass( 'opened' );
				dashboard.animate( {'right': 0 }, 700 ,'easeInOutQuad');
				
				
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
			
		}
	});
	//on windows resize
	$( window ).resize(function() {
//		var right = ( dashboard.hasClass( 'opened' ) ) ? "0" : "-"+(dashboard.width() ) +"px";
		var right = ( dashboard.hasClass( 'opened' ) ) ? "0" : "-"+(dashboard.width() - dashboardToggle.width() + 1) +"px";
		dashboard.stop().animate( {'right': right }, 200 );
	});
	
	//DASHBAORD ELEMENT EVENTS
	var addDashboardItem = function( id , label , classPrefix , container , content , show ){
		
		var rowToggle = $( '<div class="row row-toggle closed"></div>' );
		rowToggle.addClass( classPrefix + '-toggle' );
		rowToggle.addClass( classPrefix + '-toggle-' +  id );
		
		var colToggleBtn	= $( '<div class="col-md-12 toggle-btn"></div>' );
		var btn 			= $( '<button class="btn btn-transparent"><i class="fa fa-caret-down"></i>&nbsp;' +label+'</button>' );
		
		colToggleBtn.append( btn );
		rowToggle.append( colToggleBtn );
		
		var row = $( '<div class="row row-toggle-content opened"></div>' );
		row.addClass( classPrefix + '-layer' );
		row.addClass( classPrefix + '-layer-' +  id );
		var col	= $( '<div class="col-md-12"></div>' );
		row.append( col );
		col.append( content );
		
		container.append( rowToggle );
		if( !show ){
			rowToggle.hide();
			row.hide();
		}
		container.append( row );
		
		btn.click( function(){
			var elem = $( '.' + classPrefix + '-layer-' +  id );
			bus.send( 'dashboard-element-toggle-state' ,  [classPrefix , id , !elem.is( ':visible' )] );
			
		});
	};
	
	bus.listen( 'dashboard-element-toggle-state' , function( event , TYPE , id , expand ){
		var classPrefix = TYPE.toString();
		
		var toggle = $( '.' + classPrefix + '-toggle-' +  id );
		var btnToggle = toggle.find( 'div.toggle-btn button' );
		var elem = $( '.' + classPrefix + '-layer-' +  id );
		if( expand ){
			elem.slideDown( 400 );
			btnToggle.find( 'i').removeClass().addClass('fa fa-caret-down');
			toggle.removeClass( 'closed' ).addClass( 'opened' );
		} else {
			elem.stop().slideUp( 400 );
			btnToggle.find( 'i').removeClass().addClass('fa fa-caret-right');
			toggle.removeClass( 'opened' ).addClass( 'closed' );
		}
	});
	
	
	bus.listen( 'dashboard-element-toggle-visibility' , function( event , id , show ) {
		if( show === true ){
			$( '.legend-toggle-' + id ).fadeIn( 200 );
			$( '.info-toggle-' + id ).fadeIn( 200 );
			$( '.stats-toggle-' + id ).fadeIn( 200 );
			
			bus.send( 'dashboard-element-toggle-state' ,  ['legend' , id , show] );
			bus.send( 'dashboard-element-toggle-state' ,  ['info' , id , show] );
			bus.send( 'dashboard-element-toggle-state' ,  ['stats' , id , show] );
		} else {
			// close dashboard item for the given layer
			$( '.legend-layer-' + id ).fadeOut( 300 );
			$( '.legend-toggle-' + id ).fadeOut( 300 );
			$( '.legend-toggle-' + id ).find( 'button i' ).removeClass().addClass('fa fa-caret-right');

			$( '.info-layer-' + id ).fadeOut( 300 );
			$( '.info-toggle-' + id ).fadeOut( 300 );
			$( '.info-toggle-' + id ).find( 'button i' ).removeClass().addClass('fa fa-caret-right');

			$( '.stats-layer-' + id ).fadeOut( 300 );
			$( '.stats-toggle-' + id ).fadeOut( 300 );
			$( '.stats-toggle-' + id ).find( 'button i' ).removeClass().addClass('fa fa-caret-right');
		}
	});
	
	
	/**
	 * Add a specific dashbaord item to the container based on its TYPE and SOURCE
	 * 
	 * TYPE 	= dashbaord.TYPE.INFO | dashbaord.TYPE.LEGEND | dashbaord.TYPE.STATS
	 * 
	 * SOURCE 	= dashbaord.SOURCE.FEATURES | dashbaord.SOURCE.LAYERS
	 */
	bus.listen('add-dashboard-element' , function(event, id , label, data , show , TYPE, SOURCE) {
		var buttonType 	= getButtonType( TYPE );
		buttonType.prop( 'disabled' , false );

		var container	= getDashboardElementContainer( TYPE , SOURCE );
		
		addDashboardItem( id, label , TYPE.toString(), container , data , show );
		
	});
	/**
	 * Private method that returns the button for a dashboard element based on the TYPE
	 * 
	 * TYPE 	= dashbaord.TYPE.INFO | dashbaord.TYPE.LEGEND | dashbaord.TYPE.STATS
	 */
	var getButtonType = function(TYPE){
		var buttonType;
		switch( TYPE.toString() ){
			case DashboardTypes.INFO.toString() :
				buttonType = btnInfo;
				break;
			case DashboardTypes.LEGEND.toString() :
				buttonType = btnLegend;
				break;
			case DashboardTypes.STATS.toString() :
				buttonType = btnStats;
				break;
		};
		return buttonType;
	};
	/**
	 * Private method that returns the container for a dashboard element based on the TYPE and SOURCE
	 * 
	 * TYPE 	= dashbaord.TYPE.INFO | dashbaord.TYPE.LEGEND | dashbaord.TYPE.STATS
	 * 
	 * SOURCE 	= dashbaord.SOURCE.FEATURES | dashbaord.SOURCE.LAYERS
	 */
	var getDashboardElementContainer = function( TYPE , SOURCE ){
		var container = null;
		switch( TYPE.toString() ){
			case DashboardTypes.INFO.toString() :
				switch( SOURCE.toString() ){
					case DashboardSources.FEATURES.toString():
						container = infoFeatures;
						break;
					case DashboardSources.LAYERS.toString():
						container = infoLayers;
						break;
				}
				break;
			case DashboardTypes.LEGEND.toString() :
				switch( SOURCE.toString() ){
					case DashboardSources.FEATURES.toString():
						container = legendFeatures;
						break;
					case DashboardSources.LAYERS.toString():
						container = legendLayers;
						break;
				}
				break;
			case DashboardTypes.STATS.toString() :
				switch( SOURCE.toString() ){
					case DashboardSources.FEATURES.toString():
						container = statsFeatures;
						break;
					case DashboardSources.LAYERS.toString():
						container = statsLayers;
						break;
				}
				break;
		};
		return container;
	};
	/**
	 * It removes all elements for the spcific TYPE and SOURCE
	 */
	bus.listen('dashboard-reset-type' , function(event ,TYPE, SOURCE){
		//empty type
		var elems = dashboard.find( '.dashboard-content-item.'+TYPE.toString() ).find('.dashboard-'+SOURCE.toString());
		elems.empty();

		//disable button if others have not elements as well
		elems = dashboard.find( '.dashboard-content-item.'+TYPE.toString() ).children().not( '.dashboard-'+SOURCE.toString() );
		if( elems.children().length <= 0 ){
			var btn = getButtonType(TYPE);
			btn.prop('disabled',true);
			btn.removeClass('active');
		}

	});
	
	bus.listen('dashboard-activate-type' , function(event, TYPE, SOURCE){
		var typeContainer = dashboard.find( '.dashboard-content-item.'+TYPE.toString() );
		var elems = typeContainer.children().not( '.dashboard-'+SOURCE.toString() );
		elems.hide();
		
		elems = typeContainer.find( '.dashboard-'+SOURCE.toString() );
		elems.fadeIn();
		
	});
	
	/**
	 * Shows a section of the dashbaord based on the specified TYPE
	 * 
	 * TYPE = dashbaord.TYPE.INFO | dashbaord.TYPE.LEGEND | dashbaord.TYPE.STATS 
	 * 
	 * SOURCE 	= dashbaord.SOURCE.FEATURES | dashbaord.SOURCE.LAYERS
	 */
	bus.listen('dashboard-show-type' , function(event, TYPE, SOURCE){
		
		switch( TYPE.toString() ){
			case DashboardTypes.INFO.toString() :
				showInfo();
				break;
			case DashboardTypes.LEGEND.toString() :
				showLegend();
				break;
			case DashboardTypes.STATS.toString() :
				showStats();
				break;
		};

		bus.send('dashboard-activate-type' ,[TYPE,SOURCE] );
	});
	
	// 
	bus.listen('highlight-dashboard-element' , function(event, id , TYPE , SOURCE){
		var container 	= getDashboardElementContainer( TYPE , SOURCE );
		var toggleBtn 	= container.find( '.' + TYPE.toString() + '-toggle-' + id );
		var targetItem 	= container.find( '.' + TYPE.toString() + '-' + SOURCE.toString()+ '-' + id  )
		
		var highlightItem = function(){
			var color = $.Color( "rgba(50, 153, 187, 0.2)" );
			toggleBtn.animate(
					{ 'backgroundColor': color }
					, 300 
					, function(){
						toggleBtn.animate(
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
		
		//first scroll to target item, then highlights it
		setTimeout( function(){
			var scrollTop = 0;
			if(  $( targetItem ).position().top < 40 ){
				scrollTop = 0; 
			} else {
				scrollTop = $( targetItem ).position().top - dashboardContentRow.position().top;
				scrollTop = Math.abs( scrollTop );				
			}
			
			dashboardContentRow.animate( { scrollTop: scrollTop } , 200  ,'easeInOutQuad' , highlightItem );			
			
		}, 150);
		
	});
	
	
	return {
		
		SOURCE	: DashboardSources,		
		TYPE	: DashboardTypes
	}
	
});
