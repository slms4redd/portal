define([ "message-bus", "layout" , "url-parameters", "map", "toolbar", "i18n", "jquery", "openlayers", "edit-controls" ],//
function(bus, layout, urlParameters, map, toolbar, i18n, $) {
	
	var col		= $( '<div class="btn-container feedback-btn-container" />');
	toolbar.append( col );

	var btn 	= $( '<button class="btn btn-default"><i class="fa fa-bullhorn"></i>&nbsp;&nbsp;' + i18n['Feedback.btn'] + '</button>' );
	col.append( btn );
	btn.click( function(e){
		toggleFeedback();
		btn.blur();
	});	
	
	var container		= $( '<div class="feedback-container" />' );
	layout.container.append( container );
		
	var feedback = $(  '<div class="feedback closed" />' );
	container.append( feedback );	
	
	
	var rowButton = $(  '<div class="row feedback-btn no-margin" />' );
	feedback.append( rowButton );
	
//	rowButton.append( '<div class="col-md-4 feedback-btn-bottom-border height100" />' );
	var colButton = $(  '<div class="col-md-12 no-padding height100" />' );
	rowButton.append( colButton );
//	rowButton.append( '<div class="col-md-4 feedback-btn-bottom-border height100" />' );
	
//	var btn = $( '<button class="btn btn-default height100"><i class="fa fa-bullhorn"></i>  Feedback</button>' );
//	colButton.append( btn );
	var feedbackToggleBtn = $( '<button class="btn btn-default"><i class="fa fa-times-circle"></i>&nbsp;&nbsp;' + i18n['Feedback.close-btn'] + '</button>' );
	colButton.append( feedbackToggleBtn );

	feedbackToggleBtn.click( function(e){
		toggleFeedback();
		feedbackToggleBtn.blur();
	});	
	
	var toggleFeedback = function(){
		if( feedback.hasClass( 'closed' ) ){
			openFeedback();
		} else {
			closeFeedback();
		}		
	};

	var openFeedback = function(){
		container.show();
		container.animate( {'top': '0%' }, 400 );

		feedback.removeClass().addClass( 'feedback opened' );
		
		bus.send( "activate-exclusive-control", drawingToolbar );
		map.addLayer( feedbackLayer );
	};

	var closeFeedback = function(){
		container.animate( {'top': '-60%' }, 400 , function(){
			container.hide();
		});

		feedback.removeClass().addClass( 'feedback closed' );
		
		feedbackLayer.removeAllFeatures();
		bus.send( "activate-default-exclusive-control" );
		map.removeLayer( feedbackLayer );
		
		feedbackForm.find( 'button[type=reset]' ).click();
	};

	$( window ).resize( function(e){
		console.log( 'feedback' ) ;
		var top = feedback.hasClass( 'closed' ) ? '-60%' : '0%';
		container.animate( {'top': top } , 0 );
	});
	
	var rowForm = $(  '<div class="row feedback-form" />' );
	feedback.append( rowForm );
	
	var colForm = $(  '<div class="col-md-12" />' );
	rowForm.append( colForm );
	
	
	var feedbackForm = $( '<form class="form-horizontal"/>' );
	colForm.append( feedbackForm );
	var fieldset	= $( '<fieldset/>' );
	feedbackForm.append( fieldset );
	
	var drawingTools = 
		'<div class="form-group">'+
	      '<label class="col-md-2 col-md-offset-1 control-label">Draw</label>'+
	      '<div class="col-md-8 olControlPortalToolbar" id="dr_tools">'+
	      '</div>'+
	    '</div>';
	fieldset.append( $(drawingTools) );
	
	var layerSelect = 
		'<div class="form-group">'+
			'<label for="layersFeedback" class="col-md-2 col-md-offset-1 control-label">Layers</label>'+
			'<div class="col-md-8">'+
//				'<select class="form-control" id="layersFeedback"/>'+
				'<select multiple="" class="form-control" id="layersFeedback"/>'+
			'</div>'+
		'</div>';
	fieldset.append( $(layerSelect) );
	
	var email = 
		'<div class="form-group">'+
	      '<label for="inputEmail" class="col-md-2 col-md-offset-1 control-label">Email *</label>'+
	      '<div class="col-md-8">'+
	        '<input type="text" class="form-control" id="inputEmail" placeholder="Email">'+
	      '</div>'+
	    '</div>';
	fieldset.append( $(email) );
	
	var comments = 
		'<div class="form-group">'+
			'<label for="comments" class="col-md-2 col-md-offset-1 control-label">Comments *</label>'+
			'<div class="col-md-8">'+
				'<textarea class="form-control" rows="3" id="comments"></textarea>'+
			'</div>'+
		'</div>';
	fieldset.append( $(comments) );
	
	var buttons = 
		'<div class="form-group">'+
			'<div class="col-md-3 col-md-offset-3">'+
				'<button type="reset" class="btn btn-default active">Reset</button>'+
			'</div>'+
			'<div class="col-md-3">'+
				' <button type="button" class="btn btn-default active feedback-submit-btn">Submit</button>'+
			'</div>'+
		'</div>';
	fieldset.append( $(buttons) );
	
	
	// add feedback layer
	var feedbackLayers 	= new Array();
	var feedbackLayer 	= new OpenLayers.Layer.Vector( "Feedback" );
	var drawingToolbar 	= new OpenLayers.Control.PortalToolbar(feedbackLayer, {
		div : document.getElementById( "dr_tools" )
	});
	
	
	var txtEmail 			= $( '#inputEmail' );
	var txtComment 			= $( '#comments' );
	var layersFeedback 		= $( '#layersFeedback' );
	var submitForm = function() {

		var mailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if ( !mailRegex.test(txtEmail.val()) ){
			bus.send("error", i18n["Feedback.invalid-email-address"]);
		} else if( !drawingToolbar.hasFeatures()) {
			bus.send("error", i18n["Feedback.no-geometries"]);
		} else if( !txtComment.val() ){
			bus.send("error", i18n["Feedback.no-comments"]);
		} else {
			// Do submit
			
//			var data = feedbackForm.serialize();
			var layers = []; 
			layersFeedback.find(':selected').each(function(i, selected){ 
				layers[i] = $(selected).val(); 
			});
			var data = {
				"lang" 		: urlParameters.get("lang"),
				"comment" 	: txtComment.val(),
				"geometry" 	: drawingToolbar.getFeaturesAsWKT(),
				"layers" 	: layers.join(),
				"email" 	: txtEmail.val()
			};
//			console.log( data );
//			var timestamp = feedbackLayers[cmbLayer.val()].timestamp;
//			if (timestamp != null) {
//				data.date = timestamp.getDate() + "/" + (timestamp.getMonth() + 1) + "/" + timestamp.getFullYear();
//			}

			
//			bus.send("ajax", {
//				type : 'POST',
//				url : 'create-comment?',
//				data : data,
//				success : function(data, textStatus, jqXHR) {
//					bus.send("info", i18n["Feedback.verify_mail_sent"]);
//					dlg.dialog('close');
//				},
//				errorMsg : i18n["Feedback.submit_error"]
//			});
		}
	
	};
	
	feedbackForm.find( 'button.feedback-submit-btn' ).click( function(event){
		event.preventDefault();
		submitForm();
	});
	
	

	// Listen events
	bus.listen("layer-visibility", function(event, layerId, visibility) {
//		if (layerId in feedbackLayers) {
//			feedbackLayers[layerId].visibility = visibility;
//			var currentValue = cmbLayer.val();
//			cmbLayer.empty();
//			for (layerId in feedbackLayers) {
//				var layerInfo = feedbackLayers[layerId];
//				if (layerInfo["visibility"]) {
//					$("<option/>").attr("value", layerId).html(layerInfo.name).appendTo(cmbLayer);
//				}
//			}
//			if (currentValue != null && cmbLayer.find("option[value='" + currentValue + "']").length > 0) {
//				cmbLayer.val(currentValue);
//			} else {
//				var firstOption = cmbLayer.find("option:first").val();
//				cmbLayer.val(firstOption);
//			}
//		}
	});

	bus.listen("add-layer", function(event, portalLayer) {
		if (portalLayer["feedback"]) {
			feedbackLayers[portalLayer.id] = {
				name : portalLayer.label,
				visibility : false
			};
			
			var option = $( '<option />' );
			option.attr( 'value' , portalLayer.id );
			option.html( portalLayer.label );
			
			$( '#layersFeedback' ).append( option );
			
		}
	});
	
	var refreshYear = function() {
		var text = "";
		var selectedLayer = feedbackLayers[cmbLayer.val()];
		if (selectedLayer != null) {
			timestamp = selectedLayer["timestamp"];
			if (timestamp != null) {
				text = timestamp.getUTCFullYear();
			}
		}
//		lblTimestamp.html(text);
	};
	
	bus.listen("layer-timestamp-selected", function(event, layerId, timestamp) {
		if (layerId in feedbackLayers) {
			feedbackLayers[layerId].timestamp = timestamp;
			refreshYear();
		}
	});
});