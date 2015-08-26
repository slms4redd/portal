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
			+'<div class="popover-content collapsed"></div>'
			+'<div class="popover-content expanded">'
			
			+'<div class="project project_1"><i class="fa fa-circle"></i> '+i18n['redd_project_1_short_label']+'</div>'
			+'<div class="project project_2"><i class="fa fa-circle"></i> '+i18n['redd_project_2_short_label']+'</div>'
			+'<div class="project project_3"><i class="fa fa-circle"></i> '+i18n['redd_project_3_short_label']+'</div>'
			+'<div class="project project_4"><i class="fa fa-circle"></i> '+i18n['redd_project_4_short_label']+'</div>'
			+'<div class="project project_5"><i class="fa fa-circle"></i> '+i18n['redd_project_5_short_label']+'</div>'
			+'<div class="project project_6"><i class="fa fa-circle"></i> '+i18n['redd_project_6_short_label']+'</div>'
			+'<div class="project project_7"><i class="fa fa-circle"></i> '+i18n['redd_project_7_short_label']+'</div>'
			+'<div class="project project_8"><i class="fa fa-circle"></i> '+i18n['redd_project_8_short_label']+'</div>'
			+'<div class="project project_9"><i class="fa fa-circle"></i> '+i18n['redd_project_9_short_label']+'</div>'
			+'<div class="project project_10"><i class="fa fa-circle"></i> '+i18n['redd_project_10_short_label']+'</div>'
			+'<div class="project project_11"><i class="fa fa-circle"></i> '+i18n['redd_project_11_short_label']+'</div>'
			+'<div class="project project_12"><i class="fa fa-circle"></i> '+i18n['redd_project_12_short_label']+'</div>'
			+'<div class="project project_13"><i class="fa fa-circle"></i> '+i18n['redd_project_13_short_label']+'</div>'
			+'<div class="project project_14"><i class="fa fa-circle"></i> '+i18n['redd_project_14_short_label']+'</div>'
			+'<div class="project project_15"><i class="fa fa-circle"></i> '+i18n['redd_project_15_short_label']+'</div>'
			+'<div class="project project_16"><i class="fa fa-circle"></i> '+i18n['redd_project_16_short_label']+'</div>'
			
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
			console.log( layer );
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
				
				var popoverContent = popover.find('.popover');
				popoverContent.css( {top: h+'px',height: '0px' , bottom:'0px' } );
				popoverContent.stop().animate( {"top": "0px", "height": h+"px" } , 500 ,'easeInOutBack' ); 

				
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
			
			popover.find( '.popover-content.collapsed' ).html( province.projects.length + ' ' + i18n['projects'] );
			popover.find( '.popover-content.expanded' ).hide();
			
			
			$('body').append( popover );
			
			
			var h =  popover.innerHeight();
			var w =  popover.innerWidth();
			popover.css( 'top' , ( point.y - (h-5) ) + 'px' );
			popover.css( 'left' , ( point.x - (w/2-5) )+ 'px'  );
			
			
			var bindEvents = function(){
				var popoverContent = popover.find( '.popover' );
				
				var onmouseover =  function(e){
					popover.css( {'z-index':'9200'} ) ;
					popover.find( '.popover-content.collapsed' ).hide( 0 );
					
					popoverContent
					.animate({
						"height": (h+120)+"px" , 
						"width": (w+100)+"px", 
						"left":"-50px" , 
						"top":"-120px" , 
						"font-size":"12px" , 
						'background-color': 'rgba(4, 118, 210, 1);'
					} , 200 ,'easeInOutQuad' );
					
					
					setTimeout( function(){
						popover.find( '.popover-content.expanded' ).show( 0 );
						popover.find('.popover').off('mouseover',onmouseover);
						popover.find('.popover').on('mouseleave',onmouseout);
					}, 100 );
					
				}; 
				
				var onmouseout 	= function(){
					popover.find( '.popover-content.expanded' ).hide( 0 );
					
					popoverContent
					.animate({
						"height": (h)+"px" , 
						"width": (w)+"px", 
						"left":"0px" , 
						"top":"0px" , 
						"font-size":"11px" , 
						'background-color': 'rgba(4, 118, 210, 0.6);'
					} , 200 ,'easeInOutQuad' );
					
					
					setTimeout( function(){
						popover.find( '.popover-content.collapsed' ).show( 0 );
						popover.css( {'z-index' : '900'} ) ;
						popover.find('.popover').off('mouseleave',onmouseout);
						popover.find('.popover').on('mouseover',onmouseover);
					}, 100 );
				};
				
				popover.find('.popover').on('mouseover',onmouseover);
//				popover.find('.popover').mouseover(onmouseover);
				
				
			};
			bindEvents();
			
//			popoverContent.mouseout( function(e){
//				popoverContent.stop().animate( {"height": h+"px" , "width": w+"px" } , 500 ,'easeInOutBack' );
//				setTimeout( function(){
//					popover.find( '.popover-content.collapsed' ).fadeIn( 150 );
//					popover.find( '.popover-content.expanded' ).hide();
//				}, 350 );
//				
//			});

			return popover;
		}
	
	};
	
});
	
