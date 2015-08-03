define([ "jquery", "message-bus", "dashboard" ,"module" ],
		function($, bus, dashboard, module ) {
	
	
	
	bus.listen("add-group", function(event, groupInfo) {
		// add legend
		if( groupInfo.hasOwnProperty("legendLink") ){
				$.ajax({
					url			: groupInfo.legendLink ,
					data		: {bust : (new Date()).getTime()},
					dataType 	: "html" ,
					success		: function(data){
						dashboard.addLayerLegend( groupInfo.id, groupInfo.name , data , true );
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
//					dashboard.addDashboardItem( groupInfo.id, groupInfo.name , 'info', infoLayers , data , true );
					dashboard.addLayerInfo( groupInfo.id, groupInfo.name , data , true );
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
//							dashboard.addDashboardItem( portalLayer.id, portalLayer.label , 'legend', legendLayers , data , portalLayer.active);
							dashboard.addLayerLegend( portalLayer.id, portalLayer.label , data  , portalLayer.active);
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
//					dashboard.addDashboardItem( portalLayer.id, portalLayer.label , 'info', infoLayers , data , portalLayer.active );
					dashboard.addLayerInfo( portalLayer.id, portalLayer.label , data , portalLayer.active);
				}
			});
		}
	});
	
	// click from layer list
	bus.listen( "open-layer-dashboard" , function( event, id ){
		
		event.preventDefault();
		
//		resetDashboard();
		
		var legendItem = $( '.legend-toggle-' + id );
		var infoItem = $( '.info-toggle-' + id );
		var targetItem = null; 
		if( legendItem.length ){
			dashboard.showLegend();
			targetItem = $( '.legend-layer-' + id );;
		} else if( infoItem.length ){
			dashboard.showInfo();
			targetItem = $( '.info-layer-' + id );;
		}
		
		dashboard.toggleDashboardItem( 'legend' , id , true );
		dashboard.toggleDashboardItem( 'info' , id , true );

		dashboard.scrollTo( id , targetItem );

		bus.send( "layers-dashboard-toggle-visibility" , true );
		
	});
	
});
