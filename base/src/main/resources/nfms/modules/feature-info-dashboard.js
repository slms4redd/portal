define([ "module", "jquery", "message-bus", "map", "i18n", "customization", "dashboard" ], function(module, $, bus, map, i18n, customization, layerDashboard) {
	
	var infoUrl = customization['info.queryUrl'] ;
	
	var infoQueryUrl = "proxy?url=" + infoUrl;
	
	var wmsNamePortalLayerName = {};

	bus.listen("add-layer", function(event, layerInfo) {
		var portalLayerName = layerInfo["label"];
		$.each(layerInfo.wmsLayers, function(i, wmsLayer) {
			var wmsName = wmsLayer["wmsName"];
			wmsNamePortalLayerName[wmsName] = portalLayerName;
		});
	});

	var checkHasDashbaord 	= function( eventFeatures , features , featureIds , i , functionCallback) {
		var feature = null;
		for ( j = i; j < eventFeatures.length; j++) { 
			feature = eventFeatures[ j ];
			if( featureIds.indexOf(feature.fid) < 0 ){
				i = ( j + 1 );
				break;
			}
		}
		
		
		var hasDashboard = false;
		if (feature.attributes.hasOwnProperty("legend_file") && StringUtils.isNotBlank(feature.attributes.legend_file)) {
			hasDashboard = true;
		}
		if (feature.attributes.hasOwnProperty("info_file") && StringUtils.isNotBlank(feature.attributes.info_file) ) {
			hasDashboard = true;
		}
		if( hasDashboard){
			featureIds.push( feature.fid );
			features.push( feature );
		}
		
		
		
		var data = 
		    '<OR>'+
		    '<AND>'+
		        '<ATTRIBUTE><name>zone_type</name><operator>EQUAL_TO</operator><type>STRING</type><value>country</value></ATTRIBUTE>'+
		        '<ATTRIBUTE><name>zone_name</name><operator>EQUAL_TO</operator><type>STRING</type><value>vietnam</value></ATTRIBUTE>'+
		        '<ATTRIBUTE><name>period</name><operator>EQUAL_TO</operator><type>STRING</type><value>2005-2015</value></ATTRIBUTE>'+
		    '</AND>'+
		    '<AND>'+
		        '<ATTRIBUTE><name>zone_type</name><operator>EQUAL_TO</operator><type>STRING</type><value>province</value></ATTRIBUTE>'+
		        '<ATTRIBUTE><name>zone_name</name><operator>EQUAL_TO</operator><type>STRING</type><value>Nghe An</value></ATTRIBUTE>'+
		        '<ATTRIBUTE><name>period</name><operator>EQUAL_TO</operator><type>STRING</type><value>2005-2015</value></ATTRIBUTE>'+
		    '</AND>'+
		    '</OR>';
		
		
		$.ajax({
//			url			: "proxy?url=http://178.33.8.123/diss_geostore/rest/data/70" ,
			url			: infoQueryUrl ,
			type		: "POST" ,
//			type		: "GET" ,
//			data		: {bust : (new Date()).getTime()},
			data		: data,
			dataType 	: "json" ,
			contentType: "text/xml",
			beforeSend	: function( xhr ){
				xhr.setRequestHeader('Accept', 'application/json');
			}, 
			success		: function(data){
//				console.log( data );
			}
		
		});		
		if( i == eventFeatures.length ){
			functionCallback();
		} else {
			checkHasDashbaord( eventFeatures , features , featureIds , i , functionCallback );
		}
	}
	
	
	bus.listen( "info-features", function(event, eventFeatures, x, y) {
		if( eventFeatures && eventFeatures.length > 0 ){
			
			var features 	= new Array();
			var featureIds 	= new Array();
			checkHasDashbaord( eventFeatures , features , featureIds , 0 , function(){
				UI.unlock();
				
//				if( features.length == 1 ){ 
					bus.send( "open-dashboard-info-feature" , [ features ] );
//				} else {
//					console.log( "TO-DO" );
//				}
			} );
		} else {
			UI.unlock();
		}
		
	
	});
	
	
	
	bus.listen( "open-dashboard-info-feature" , function( event, features ){
		
		layerDashboard.resetDashboardStats();

		bus.send( "layers-dashboard-toggle-visibility" , true );
//		console.log( features );
		
		features.sort( function(f1,f2){
			return f1.fid.localeCompare(f2.fid);
		});
		
		for( var i = 0 ; i < features.length ; i++ ){
			var feature = features[ i ];
			
			var show = ( i == features.length-1 ) ? true : false;
			
			// open info
			loadFeatureInfo( feature , show );
		
			// add stats
			var fakeData = getFakeStatsData();
	
			feature.attributes['ResourceList'] = fakeData.ResourceList;
			if( feature.attributes['ResourceList'] ){
				bus.send( "add-feature-stats" , [ feature , show ] );
			}
		}
	});
	
	var loadFeatureInfo = function( feature , show ){
		var fId = feature.fid.replace( '.' , '-' );
	
//		layerDashboard.addFeatureInfo(fId, feature.attributes.name , data );
//		layerDashboard.toggleDashboardItem( 'info' , fId , show );
		
		// open info
		if ( feature.attributes.hasOwnProperty("info_file")  ) {
			
			var url =  "static/loc/" + customization.languageCode + "/html/" + feature.attributes.info_file;
			$.ajax({
				url			: url ,
				data		: {bust : (new Date()).getTime()},
				dataType 	: "html" ,
				success		: function(data){
//					success(data);
					var data 		= $( data );
					var dataClass 	=  "feature-info-" + fId ;
					data.addClass( dataClass );
					
					layerDashboard.addFeatureInfo(fId, feature.attributes.name , data );
					layerDashboard.toggleDashboardItem( 'info' , fId , show );
					
				}
			});
			
			layerDashboard.showInfo();
		
		}
	};
	
	var getFakeStatsData = function(){
		var fakeData = {
				  
				  
				  "ResourceList": {
					    "Resource": [
					      {
					        
										      "Attributes": {
										        "attribute": [
										          {
										            "type": "STRING",
										            "name": "zone_type",
										            "value": "ecoregion"
										          },
										          {
										            "type": "STRING",
										            "name": "zone_name",
										            "value": "ecoregion_north"
										          },
										          {
										            "type": "INTEGER",
										            "name": "start_period",
										            "value": "1990"
										          },
										          {
										            "type": "INTEGER",
										            "name": "end_period",
										            "value": "2015"
										          },
										          {
										            "type": "STRING",
										            "name": "stats_type",
										            "value": "lucm"
										          },
										          {
										            "type": "STRING",
										            "name": "period",
										            "value": "2000-2015"
										          },
										          {
										            "type": "NUMBER",
										            "name": "version",
										            "value": "1.0"
										          },
										          {
										            "type": "DATE",
										            "name": "last_update",
										            "value": "2015-06-30T14:44:39.262+0000"
										          }
										        ]
										      },
										      "category": {
										        "id": "4",
										        "name": "StatsData"
										      },
										      "store": {
										        "data": [
										            [32,645,654,32,645,654,32,645,654,32,645,654,32,645,654,654],
					[432,654,65,432,654,65,432,654,65,432,654,65,432,654,65,65],
					[43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,6534],
					[342,76,35,342,76,35,342,76,35,342,76,35,342,76,35,35],
					[432,63,53,432,63,53,432,63,53,432,63,53,432,63,53,53],
					[432,5463,65,432,5463,65,432,5463,65,432,5463,65,432,5463,65,65],
					[432,546,6543,432,546,6543,432,546,6543,432,546,6543,432,546,6543,6543],
					[432,456,653,432,456,653,432,456,653,432,456,653,432,456,653,653],
					[46,456,65,46,456,65,46,456,65,46,456,65,46,456,65,65],
					[76,4356,65,76,4356,65,76,4356,65,76,4356,65,76,4356,65,65],
					[5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,653],
					[654,34,65,654,34,65,654,34,65,654,34,65,654,34,65,65],
					[342,345,6543,342,345,6543,342,345,6543,342,345,6543,342,345,6543,6543],
					[6543,65,643,6543,65,643,6543,65,643,6543,65,643,6543,65,643,643],
					[65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,6543],
					[6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543]
										            ]
										      },
										      "creation": "2015-06-30T15:06:21.492+00:00",
										      "description": "description of this resource",
										      "id": "49",
										      "name": "resource"
										    
					      },
					      {
					        
					        
											      "Attributes": {
												        "attribute": [
												          {
												            "type": "STRING",
												            "name": "zone_type",
												            "value": "ecoregion"
												          },
												          {
												            "type": "STRING",
												            "name": "zone_name",
												            "value": "ecoregion_north"
												          },
												          {
												            "type": "INTEGER",
												            "name": "start_period",
												            "value": "1995"
												          },
												          {
												            "type": "INTEGER",
												            "name": "end_period",
												            "value": "2015"
												          },
												          {
												            "type": "STRING",
												            "name": "stats_type",
												            "value": "lucm"
												          },
												          {
												            "type": "STRING",
												            "name": "period",
												            "value": "2000-2015"
												          },
												          {
												            "type": "NUMBER",
												            "name": "version",
												            "value": "1.0"
												          },
												          {
												            "type": "DATE",
												            "name": "last_update",
												            "value": "2015-06-30T14:44:39.262+0000"
												          }
												        ]
												      },
												      "category": {
												        "id": "4",
												        "name": "StatsData"
												      },
												      "store": {
												        "data": [
												            [32,645,654,32,645,654,32,645,654,32,645,654,32,645,654,654],
					[432,654,65,432,654,65,432,654,65,432,654,65,432,654,65,65],
					[43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,6534],
					[342,76,35,342,76,35,342,76,35,342,76,35,342,76,35,35],
					[432,63,53,432,63,53,432,63,53,432,63,53,432,63,53,53],
					[432,5463,65,432,5463,65,432,5463,65,432,5463,65,432,5463,65,65],
					[432,546,6543,432,546,6543,432,546,6543,432,546,6543,432,546,6543,6543],
					[432,456,653,432,456,653,432,456,653,432,456,653,432,456,653,653],
					[46,456,65,46,456,65,46,456,65,46,456,65,46,456,65,65],
					[76,4356,65,76,4356,65,76,4356,65,76,4356,65,76,4356,65,65],
					[5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,653],
					[654,34,65,654,34,65,654,34,65,654,34,65,654,34,65,65],
					[342,345,6543,342,345,6543,342,345,6543,342,345,6543,342,345,6543,6543],
					[6543,65,643,6543,65,643,6543,65,643,6543,65,643,6543,65,643,643],
					[65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,6543],
					[6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543]
												     ] },
												      "creation": "2015-06-30T15:06:21.492+00:00",
												      "description": "description of this resource",
												      "id": "50",
												      "name": "resource"
												    
					        
					      },
					      {
					        
					        
											      "Attributes": {
												        "attribute": [
												          {
												            "type": "STRING",
												            "name": "zone_type",
												            "value": "ecoregion"
												          },
												          {
												            "type": "STRING",
												            "name": "zone_name",
												            "value": "ecoregion_north"
												          },
												          {
												            "type": "INTEGER",
												            "name": "start_period",
												            "value": "2000"
												          },
												          {
												            "type": "INTEGER",
												            "name": "end_period",
												            "value": "2015"
												          },
												          {
												            "type": "STRING",
												            "name": "stats_type",
												            "value": "lucm"
												          },
												          {
												            "type": "STRING",
												            "name": "period",
												            "value": "2000-2015"
												          },
												          {
												            "type": "NUMBER",
												            "name": "version",
												            "value": "1.0"
												          },
												          {
												            "type": "DATE",
												            "name": "last_update",
												            "value": "2015-06-30T14:44:39.262+0000"
												          }
												        ]
												      },
												      "category": {
												        "id": "4",
												        "name": "StatsData"
												      },
												      "store": {
												        "data": [
												            [32,645,654,32,645,654,32,645,654,32,645,654,32,645,654,654],
					[432,654,65,432,654,65,432,654,65,432,654,65,432,654,65,65],
					[43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,6534],
					[342,76,35,342,76,35,342,76,35,342,76,35,342,76,35,35],
					[432,63,53,432,63,53,432,63,53,432,63,53,432,63,53,53],
					[432,5463,65,432,5463,65,432,5463,65,432,5463,65,432,5463,65,65],
					[432,546,6543,432,546,6543,432,546,6543,432,546,6543,432,546,6543,6543],
					[432,456,653,432,456,653,432,456,653,432,456,653,432,456,653,653],
					[46,456,65,46,456,65,46,456,65,46,456,65,46,456,65,65],
					[76,4356,65,76,4356,65,76,4356,65,76,4356,65,76,4356,65,65],
					[5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,653],
					[654,34,65,654,34,65,654,34,65,654,34,65,654,34,65,65],
					[342,345,6543,342,345,6543,342,345,6543,342,345,6543,342,345,6543,6543],
					[6543,65,643,6543,65,643,6543,65,643,6543,65,643,6543,65,643,643],
					[65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,6543],
					[6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543]
												     ] },
												      "creation": "2015-06-30T15:06:21.492+00:00",
												      "description": "description of this resource",
												      "id": "50",
												      "name": "resource"
												    
					        
					      },
					      {
					        
					        
											      "Attributes": {
												        "attribute": [
												          {
												            "type": "STRING",
												            "name": "zone_type",
												            "value": "ecoregion"
												          },
												          {
												            "type": "STRING",
												            "name": "zone_name",
												            "value": "ecoregion_north"
												          },
												          {
												            "type": "INTEGER",
												            "name": "start_period",
												            "value": "2005"
												          },
												          {
												            "type": "INTEGER",
												            "name": "end_period",
												            "value": "2015"
												          },
												          {
												            "type": "STRING",
												            "name": "stats_type",
												            "value": "lucm"
												          },
												          {
												            "type": "STRING",
												            "name": "period",
												            "value": "2000-2015"
												          },
												          {
												            "type": "NUMBER",
												            "name": "version",
												            "value": "1.0"
												          },
												          {
												            "type": "DATE",
												            "name": "last_update",
												            "value": "2015-06-30T14:44:39.262+0000"
												          }
												        ]
												      },
												      "category": {
												        "id": "4",
												        "name": "StatsData"
												      },
												      "store": {
												        "data": [
												            [32,645,654,32,645,654,32,645,654,32,645,654,32,645,654,654],
					[432,654,65,432,654,65,432,654,65,432,654,65,432,654,65,65],
					[43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,6534],
					[342,76,35,342,76,35,342,76,35,342,76,35,342,76,35,35],
					[432,63,53,432,63,53,432,63,53,432,63,53,432,63,53,53],
					[432,5463,65,432,5463,65,432,5463,65,432,5463,65,432,5463,65,65],
					[432,546,6543,432,546,6543,432,546,6543,432,546,6543,432,546,6543,6543],
					[432,456,653,432,456,653,432,456,653,432,456,653,432,456,653,653],
					[46,456,65,46,456,65,46,456,65,46,456,65,46,456,65,65],
					[76,4356,65,76,4356,65,76,4356,65,76,4356,65,76,4356,65,65],
					[5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,653],
					[654,34,65,654,34,65,654,34,65,654,34,65,654,34,65,65],
					[342,345,6543,342,345,6543,342,345,6543,342,345,6543,342,345,6543,6543],
					[6543,65,643,6543,65,643,6543,65,643,6543,65,643,6543,65,643,643],
					[65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,6543],
					[6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543]
												     ] },
												      "creation": "2015-06-30T15:06:21.492+00:00",
												      "description": "description of this resource",
												      "id": "50",
												      "name": "resource"
												    
					        
					      },
					      {
					        
					        
											      "Attributes": {
												        "attribute": [
												          {
												            "type": "STRING",
												            "name": "zone_type",
												            "value": "ecoregion"
												          },
												          {
												            "type": "STRING",
												            "name": "zone_name",
												            "value": "ecoregion_north"
												          },
												          {
												            "type": "INTEGER",
												            "name": "start_period",
												            "value": "2010"
												          },
												          {
												            "type": "INTEGER",
												            "name": "end_period",
												            "value": "2015"
												          },
												          {
												            "type": "STRING",
												            "name": "stats_type",
												            "value": "lucm"
												          },
												          {
												            "type": "STRING",
												            "name": "period",
												            "value": "2000-2015"
												          },
												          {
												            "type": "NUMBER",
												            "name": "version",
												            "value": "1.0"
												          },
												          {
												            "type": "DATE",
												            "name": "last_update",
												            "value": "2015-06-30T14:44:39.262+0000"
												          }
												        ]
												      },
												      "category": {
												        "id": "4",
												        "name": "StatsData"
												      },
												      "store": {
												        "data": [
												            [32,645,654,32,645,654,32,645,654,32,645,654,32,645,654,654],
					[432,654,65,432,654,65,432,654,65,432,654,65,432,654,65,65],
					[43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,6534],
					[342,76,35,342,76,35,342,76,35,342,76,35,342,76,35,35],
					[432,63,53,432,63,53,432,63,53,432,63,53,432,63,53,53],
					[432,5463,65,432,5463,65,432,5463,65,432,5463,65,432,5463,65,65],
					[432,546,6543,432,546,6543,432,546,6543,432,546,6543,432,546,6543,6543],
					[432,456,653,432,456,653,432,456,653,432,456,653,432,456,653,653],
					[46,456,65,46,456,65,46,456,65,46,456,65,46,456,65,65],
					[76,4356,65,76,4356,65,76,4356,65,76,4356,65,76,4356,65,65],
					[5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,653],
					[654,34,65,654,34,65,654,34,65,654,34,65,654,34,65,65],
					[342,345,6543,342,345,6543,342,345,6543,342,345,6543,342,345,6543,6543],
					[6543,65,643,6543,65,643,6543,65,643,6543,65,643,6543,65,643,643],
					[65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,6543],
					[6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543]
												     ] },
												      "creation": "2015-06-30T15:06:21.492+00:00",
												      "description": "description of this resource",
												      "id": "50",
												      "name": "resource"
												    
					        
					      }
					    ]
					  }
					

};
		
		return fakeData;
	};
	
	
	bus.listen( "open-dashboard-info-feature", function(event, feature) {
		console.log( feature );
	});
	
	/*bus.listen("info-features-orig", function(event, features, x, y) {
	//bus.listen("info-popup-getfeatureinfo", function(control, x, y, text) {
		console.log("into popup");
		var i, infoPopup, epsg4326, epsg900913;

		// re-project to Google projection
		epsg4326 = new OpenLayers.Projection("EPSG:4326");
		epsg900913 = new OpenLayers.Projection("EPSG:900913");
		for (i = 0; i < features.length; i++) {
			if (customization["highlight-bounds"] == "true") {
				features[i].geometry = features[i].geometry.getBounds().toGeometry();
			}
			features[i].geometry.transform(epsg4326, epsg900913);
		}

		infoPopup = $("#info_popup");
		if (infoPopup.length === 0) {
			infoPopup = $("<div/>").attr("id", "info_popup");
		} else {
			infoPopup.empty();
		}
		infoPopup.dialog({
			title : i18n["info_dialog_title"],
			closeOnEscape : true,
			width : 700,
			height : 200,
			resizable : true,
			close : function(event, ui) {
				bus.send("clear-highlighted-features");
				map.getLayer("Highlighted Features").destroyFeatures();
			},

			autoOpen : false
		});

		// TODO check if there is a custom pop up instead of showing the
		// standard one

		var layerNameFeatures = {};
		$.each(features, function(layerId, feature) {
			qualifiedLayerId = feature.gml.featureNSPrefix + ":" + feature.gml.featureType;

			if (!layerNameFeatures.hasOwnProperty(qualifiedLayerId)) {
				layerNameFeatures[qualifiedLayerId] = [ feature ];
			} else {
				layerNameFeatures[qualifiedLayerId].push(feature);
			}
		});
		var divResults = $("<div/>").attr("id", "result_area").appendTo(infoPopup);
		$.each(layerNameFeatures, function(layerId, layerFeatures) {
			var layerName = wmsNamePortalLayerName[layerId];
			$("<div/>").addClass("layer_title info_center").html(layerName).appendTo(divResults);
			var divTable = $("<div/>").addClass("layer_results info_center").appendTo(divResults);
			var tblData = $("<table/>").appendTo(divTable);
			var tr = $("<tr/>").appendTo(tblData);

			$("<th/>").addClass("command").html("").appendTo(tr);
			$("<th/>").addClass("command").html("").appendTo(tr);
			for (attribute in layerFeatures[0].attributes) {
				$("<th/>").addClass("data").html(attribute).appendTo(tr);
			}
			$.each(layerFeatures, function(index, feature) {
				var tr = $("<tr/>").appendTo(tblData);

				// Zoom to object button
				var imgZoomToArea = $("<img/>").attr("src", "modules/images/zoom-to-object.png");
				imgZoomToArea.css("cursor", "pointer");
				$("<td/>").addClass("command").append(imgZoomToArea).appendTo(tr).click(function() {
					bus.send("zoom-to", feature.geometry.getBounds().scale(1.2));
				});

				// Indicators button
				var imgWait = $("<img/>").attr("src", "styles/images/ajax-loader.gif").attr("alt", "wait");
				var tdIndicators = $("<td/>").addClass("command").append(imgWait).appendTo(tr);
				bus.send("ajax", {
					url : 'indicators?layerId=' + layerId,
					success : function(indicators, textStatus, jqXHR) {
						//TODO if there is more than one indicator, offer the choice to the user.
						if (indicators.length > 0) {
							$(indicators).each(function( i, val ) { console.log(val.id+'-> '+val.fieldId);
								// Muestra un icono para cada grafico con el texto alternativo con el titulo del grafico.								
								var aIndicators = $("<a/>").addClass("fancybox.iframe").appendTo(tdIndicators);
								aIndicators.css("padding","1px");
								$("<img/>").attr("src", "modules/images/object-indicators.png").appendTo(aIndicators);
								aIndicators.attr("href", "indicator?objectId=" + feature.attributes[val.fieldId] + "&layerId=" + layerId + "&indicatorId=" + val.id);
								aIndicators.attr("alt", val.title);
								aIndicators.attr("title", val.title);
								aIndicators.fancybox({
									maxWidth : 840,
									maxHeight : 600,
									fitToView : false,
									width : 840,
									height : 590,
									autoSize : false,
									closeClick : false,
									openEffect : 'none',
									closeEffect : 'fade'
								});
								//TODO Agregar separador entre iconos.
							});// END each
						}
					},
					errorMsg : "Could not obtain the indicator",
					complete : function() {
						imgWait.remove();
					}
				});

				var attributes = feature.attributes;
				for (attribute in attributes) {
					$("<td/>").addClass("data").html(attributes[attribute]).appendTo(tr);
				}

				tr.mouseenter(function() {
					bus.send("highlight-feature", feature);
				});
				tr.mouseleave(function() {
					bus.send("clear-highlighted-features");
				});

			});

		});

		// If no features selected then close the dialog
		if (features.length === 0) {
			infoPopup.dialog('close');
		} else {
			var openInCenter = module.config()["open-in-center"];
			// Don't reposition the dialog if already open
			if (!infoPopup.dialog('isOpen')) {
				var position;
				if (openInCenter) {
					position = "center";
				} else {
					var dialogX = x + 100;
					var dialogY = y - 200;
					position = [ dialogX, dialogY ];
				}
				
				infoPopup.dialog('option', 'position', position);

				// Finally open the dialog
				infoPopup.dialog('open');
				infoPopup.dialog('moveToTop');
			}
		}
		
		// adding popup
		//map.addControl(control);
		//control.activate;
		//console.log("exiting popup");
	});*/

	bus.listen("highlight-feature", function(event, feature) {
		var highlightLayer = map.getLayer("Highlighted Features");
		highlightLayer.removeAllFeatures();
		highlightLayer.addFeatures(feature);
		highlightLayer.redraw();
	});

	bus.listen("clear-highlighted-features", function() {
		var highlightLayer = map.getLayer("Highlighted Features");
		highlightLayer.removeAllFeatures();
		highlightLayer.redraw();
	});

});