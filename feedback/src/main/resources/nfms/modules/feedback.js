define([ "message-bus", "layout" , "url-parameters", "map", "toolbar", "i18n", "jquery", "openlayers", "edit-controls" ],//
function(bus, layout, urlParameters, map, toolbar, i18n, $) {
	
	var container		= $( '<div class="feedback-container" />' );
	layout.container.append( container );
		
	var feedback = $(  '<div class="feedback closed" />' );
	container.append( feedback );	
	
	
	var rowButton = $(  '<div class="row feedback-btn" />' );
	feedback.append( rowButton );
	
	rowButton.append( '<div class="col-md-4 feedback-btn-bottom-border height100" />' );
	var colButton = $(  '<div class="col-md-4 no-padding height100" />' );
	rowButton.append( colButton );
	rowButton.append( '<div class="col-md-4 feedback-btn-bottom-border height100" />' );
	
	var btn = $( '<button class="btn btn-default height100"><i class="fa fa-bullhorn"></i>  Feedback</button>' );
	colButton.append( btn );

	btn.click( function(){
		var top 		= '90%';
		var cssClass 	= 'closed';
		if( feedback.hasClass( 'closed' ) ){
			top 		= '0px';
			cssClass 	= 'opened';
		}
		feedback.animate( {'top': top }, 400 );
		feedback.removeClass().addClass( 'feedback ' + cssClass );
	});	
	
	var rowForm = $(  '<div class="row feedback-form" />' );
	feedback.append( rowForm );
	
	var colForm = $(  '<div class="col-md-12" />' );
	rowForm.append( colForm );
	
	
	var form 		= $( '<form class="form-horizontal"/>' );
	colForm.append( form );
	var fieldset	= $( '<fieldset/>' );
	form.append( fieldset );
	
	var email = 
		'<div class="form-group">'+
	      '<label for="inputEmail" class="col-md-2 col-md-offset-1 control-label">Email*</label>'+
	      '<div class="col-md-8">'+
	        '<input type="text" class="form-control" id="inputEmail" placeholder="Email">'+
	      '</div>'+
	    '</div>';
	fieldset.append( $(email) );
	
	var comments = 
		'<div class="form-group">'+
			'<label for="comments" class="col-md-2 col-md-offset-1 control-label">Comments*</label>'+
			'<div class="col-md-8">'+
				'<textarea class="form-control" rows="5" id="comments"></textarea>'+
			'</div>'+
		'</div>';
	fieldset.append( $(comments) );
	
	var layerSelect = 
		'<div class="form-group">'+
			'<label for="layersFeedback" class="col-md-2 col-md-offset-1 control-label">Mention layers</label>'+
			'<div class="col-md-8">'+
				'<select multiple="" class="form-control" id="layersFeedback"/>'+
			'</div>'+
		'</div>';
	fieldset.append( $(layerSelect) );

	
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
	
	
	
	var feedbackLayers = new Array();

	// Dialog controls
	var dlg;
	var cmbLayer;
	var lblTimestamp;
	var txtEmail;
	var txtComment;
	var editToolbar;

	var feedbackLayer = new OpenLayers.Layer.Vector("Feedback");

	var initializeDialog = function() {
		dlg = $("<div/>").attr("id", "feedback_popup");
		$("<label/>").addClass("feedback-form-left").html("Capa:").appendTo(dlg);
		cmbLayer = $("<select/>").attr("id", "feedback-layer-combo").appendTo(dlg);
		cmbLayer.change(refreshYear);
		lblTimestamp = $("<span/>").appendTo(dlg);

		dlg.append("<br/>");
		$("<label/>").addClass("feedback-form-left").html("Drawing tools:").appendTo(dlg);
		$("<div/>").attr("id", "fb_toolbar").addClass("olControlPortalToolbar").appendTo(dlg);

		dlg.append("<br/>");
		$("<label/>").addClass("feedback-form-left").html("Email:").appendTo(dlg);
		txtEmail = $("<input/>").attr("type", "text").attr("size", "40").appendTo(dlg);

		dlg.append("<br/>");
		$("<label/>").addClass("feedback-form-left").html("Comentario:").appendTo(dlg);
		txtComment = $("<textarea/>").attr("cols", "40").attr("rows", "6").appendTo(dlg);

		dlg.append("<br/>");
		var btnClose = $("<div/>").html("Cerrar").appendTo($("<div/>").addClass("feedback-form-left").appendTo(dlg));
//		btnClose.button().click(function() {
//			dlg.dialog('close');
//		});
		var btnSubmit = $("<div/>").html("Enviar").appendTo(dlg);
//		btnSubmit.button().click(function() {
//			submit();
//		});

		dlg.dialog({
			autoOpen : false,
			closeOnEscape : false,
			width : "auto",
			zIndex : 2000,
			resizable : false,
			position : [ 270, 150 ],
			title : i18n["feedback_title"],
			close : deactivateFeedback
		});

		// Need to create after the dialog is in the DOM otherwise the call to
		// getElementById returns null
		editToolbar = new OpenLayers.Control.PortalToolbar(feedbackLayer, {
			div : document.getElementById("fb_toolbar")
		});

	}

	var submit = function() {
		var mailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!mailRegex.test(txtEmail.val())) {
			bus.send("error", i18n["Feedback.invalid-email-address"]);
		} else if (!editToolbar.hasFeatures()) {
			bus.send("error", i18n["Feedback.no-geometries"]);
		} else {
			// Do submit

			var data = {
				"lang" : urlParameters.get("lang"),
				"comment" : txtComment.val(),
				"geometry" : editToolbar.getFeaturesAsWKT(),
				"layerName" : cmbLayer.val(),
				"email" : txtEmail.val()
			};

			var timestamp = feedbackLayers[cmbLayer.val()].timestamp;
			if (timestamp != null) {
				data.date = timestamp.getDate() + "/" + (timestamp.getMonth() + 1) + "/" + timestamp.getFullYear();
			}

			bus.send("ajax", {
				type : 'POST',
				url : 'create-comment?',
				data : data,
				success : function(data, textStatus, jqXHR) {
					bus.send("info", i18n["Feedback.verify_mail_sent"]);
					dlg.dialog('close');
				},
				errorMsg : i18n["Feedback.submit_error"]
			});
		}
	}

	var activateFeedback = function() {
		$("#button_feedback").addClass('selected');
		txtEmail.val("");
		txtComment.val("");
		bus.send("activate-exclusive-control", editToolbar);
		map.addLayer(feedbackLayer);
		dlg.dialog("open");
	}

	var deactivateFeedback = function() {
		feedbackLayer.removeAllFeatures();
		bus.send("activate-default-exclusive-control");
		map.removeLayer(feedbackLayer);
		$("#button_feedback").removeClass('selected');
	}

	var refreshYear = function() {
		var text = "";
		var selectedLayer = feedbackLayers[cmbLayer.val()];
		if (selectedLayer != null) {
			timestamp = selectedLayer["timestamp"];
			if (timestamp != null) {
				text = timestamp.getUTCFullYear();
			}
		}
		lblTimestamp.html(text);
	}

	initializeDialog();

	// Install feedback button
	var btn = $("<a/>").attr("id", "feedback-button").addClass("blue_button").html("Feedback");
//	btn.appendTo(toolbar);
	btn.click(function() {
		if (!btn.hasClass("selected")) {
			activateFeedback();
		}
		return false;
	});

	// Listen events
	bus.listen("layer-visibility", function(event, layerId, visibility) {
		if (layerId in feedbackLayers) {
			feedbackLayers[layerId].visibility = visibility;
			var currentValue = cmbLayer.val();
			cmbLayer.empty();
			for (layerId in feedbackLayers) {
				var layerInfo = feedbackLayers[layerId];
				if (layerInfo["visibility"]) {
					$("<option/>").attr("value", layerId).html(layerInfo.name).appendTo(cmbLayer);
				}
			}
			if (currentValue != null && cmbLayer.find("option[value='" + currentValue + "']").length > 0) {
				cmbLayer.val(currentValue);
			} else {
				var firstOption = cmbLayer.find("option:first").val();
				cmbLayer.val(firstOption);
			}
		}
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

	bus.listen("layer-timestamp-selected", function(event, layerId, timestamp) {
		if (layerId in feedbackLayers) {
			feedbackLayers[layerId].timestamp = timestamp;
			refreshYear();
		}
	});
});