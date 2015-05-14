define([ "jquery", "message-bus", "layer-list-selector", "i18n" ], function($, bus, layerListSelector, i18n) {
	
	var iconOpened = '<span class="fa-stack"><i class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-angle-double-right fa-stack-1x"></i></span>' ;
	var iconClosed = '<span class="fa-stack"><i class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-tachometer fa-stack-1x"></i></span>' ;

	
	var dashboard = $( '<div class="row dashboard height100"></div>' );
	dashboard.css( 'opacity' , '0' );
	
//	dashboard.hide();
	layerListSelector.layersDashboardContainer.append( dashboard );
	
	
//	var addHeader = function( container ){
		
	var dashboardToggle = $( '<div class="col-md-1 no-padding dashboard-toggle"></div>' )
	dashboard.append( dashboardToggle );
	
	var btnCollapse = $( '<button class="btn btn-collapse">' + iconClosed + '</button>' );
	dashboardToggle.append( btnCollapse );
	
	btnCollapse.click( function(e){
		bus.send( "layers-dashboard-toggle-visibility" );
		btnCollapse.blur();
	});
	
	
	var dashboardContainer	= $( '<div class="col-md-11 no-padding height100 dashboard-container"></div>' );
	dashboard.append( dashboardContainer );
	
	var rowHeader	= $( '<div class="row dashboard-header height10"></div>')
	dashboardContainer.append( rowHeader );
	var colHeader	= $( '<div class="col-md-12"></div>' );
	rowHeader.append( colHeader );
	
	var btnGroup = '<div class="btn-group"><button type="button" class="btn layer-label">- Select Layer</button>'+
      '<button type="button" class="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">'+
       '<span class="caret"></span>'+
//        '<span class="sr-only">Toggle Dropdown</span>'+
      '</button>'+
      '<ul class="dropdown-menu" role="menu">'+
        '<li><button class="btn btn-default">layer 1</button></li>'+
        '<li><button class="btn btn-default">layer 2</button></li>'+
        '</ul>'+
    '</div>';

	colHeader.append( btnGroup );
	
	dashboard.css( 'right' , '-' + (dashboard.width() - dashboardToggle.width() ) +'px' );
	dashboard.addClass( 'closed' );
	dashboard.animate( {'opacity':0.9}, 300 );
	
	
	// add dashboard content
	var dashboardContent = $( '<div class="row dashboard-content height90"></div>' );
	dashboardContainer.append( dashboardContent );
	var dashboardContentCol	= $( '<div class="col-md-12 heigth100"></div>' );
	dashboardContent.append( dashboardContentCol );
	
	var divNav = $( '<div class="width100 height100 dashboard-content-selector"></div>' );
	dashboardContentCol.append( divNav );
	var ul = $( '<ul class="nav nav-tabs nav-justified"></ul>' );
	divNav.append( ul );
	
	var liLegend = $( '<li></li>' );
	ul.append( liLegend );
	var aLegend = $( '<button class="btn btn-default active"><i class="fa fa-th-list"></i> Legend</button>' );
	liLegend.append( aLegend );
	
	var liInfo = $( '<li></li>' );
	ul.append( liInfo );
	var aInfo = $( '<button class="btn btn-default"><i class="fa fa-info-circle"></i> Info</button>' );
	liInfo.append( aInfo );

	var liStats = $( '<li></li>' );
	ul.append( liStats );
	var aStats = $( '<button class="btn btn-default"><i class="fa fa-pie-chart"></i> Stats</button>' );
	liStats.append( aStats );
	
	
	
	bus.listen("layer-visibility", function(event, layerId, visible) {
		
	});
	
	
	bus.listen( "layers-dashboard-toggle-visibility" , function(event){
		var icon = null;
		if( dashboard.hasClass('closed') ){
			dashboard.removeClass( 'closed' ).addClass( 'opened' );
			dashboard.animate( {'right': 0 }, 500 );

			
			icon = iconOpened;
		} else {
			dashboard.removeClass( 'opened' ).addClass( 'closed' );
			dashboard.animate( {'right': '-' + (dashboard.width() - dashboardToggle.width() ) +'px' }, 500 );
			
			icon = iconClosed;
		}
		
		icon = $( icon );
		icon.hide();
		setTimeout( function(){
			btnCollapse.empty();
			btnCollapse.append( icon );
			btnCollapse.blur();
			
			icon.fadeIn();
		}, 300 );
	});
	
	
	
});
