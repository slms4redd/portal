define([ "module", "jquery", "message-bus", "dashboard" ], function(module, $, bus, dashboard) {
	
	bus.listen("info-features", function(event, features, x, y) {
		if( features && features.length > 0 ){
			
			// first reset dashbaord source features
			bus.send( "dashboard-reset-type" , [dashboard.TYPE.INFO, dashboard.SOURCE.FEATURES] );
//			bus.send( "dashboard-reset-type" , [dashboard.TYPE.LEGEND, dashboard.SOURCE.FEATURES] );
//			bus.send( "dashboard-reset-type" , [dashboard.TYPE.STATS, dashboard.SOURCE.FEATURES] );

			for( var i in features ){
				var feature = features[ i ];
				
				addFeatureInfo( feature );
			}
			// by default show info / features after adding all features
			bus.send( "dashboard-show-type" , [dashboard.TYPE.INFO, dashboard.SOURCE.FEATURES] );
		}
	});
	
	var addFeatureInfo = function( feature ){
		
		var attributes 	= feature.attributes;
		var fid			= feature.fid.replace( '.' , '-' );
		var fName		= ( attributes.name ) ?  attributes.name : fid;
		
		var div 	= $( '<div class="table-responsive"></div>' );
		var table 	= $( '<table class="table"></table>' );
		div.append( table );
		
		var thead 	= $( '<thead></thead>' );
		table.append( thead );
		var trHead 	= $( '<tr></tr>' );
		thead.append( trHead );
		
		var tbody 	= $( '<tbody></tbody>' );
		table.append( tbody );
		var trBody 	= $( '<tr></tr>' );
		tbody.append( trBody );
		
		for( var name in attributes ){
			var value = attributes[ name ];
			
			var th	= $( '<th class="text-center"></th>' );
			th.append( name );
			trHead.append( th );
			
			var td	= $( '<td class="text-center"></td>' );
			td.append( value );
			trBody.append( td );
		}
		
		bus.send( 'add-dashboard-element' , [fid , fName, div , true , dashboard.TYPE.INFO, dashboard.SOURCE.FEATURES]);
//		if( !expand ){
//			bus.send( 'dashboard-element-toggle-state' , [dashboard.TYPE.INFO , fId , false] );
//		}
	};
	
});