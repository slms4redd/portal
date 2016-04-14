define([ "jquery", "message-bus", "layer-list-selector", "i18n" ,"customization" ,"module", "i18nUtils","jquery-color","jquery-easing" ], function($, bus, layerListSelector, i18n, customization , module ) {
	
	var config = module.config();
	
	var DashboardType = function(name){
		this.name = name;
		
		this.toString = function(){
			return this.name;
		};
	};
	
	var DashboardSources 	= { FEATURES: new DashboardType('features') , LAYERS: new DashboardType('layer') };
	var DashboardTypes 		= { LEGEND: new DashboardType('legend') , INFO: new DashboardType('info') , STATS: new DashboardType('stats')  };
	
	
	var defaultTypes	 	= [ DashboardTypes.LEGEND , DashboardTypes.INFO , DashboardTypes.STATS ]; 
	var customTypes			= new Array();
	if( config.types ){
		for( var t in config.types ){
			customTypes.push( new DashboardType(config.types[t]) );
		}
	}
	var types = ( customTypes.length > 0 ) ? customTypes : defaultTypes; 
	
	
	// UI
	var iconOpened = '<i class="fa fa-angle-double-right"></i>' ;
	var iconClosed = '<i class="fa fa-tachometer"></i>' ;
	
	var dashboard = $( '<div class="row dashboard height100"></div>' );
	layerListSelector.layersDashboardContainer.append( dashboard );
	
	// dashbaord toggle 
	var dashboardToggle = $( '<div class="col-md-1 col-sm-2 dashboard-toggle no-padding "></div>' )
	dashboard.append( dashboardToggle );
	
	var btnHide 	= $( '<button class="btn btn-collapse">' + iconClosed +'</button>' );
	var btnExpand 	= $( '<button class="btn btn-collapse"><i class="fa fa-expand"></i></button>' );
	var btnReduce 	= $( '<button class="btn btn-collapse"><i class="fa fa-compress"></i></button>' );
	
	dashboardToggle.append( $('<div class="dashboard-toggle-btn"/>' ).append( btnHide ) );
	dashboardToggle.append( $('<div class="dashboard-toggle-btn" style="display: none" />' ).append(btnExpand ) );
	dashboardToggle.append( $('<div class="dashboard-toggle-btn" style="display: none" />' ).append(btnReduce ) );
	
	var dashboardToggleEmptyCol = $( '<div class="dashboard-toggle-empty-col"></div>' )
	dashboardToggle.append( dashboardToggleEmptyCol );
	var tooltipTemplate = '<div class="tooltip portal-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>';

	btnHide.click( function(e){
		bus.send( "dashboard-toggle-visibility" );
		btnHide.blur();
	});
	btnHide.tooltip({
		title :  function(){ 
			if( btnHide.find('i').hasClass('fa-angle-double-right') ){
				return  i18n[ 'dashboard_close_tooltip'];
			} else {
				return  i18n[ 'dashboard_open_tooltip'];
			}
		}, 
		container: 'body', 
		placement:'left', 
		template:tooltipTemplate , 
		delay: { "show": 0, "hide": 20 }, 
		html:true 
	});
	btnExpand.click( function(e){
		bus.send( "dashboard-expand" );
		btnExpand.blur();
	});
	btnExpand.tooltip({
		title : i18n[ 'dashboard_expand_tooltip'], 
		container: 'body', 
		placement:'left', 
		template:tooltipTemplate , 
		delay: { "show": 0, "hide": 20 }, 
		html:true 
	});
	btnReduce.click( function(e){
		bus.send( "dashboard-reduce" );
		btnReduce.blur();
	});
	btnReduce.tooltip({
		title : i18n[ 'dashboard_reduce_tooltip'], 
		container: 'body', 
		placement:'left', 
		template:tooltipTemplate , 
		delay: { "show": 0, "hide": 20 }, 
		html:true 
	});
	
	
	// main dashbaord container
	var dashboardContainer	= $( '<div class="col-md-11 col-sm-10 height100 dashboard-container"></div>' );
	dashboard.append( dashboardContainer );
	
	var dashboardMargin = 0 ;
	dashboard.css( 'left' ,  ( dashboard.width() - dashboardToggle.width()  ) +'px' );
	dashboard.addClass( 'closed' );
	
	
	// add dashboard content
	var dashboardBtnBar = $( '<div class="row dashboard-btn-bar"></div>' );
	dashboardContainer.append( dashboardBtnBar );
	var dashboardBtnBarCol	= $( '<div class="col-md-12 height100"></div>' );
	dashboardBtnBar.append( dashboardBtnBarCol );
	
	// dashbaord button bar
	var divNav = $( '<div class="width100 height100 dashboard-content-selector"></div>' );
	dashboardBtnBarCol.append( divNav );
	var ul = $( '<ul class="nav nav-tabs nav-justified"></ul>' );
	divNav.append( ul );
	
	// dashboard content items container
	var dashboardContentRow = $( '<div class="row dashboard-content"></div>' );
	dashboardContainer.append( dashboardContentRow );
	var dashboardContent	= $( '<div class="col-md-12 height100"></div>' );
	dashboardContentRow.append( dashboardContent );
	
	
	/**
	 * Private method that returns the button for a dashboard element based on the TYPE
	 * 
	 * TYPE 	= dashbaord.TYPE.INFO | dashbaord.TYPE.LEGEND | dashbaord.TYPE.STATS
	 */
	var getButtonType = function(TYPE){
		var buttonType = dashboardBtnBar.find( 'button.'+TYPE.toString() );
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
		var container 		= null;
		var contentItem		= dashboard.find( '.dashboard-content-item.' + TYPE.toString() );
		
		switch( SOURCE.toString() ){
			case DashboardSources.FEATURES.toString():
				container = contentItem.find( '.dashboard-features' );
				break;
			case DashboardSources.LAYERS.toString():
				container = contentItem.find( '.dashboard-layer' );
				break;
		}
		return container;
	};
	
	var getConfigSection = function( type ){
		if( config.sections ){
			for( i in config.sections ){
				var section = config.sections[ i ];
				if( section.name === type.toString() ){
					return section;
				}
			}
		}
		return {};
	};
	
	// add types to UI
	for( i in types ){
		
		var type = types[ i ];
		
		var addButton = function( t ){
			var li 		= $( '<li></li>' );
			ul.append( li );
			var btn 	= $( '<button class="btn btn-default"></button>' );
			btn.append( i18n['dashboard_'+t.toString()+'_button'] );
			btn.addClass( t.toString() );
			btn.click( function(){
				showType( t );
			});
			li.append( btn );
			
		};
		var addContent = function( t ){
			var configSection = getConfigSection( t );
			
			var content = $( '<div class="dashboard-content-item"></div>' );
			content.addClass( t.toString() );
			dashboardContent.append( content );
			if( configSection.header ){
				content.append( $('<div class="row always-visible"><div class="col-md-12 text-center"><h5>'+i18n[configSection.header]+'</h5></div></div>') );
			}
			
			var layers 	= $( '<div class="dashboard-layer width100 height100"></div>' );
			var features = $( '<div class="dashboard-features width100 height100"></div>' );
			content.append( layers );
			content.append( features );
			content.hide();
		};
		
		addButton( type );
		addContent( type );
		
	}
	
	
	// reset the dashboard to its origianl state
	var resetDashboard = function(){
		dashboardBtnBar.find( 'button' ).attr( 'disabled' , true ).removeClass( 'active' );
		
		$( '.dashboard-features' ).hide();
		$( '.dashboard-layer' ).hide();
	};
	
	var showType = function( TYPE ){
		dashboardBtnBar.find( 'button' ).removeClass( 'active' );
		var btn = getButtonType( TYPE );
		btn.addClass( 'active' );

		var contentItem	= dashboard.find( '.dashboard-content-item.' + TYPE.toString() );
		if( !contentItem.is(":visible") ){
			dashboard.find( '.dashboard-content-item' ).hide();
			contentItem.fadeIn( 350 );
			dashboardContentRow.animate( { scrollTop: 0 } , 200  ,'easeInOutQuad' );	
		}
		
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
		showType( DashboardTypes.LEGEND );
	};
	
	var showInfo = function(){
		showType( DashboardTypes.INFO );
	};
	
	var showStats = function(){
		showType( DashboardTypes.STATS );
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
				dashboard.stop().animate( {'left':  ( dashboard.width() - dashboardToggle.width() ) +'px' }, 100 );
				
				icon = iconClosed;
				
				btnExpand.parent().hide();
				btnReduce.parent().hide();
			} else {
				dashboard.removeClass( 'closed' ).addClass( 'opened' );
				dashboard.stop().animate( {'left':  (0+dashboardMargin) +'px' }, 100 );
				
				icon = iconOpened;
				
				btnExpand.parent().fadeIn( 700 );
			}
			
			icon = $( icon );
			icon.hide();
			setTimeout( function(){
				btnHide.empty();
				btnHide.append( icon );
				btnHide.blur();
				
				icon.fadeIn();
			}, 300 );
			
		}
	});
	
	bus.listen( "dashboard-expand" , function(event , open){
		if( !dashboard.hasClass( 'expanded' ) ){
			dashboardContainer.animate( {backgroundColor: 'rgba(61, 65, 70, 0.97)'} , 500 );
			
			dashboard.addClass( 'expanded' );
			
			btnExpand.parent().hide();
			btnHide.parent().hide();
			btnReduce.parent().show();
		}
	});
	
	bus.listen( "dashboard-reduce" , function(event , open){
		if( dashboard.hasClass( 'expanded' ) ){
		
			dashboardContainer.animate( {backgroundColor: 'rgba(61, 65, 70, 0.85)'} , 500 );
			
			dashboard.removeClass( 'expanded' );
			btnReduce.parent().hide();
			btnHide.parent().show();
			btnExpand.parent().show();
		}
	});

	
	//on windows resize
	$( window ).resize(function() {
		var right = ( dashboard.hasClass( 'opened' ) ) ? "0" : "-"+(dashboard.width() - dashboardToggle.width() + 1) +"px";
		dashboard.stop().animate( {'right': right }, 200 );
	});
	
	//DASHBAORD ITEM EVENTS
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
	
	/**
	 * Expands or Collapses a dashboard item
	 */
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
	
	/**
	 * Shows or hides the dashbaord items linked to the layer with the specified id
	 */
	bus.listen( 'dashboard-element-toggle-visibility' , function( event , id , show ) {
		for( i in types ){
			var type = types[ i ];
			
			if( show === true ){
				$( '.'+type.toString()+'-toggle-' + id ).fadeIn( 200 );
				bus.send( 'dashboard-element-toggle-state' ,  [ type.toString() , id , show ] );
			} else {
				$( '.'+type.toString()+'-layer-' + id ).fadeOut( 300 );
				$( '.'+type.toString()+'-toggle-' + id ).fadeOut( 300 );
				$( '.'+type.toString()+'-toggle-' + id ).find( 'button i' ).removeClass().addClass('fa fa-caret-right');
			}
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
	
	/**
	 * Activates the dashboard view based on TYPE and SOURCE
	 */
	bus.listen('dashboard-activate-type' , function(event, TYPE, SOURCE){
		var typeContainer = dashboard.find( '.dashboard-content-item.'+TYPE.toString() );
		var elems = typeContainer.children().not( '.dashboard-'+SOURCE.toString() ).not( '.always-visible');
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
		showType(TYPE);
		bus.send('dashboard-activate-type' , [TYPE, SOURCE] );
	});
	
	/**
	 * It first shows a dashbaord item then highlights it
	 */
	bus.listen('highlight-dashboard-element' , function(event, id , TYPE , SOURCE){
		var container 	= getDashboardElementContainer( TYPE , SOURCE );
		var toggleBtn 	= container.find( '.' + TYPE.toString() + '-toggle-' + id );
		var targetItem 	= container.find( '.' + TYPE.toString() + '-' + SOURCE.toString()+ '-' + id  )
		
		bus.send( "dashboard-toggle-visibility" , [true] );
		bus.send( 'dashboard-show-type' , [TYPE, SOURCE] );
		
		var highlightItem = function(){
			var color = $.Color( "rgba(50, 153, 187, 0.35)" );
			toggleBtn.animate(
					{ 'backgroundColor': color }
					, 600 
					, function(){
						toggleBtn.animate(
								{ 'backgroundColor': "transparent" }
								, 2000 )
					});
			targetItem.animate(
					{ 'backgroundColor': color }
					, 600 
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
		TYPE	: DashboardTypes,
		
		isExpanded : function(){
			return dashboard.hasClass( 'expanded' );
		}
		
	}
	
});
