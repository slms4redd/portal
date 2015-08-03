define([ "jquery" , "message-bus" , "i18n", "dashboard" ,"highcharts" , "jquery.actual.min"], function($, bus, i18n, layerDashbaord ,highcharts) {
	
//	var startYears 			= new Array();
//	var endYears 			= new Array();
//	var currentStartYear 	= null;
//	var currentEndYear 		= null;
	
	bus.listen( "add-feature-stats" , function( event , feature , show ){
		var resources = parseResources( feature );
		
//		startYears 			= new Array();
//		endYears 			= new Array();
//		currentStartYear 	= null;
//		currentEndYear 		= null;
		var startYears 			= new Array();
		var endYears 			= new Array();
		var currentStartYear 	= null;
		var currentEndYear 		= null;
		if( resources.length > 0 ){
			
			var container = $( '<div class="width100 height100 lucm"></div>' );
			
			
			var rowHeader = $( '<div class="row row-dashbaord-padded info-table"></div>' );
			container.append( rowHeader );
			var colHeader = $( '<div class="col-md-12 title"></div>' );
			rowHeader.append(  colHeader );
			var toggleButton = $( '<button class="btn btn-transparent btn-toggle-item" data-target="lucm-table"><i class="fa fa-caret-right"></i>&nbsp;</button>' );
			toggleButton.append( i18n['forest_cover_change_matrix'] );
			colHeader.append( toggleButton );
			
			var colCollapsableMatrix = $( '<div class="col-md-12 lucm-table">' );
			rowHeader.append(  colCollapsableMatrix );
			
			
			var rowStartYear = $( '<div class="row"></div>' );
			colCollapsableMatrix.append( rowStartYear );
			var colStartYearLabel = $( '<div class="col-md-4"></div>' );
			rowStartYear.append( colStartYearLabel );
			colStartYearLabel.html( i18n['initial_year'] );
			var colStartYearBtns = $( '<div class="col-md-8 period-btns start-period-btns"></div>' );
			rowStartYear.append( colStartYearBtns );
			
			var rowEndYear = $( '<div class="row"></div>' );
			colCollapsableMatrix.append( rowEndYear );
			var colEndYearLabel = $( '<div class="col-md-4"></div>' );
			rowEndYear.append( colEndYearLabel );
			colEndYearLabel.html( i18n['end_year'] );
			var colEndYearBtns = $( '<div class="col-md-8 period-btns end-period-btns"></div>' );
			rowEndYear.append( colEndYearBtns );
			
			for( var i = 0 ; i < resources.length ; i++ ){
				var resource 	= resources[ i ];
				
				var attributes 	= resource.Attributes.attribute;
				
				var startYear  	= getAttributeByName( attributes , 'start_period').value;
				var endYear  	= getAttributeByName( attributes , 'end_period').value ;
				var data 		= resource.store.data;
				
				if( startYears.indexOf(startYear) < 0 ){
					startYears.push( startYear );
				}
				if( endYears.indexOf(endYear) < 0 ){
					endYears.push( endYear );
				}
				var compareYears = function( a , b ){
					return parseInt( a ) - parseInt( b );
				};
				startYears 	= startYears.sort( compareYears );
				endYears 	= endYears.sort( compareYears );
				
//				console.log( resource );
//				console.log( endYears );
//				console.log( startYears );
				
				// now append lucm table 
				var rowMatrix = $( '<div class="row row-matrix"></div>' );
				rowMatrix.addClass( startYear + '-' + endYear );
				rowMatrix.hide();
				colCollapsableMatrix.append( rowMatrix );
				var colMatrix = $( '<div class="col-md-12 table-responsive no-padding"></div>' );
				rowMatrix.append( colMatrix );
				
				var table = $('<table class="table"></table>');
				colMatrix.append( table );
				
				var thead = $('<thead></thead>');
				table.append( thead );
				var trHead = $( '<tr></tr>' );
				thead.append( trHead );

				var tBody = $('<tbody></tbody>');
				table.append( tBody );
				for( var r = 0 ; r < data.length ; r++ ){
					var rowData = data[ r ];
					var tr = $( '<tr></tr>' );
					tBody.append( tr );
					
					// first column is the class
					var tdClass = $( '<td class="data-class"></td>' );
					tdClass.html( (r+1) );
					tr.append( tdClass );
					
					for( var c = 0 ; c < rowData.length ; c++ ){
						var value = rowData[ c ];
//						console.log( "row " + r + " - col " + c + " value " + value );
						
						var td = $( '<td></td>' );
						td.html( value );
						tr.append( td );
						td.addClass( (r+1) + '-' + (c+1) );
					}
				}
				
				// add fake headers
				var th = $(  '<th></th>' );
				trHead.append( th );
				for( var r = 0 ; r < data.length ; r++ ){
					
					var th = $(  '<th></th>' );
					th.html( (r+1) );
					trHead.append( th );
				}
				
				//give table celles a style
 				styleTableCells( table );
			}
			
			// add years buttons
			for( var i = 0 ; i < startYears.length ; i ++ ){
				
				var addBtn = function(){
					var startYear = startYears[ i ];
					var btn = $( '<button class="btn btn-default"></button>' );
					btn.html( startYear );
					btn.addClass( startYear );
					btn.click(function(){
						changeStartYear( startYear );
					});
					colStartYearBtns.append( btn );
				};
				addBtn();
			}
			for( var i = 0 ; i < endYears.length ; i ++ ){
				var addEndBtn = function(){
					var endYear = endYears[ i ];
					var btn = $( '<button class="btn btn-default"></button>' );
					btn.html( endYear );
					btn.addClass( endYear );
					btn.click(function(){
						changeEndYear( endYear );
					});
					colEndYearBtns.append( btn );
				};
				addEndBtn();
			}
			
			

			
			
			
			var toggleLUCM = function(){
//				console.log( currentStartYear +'   ' + currentEndYear);
				if( currentStartYear && currentEndYear){
					colCollapsableMatrix.find( '.row-matrix' ).hide();
					var matrix = container.find( '.row-matrix.'+currentStartYear+'-'+currentEndYear);
					matrix.fadeIn();
				}
			};
			
			var changeStartYear = function( year ){
				currentStartYear = year;
				colCollapsableMatrix.find( '.start-period-btns button' ).removeClass( 'active' );
				colCollapsableMatrix.find( '.start-period-btns button.' +year ).addClass( 'active' );
				toggleLUCM();
			};
			
			var changeEndYear = function( year ){
				currentEndYear = year;
				colCollapsableMatrix.find( '.end-period-btns button' ).removeClass( 'active' );
				colCollapsableMatrix.find( '.end-period-btns button.' +year ).addClass( 'active' );
				toggleLUCM();
			};
			
			changeStartYear( startYears[0] );
			changeEndYear( endYears[0] );
			
			
			
			// add chart containers
			
			// change of forest area
			var rowForestArea = $( '<div class="row row-dashbaord-padded info-table"></div>' );
			container.append( rowForestArea );
			var colFAHeader = $( '<div class="col-md-12 title"></div>' );
			rowForestArea.append(  colFAHeader );
			var toggleButtonFA = $( '<button class="btn btn-transparent btn-toggle-item" data-target="lucm-fa-chart"><i class="fa fa-caret-right"></i>&nbsp;</button>' );
			toggleButtonFA.append( i18n['change_forest_area'] );
			colFAHeader.append( toggleButtonFA );
			
			var colCollapsableFA = $( '<div class="col-md-12 lucm-fa-chart">' );
			rowForestArea.append(  colCollapsableFA );
			
			
			//area of land cover change
			var rowLCHeader = $( '<div class="row row-dashbaord-padded info-table"></div>' );
			container.append( rowLCHeader );
			var colLCHeader = $( '<div class="col-md-12 title"></div>' );
			rowLCHeader.append(  colLCHeader );
			var toggleButtonLC = $( '<button class="btn btn-transparent btn-toggle-item" data-target="lucm-lc-chart"><i class="fa fa-caret-right"></i>&nbsp;</button>' );
			toggleButtonLC.append( i18n['area_land_cover_change'] );
			colLCHeader.append( toggleButtonLC );
			
			var colCollapsableLC = $( '<div class="col-md-12 lucm-lc-chart">' );
			rowLCHeader.append(  colCollapsableLC );
			
			
			// add element to dashboard
			var fId = feature.fid.replace( '.' , '-' );
			layerDashbaord.addFeatureStats( fId, feature.attributes.name , container );
			layerDashbaord.toggleDashboardItem( 'stats' , fId , show );
			
			
			// add charts
			createForestAreaChangeChart( colCollapsableFA , null );
			createLandCoverChangeChart( colCollapsableLC , null );
			
			// bind events
			
//			$( '.collapsable' ).hide();
			container.find( '.btn-toggle-item' ).each( function(i,b){
				var btn = $( b );
				var target = container.find( '.' + btn.attr( 'data-target' ) );
//				setTimeout( function(){ target.hide(); } , 300 );
				target.hide();
			});
			container.find( '.btn-toggle-item' ).click(function(){
				var btn = $( this );
				var target = container.find( '.' + btn.attr( 'data-target' ) );
				if( target.is(':visible') ){
					target.slideUp();
					btn.find( 'i' ).removeClass().addClass( 'fa fa-caret-right' );
				} else {
					target.slideDown();
					btn.find( 'i' ).removeClass().addClass( 'fa fa-caret-down' );
					// resize highcharts width
//					$(window).trigger('resize');
				}
			});
		}
		
	});
	

	var styleTableCells = function( table ){
		//'rgba(50,40,20,0.5)' 
		table
			.find( 'td:not(.data-class)' )
			.css( 'background-color' , function(){
				var cssClasses = $( this ).get( 0 ).className.split( '-' );
				var row = parseInt( cssClasses[ 0 ] );
				var col = parseInt( cssClasses[ 1 ] );
//				console.log( row + '   '  + col ); 
				if( row <= 10 && col == 11 ){
//					return 'rgba( 220 , 72 , 72 ,0.5)';
//					return 'rgba( 224 , 13 , 38 ,0.5)';
					return 'rgba( 213 , 59 , 53 ,0.5)';
				} else if( row >=12 && col <= 10 ){
					// reforestation
					return 'rgba( 119 , 227 , 160 ,0.5)';
				} else if( row >= 12 && col == 11 ){
					// reforestation of plantation 
					return 'rgba( 202 , 204 , 0 ,0.5)';
				} else if ( row <= 11 && col >=12 ){
					return 'rgba( 213 , 9 , 33 ,0.5)';
				} 
				
				else if( col >= 12 && row >= 12 ){
					return 'rgba(50,40,20,0.5)';
				} else if( row == col ){
					return 'rgba( 255 , 255 , 255 ,0.5)';
				}
				
				
				
				//randon values
				else if(  row <= 4 && col <= 4){
					//degradation
					return 'rgba( 240 , 133 , 39 ,0.5)';
				} else if( row >= 4 && col <= 7 ) {
					//restoration
					return 'rgba( 119 , 227 , 39 ,0.5)';
				} else if( col >= 8 ){
					//degradation
					return 'rgba( 240 , 133 , 39 ,0.5)';
				} else {
					//restoration
					return 'rgba( 119 , 227 , 39 ,0.5)';
				}
			} );
	};

	var parseResources = function(feature) {
		var resources = new Array();
		if ( feature.attributes.ResourceList ) {
			for ( var i = 0; i < feature.attributes.ResourceList.Resource.length; i++ ) {
				var resource = feature.attributes.ResourceList.Resource[i];
				var attribute = getAttributeByName( resource.Attributes.attribute, 'stats_type' );
				if ( attribute.value == "lucm" ) {
					resources.push(resource);
				}
			}
		}

		return resources;
	};
	
	var getAttributeByName = function( attributes , name ){
		for( var j = 0 ; j < attributes.length ; j++){
			var attribute = attributes[ j ];
			if( attribute.name == name ){
				return attribute ;
			}
		}
	};
	
	var createForestAreaChangeChart = function( container , data ){
		container.css('height','550px');
		
		container.highcharts({
	        chart: {
	            type: 'column',
	            width : container.actual('width'),
	            backgroundColor : 'none',
	            style: {
	                fontFamily: 'Roboto',
	                color: "#E9E9E9"
	            }
	        },
	        plotBorderColor : 'rgba(233, 233, 233, 0.3)',
	        credits: {
	            enabled: false
	        } ,
	        title: {
	            text: '',
	            margin: 0
	        },
	        xAxis: {
	            categories: ['1990', '1995', '2000', '2005', '2010'],
	            labels: { 
	            	style: {
	            		fontFamily: 'Roboto',
	            		color: "#E9E9E9"
	            	}
	            },
	            gridLineColor : 'rgba(233, 233, 233, 0.25)',
	            lineColor : 'rgba(233, 233, 233, 0.25)',
	            minorGridLineColor : 'rgba(233, 233, 233, 0.25)',
	            minorTickColor : 'rgba(233, 233, 233, 0.25)',
	            tickColor : 'rgba(233, 233, 233, 0.25)'
	        },
	        yAxis: {
	            min: 0,
	            title: {
	            	text: '',
		            margin: 0
	            },
	            stackLabels: {
	                enabled: false,
	                style: {
	            		fontFamily: 'Roboto',
	            		color: "#E9E9E9"
	            	}
	            },
	            labels: { 
	            	style: {
	            		fontFamily: 'Roboto',
	            		color: "#E9E9E9"
	            	}
	            },
	            gridLineColor : 'rgba(233, 233, 233, 0.25)',
	            lineColor : 'rgba(233, 233, 233, 0.25)',
	            minorGridLineColor : 'rgba(233, 233, 233, 0.25)',
	            minorTickColor : 'rgba(233, 233, 233, 0.25)',
	            tickColor : 'rgba(233, 233, 233, 0.25)'
	        },
	        legend: {
	        	backgroundColor: 'rgba(66, 66, 66, 0.85)',
	            style : {
	            },
	            padding: 15,
	            itemStyle : {
	            	fontFamily: 'Roboto',
	            	color : "#E9E9E9",
	            	fontWeight: 100
	            },
	            itemHoverStyle: {
	            	color: 'rgba(50, 153, 187, 0.7)'
	            },
	            itemHiddenStyle: {
	            	color: 'rgba(40, 34, 34, 0.7)'
	            },
	            layout: 'vertical'
//	            itemDistance: 120
	        },
	        tooltip: {
	            formatter: function () {
	                return '<b>' + this.x + '</b><br/>' +
	                    this.series.name + ': ' + this.y + '<br/>' +
	                    'Total: ' + this.point.stackTotal;
	            }
	        },
	        plotOptions: {
	            column: {
//	            	color: '#E9E9E9',
	                stacking: 'normal',
	                borderColor : 'rgba(233, 233, 233, 0.20)',
	                dataLabels: {
	                    enabled: true,
	                    color: '#E9E9E9',
	                    style: {
	                        textShadow: '0 0 2px rgba(66, 66, 66, 0.2)',
	                        fontWeight: 100
	                    }
	                }
	            }
	        },
//	        colors: ['#8ded40','#7fd836','#30702b','#4f6b4d','#2b5a45','#7b9c46','#6e8c3e','#02491e','#036c2d','#137a6d','#2b6559','#cacc00' ],
	        colors: ['rgba(141, 237, 64, 0.5)','rgba(127, 216, 54, 0.5)','rgba(48, 112, 43, 0.5)','rgba(79, 107, 77, 0.5)','rgba(43, 90, 69, 0.5)','rgba(123, 156, 70, 0.5)'
	                 ,'rgba(110, 140, 62, 0.5)','rgba(2, 73, 30, 0.5)','rgba(3, 108, 45, 0.5)','rgba(19, 122, 109, 0.5)','rgba(43, 101, 89, 0.5)','rgba(202, 204, 0, 0.5)' ],
	        series: [
		        {
		            name: i18n['evergreen_broadleaves_rich'],
		            data: [5, 3, 4, 7, 2]
		        }, {
		            name:  i18n['evergreen_broadleaves_medium'],
		            data: [2, 2, 3, 2, 1]
		        }, {
		            name:  i18n['evergreen_broadleaves_poor'],
		            data: [3, 4, 4, 2, 5]
		        },
		        {
		        	name: i18n['evergreen_broadleaves_regrowth'],
		        	data: [5, 3, 4, 7, 2]
		        }, {
		        	name:  i18n['deciduous_forest'],
		        	data: [2, 2, 3, 2, 1]
		        }, {
		        	name:  i18n['bamboo_forest'],
		        	data: [3, 4, 4, 2, 5]
		        },
		        {
		        	name: i18n['mixed_wood_bamboo_forests'],
		        	data: [5, 3, 4, 7, 2]
		        }, {
		        	name:  i18n['coniferous_forests'],
		        	data: [2, 2, 3, 2, 1]
		        }, {
		        	name:  i18n['mixed_broadleaves_and_coniferous_forests'],
		        	data: [3, 4, 4, 2, 5]
		        },
		        {
		        	name: i18n['mangrove_forests'],
		        	data: [5, 3, 4, 7, 2]
		        }, {
		        	name:  i18n['lime_stone_forests'],
		        	data: [2, 2, 3, 2, 1]
		        }, {
		        	name:  i18n['plantation_forest'],
		        	data: [3, 4, 4, 2, 5]
		        },
	        
	        ]
	    });
	};
	
	var createLandCoverChangeChart = function( container , data ){
		container.css('height','400px');
	
		container.highcharts({

			chart: {
	            type: 'column',
	            width : container.actual('width'),
	            backgroundColor : 'none',
	            style: {
	                fontFamily: 'Roboto',
	                color: "#E9E9E9"
	            }
	        },
	        plotBorderColor : 'rgba(233, 233, 233, 0.3)',
	        credits: {
	            enabled: false
	        } ,
	        title: {
	            text: '',
	            margin: 0
	        },
	        xAxis: {
	        	categories: [ '90~95', '95~00', '00~05', '05~10' ],
	            labels: { 
	            	style: {
	            		fontFamily: 'Roboto',
	            		color: "#E9E9E9"
	            	}
	            },
	            gridLineColor : 'rgba(233, 233, 233, 0.25)',
	            lineColor : 'rgba(233, 233, 233, 0.25)',
	            minorGridLineColor : 'rgba(233, 233, 233, 0.25)',
	            minorTickColor : 'rgba(233, 233, 233, 0.25)',
	            tickColor : 'rgba(233, 233, 233, 0.25)'
	        },
	        yAxis: {
	            min: 0,
	            title: {
	            	text: '',
		            margin: 0
	            },
	            stackLabels: {
	                enabled: false,
	                style: {
	            		fontFamily: 'Roboto',
	            		color: "#E9E9E9"
	            	}
	            },
	            labels: { 
	            	style: {
	            		fontFamily: 'Roboto',
	            		color: "#E9E9E9"
	            	}
	            },
	            gridLineColor : 'rgba(233, 233, 233, 0.25)',
	            lineColor : 'rgba(233, 233, 233, 0.25)',
	            minorGridLineColor : 'rgba(233, 233, 233, 0.25)',
	            minorTickColor : 'rgba(233, 233, 233, 0.25)',
	            tickColor : 'rgba(233, 233, 233, 0.25)'
	        },

	        tooltip: {
	            formatter: function () {
	                return '<b>' + this.x + '</b><br/>' +
	                    this.series.name + ': ' + this.y 
//	                    + '<br/>' 
//	                    +
//	                    'Total: ' + this.point.stackTotal
	                    ;
	            }
	        },

	        plotOptions: {
		        column: {
	//            	color: '#E9E9E9',
	                stacking: 'normal',
	                borderColor : 'rgba(233, 233, 233, 0.20)',
	                dataLabels: {
	                    enabled: true,
	                    color: '#E9E9E9',
	                    style: {
	                        textShadow: '0 0 2px rgba(66, 66, 66, 0.2)',
	                        fontWeight: 100
	                    }
	                }
	            }
	        },
	        legend: {
	        	backgroundColor: 'rgba(66, 66, 66, 0.85)',
	            padding: 15,
	            itemStyle : {
	            	fontFamily: 'Roboto',
	            	color : "#E9E9E9",
	            	fontWeight: 100
	            },
	            itemHoverStyle: {
	            	color: 'rgba(50, 153, 187, 0.7)'
	            },
	            itemHiddenStyle: {
	            	color: 'rgba(40, 34, 34, 0.7)'
	            },
	            itemDistance: 40
	        },
	        colors:[ 'rgba(213, 9, 33, 0.5)' ,'rgba(119, 227, 39, 0.5)','rgba(119, 227, 160, 0.5)','rgba(50, 40, 20, 0.4)'],
	        
	        series: [{
	            name: 'D',
	            data: [40, 50, 90, 10],
	            stack: '1'
	        }, {
	            name: 'A/R',
	            data: [70, 80, 120, 30],
	            stack: '2'
	        }, {
	            name: 'FrF',
	            data: [170, 180, 190, 310],
	            stack: '3'
	        }, {
	            name: 'NonF',
	            data: [720, 640, 560, 595],
	            stack: '4'
	        }]
	    });
	
	};
});