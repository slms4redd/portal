define([ "jquery" , "message-bus" , "i18n", "layer-dashboard" ], function($, bus, i18n, layerDashbaord ) {
	
	var startYears 			= new Array();
	var endYears 			= new Array();
	var currentStartYear 	= null;
	var currentEndYear 		= null;
	
	bus.listen( "add-feature-stats" , function( event ,feature){
		var resources = parseResources( feature );
		
		startYears 			= new Array();
		endYears 			= new Array();
		currentStartYear 	= null;
		currentEndYear 		= null;
		
		if( resources.length > 0 ){
			var container = $( '<div class="width100 height100 lucm"></div>' );
			var rowHeader = $( '<div class="row"></div>' );
			container.append( rowHeader );
			var colHeader = $( '<div class="col-md-12"></div>' );
			rowHeader.append(  colHeader );
			colHeader.html( i18n['forest_cover_change_matrix'] );
			
			
			var rowStartYear = $( '<div class="row"></div>' );
			container.append( rowStartYear );
			var colStartYearLabel = $( '<div class="col-md-4"></div>' );
			rowStartYear.append( colStartYearLabel );
			colStartYearLabel.html( i18n['initial_year'] );
			var colStartYearBtns = $( '<div class="col-md-8 period-btns start-period-btns"></div>' );
			rowStartYear.append( colStartYearBtns );
			
			var rowEndYear = $( '<div class="row"></div>' );
			container.append( rowEndYear );
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
				container.append( rowMatrix );
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
					var tdClass = $( '<td class="data-class"></td>' );
					tdClass.html( (r+1) );
					tr.append( tdClass );
					for( var c = 0 ; c < rowData.length ; c++ ){
						var value = rowData[ c ];
//						console.log( "row " + r + " - col " + c + " value " + value );
						
						var td = $( '<td></td>' );
						td.html( value );
						tr.append( td );
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
			
			
			// add element to dashboard
			var fId = feature.fid.replace( '.' , '-' );
			layerDashbaord.addFeatureStats( fId, feature.attributes.name , container );
			layerDashbaord.toggleDashboardItem( 'stats' , fId , true );

			
			
			
			var toggleLUCM = function(){
//				console.log( currentStartYear +'   ' + currentEndYear);
				if( currentStartYear && currentEndYear){
					container.find( '.row-matrix' ).hide();
					var matrix = container.find( '.row-matrix.'+currentStartYear+'-'+currentEndYear);
					matrix.fadeIn();
				}
			};
			
			var changeStartYear = function( year ){
				currentStartYear = year;
				container.find( '.start-period-btns button' ).removeClass( 'active' );
				container.find( '.start-period-btns button.' +year ).addClass( 'active' );
				toggleLUCM();
			};
			
			var changeEndYear = function( year ){
				currentEndYear = year;
				container.find( '.end-period-btns button' ).removeClass( 'active' );
				container.find( '.end-period-btns button.' +year ).addClass( 'active' );
				toggleLUCM();
			};
			
			changeStartYear( startYears[0] );
			changeEndYear( endYears[0] );
		}
		
	});
	

	

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
	
});