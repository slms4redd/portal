/**
 * 
 */
define([ "module", "jquery", "message-bus", "map", "i18n", "customization","features" , "portal-string-utils", "jquery-easing"  ], 
		function(module, $, bus, map, i18n, customization ) {
	
	
	var provinceVisible 	= true;
	var ecoRegionVisible 	= false;
	var districtVisible 	= false;
	var communeVisible 		= false;
	
	bus.listen('layers-loaded', function(e){

		//redd project layers
		map.events.register("movestart", this, function (e) {
			$( '.admin-unit-label' ).css( { 'z-index':'-1' } ) ;
		});

		map.events.register("moveend", this, function (e) {
			$( '.admin-unit-label' ).remove();
			
			refreshLayers();
		});
		
	});
	
	var refreshEcoregion = function(){
		refreshLayer( 'ecoregion_label' , 0 , ecoRegionVisible );
	};
	var refreshProvince = function(){
		refreshLayer( 'province_label' , 2 , provinceVisible );
	};
	var refreshDistrict = function(){
		refreshLayer( 'district_label' , 6 , districtVisible );
	};
	var refreshCommune = function(){
		refreshLayer( 'commune_label' , 9 , communeVisible );
	};
	
	var refreshLayer = function( layerId , zoom , visibility ){
		var layer  = map.getLayer( layerId );
		var currentZoom =  map.getZoom() 
		if( layer && visibility && currentZoom >= zoom ){
			
			layer.setVisibility( true );
			layer.refresh( {force:true} );
		} else {
			layer.setVisibility( false );
			
		}
	};
	
	var refreshLayers = function(){
		refreshEcoregion();
		refreshProvince();
		refreshDistrict();
		refreshCommune();
	};
	
	bus.listen("layer-visibility", function(event, layerId, visible) {
		$( '.admin-unit-label-' + layerId ).remove();

		switch ( layerId ) {
		case 'ecoregion':
			ecoRegionVisible = visible;
			
			refreshEcoregion();
			break;
		case 'province':
			provinceVisible = visible;
			
			refreshProvince();
			break;
		case 'district':
			districtVisible = visible;

			refreshDistrict();
			break;
		case 'commune':
			communeVisible = visible;

			refreshCommune();
			break;

		default:
			break;
		}
		
	});
	
	bus.listen( "wfs-feature-added", function( event , object ){
		var extent = map.getExtent();

		var feature = object.feature;
		var geom 	= feature.geometry;

		var layerId	= feature.layer.id;
		
		if( isLabelLayer( layerId) && extent.intersectsBounds(geom.getBounds()) ) {
			
			var fid 	= feature.fid;
			var zone	= fid.substring( 0 , fid.indexOf('_') );
			var name 	= feature.attributes.name;
			
			var point 	= map.getViewPortPxFromLonLat( new OpenLayers.LonLat(geom.x, geom.y) );
			
			var label = $( '<div class="admin-unit-label"></div>' );
			label.hide();
			label.addClass( 'admin-unit-label-' + zone );
			label.html( name );
			
			
			$('body').append( label );
			
			//position label
			var h =  label.innerHeight();
			var w =  label.innerWidth();

			label.css( 'top' , ( point.y  ) + 'px' );
			label.css( 'left' , ( point.x - ( 10 ) )+ 'px'  );
			
			//set visibility
			var visibile 	= null;
			var z			= null;
			switch ( zone ) {
			case 'ecoregion':
				visibile = ecoRegionVisible;
				break;
			case 'province':
				visibile = provinceVisible;
				z = 1;
				break;
			case 'district':
				visibile = districtVisible;
				z = 2;
				break;
			case 'commune':
				visibile = communeVisible;
				z = 3;
				break;
				

			default:
				break;
			}
			
			if( visibile ){
				label.css( {'z-index': ( 900 - z ) } );
				label.fadeIn();
			} else {
				label.css( {'z-index':'-1'} );
			}
			
			//add zoom class
			label.removeClass (function (index, css) {
			    return (css.match (/(^|\s)zoom-\S+/g) || []).join(' ');
			});
			label.addClass( 'zoom-' + map.getZoom() );
			
		}
	});
	
	var isLabelLayer = function( layerId ){
		var isLabelLayer = false;
		
		switch ( layerId ) {
		case 'province_label':
		case 'ecoregion_label':
		case 'district_label':
		case 'commune_label':
			isLabelLayer = true;
			break;
		default:
			break;
		}
		return isLabelLayer;
		
	};
	
});
	
