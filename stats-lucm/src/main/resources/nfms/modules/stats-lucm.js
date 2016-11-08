define([ "jquery" , "message-bus" , "i18n", "dashboard" ,"highcharts" ,"customization", "jquery.actual.min"], function($, bus, i18n, dashboard ,highcharts, customization) {
	var tooltipTemplate = '<div class="tooltip portal-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>';

	var charts = [];
	
	var addSource = function( sectionButton , sectionData , file ){
		var sourceBtn = $( '<button class="btn btn-default chart_source_btn"></button>' );
		sourceBtn.append( i18n['chart_source_btn']  );
		sectionButton.append( sourceBtn );
		
		var rowSource = $( '<div class="row"></div>' );
		sectionData.append( rowSource );
		
		var colSource = $( '<div class="col-md-12"></div>' );
		rowSource.append(colSource);
		rowSource.hide();
		
		var linkSource = "static/loc/" + customization.languageCode + "/html/" + file;
		$.ajax({
			url			: linkSource ,
			data		: {bust : (new Date()).getTime()},
			dataType 	: "html" ,
			success		: function(data){
				colSource.append( data );
			}
		});
		sourceBtn.click( function(e){
			e.preventDefault();
			sourceBtn.blur();
			if( rowSource.is(":hidden") ){
				rowSource.slideDown();
			} else {
				rowSource.slideUp();
			}
		});
	};
	
	bus.listen( "add-feature-stats" , function( event , feature , openSection , expand ){
		var compareLucmRes			= function (a , b){
			var y1  	= getAttributeByName( a.Attributes.attribute , 'start_period').value;
			var y2  	= getAttributeByName( b.Attributes.attribute , 'start_period').value;
			return ( y1 < y2 ) ? -1 : 1;
		};
		
		var resources 				= parseResources( feature , "lucm" , compareLucmRes );
		
		var carbonStockResources	= parseResources( feature , "carbon_stock" );
		var carbonStock				= null;
		if( carbonStockResources.length > 0 ){
			carbonStock = carbonStockResources[ 0 ];
		}
		
		
		var startYears 			= new Array();
		var endYears 			= new Array();
		var currentStartYear 	= null;
		var currentEndYear 		= null;
		
		if( resources.length > 0 ){
			
			var container = $( '<div class="width100 height100 lucm"></div>' );
			
			var headerBtns = $(' <div class="row row-dashbaord-padded header-btns">'+
								'<div class="col-md-12" >'+
								'<select class="stats-select form-control">'+
									'<option data-target="lucm-fa-chart" selected="selected">'+i18n['btn-stats-forest-area']+'</option>'+
									'<option data-target="lucm-lc-chart">'+i18n['btn-stats-forest-change']+'</option>'+
									'<option data-target="lucm-table">'+i18n['btn-stats-change-matrix']+'</option>'+
								'</select>'+
							'</div>'+
						'</div> ');
			container.append( headerBtns );
			
			if( carbonStock ){
				headerBtns.find( 'select.stats-select' ).append( '<option data-target="carbon-stock">'+i18n['btn-stats-carbon-stock']+'</option>' );
			}
			headerBtns.find( 'select.stats-select' ).append( '<option data-target="lucm-emission-removal-categories">'+i18n['btn-stats-er-categories']+'</option>' ).append('<option data-target="lucm-emission-removal-activities">'+i18n['btn-stats-er-activities']+'</option>');
			
			var rowHeader = $( '<div class="row row-dashbaord-padded info-table lucm-table"></div>' );
			container.append( rowHeader );
			var colHeader = $( '<div class="col-md-12 title"></div>' );
			colHeader.append( i18n['forest_cover_change_matrix'] );
			rowHeader.append(  colHeader );
			
			var colFASrc = $( '<div class="col-md-12">' );
			rowHeader.append(  colFASrc );
			addSource( colHeader ,  colFASrc , "lucc_info.html" );
			
			var colCollapsableMatrix = $( '<div class="col-md-12">' );
			rowHeader.append(  colCollapsableMatrix );
						
			var rowStartYear = $( '<div class="row"></div>' );
			colCollapsableMatrix.append( rowStartYear );
			var colStartYearLabel = $( '<div class="col-md-4"></div>' );
			rowStartYear.append( colStartYearLabel );
			//colStartYearLabel.html( i18n['initial_year'] );
			var colStartYearBtns = $( '<div class="col-md-12 period-btns start-period-btns"></div>' );
			rowStartYear.append( colStartYearBtns );
			
			var rowEndYear = $( '<div class="row"></div>' );
			
			// HACK 06/11/2016: LUCM data are only for contiguous years so the end years buttons are useless 
			// just hide them for now
			rowEndYear.css("display","none")
			
			colCollapsableMatrix.append( rowEndYear );
			var colEndYearLabel = $( '<div class="col-md-4"></div>' );
			rowEndYear.append( colEndYearLabel );
			colEndYearLabel.html( i18n['end_year'] );
			var colEndYearBtns = $( '<div class="col-md-8 period-btns end-period-btns"></div>' );
			rowEndYear.append( colEndYearBtns );
			
			// forest change data 
			var forestChangeData = [];
			var forestAreaData	= [];
			for( var i = 0 ; i < resources.length ; i++ ){
				var resource 	= resources[ i ];
				
				var attributes 	= resource.Attributes.attribute;
				
				var startYear  	= getAttributeByName( attributes , 'start_period').value;
				var endYear  	= getAttributeByName( attributes , 'end_period').value ;
				var data 		= $.parseJSON( resource.data.data );
				
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
				
				
				// add headers
				var th = $(  '<th></th>' );
				trHead.append( th );
				for( var r = 0 ; r < data[0].length ; r++ ){
					
					var th = $(  '<th></th>' );
					th.html( (r+1) );
					th.addClass( 'nfi-class-' + (r+1) );
					th.tooltip({
						title:i18n[ 'nfi-class-' + (r+1) ], 
						container: 'body', 
						placement:'top', 
						template:tooltipTemplate , 
						delay: { "show": 0, "hide": 20 }, 
						html:true 
					});
					trHead.append( th );
				}
				var thTot = $(  '<th></th>' );
				thTot.html( i18n['total'] );
				trHead.append( thTot );
				
				// init total variables
				var total = 0;
				var colTot = new Array();
				for( var k = 0 ; k< data[0].length ; k++ ){
					colTot[k] = 0;
				}
				
				
				var forestChange 	= [ 0 , 0 , 0 , 0 ];
				var forestArea	 	= new Array();
				
				// add row
				for( var r = 0 ; r < data.length ; r++ ){
					var rowData = data[ r ];
					var tr = $( '<tr></tr>' );
					tBody.append( tr );
					
					// first column is the class
					var tdClass = $( '<td class="data-class"></td>' );
					tdClass.html( (r+1) );
					tdClass.addClass( 'nfi-class-' + (r+1) );
					tdClass.tooltip({
						title:i18n[ 'nfi-class-' + (r+1) ], 
						container: 'body', 
						placement:'left', 
						template:tooltipTemplate , 
						delay: { "show": 0, "hide": 20 }, 
						html:true 
					});
					
					tr.append( tdClass );
					var rowTot= 0;
					// add column
					for( var c = 0 ; c < rowData.length ; c++ ){
						var value = rowData[ c ];
						// row total
						rowTot += value;
						// column total
						colTot[ c ] = colTot[ c ] +   value;
						// total
						total += value;
						
//						console.log( value.toLocaleString() );
						var valueStr = ( +value.toFixed(0) ).toLocaleString();
//						console.log( "row " + r + " - col " + c + " value " + value );
						
						var td = $( '<td></td>' );
						td.html( valueStr );
						tr.append( td );
						td.addClass( (r+1) + '-' + (c+1) );
						
						// 13 : 17 --> 1 : 12
						// 1 : 12 --> 1:12
						// 1:12 --> 13:17
						//  13:17 -->  13:17
						// NO DATA Exlcuded
						if( c <= 17 && r<= 17 ){
							
							if( c<= 12 ){
								//  forest
								if( r <= 12 ){
									forestChange[ 1 ] += value;
								} else {
									forestChange[ 0 ] += value;
								}
							} else {
								//  non forest
								if( r <= 12 ){
									forestChange[ 2 ] += value;
								} else {
									forestChange[ 3 ] += value;
								}
							}
						}
						
					}
					var tdTot = $( '<td></td>' );
					tdTot.html(  (+ rowTot.toFixed(0)).toLocaleString() );
					tr.append( tdTot );
					
					forestArea.push( rowTot );
				}
				
				forestChangeData[ startYear + '~' + endYear ] = forestChange;
				forestAreaData[ startYear + '' ] = forestArea.slice(0, 12);
				if( i == resources.length-1 ){
					forestAreaData[ endYear + '' ] = colTot.slice(0, 12);
				}
				
				// add total rows
				var trTot = $(  '<tr></tr>' );
				tBody.append( trTot );
				trTot.append( '<td>' + i18n['total'] + '</td>' );
				for( var c = 0 ; c < colTot.length ; c++ ){
					var valueStr = ( +colTot[c].toFixed(0) ).toLocaleString();
					var td = $(  '<td></td>' );
					td.html( valueStr );
					trTot.append( td );

				}
				var tdTot = $(  '<td></td>' );
				tdTot.html( ( +total.toFixed(0) ).toLocaleString() );
				trTot.append( tdTot );
				
				
				//give table celles a style
 				styleTableCells( table );
			}
			
			// add years buttons
			for( var i = 0 ; i < startYears.length ; i ++ ){
				
				var addBtn = function(){
					var startYear = startYears[ i ];
					var btn = $( '<button class="btn btn-default"></button>' );
					var endYear = endYears[i];
					btn.html( startYear + "-" + endYear);
					btn.addClass( startYear+'' );
					btn.click(function(){
						changeStartYear( startYear );
						// HACK 06/11/2016 set here also end year
						changeEndYear( endYear );
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
					btn.addClass( endYear+'' );
					btn.click(function(){
						changeEndYear( endYear );
					});
					colEndYearBtns.append( btn );
				};
				addEndBtn();
			}
			
			

			
			
			
			var toggleLUCM = function(){
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
			var rowForestArea = $( '<div class="row row-dashbaord-padded info-table lucm-fa-chart"></div>' );
			container.append( rowForestArea );
			var colFAHeader = $( '<div class="col-md-12 title"></div>' );
			colFAHeader.append( i18n['change_forest_area'] );
			rowForestArea.append(  colFAHeader );
			
			var colFASrc = $( '<div class="col-md-12">' );
			rowForestArea.append(  colFASrc );
			addSource( colFAHeader ,  colFASrc , "forest_area_info.html" );
			
			var colCollapsableFA = $( '<div class="col-md-12">' );
			rowForestArea.append(  colCollapsableFA );
			
			//area of land cover change
			var rowLCHeader = $( '<div class="row row-dashbaord-padded info-table lucm-lc-chart"></div>' );
			container.append( rowLCHeader );
			var colLCHeader = $( '<div class="col-md-12 title"></div>' );
			colLCHeader.append( i18n['area_land_cover_change'] );
			rowLCHeader.append(  colLCHeader );
			
			var colLCSrc = $( '<div class="col-md-12">' );
			rowLCHeader.append(  colLCSrc );
			addSource( colLCHeader ,  colLCSrc , "forest_change_info.html" );
			
			var colCollapsableLC 		= $( '<div class="col-md-12">' );
			rowLCHeader.append(  colCollapsableLC );
			
			// emission removal activities
			bus.send( 'emission-removal-activities' , [container, feature]);
			
			// emission removal categories
			bus.send( 'emission-removal-categories' , [container, feature]);
			
			// Carbon Stock
			if( carbonStock ){
				var rowCS = $( '<div class="row row-dashbaord-padded info-table carbon-stock"></div>' );
				container.append( rowCS );
				var colCSHeader = $( '<div class="col-md-12 title"></div>' );
				colCSHeader.append( i18n['carbon_stock_estimates'] );
				rowCS.append(  colCSHeader );
				
				
				var colCollapsableCS = $( '<div class="col-md-12">' );
				rowCS.append( colCollapsableCS );
				
				addSource( colCSHeader ,  colCollapsableCS , "carbon_stock_info.html" );
				
				
				var div = $('<div class="table-responsive">'+
								'<table class="table">'+
									'<thead>'+
										'<tr>'+
											'<th class="col-md-8"></th>'+
											'<th class="col-md-4">'+i18n['avg']+'</th>'+
										'</tr>'+
									'</thead>'+
								'</table>'+
							'</div>');
				var tbody = $( '<tbody/>' );
				div.find( 'table' ).append( tbody );
				colCollapsableCS.append( div );
				
				var addCSRow = function( index , data ){
					
					var tr = $( '<tr/>' );
					tbody.append( tr );
					
					var td1 = $( '<td></td>' );
					var nfiCls	= 'nfi-class-'+(index+1);
					td1.append( i18n['nfi-class-'+( parseInt(index)+1)] );
					tr.append( td1 );
					
					var valueStr = ( +data.toFixed(2) ).toLocaleString();
					var td2 = $( '<td></td>' );
					td2.append( valueStr );
					tr.append( td2 );
				};
				
				var csData = $.parseJSON(carbonStock.data.data);
				for( var l in csData ){
					addCSRow( l , csData[ l ] );
				}
				
			}
			
			// add UI element to dashboard
			var fId = feature.fid.replace( '.' , '-' );
			var fName = ( feature.isEcoregion ) ? feature.attributes.ecozonedef : feature.attributes.name ; 
			bus.send( 'add-dashboard-element' , [fId , fName, container , true , dashboard.TYPE.STATS, dashboard.SOURCE.FEATURES]);
			
			bus.send( "dashboard-activate-type" , [dashboard.TYPE.STATS, dashboard.SOURCE.FEATURES] );
			
			if( !expand ){
				bus.send( 'dashboard-element-toggle-state' , [dashboard.TYPE.STATS , fId , false] );
			}
			
			// add charts
			createForestAreaChart( colCollapsableFA , forestAreaData );
			createForestChangeChart( colCollapsableLC , forestChangeData );
			
			// bind events
			var infoTables = container.find( '.info-table' );
			infoTables.hide();
			
			var options =  container.find( '.stats-select');
			
			var activateStats = function(){
				var option = $(this).find(":selected");
					infoTables.hide();
					var target = container.find( '.' + option.attr( 'data-target' ) );
					target.fadeIn();
			}
			
			options.change( activateStats );
			options.ready( activateStats );			
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

				if( isNaN(row) && isNaN(col) ){
					return '';
				} else {
					if( row <= 10 && col == 11 ){
//						return 'rgba( 220 , 72 , 72 ,0.5)';
//						return 'rgba( 224 , 13 , 38 ,0.5)';
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
					
					
				
					//random values
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
				}
//				
			} );
	};
	
	var parseResources = function(feature , statsType , compareFunction ) {
		var resources = new Array();
		if ( feature.attributes.ResourceList ) {
			for ( var i = 0; i < feature.attributes.ResourceList.Resource.length; i++ ) {
				var resource = feature.attributes.ResourceList.Resource[i];
				var attribute = getAttributeByName( resource.Attributes.attribute, 'stats_type' );
				if ( attribute.value ==  statsType ) {
					resources.push(resource);
				}
			}
		}
		
		if( compareFunction ){
			resources.sort(compareFunction);
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
	
	var createForestAreaChart = function( container , data ){
		var years 		= new Array();
		var dataClasses = new Array();
		
		for( var y in data ){
			years.push( y );
			
			var dataArray = data[ y ];
			for( var d in dataArray ){
				var datum = dataArray[ d ];
				
				if( dataClasses.length <= d ){
					dataClasses.push( new Array() );
				}
				dataClasses[ d ].push( datum );
			}
		}
		
		var h = getChartHeight();
		container.css( 'height',  h + 'px' );
		var chartId = 'chart-fa-'+$.now();
		container.attr( 'id'  ,  chartId );
			
		var chart = new Highcharts.Chart({
	        chart: {
	        	renderTo : chartId,
	            type: 'column',
	            //width : container.actual('width'),
	            backgroundColor : 'none',
	            style: {
	                fontFamily: 'Roboto',
	                color: "#E9E9E9"
	            },
	            width: $('.dashboard').width()*0.75 ,
	            height: h,
	            marginLeft : 50
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
	            categories: years,
//	            categories: ['1990', '1995', '2000', '2005', '2010'],
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
	        	backgroundColor: 'rgba(233, 233, 233, 0.10)',
//	        	backgroundColor: 'rgba(61, 65, 70, 0.90)',
	            style : {
	            },
	            padding: 22,
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
	                    enabled: false,
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
		            name: i18n['nfi-class-1'],
//		            data: [5, 3, 4, 7, 2]
		        	data: dataClasses[ 0 ]
		        }, {
		            name:  i18n['nfi-class-2'],
		            data: dataClasses[ 1 ]
		        }, {
		            name:  i18n['nfi-class-3'],
		            data: dataClasses[ 2 ]
		        },
		        {
		        	name: i18n['nfi-class-4'],
		        	data: dataClasses[ 3 ]
		        }, {
		        	name:  i18n['nfi-class-5'],
		        	data: dataClasses[ 4 ]
		        }, {
		        	name:  i18n['nfi-class-6'],
		        	data: dataClasses[ 5 ]
		        },
		        {
		        	name: i18n['nfi-class-7'],
		        	data: dataClasses[ 6 ]
		        }, {
		        	name:  i18n['nfi-class-8'],
		        	data: dataClasses[ 7 ]
		        }, {
		        	name:  i18n['nfi-class-9'],
		        	data: dataClasses[ 8 ]
		        },
		        {
		        	name: i18n['nfi-class-10'],
		        	data: dataClasses[ 9 ]
		        }, {
		        	name:  i18n['nfi-class-11'],
		        	data: dataClasses[ 10 ]
		        }, {
		        	name:  i18n['nfi-class-12'],
		        	data: dataClasses[ 11 ]
		        },
	        
	        ]
	    });
		
		charts[ chartId ] = chart ;
		//resizeChart( chart , container , $('.dashboard').width()*0.80 , $( window ).height() *0.5 );
	};
	
	var createForestChangeChart = function( container , data ){
		// 13 : 17 --> 1 : 12
		// 1 : 12 --> 1:12
		// 1:12 --> 13:17
		//  13:17 -->  13:17
		
		var dataYears 	= [];
		var categories 	= [];
		var l = 0;
		for( var i in data ){
			dataYears[ l ] = data[ i ];
			categories[ l ] =  i ;
			
			l++;
		}
		var dataClasses = [ [] , [] , [] , [] ];
		
		for( var i in dataYears ){
			var dataYear 	= dataYears[i];
			
			var totalArea 	= 0; 
			for( var j in dataYear ){
				totalArea += dataYear[ j ];
			}
			for( var j in dataYear ){
				dataClasses[ j ][ i ] =  dataYear[ j ] ;
//				dataClasses[ j ][ i ] = +( dataYear[ j ] / totalArea * 1000 ).toFixed(2);
//				dataClasses[ j ][ i ] = +( dataYear[ j ] / totalArea * 100 ).toFixed(2);
			}
		}
		
		var h = getChartHeight();
		container.css( 'height', h + 'px' );

		var chartId = 'chart-fc'+$.now();
		container.attr( 'id'  ,  chartId );
	
		var chart = new Highcharts.Chart({

			chart: {
				
				renderTo 	: chartId,
	            type		: 'column',
	          //  width 		: container.actual('width'),
	            backgroundColor : 'none',
	            style: {
	                fontFamily: 'Roboto',
	                color: "#E9E9E9"
	            },
	            width: $('.dashboard').width()*0.75 ,
	            height: h,
	            marginLeft : 50
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
	        	categories: categories,
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
	            	},
		            formatter: function() {
		            	return this.value + ' %';
		            }
	            },
	            gridLineColor : 'rgba(233, 233, 233, 0.25)',
	            lineColor : 'rgba(233, 233, 233, 0.25)',
	            minorGridLineColor : 'rgba(233, 233, 233, 0.25)',
	            minorTickColor : 'rgba(233, 233, 233, 0.25)',
	            tickColor : 'rgba(233, 233, 233, 0.25)'
	        },
	        tooltip: {
	        	backgroundColor	: 'rgba(233, 233, 233, 0.90)',
	        	borderColor: 'rgba(61, 65, 70, 0.90)',
	        	borderRadius	: 1,
	        	headerFormat	: '<span style="width:100%; text-align:center; font-weight:bold; padding: 5px 0px;">{point.key}</span><br/>',
	            pointFormat		: '<span style="color:{series.color}; font-weight:bold">{series.name}: </span><b>{point.percentage:.0f}% ({point.y})</b><br/>',
	            shared: true
	        },
//	        tooltip: {
//	            formatter: function () {
//	                return '<b>' + this.x + '</b><br/>' +
//	                    this.series.name + ': ' + this.y + '%'
//	                    ;
//	            }
//	        },
	        plotOptions: {
		        column: {
	                stacking: 'percent',
	                borderColor : 'rgba(233, 233, 233, 0.20)',
	                dataLabels: {
	                    enabled: false,
	                    color: '#E9E9E9',
	                    style: {
	                        textShadow: '0 0 2px rgba(66, 66, 66, 0.2)',
	                        fontWeight: 100
	                    }, formatter: function(){
//		                	console.log( this );
		                	return this.y + ' %';
		                }
	                }
	            }
	        },
	        legend: {
//	        	backgroundColor: 'rgba(61, 65, 70, 0.90)',
	        	backgroundColor: 'rgba(233, 233, 233, 0.10)',
	            padding: 16,
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
	            //itemDistance: 140,
	            layout: 'vertical'
	        },

//	        colors:[ 'rgba(213, 9, 33, 0.5)' ,'rgba(202, 204, 0, 0.5)','rgba(96, 204, 16, 0.5)','rgba(40, 34, 34, 0.5)'],
//	        colors:[ 'rgba(213, 9, 33, 0.5)','rgba(96, 204, 16, 0.5)','rgba(56, 126, 8, 0.5)','rgba(40, 34, 34, 0.5)'],
//	        colors:[ 'rgba(213, 9, 33, 0.5)','rgba(96, 204, 16, 0.5)','rgba(56, 126, 8, 0.5)','rgba(56, 56, 54, 0.5)'],
	        colors:[ 'rgba(96, 204, 16, 0.5)','rgba(56, 126, 8, 0.5)','rgba(213, 9, 33, 0.5)','rgba(56, 56, 54, 0.5)'],
	        
	        series: [
		        {
		        	name: i18n[ 'forest_change_ar' ],
		        	data: dataClasses[0]
		        }, {
		        	name: i18n[ 'forest_change_frf' ],
		        	data: dataClasses[1]
		        }
		        ,{
		            name: i18n[ 'forest_change_d' ],
		            data: dataClasses[2]
		        }
		        , {
		        	name: i18n[ 'forest_change_nf' ],
		            data: dataClasses[3]
		        }
	        ]
	    });	
		charts[ chartId ] = chart; 
		
		//resizeChart( chart , container , $('.dashboard').width()*0.80 , $( window ).height() *0.5 );
	};
	
	//resize events
	var resizeChart = function( chart , elem , w , h ){
		
		elem.css( { width: w, height : h} );
		chart.setSize( w, h );
		//chart.redraw();
	};	
	
	var resizeCharts = function( h ){	
		for( var chartId in charts ){
			
			var chart = charts[ chartId ];
			var elem 	= $( '#'+chartId );
			
			if( elem.length ){
				var h = getChartHeight();
				var w = $('.dashboard').width()*0.75;
				resizeChart( chart , elem , w , h );
			
			} else {
			
				charts[ chartId ] = null;
			
			}
		}
		
	};

	var getChartHeight = function(){
		var h = $( window ).height() * ( dashboard.isExpanded() ? 0.65 : 0.5 );
		return h ;
	};
	
	bus.listen( 'dashboard-expand' , function(){
		setTimeout(function(){
			resizeCharts();	
		}, 300 );
	});
	
	bus.listen( 'dashboard-reduce' , function(){
//		resizeCharts();		
		setTimeout(function(){
			resizeCharts();	
		}, 300 );
	});
	
	$(window).resize( function(){
		resizeCharts()
	});
	
});