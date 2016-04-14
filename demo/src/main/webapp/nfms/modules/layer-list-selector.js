define([ "jquery", "message-bus", "layout", "customization", "i18n", "bootstrap" ], function($, bus, layout, customization, i18n) {

	var iconClosed = '<i class="fa fa-angle-double-right"></i>';
	var iconOpened = '<i class="fa fa-angle-double-left"></i>';

	var divsById = [];

	var row 		= $( '<div class="row height85"></div>' );
	layout.container.append( row );
	
	var col	= $( '<div class="col-md-3 col-sm-4 col-xs-5 height100"></div>' );
	row.append( col );
	var rowContainer = $( '<div class="row height100" style="  overflow: hidden;"></div>' );
	col.append( rowContainer );
	var container	= $( '<div class="col-md-12 col-sm-12 col-xs-12 layers-container no-padding open" role="tablist" aria-multiselectable="true"></div>' );
	rowContainer.append( container );
	
	var dashboardCol = $( '<div class="col-md-5 col-md-offset-4 col-sm-6 col-sm-offset-2 hidden-xs height100"></div>' );
	row.append( dashboardCol );
	
	$( window ).resize(function() {
		if( container.hasClass( 'open' ) ) {
			container.stop().animate( {width: container.parent().width() }, 300 );
		}
	});
	
	var addToggleLayersSection = function(){
		var row = $( '<div class="row no-margin" />' );
		container.append( row );
		var col	= $( '<div class="col-md-1 col-md-offset-11 col-sm-2 col-sm-offset-10 col-xs-4 col-xs-offset-8 no-padding" />' );
		row.append( col );
		var btnDiv	= $( '<div class="toggle-layers" />' );
		col.append( btnDiv );
		
		var btn		= $( '<button class="btn btn-collapse no-padding">'+iconOpened+'</button>' );
		btnDiv.append( btn );
		
		btn.click( function(e){
			bus.send( "layers-toggle-visibility" );
			btn.blur();
		});
	};
	addToggleLayersSection();
	
	
	var divContainer = $("<div/>").attr("id", "layers_container").appendTo("body");

	var divLayerListSelector = $("<div/>").attr("id", "layer_list_selector_pane").appendTo("body").hide();

	bus.listen("show-layer-panel", function(event, id) {
		for (divId in divsById) {
			if (divId == id) {
				divsById[divId].show();
			} else {
				divsById[divId].hide();
			}
		}
	});

	var registerLayerPanel = function(id, text, div) {

		var btn = $("<input type='radio'/>").attr("id", id).attr("name", "layerListSelector").appendTo(divLayerListSelector);
		var lbl = $("<label/>").addClass("noselect").attr("for", id).html(text).appendTo(divLayerListSelector);

		div.appendTo(divContainer);

		if ($.isEmptyObject(divsById)) {
			btn.attr("checked", "true");
		} else {
			div.hide();
		}

		// Workaround for http://bugs.jqueryui.com/ticket/7665
		lbl.click(function() {
			btn.checked = !btn.checked;
			btn.button("refresh");
			btn.change();
			bus.send("show-layer-panel", [ id ]);
			return false;
		});

		divsById[id] = div;
	};
	
	bus.listen("modules-loaded", function() {
//		divLayerListSelector.buttonset();
//		divLayerListSelector.show();
	});

	bus.listen("layers-loaded" , function(){
		//change icon to layers list group heading
		$('.collapse').on('hide.bs.collapse', function () {
			var $this = $( this );
			var icon = $this.parent().find( '[href=#' + $this.attr('id') +']' ).find( 'i' );
			icon.removeClass();
			icon.addClass( 'fa fa-caret-right' );
		});
		
		$('.collapse').on('show.bs.collapse', function () {
			var $this = $( this );
			var icon = $this.parent().find( '[href=#' + $this.attr('id') +']' ).find( 'i' );
			icon.removeClass();
			icon.addClass( 'fa fa-caret-down' );
		});
		
	});
	
	bus.listen( "layers-toggle-visibility", function( event ){
		var toggleLayersSection = container.find( '.toggle-layers' );
		var btn = toggleLayersSection.find( 'button' );
		if( container.hasClass( 'open' ) ) {
			container.removeClass( 'open' );
			
			// remove scroll bar in case there is
			container.css( 'overflow', 'hidden' );
			
//			container.animate( {width: "45px"}, 600 );
			container.animate( {'left': '-' + (container.parent().width() - toggleLayersSection.width() ) +'px' }, 500 );

			var panel = container.children( '.panel' );
			panel.animate( {opacity: "0"}, 500 );
			
			setTimeout( function(){
				btn.empty();
				btn.append( iconClosed );
				btn.blur();
				
			}, 200 );
			
		} else {
			container.addClass( 'open' );
			// add scroll bar in case there is overflow
			container.css( 'overflow', 'auto' );

//			container.animate( {width: container.parent().width() }, 600 );
			container.animate( {'left': '0px' }, 500 );

			var panel = container.children( '.panel' );
			panel.animate( {opacity: "1"}, 400 );

			setTimeout( function(){
				btn.empty();
				btn.append( iconOpened );
				btn.blur();
			}, 200 );
		}
	});
	
	return {
		"registerLayerPanel" 		: registerLayerPanel ,
		"layersContainer"			: container ,
		"layersDashboardContainer"	: dashboardCol 
	};
});
