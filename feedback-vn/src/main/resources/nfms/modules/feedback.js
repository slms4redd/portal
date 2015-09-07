define([ "message-bus", "layout" , "i18n", "jquery", "toolbar" , "tutorial" , "portal-string-utils" , "portal-ui"],//
function(bus, layout, i18n, $, toolbar) {
	
	
	var col		= $( '<div class="btn-container feedback-btn-container" />');
	toolbar.append( col );

	var btn 	= $( '<button class="btn btn-default"><i class="fa fa-bullhorn"></i>&nbsp;&nbsp;' + i18n['Feedback.btn'] + '</button>' );
	col.append( btn );
	btn.click( function(){
		if( feedback.hasClass( 'closed' ) ){
			openFeedback();
		} else {
			closeFeedback();
		}
		btn.blur();
	});	
	
	var container		= $( '<div class="feedback-container" />' );
	layout.container.append( container );
		
	var feedback = $(  '<div class="feedback closed" />' );
	container.append( feedback );	
	
	
	var rowButton = $(  '<div class="row feedback-btn no-margin" />' );
	feedback.append( rowButton );
	
//	rowButton.append( '<div class="col-md-12 feedback-btn-bottom-border height100" />' );
	var colButton = $(  '<div class="col-md-12 no-padding height100" />' );
	rowButton.append( colButton );
//	rowButton.append( '<div class="col-md-4 feedback-btn-bottom-border height100" />' );
	
	var feedbackToggleBtn = $( '<button class="btn btn-default"><i class="fa fa-times-circle"></i>&nbsp;&nbsp;' + i18n['Feedback.close-btn'] + '</button>' );
//	var feedbackToggleBtn = $( '<button class="btn btn-default height100"><i class="fa fa-bullhorn"></i>  Feedback</button>' );
	colButton.append( feedbackToggleBtn );

	feedbackToggleBtn.click( function(){
		if( feedback.hasClass( 'closed' ) ){
			openFeedback();
		} else {
			closeFeedback();
		}
		feedbackToggleBtn.blur();
	});	
	
	var openFeedback = function(){
		container.animate( {'top': '0%' }, 400 );
//		container.animate( {'top': '40%' }, 400 );
		feedback.removeClass().addClass( 'feedback opened' );
	};

	var closeFeedback = function(){
		container.animate( {'top': '-60%' }, 400 );
		feedback.removeClass().addClass( 'feedback closed' );
		
		feedbackForm.find( 'button[type=reset]' ).click();
		affiliationOther.prop( 'disabled' , 'disabled' );
		locationOther.prop( 'disabled' , 'disabled' );

	};
	
	var rowForm = $(  '<div class="row feedback-form no-margin" />' );
	feedback.append( rowForm );
	
	var colForm = $(  '<div class="col-md-12" />' );
	rowForm.append( colForm );
	
	
	var feedbackForm = $( '<form class="form-horizontal"/>' );
	colForm.append( feedbackForm );
	var fieldset	= $( '<fieldset/>' );
	feedbackForm.append( fieldset );
	
//	var drawingTools = 
//		'<div class="form-group">'+
//	      '<label class="col-md-2  control-label">Draw</label>'+
//	      '<div class="col-md-8 olControlPortalToolbar" id="dr_tools">'+
//	      '</div>'+
//	    '</div>';
//	fieldset.append( $(drawingTools) );
	
//	var layerSelect = 
//		'<div class="form-group">'+
//			'<label for="layersFeedback" class="col-md-2  control-label">Layers</label>'+
//			'<div class="col-md-8">'+
////				'<select class="form-control" id="layersFeedback"/>'+
//				'<select multiple="" class="form-control" id="layersFeedback"/>'+
//			'</div>'+
//		'</div>';
//	fieldset.append( $(layerSelect) );
	
	var email = 
		'<div class="form-group">'+
	      '<label for="email" class="col-md-4  control-label">' + i18n['Feedback.form.email'] + ' *</label>'+
	      '<div class="col-md-7">'+
	        '<input type="text" class="form-control" name="email" placeholder="' + i18n['Feedback.form.email'] + '">'+
	      '</div>'+
	    '</div>';
	fieldset.append( $(email) );
	
	var affiliation = 
		'<div class="form-group affiliation-box">'+
	      '<label for="" class="col-md-4  control-label">' + i18n['Feedback.form.affiliation'] + ' *</label>'+
	      '<div class="col-md-7">'+
	        '<div class="radio"> <label> <input type="radio" name="affiliation" value="government">' + i18n['Feedback.form.government'] + '</label></div>'+
	        '<div class="radio"> <label> <input type="radio" name="affiliation" value="ngo">' + i18n['Feedback.form.ngo'] + '</label></div>'+
	        '<div class="radio"> <label> <input type="radio" name="affiliation" value="international_organization">' + i18n['Feedback.form.int_org'] + '</label></div>'+
	        '<div class="radio feedback-input-group"> <label class="feedback-input-group-addon"> <input type="radio" name="affiliation" value="other"></label><input type="text" class="form-control" name="affiliation_other" placeholder="'+i18n['Feedback.form.other_specify']+'"></div>'+
//	        '<div class="radio"> <label> <input type="radio" name="affiliation" value="other" checked="">' + i18n['Feedback.form.other_specify'] + '</label><input type="text" class="form-control" id="affiliation_other" name="affiliation_other" placeholder="'+i18n['Feedback.form.other_specify']+'"></div>'+
	      '</div>'+
	    '</div>';
	fieldset.append( $(affiliation) );
	
	
	var location = 
		'<div class="form-group location-box">'+
	      '<label class="col-md-4  control-label">' + i18n['Feedback.form.location'] + ' *</label>'+
	      '<div class="col-md-7">'+
	        '<div class="radio"> <label> <input type="radio" name="location" value="vietnam">' + i18n['Feedback.form.vietnam'] + '</label></div>'+
	        '<div class="radio feedback-input-group"> <label class="feedback-input-group-addon"> <input type="radio" name="location" value="other" ></label><input type="text" class="form-control" name="location_other" placeholder="'+i18n['Feedback.form.other_specify']+'"></div>'+
	      '</div>'+
	    '</div>';
	fieldset.append( $(location) );
  
	var comments = 
		'<div class="form-group">'+
			'<label for="comments" class="col-md-4  control-label">' + i18n['Feedback.form.comments'] + ' *</label>'+
			'<div class="col-md-7">'+
				'<textarea class="form-control" rows="3" name="comments"></textarea>'+
			'</div>'+
		'</div>';
	fieldset.append( $(comments) );
	
	var buttons = 
		$( '<div class="form-group" style="padding-top: 10px;">'+
			'<div class="col-md-3 col-md-offset-3">'+
				'<button type="reset" class="btn btn-default active">' + i18n['Feedback.form.reset'] + '</button>'+
			'</div>'+
			'<div class="col-md-3">'+
				' <button type="button" class="btn btn-default active feedback-submit-btn">' + i18n['Feedback.form.submit'] + '</button>'+
			'</div>'+
		'</div>' );
	fieldset.append( buttons );
	
	var affiliationOther 	= feedbackForm.find( 'input[name=affiliation_other]' );
	affiliationOther.prop( 'disabled' , 'disabled' );
	var affiliationInputs	= feedbackForm.find( 'input[name=affiliation]' );
	affiliationInputs.change( function(e){
		if( $(this).val() == 'other' ){
			affiliationOther.prop( 'disabled' , false );
		} else {
			affiliationOther.prop( 'disabled' , 'disabled' );
			affiliationOther.val( '' );
		}
	});

	var locationOther 		= feedbackForm.find( 'input[name=location_other]' );
	locationOther.prop( 'disabled' , 'disabled' );
	var locationInputs 		= feedbackForm.find( 'input[name=location]' );
	locationInputs.change( function(e){
		if( $(this).val() == 'other' ){
			locationOther.prop( 'disabled' , false );
		} else {
			locationOther.prop( 'disabled' , 'disabled' );
			locationOther.val( '' );
		}
	});

	// add feedback layer
//	var feedbackLayers 	= new Array();
//		div : document.getElementById( "dr_tools" )
//	});
	
	
	var txtEmail 			= feedbackForm.find( '[name=email]' );
	var txtComment 			= feedbackForm.find( '[name=comments]' );
	var mailRegex 			= /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	var submitForm = function() {

		// vaidate email
		if ( !mailRegex.test(txtEmail.val()) ){
			bus.send("error-popover", [ i18n["Feedback.invalid-email-address" ] , txtEmail]);
		} else {
			
			// validate affiliation
			var affiliation 		= feedbackForm.find( 'input[name=affiliation]:checked' );
			
			if( affiliation.length <= 0 || StringUtils.isBlank(affiliation.val()) || (affiliation.val()=='other' && StringUtils.isBlank(affiliationOther.val()) ) ){
				var box 		= feedbackForm.find( '.affiliation-box' );
//				bus.send("error", [ i18n["Feedback.invalid-affiliation"] , offset]);
				bus.send("error-popover", [ i18n["Feedback.invalid-affiliation"] , box]);
			
			} else {
				
				// validate location
				var location  		= feedbackForm.find( 'input[name=location]:checked' );
				// || (location.val()=='other' && StringUtils.isBlank(locationOther.val()) )
				if( location.length <= 0 || StringUtils.isBlank(location.val()) ){
					
					var box 		= feedbackForm.find( '.location-box' );
					bus.send("error-popover", [ i18n["Feedback.invalid-location"] , box]);
//					bus.send("error", [ i18n["Feedback.invalid-location"] , offset]);
				} else {
					// validate comments
					if( !txtComment.val() ){
						bus.send("error-popover", [ i18n["Feedback.no-comments"] , txtComment]);
					} else {
						UI.lock();
						// Do submit
						var data = feedbackForm.serialize();
						
						bus.send("ajax", {
							type : 'POST',
							url : 'create-comment',
							data : data,
							success : function(data, textStatus, jqXHR) {
								UI.unlock();
								
								var offset = feedbackToggleBtn.offset(); 
								offset.top = offset.top - 60;
								bus.send("info", [ i18n["Feedback.mail_sent"] ]);
//								bus.send("info", [ i18n["Feedback.mail_sent"] , offset]);

								closeFeedback();
							},
							errorFunction : function(){
								UI.unlock();
							},
							errorMsg : i18n["Feedback.submit_error"]
						});
					
					}
					
				}
				
			}
			
		}
	
	};
	
	feedbackForm.find( 'button.feedback-submit-btn' ).click( function(event){
		event.preventDefault();
		submitForm();
	});
	
	

	// Listen events
//	bus.listen("layer-visibility", function(event, layerId, visibility) {
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
//	});

//	bus.listen("add-layer", function(event, portalLayer) {
//		if (portalLayer["feedback"]) {
//			feedbackLayers[portalLayer.id] = {
//				name : portalLayer.label,
//				visibility : false
//			};
//			
//			var option = $( '<option />' );
//			option.attr( 'value' , portalLayer.id );
//			option.html( portalLayer.label );
//			
//			$( '#layersFeedback' ).append( option );
//			
//		}
//	});
	
//	var refreshYear = function() {
//		var text = "";
//		var selectedLayer = feedbackLayers[cmbLayer.val()];
//		if (selectedLayer != null) {
//			timestamp = selectedLayer["timestamp"];
//			if (timestamp != null) {
//				text = timestamp.getUTCFullYear();
//			}
//		}
////		lblTimestamp.html(text);
//	};
	
//	bus.listen("layer-timestamp-selected", function(event, layerId, timestamp) {
//		if (layerId in feedbackLayers) {
//			feedbackLayers[layerId].timestamp = timestamp;
//			refreshYear();
//		}
//	});
});