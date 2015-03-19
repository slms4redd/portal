define([ "jquery", "message-bus", "layout", "customization", "i18n", "jquery-ui", "bootstrap" ], function($, bus, layout, customization, i18n, ui) {
	var iconClosed = '<span class="fa-stack"><i class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-angle-double-right fa-stack-1x"></i></span>';
	var iconOpened = '<span class="fa-stack"><i class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-angle-double-left fa-stack-1x"></i></span>';

	var divsById = [];

	var row 		= $( '<div class="row no-margin"></div>' );
//	var row 		= $( '<div class="row height100"></div>' );
	var container	= $( '<div class="col-md-3 col-sm-3 col-xs-3 panel-group layers-container open" id="group-accordion" role="tablist" aria-multiselectable="true"></div>' );
	row.append( container );
	layout.container.append( row );
	
	var addToggleLayersSection = function(){
		var row = $( '<div class="row no-margin no-padding" />' );
		container.append( row );
		var col	= $( '<div class="col-md-12 no-margin no-padding" />' );
		row.append( col );
		var btnDiv	= $( '<div class="toggle-layers" />' );
		col.append( btnDiv );
		
		var btn		= $( '<button class="btn">'+iconOpened+'</button>' );
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
		var btn = container.find( '.toggle-layers button' );
		if( container.hasClass( 'open' ) ) {
			container.removeClass( 'open' );
			
//			container.slide( {direction:'left'} );
			container.animate( {width: "45px"}, 600 );
			
			var panel = container.children( '.panel' );
			panel.animate( {opacity: "0"}, 500 );
//			panel.find( '.in' ).animate( {opacity: "0"}, 500 );
			
			setTimeout( function(){
				btn.empty();
				btn.append( iconClosed );
				btn.blur();
				
			}, 200 );
			
		} else {
			container.addClass( 'open' );
			container.animate( {width: $( document ).width() / 4 }, 600 );
			
			var panel = container.children( '.panel' );
			panel.animate( {opacity: "1"}, 400 );
//			panel.find( '.in' ).animate( {opacity: "1"}, 0 );				

			setTimeout( function(){
				btn.empty();
				btn.append( iconOpened );
				btn.blur();
			}, 200 );
		}
	});
	
	return {
		"registerLayerPanel" 	: registerLayerPanel ,
		"layersContainer"		: container
	};
});
