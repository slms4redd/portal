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

			var provinceLayer = map.getLayer( 'province_label' );
			provinceLayer.refresh( {force:true} );

			var ecoregionLayer = map.getLayer( 'ecoregion_label' );
			ecoregionLayer.refresh( {force:true} );
		});
		
	});
	
	bus.listen("layer-visibility", function(event, layerId, visible) {
		
		
		var labels 		= null;
		if( layerId === 'province' ){
			labels = $( '.admin-unit-label-province' );
			provinceVisible = visible;
		} else if( layerId === 'ecoregion' ){
			labels = $( '.admin-unit-label-ecoregion' );
			ecoRegionVisible = visible;
		}

		if( labels ){
			if( visible ){
				labels.css( {'z-index':'900'} );
				labels.fadeIn();
			} else {
				labels.css( {'z-index':'-1'} );
				labels.fadeOut( 100 );
			}
		}
		
	});
	
	bus.listen( "wfs-feature-added", function( event , object ){
		var feature = object.feature;
		var layerId	= feature.layer.id;
		
		if( layerId == 'province_label' || layerId == 'ecoregion_label' ){
			var fid 	= feature.fid;
			var zone	= fid.substring( 0 , fid.indexOf('_') );
			var name 	= feature.attributes.name;
			
			var geom 	= feature.geometry;
			var point 	= map.getViewPortPxFromLonLat( new OpenLayers.LonLat(geom.x, geom.y) );
			
			var label = $( '<div class="admin-unit-label"></div>' );
			label.hide();
			label.addClass( 'admin-unit-label-' + zone );
			label.html( name );
			
			$('body').append( label );
			
			var h =  label.innerHeight();
			var w =  label.innerWidth();

			label.css( 'top' , ( point.y  ) + 'px' );
			label.css( 'left' , ( point.x - ( 10 ) )+ 'px'  );
			
			var visibile = ( zone === 'province' ) ? provinceVisible : ecoRegionVisible;
			if( visibile ){
				label.css( {'z-index':'900'} );
				label.fadeIn();
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
	
