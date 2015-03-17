define([ "jquery", "message-bus", "layout", "customization", "i18n", "jquery-ui", "bootstrap" ], function($, bus, layout, customization, i18n, ui) {

	var divsById = [];

	var row 		= $( '<div class="row"></div>' );
//	var row 		= $( '<div class="row height100"></div>' );
	var container	= $( '<div class="col-md-2 panel-group layers-container open" id="group-accordion" role="tablist" aria-multiselectable="true"></div>' );
	row.append( container );
	layout.container.append( row );
	
	var layersContainerWidth = container.width() + "px";
	
	var addToggleLayersSection = function(){
		var row = $( '<div class="row no-margin no-padding" />' );
		container.append( row );
		var col	= $( '<div class="col-md-12 no-margin no-padding" />' );
		row.append( col );
		var btnDiv	= $( '<div class="toggle-layers" />' );
		col.append( btnDiv );
		
		var btn		= $( '<button class="btn"><i class="fa fa-angle-double-left"></i></button>' );
		btnDiv.append( btn );
		
		btn.click( function(e){
			if( container.hasClass( 'open' ) ) {
				container.children( '.panel' ).fadeOut( 400 );
				container.animate( {width: "30px"}, 500);
				container.removeClass( 'open' );
				
				setTimeout( function(){
					btn.empty();
					btn.append( $('<i class="fa fa-angle-double-right"></i>') );
					btn.blur();
				}, 200 );
			} else {
				container.animate( {width: layersContainerWidth }, 500);
				container.children( '.panel' ).fadeIn( 400 );
				container.addClass( 'open' );
				
				setTimeout( function(){
					btn.empty();
					btn.append( $('<i class="fa fa-angle-double-left"></i>') );
					btn.blur();
				}, 200 );
			}
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

	return {
		"registerLayerPanel" 	: registerLayerPanel ,
		"layersContainer"		: container
	};
});
