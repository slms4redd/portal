/**
 * 
 */
define([ "module", "jquery", "message-bus", "map", "i18n", "customization",  "portal-string-utils", "jquery-easing"  ], 
		function(module, $, bus, map, i18n, customization ) {
	
	
	var provinceVisible 	= true;
	var ecoRegionVisible 	= false;
	
	bus.listen('layers-loaded', function(e){

		//redd project layers
		map.events.register("movestart", this, function (e) {
			$( '.admin-unit-label' ).css( { 'z-index':'-1' } ) ;
		});

		map.events.register("moveend", this, function (e) {
			$( '.admin-unit-label' ).remove();

			var layer = map.getLayer( 'province_label' );
			layer.refresh( {force:true} );
		});
		
		console.log( 'layers-loaded' );
		
		
	});
	
	bus.listen("layer-visibility", function(event, layerId, visible) {
		if( layerId === 'province' ){
			console.log( 'province' );
			var labels = $( '.admin-unit-label-province' );
			provinceVisible = visible;
			if( provinceVisible ){
				labels.css( {'z-index':'900'} );
			} else {
				labels.css( {'z-index':'-1'} );
				
			}
//			$('.redd_project').stop().remove();
//			$('.redd_project_marker').stop().remove();
//			
//			reddProjectsVisibile = visible;
//			
//			var layer = map.getLayer( 'province_label' );
//			layer.refresh( {force:true} );
		}
	});
	
	bus.listen( "wfs-feature-added", function( event , object ){
		var feature = object.feature;
		var layerId	= feature.layer.id;
		if( layerId == 'province_label' ){
//			console.log( object );
			console.log( map.getZoom() );
			
			var fid 	= feature.fid;
			var zone	= fid.substring( 0 , fid.indexOf('_') );
			var name 	= feature.attributes.name;
			
			var geom 	= feature.geometry;
			var point 	= map.getViewPortPxFromLonLat( new OpenLayers.LonLat(geom.x, geom.y) );
			
			var label = $( '<div class="admin-unit-label"></div>' );
			label.addClass( 'admin-unit-label-' + zone );
			label.html( name );
			
			$('body').append( label );
			
			var h =  label.innerHeight();
			var w =  label.innerWidth();
//			label.css( 'top' , ( point.y - (h/2) ) + 'px' );
//			label.css( 'left' , ( point.x - (w/2) )+ 'px'  );
			label.css( 'top' , ( point.y  ) + 'px' );
			label.css( 'left' , ( point.x - (w/4) )+ 'px'  );
			
			if( provinceVisible ){
				label.css( {'z-index':'900'} );
			} else {
				label.css( {'z-index':'-1'} );
			}
			label.removeClass (function (index, css) {
			    return (css.match (/(^|\s)zoom-\S+/g) || []).join(' ');
			});
			label.addClass( 'zoom-' + map.getZoom() );
		}
	});
	
	
	
});
	
