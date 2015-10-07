define([ "module", "jquery", "message-bus", "map", "i18n", "customization", "dashboard","features" ,"redd_projects"], function(module, $, bus, map, i18n, customization, dashboard) {
	
	var infoQueryUrl 	= customization['info.queryUrl'] ;
	var serverUrl 		= customization['info.serverUrl'] ;
	var sameOrigin = StringUtils.startsWith( window.location.origin , serverUrl );	
	if( !sameOrigin ){
		infoQueryUrl 	= "proxy?url=" + encodeURIComponent( infoQueryUrl );
	} 
	
//	var infoQueryUrl = "proxy?url=" + encodeURIComponent ( infoUrl );
	
	var wmsNamePortalLayerName = {};
	
	var provinceHtmlTemplate = "";
	var countryHtmlTemplate = "";
	$.ajax({
		url			: 'static/province_info_file.html' ,
		data		: {bust : (new Date()).getTime()},
		dataType 	: "html" ,
		success		: function(data){
			provinceHtmlTemplate		= $( data );
		}
	});
	$.ajax({
		url			: "static/loc/" + customization.languageCode + "/html/vietnam.html" ,
		data		: {bust : (new Date()).getTime()},
		dataType 	: "html" ,
		success		: function(data){
			countryHtmlTemplate		= $( data );
		}
	});
	
	
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
		var featureName 	= feature.attributes.name ;
		var zoneType		= feature.fid.substring( 0, feature.fid.indexOf('.') );
		
		var isProvince 		= ( zoneType == 'province' ); 
		feature.isProvince 	= isProvince;
		
		var isEcoregion 	= ( zoneType == 'ecoregion' ); 
		feature.isEcoregion = isEcoregion;
		
		var isCountry 		= ( zoneType == 'country' ); 
		feature.isCountry = isCountry;
		
		
		var hasDashboard = false;
		
		var statsQueryData = '<AND><ATTRIBUTE><name>zone_type</name><operator>EQUAL_TO</operator><type>STRING</type><value>'+ zoneType +'</value></ATTRIBUTE>';
		
		if( feature.isProvince ){
			var provinceId 	= feature.attributes.province_c;
			var province 	= REDDProjects.provinces[ provinceId ];
			if( province != null ){
				hasDashboard = true;
			}
			statsQueryData += '<ATTRIBUTE><name>zone_id</name><operator>EQUAL_TO</operator><type>STRING</type><value>'+ provinceId +'</value></ATTRIBUTE>' ;
			
		} else if( feature.isEcoregion ){
			var ecoregionId 	= feature.attributes.eco_zone_c;
			statsQueryData += '<ATTRIBUTE><name>zone_id</name><operator>EQUAL_TO</operator><type>STRING</type><value>'+ ecoregionId +'</value></ATTRIBUTE>' ;
			
		} else {
			
			if (feature.attributes.hasOwnProperty("info_file") && StringUtils.isNotBlank(feature.attributes.info_file) ) {
				hasDashboard = true;
			}
			
		}
		
		statsQueryData += '</AND>';
		
		$.ajax({
			url			: infoQueryUrl ,
			type		: "POST" ,
			data		: statsQueryData,
			dataType 	: "json" ,
			contentType: "text/xml",
			beforeSend	: function( xhr ){
				xhr.setRequestHeader('Accept', 'application/json');
			}, 
			success		: function(data){
//				if( feature.isEcoregion ){
//				console.log( data );
//				console.log( statsQueryData );
//				}
				if( data.ResourceList ){
					hasDashboard = true;
//					console.log( " =========== RESOURCES LOADED for " + featureName + " : " );
//					console.log( data );
//					console.log( " =========== END RESOURCES LOADED " );
					
					feature.attributes['ResourceList'] = data.ResourceList;
					
				}
				
				if( hasDashboard){
					featureIds.push( feature.fid );
					features.push( feature );
				}
				
				if( i == eventFeatures.length ){
					functionCallback();
				} else {
					checkHasDashbaord( eventFeatures , features , featureIds , i , functionCallback );
				}
				
			}
		
		});		
		
	}
	
	var unlockUi = function(){
		setTimeout(function(){
			UI.unlock();
		}, 200);
	};
	
	bus.listen( "info-features", function(event, eventFeatures, openSection , section) {
		if( eventFeatures && eventFeatures.length > 0 ){
			
			var features 	= new Array();
			var featureIds 	= new Array();
			checkHasDashbaord( eventFeatures , features , featureIds , 0 , function(){
//				UI.unlock();
				
				bus.send( "open-dashboard-info-feature" , [ features ,openSection ,section ] );

			} );
		} else {
//			UI.unlock();
			unlockUi();
		}
		
	
	});
	
	
	
	bus.listen( "open-dashboard-info-feature" , function( event, features , openSection , section ){
		
		if( features.length > 0 ){
			
			if( openSection !== false ){
				openSection = true ;
			}
			
			
			features.sort( function(f1,f2){
				return f1.fid.localeCompare(f2.fid);
			});
			
			bus.send( "dashboard-toggle-visibility" , true );

			bus.send( "dashboard-reset-type" , [dashboard.TYPE.INFO, dashboard.SOURCE.FEATURES] );
			bus.send( "dashboard-reset-type" , [dashboard.TYPE.LEGEND, dashboard.SOURCE.FEATURES] );
			bus.send( "dashboard-reset-type" , [dashboard.TYPE.STATS, dashboard.SOURCE.FEATURES] );
			
//			console.log( features );
			
			for( var i = 0 ; i < features.length ; i++ ){
				var feature 	= features[ i ];
				
				var expandInfo 	= true;
				var expandStats	= true;
				for( var j = i+1 ; j < features.length ; j++ ){
					var nextFeature = features[ j ];
					if(  nextFeature.isProvince || nextFeature.isCountry ){
						expandInfo = false;
					}
					if( nextFeature.attributes['ResourceList']  ){
						expandStats = false;
					}
				}
				
				// open info
				loadFeatureInfo( feature , openSection , expandInfo , section );
				
				// add stats
//				var fakeData = getFakeStatsData();
				
//				feature.attributes['ResourceList'] = fakeData.ResourceList;
				if( feature.attributes['ResourceList'] ){
					bus.send( "add-feature-stats" , [ feature , openSection , expandStats ] );
				}
			}
			
			unlockUi();
		}
	});
	
	var loadFeatureInfo = function( feature , openSection, expand ,section ){
		var fId = feature.fid.replace( '.' , '-' );
//		console.log( feature );

		// open info
		var data = '';
		if( feature.isProvince || feature.isCountry ){
			var data = ( feature.isProvince ) ? provinceHtmlTemplate.clone() : countryHtmlTemplate.clone();
			
			var dataClass 	=  "feature-info-" + fId ;
			data.addClass( dataClass );
			
			Features.appendLabels( data );
			if( feature.isProvince ){
				Features.processProvince ( feature , data ,section );
			}
			
			bus.send( 'add-dashboard-element' , [fId , feature.attributes.name, data , true , dashboard.TYPE.INFO, dashboard.SOURCE.FEATURES]);
			
			if( openSection ){
				bus.send( "dashboard-show-type" , [dashboard.TYPE.INFO, dashboard.SOURCE.FEATURES] );
			} else {
				bus.send( "dashboard-activate-type" , [dashboard.TYPE.INFO, dashboard.SOURCE.FEATURES] );
			}
			
			if( !expand ){
				bus.send( 'dashboard-element-toggle-state' , [dashboard.TYPE.INFO , fId , false] );
			}
			
		}
		else if ( feature.attributes.hasOwnProperty("info_file")  ) {
			
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
					
					Features.appendLabels( data );
					
					bus.send( 'add-dashboard-element' , [fId , feature.attributes.name, data , true , dashboard.TYPE.INFO, dashboard.SOURCE.FEATURES]);
					
					if( openSection ){
						bus.send( "dashboard-show-type" , [dashboard.TYPE.INFO, dashboard.SOURCE.FEATURES] );
					} else {
						bus.send( "dashboard-activate-type" , [dashboard.TYPE.INFO, dashboard.SOURCE.FEATURES] );
					}
					
					if( !expand ){
						bus.send( 'dashboard-element-toggle-state' , [dashboard.TYPE.INFO , fId , false] );
					}
				}
			});
			
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
			                    "data": "[[32,645,654,32,645,654,32,645,654,32,645,654,32,645,654,654],[432,654,65,432,654,65,432,654,65,432,654,65,432,654,65,65],[43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,6534],[342,76,35,342,76,35,342,76,35,342,76,35,342,76,35,35],[432,63,53,432,63,53,432,63,53,432,63,53,432,63,53,53],[432,5463,65,432,5463,65,432,5463,65,432,5463,65,432,5463,65,65],[432,546,6543,432,546,6543,432,546,6543,432,546,6543,432,546,6543,6543],[432,456,653,432,456,653,432,456,653,432,456,653,432,456,653,653],[46,456,65,46,456,65,46,456,65,46,456,65,46,456,65,65],[76,4356,65,76,4356,65,76,4356,65,76,4356,65,76,4356,65,65],[5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,653],[654,34,65,654,34,65,654,34,65,654,34,65,654,34,65,65],[342,345,6543,342,345,6543,342,345,6543,342,345,6543,342,345,6543,6543],[6543,65,643,6543,65,643,6543,65,643,6543,65,643,6543,65,643,643],[65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,6543],[6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543]]"
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
			                    "data": "[[32,645,654,32,645,654,32,645,654,32,645,654,32,645,654,654],[432,654,65,432,654,65,432,654,65,432,654,65,432,654,65,65],[43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,6534],[342,76,35,342,76,35,342,76,35,342,76,35,342,76,35,35],[432,63,53,432,63,53,432,63,53,432,63,53,432,63,53,53],[432,5463,65,432,5463,65,432,5463,65,432,5463,65,432,5463,65,65],[432,546,6543,432,546,6543,432,546,6543,432,546,6543,432,546,6543,6543],[432,456,653,432,456,653,432,456,653,432,456,653,432,456,653,653],[46,456,65,46,456,65,46,456,65,46,456,65,46,456,65,65],[76,4356,65,76,4356,65,76,4356,65,76,4356,65,76,4356,65,65],[5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,653],[654,34,65,654,34,65,654,34,65,654,34,65,654,34,65,65],[342,345,6543,342,345,6543,342,345,6543,342,345,6543,342,345,6543,6543],[6543,65,643,6543,65,643,6543,65,643,6543,65,643,6543,65,643,643],[65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,6543],[6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543]]"
			                },
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
			                    "data": "[[32,645,654,32,645,654,32,645,654,32,645,654,32,645,654,654],[432,654,65,432,654,65,432,654,65,432,654,65,432,654,65,65],[43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,6534],[342,76,35,342,76,35,342,76,35,342,76,35,342,76,35,35],[432,63,53,432,63,53,432,63,53,432,63,53,432,63,53,53],[432,5463,65,432,5463,65,432,5463,65,432,5463,65,432,5463,65,65],[432,546,6543,432,546,6543,432,546,6543,432,546,6543,432,546,6543,6543],[432,456,653,432,456,653,432,456,653,432,456,653,432,456,653,653],[46,456,65,46,456,65,46,456,65,46,456,65,46,456,65,65],[76,4356,65,76,4356,65,76,4356,65,76,4356,65,76,4356,65,65],[5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,653],[654,34,65,654,34,65,654,34,65,654,34,65,654,34,65,65],[342,345,6543,342,345,6543,342,345,6543,342,345,6543,342,345,6543,6543],[6543,65,643,6543,65,643,6543,65,643,6543,65,643,6543,65,643,643],[65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,6543],[6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543]]"
			                },
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
			                    "data": "[[32,645,654,32,645,654,32,645,654,32,645,654,32,645,654,654],[432,654,65,432,654,65,432,654,65,432,654,65,432,654,65,65],[43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,6534],[342,76,35,342,76,35,342,76,35,342,76,35,342,76,35,35],[432,63,53,432,63,53,432,63,53,432,63,53,432,63,53,53],[432,5463,65,432,5463,65,432,5463,65,432,5463,65,432,5463,65,65],[432,546,6543,432,546,6543,432,546,6543,432,546,6543,432,546,6543,6543],[432,456,653,432,456,653,432,456,653,432,456,653,432,456,653,653],[46,456,65,46,456,65,46,456,65,46,456,65,46,456,65,65],[76,4356,65,76,4356,65,76,4356,65,76,4356,65,76,4356,65,65],[5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,653],[654,34,65,654,34,65,654,34,65,654,34,65,654,34,65,65],[342,345,6543,342,345,6543,342,345,6543,342,345,6543,342,345,6543,6543],[6543,65,643,6543,65,643,6543,65,643,6543,65,643,6543,65,643,643],[65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,6543],[6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543]]"
			                },
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
			                    "data": "[[32,645,654,32,645,654,32,645,654,32,645,654,32,645,654,654],[432,654,65,432,654,65,432,654,65,432,654,65,432,654,65,65],[43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,43214,64,6534,6534],[342,76,35,342,76,35,342,76,35,342,76,35,342,76,35,35],[432,63,53,432,63,53,432,63,53,432,63,53,432,63,53,53],[432,5463,65,432,5463,65,432,5463,65,432,5463,65,432,5463,65,65],[432,546,6543,432,546,6543,432,546,6543,432,546,6543,432,546,6543,6543],[432,456,653,432,456,653,432,456,653,432,456,653,432,456,653,653],[46,456,65,46,456,65,46,456,65,46,456,65,46,456,65,65],[76,4356,65,76,4356,65,76,4356,65,76,4356,65,76,4356,65,65],[5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,5436,3546,653,653],[654,34,65,654,34,65,654,34,65,654,34,65,654,34,65,65],[342,345,6543,342,345,6543,342,345,6543,342,345,6543,342,345,6543,6543],[6543,65,643,6543,65,643,6543,65,643,6543,65,643,6543,65,643,643],[65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,65,3456,6543,6543],[6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543,653,6543,6543]]"
			                },
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
	
	
//	bus.listen( "open-dashboard-info-feature", function(event, feature) {
//		console.log( feature );
//	});
	
//	bus.listen("info-features-orig", function(event, features, x, y) {
//		var i, infoPopup, epsg4326, epsg900913;
//
//		// re-project to Google projection
//		epsg4326 = new OpenLayers.Projection("EPSG:4326");
//		epsg900913 = new OpenLayers.Projection("EPSG:900913");
//		for (i = 0; i < features.length; i++) {
//			if (customization["highlight-bounds"] == "true") {
//				features[i].geometry = features[i].geometry.getBounds().toGeometry();
//			}
//			features[i].geometry.transform(epsg4326, epsg900913);
//		}
//
//		infoPopup = $("#info_popup");
//		if (infoPopup.length === 0) {
//			infoPopup = $("<div/>").attr("id", "info_popup");
//		} else {
//			infoPopup.empty();
//		}
//		infoPopup.dialog({
//			title : i18n["info_dialog_title"],
//			closeOnEscape : true,
//			width : 700,
//			height : 200,
//			resizable : true,
//			close : function(event, ui) {
//				bus.send("clear-highlighted-features");
//				map.getLayer("Highlighted Features").destroyFeatures();
//			},
//
//			autoOpen : false
//		});
//
//		// TODO check if there is a custom pop up instead of showing the
//		// standard one
//
//		var layerNameFeatures = {};
//		$.each(features, function(layerId, feature) {
//			qualifiedLayerId = feature.gml.featureNSPrefix + ":" + feature.gml.featureType;
//
//			if (!layerNameFeatures.hasOwnProperty(qualifiedLayerId)) {
//				layerNameFeatures[qualifiedLayerId] = [ feature ];
//			} else {
//				layerNameFeatures[qualifiedLayerId].push(feature);
//			}
//		});
//		var divResults = $("<div/>").attr("id", "result_area").appendTo(infoPopup);
//		$.each(layerNameFeatures, function(layerId, layerFeatures) {
//			var layerName = wmsNamePortalLayerName[layerId];
//			$("<div/>").addClass("layer_title info_center").html(layerName).appendTo(divResults);
//			var divTable = $("<div/>").addClass("layer_results info_center").appendTo(divResults);
//			var tblData = $("<table/>").appendTo(divTable);
//			var tr = $("<tr/>").appendTo(tblData);
//
//			$("<th/>").addClass("command").html("").appendTo(tr);
//			$("<th/>").addClass("command").html("").appendTo(tr);
//			for (attribute in layerFeatures[0].attributes) {
//				$("<th/>").addClass("data").html(attribute).appendTo(tr);
//			}
//			$.each(layerFeatures, function(index, feature) {
//				var tr = $("<tr/>").appendTo(tblData);
//
//				// Zoom to object button
//				var imgZoomToArea = $("<img/>").attr("src", "modules/images/zoom-to-object.png");
//				imgZoomToArea.css("cursor", "pointer");
//				$("<td/>").addClass("command").append(imgZoomToArea).appendTo(tr).click(function() {
//					bus.send("zoom-to", feature.geometry.getBounds().scale(1.2));
//				});
//
//				// Indicators button
//				var imgWait = $("<img/>").attr("src", "styles/images/ajax-loader.gif").attr("alt", "wait");
//				var tdIndicators = $("<td/>").addClass("command").append(imgWait).appendTo(tr);
//				bus.send("ajax", {
//					url : 'indicators?layerId=' + layerId,
//					success : function(indicators, textStatus, jqXHR) {
//						//TODO if there is more than one indicator, offer the choice to the user.
//						if (indicators.length > 0) {
//							$(indicators).each(function( i, val ) { console.log(val.id+'-> '+val.fieldId);
//								// Muestra un icono para cada grafico con el texto alternativo con el titulo del grafico.								
//								var aIndicators = $("<a/>").addClass("fancybox.iframe").appendTo(tdIndicators);
//								aIndicators.css("padding","1px");
//								$("<img/>").attr("src", "modules/images/object-indicators.png").appendTo(aIndicators);
//								aIndicators.attr("href", "indicator?objectId=" + feature.attributes[val.fieldId] + "&layerId=" + layerId + "&indicatorId=" + val.id);
//								aIndicators.attr("alt", val.title);
//								aIndicators.attr("title", val.title);
//								aIndicators.fancybox({
//									maxWidth : 840,
//									maxHeight : 600,
//									fitToView : false,
//									width : 840,
//									height : 590,
//									autoSize : false,
//									closeClick : false,
//									openEffect : 'none',
//									closeEffect : 'fade'
//								});
//								//TODO Agregar separador entre iconos.
//							});// END each
//						}
//					},
//					errorMsg : "Could not obtain the indicator",
//					complete : function() {
//						imgWait.remove();
//					}
//				});
//
//				var attributes = feature.attributes;
//				for (attribute in attributes) {
//					$("<td/>").addClass("data").html(attributes[attribute]).appendTo(tr);
//				}
//
//				tr.mouseenter(function() {
//					bus.send("highlight-feature", feature);
//				});
//				tr.mouseleave(function() {
//					bus.send("clear-highlighted-features");
//				});
//
//			});
//
//		});
//
//		// If no features selected then close the dialog
//		if (features.length === 0) {
//			infoPopup.dialog('close');
//		} else {
//			var openInCenter = module.config()["open-in-center"];
//			// Don't reposition the dialog if already open
//			if (!infoPopup.dialog('isOpen')) {
//				var position;
//				if (openInCenter) {
//					position = "center";
//				} else {
//					var dialogX = x + 100;
//					var dialogY = y - 200;
//					position = [ dialogX, dialogY ];
//				}
//				
//				infoPopup.dialog('option', 'position', position);
//
//				// Finally open the dialog
//				infoPopup.dialog('open');
//				infoPopup.dialog('moveToTop');
//			}
//		}
//	});

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