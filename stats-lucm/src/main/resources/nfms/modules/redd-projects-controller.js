/**
 * 
 */
define([ "module", "jquery", "message-bus", "map", "i18n", "customization",  "portal-string-utils", 'redd_projects' ,"jquery-easing"], 
		function(module, $, bus, map, i18n, customization ) {
	
	var reddProjectsVisibile =  true;
	
	var config = module.config();
	
	var serverUrl 	= customization['info.serverUrl'] ;
	var wmsUri 		= customization['info.wmsUri'] ;
	
	// popover html content
	var popoverHtml = $( '<div class="redd_project"><div class="popover fade top in popover_province" data-style="redd_projects_tooltip" role="tooltip">'
			+'<div class="arrow"></div>'
			+'<h3 class="popover-title"></h3>'
			+'<div class="popover-content">'
			
			+'<div class="project project_1"><i class="fa fa-circle-thin"></i> '+i18n['redd_project_1_short_label']+'</div>'
			+'<div class="project project_2"><i class="fa fa-circle-thin"></i> '+i18n['redd_project_2_short_label']+'</div>'
			+'<div class="project project_3"><i class="fa fa-circle-thin"></i> '+i18n['redd_project_3_short_label']+'</div>'
			+'<div class="project project_4"><i class="fa fa-circle-thin"></i> '+i18n['redd_project_4_short_label']+'</div>'
			+'<div class="project project_5"><i class="fa fa-circle-thin"></i> '+i18n['redd_project_5_short_label']+'</div>'
			+'<div class="project project_6"><i class="fa fa-circle-thin"></i> '+i18n['redd_project_6_short_label']+'</div>'
			+'<div class="project project_7"><i class="fa fa-circle-thin"></i> '+i18n['redd_project_7_short_label']+'</div>'
			+'<div class="project project_8"><i class="fa fa-circle-thin"></i> '+i18n['redd_project_8_short_label']+'</div>'
			+'<div class="project project_9"><i class="fa fa-circle-thin"></i> '+i18n['redd_project_9_short_label']+'</div>'
			+'<div class="project project_10"><i class="fa fa-circle-thin"></i> '+i18n['redd_project_10_short_label']+'</div>'
			+'<div class="project project_11"><i class="fa fa-circle-thin"></i> '+i18n['redd_project_11_short_label']+'</div>'
			+'<div class="project project_12"><i class="fa fa-circle-thin"></i> '+i18n['redd_project_12_short_label']+'</div>'
			+'<div class="project project_13"><i class="fa fa-circle-thin"></i> '+i18n['redd_project_13_short_label']+'</div>'
			+'<div class="project project_14"><i class="fa fa-circle-thin"></i> '+i18n['redd_project_14_short_label']+'</div>'
			+'<div class="project project_15"><i class="fa fa-circle-thin"></i> '+i18n['redd_project_15_short_label']+'</div>'
			+'<div class="project project_16"><i class="fa fa-circle-thin"></i> '+i18n['redd_project_16_short_label']+'</div>'
			
			+'</div>'
			+'</div>'
			+'</div>' );

	
	bus.listen('layers-loaded', function(e){

		//redd project layers
		map.events.register("movestart", this, function (e) {
			$('.redd_project').stop().hide();
		});

		map.events.register("moveend", this, function (e) {
			$('.redd_project').stop().hide();
			var layer = map.getLayer( 'province_center' );
			layer.refresh( {force:true} );
		});
		
		
	});
	
	bus.listen("layer-visibility", function(event, layerId, visible) {
		if( layerId === 'province_center' ){
			
			$('.redd_project').stop().remove();
			
			reddProjectsVisibile = visible;
			
			var layer = map.getLayer( 'province_center' );
			layer.refresh( {force:true} );
		}
	});
	
	bus.listen( "wfs-feature-added", function( event , object ){

		var feature = object.feature; 
		var id 		= feature.attributes.province_c;

		if( hasPopover(id) ){
			
			$( '.feature_' + id ).stop().remove();

			var popover = createPopover( feature );

			if( reddProjectsVisibile ){
				var h =  popover.innerHeight() ;
//				console.log( h );
				
				var popoverContent = popover.find('.popover');
				popoverContent.css({top: h+'px',height: '0px' , bottom:'0px' });
				popoverContent.stop().animate({"top": "0px", "height": h+"px" } , 500 ,'easeInOutElastic'); 

				
			} else {
				popover.stop().hide();
			}
		
			
		}
		
	});
	
	
	var hasPopover = function( id ){
		var province = REDDProjects.provinces[id];
		return province != null;
	};
	
	var createPopover = function( feature ){
		var id = feature.attributes.province_c;
		
		var province = REDDProjects.provinces[id];
		if( province ){
			var popover = popoverHtml.clone();
			var geom 	= feature.geometry;
			var point 	= map.getViewPortPxFromLonLat( new OpenLayers.LonLat(geom.x, geom.y) );
			
			popover.addClass( 'feature_'+id );
			
			popover.find( '.popover-title' ).html( feature.attributes.name );
			
			for( var i in province.projects ){
				var proj = province.projects [i];
				popover.find( '.project_' + proj ).show();
			}
			
			$('body').append( popover );

			var h =  popover.innerHeight() ;
			popover.css( 'top' , ( point.y - (h-5) ) + 'px' );
			popover.css( 'left' , ( point.x - 85 )+ 'px'  );
			
			return popover;
		}
	
	};
	
});
	
