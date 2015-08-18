/**
 * Controller module for layer dashboard
 * 
 * @author M. Togna
 */
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
//						dashboard.addLayerLegend( groupInfo.id, groupInfo.name , data , true );
						bus.send( 'add-dashboard-element' , [groupInfo.id , groupInfo.name, data , true , dashboard.TYPE.LEGEND, dashboard.SOURCE.LAYERS]);
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
//					dashboard.addLayerInfo( groupInfo.id, groupInfo.name , data , true );
					bus.send( 'add-dashboard-element' , [groupInfo.id , groupInfo.name, data , true , dashboard.TYPE.INFO, dashboard.SOURCE.LAYERS]);
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
//							dashboard.addLayerLegend( portalLayer.id, portalLayer.label , data  , portalLayer.active);
							bus.send( 'add-dashboard-element' , [portalLayer.id , portalLayer.label, data , portalLayer.active , dashboard.TYPE.LEGEND, dashboard.SOURCE.LAYERS]);
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
//					dashboard.addLayerInfo( portalLayer.id, portalLayer.label , data , portalLayer.active);
					bus.send( 'add-dashboard-element' , [portalLayer.id , portalLayer.label, data , portalLayer.active , dashboard.TYPE.INFO, dashboard.SOURCE.LAYERS]);
				}
			});
		}
	});
	
	bus.listen( "group-active-layers-changed" , function(event , groupId , count){
		var show = ( count > 0 ) ? true : false;
		bus.send( 'dashboard-element-toggle-visibility' , [groupId , show ] );
	});
	
	bus.listen("layer-visibility", function(event, layerId, visible) {
		bus.send( 'dashboard-element-toggle-visibility' , [layerId , visible ] );
	});
	
	// click from layer list
	bus.listen( "open-layer-dashboard" , function( event, id ){
		
		event.preventDefault();
		// open dashboard
		bus.send( "dashboard-toggle-visibility" , true );
		// show legeng for layers
		bus.send( "dashboard-show-type" , [dashboard.TYPE.LEGEND, dashboard.SOURCE.LAYERS] );
		// expand the item
		bus.send( "dashboard-element-toggle-state" , [dashboard.TYPE.LEGEND, id , true] );
		bus.send( "dashboard-element-toggle-state" , [dashboard.TYPE.INFO, id , true] );
		// highlight the item
		bus.send( "highlight-dashboard-element" , [id , dashboard.TYPE.LEGEND, dashboard.SOURCE.LAYERS] );
	});
	
});
