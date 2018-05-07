define([ "jquery" , "message-bus" , "i18n", "customization","mustache"], function($, bus, i18n, customization, mustache) {
	
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
	
	bus.listen( "emission-removal-activities" , function( event, container, feature ){
		var erActivities = $( '<div class="row row-dashbaord-padded info-table lucm-emission-removal-activities"></div>' );
		container.append( erActivities );
		
		var mustacheEngine = mustache;
		
		var infoQueryUrl 	= customization['info.queryUrl'] ;
		var serverUrl 		= customization['info.serverUrl'] ;
		var sameOrigin = StringUtils.startsWith( window.location.origin , serverUrl );	
		if( !sameOrigin ){
			infoQueryUrl 	= "proxy?url=" + encodeURIComponent( infoQueryUrl );
		}
		
		var zonesArray = {"100":"ecoregion","010":"country","001":"province"};
		var codesArray = {"100":"ecozonecod","010":"1","001":"province_c"};
		var index = ""+(0+feature.isEcoregion)+(0+feature.isCountry)+(0+feature.isProvince);
		
		var statsQueryData = '<AND><ATTRIBUTE><name>zone_type</name><operator>EQUAL_TO</operator><type>STRING</type><value>' + zonesArray[index] + '</value></ATTRIBUTE>';
		statsQueryData += '<ATTRIBUTE><name>zone_id</name><operator>EQUAL_TO</operator><type>STRING</type><value>' + (feature.properties[codesArray[index]]||codesArray[index]) + '</value></ATTRIBUTE>' ;
		statsQueryData += '<ATTRIBUTE><name>stats_type</name><operator>EQUAL_TO</operator><type>STRING</type><value>emission-removals-activity</value></ATTRIBUTE>' ;		
		statsQueryData += '</AND>';
		
		var colHeader = $( '<div class="col-md-12 title"></div>' );
		colHeader.append( i18n['er_activities_uom'] );
		erActivities.append(  colHeader );
		
		var colFASrc = $( '<div class="col-md-12">' );
		erActivities.append(  colFASrc );
		addSource( colHeader ,  colFASrc , "er_activities_info.html" );
		
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
				if( data.ResourceList ){
					window['INDEX']=0;
					var table = {
							data : JSON.parse(data.ResourceList.Resource.data.data),
							label: function() {
								var labelArray = {"1":i18n[ 'deforestation' ],"2":i18n[ 'degradation' ],"3":i18n[ 'reforestation' ],"4":i18n[ 'restoration' ],"5":i18n[ 'tot_emissions' ],"6":i18n[ 'tot_removals' ],"7":i18n[ 'frel' ],"8":i18n[ 'frl_adj' ],"9":i18n[ 'frl_w_adj' ]};
								++window['INDEX']||(window['INDEX']=0);
								return labelArray[window['INDEX']];
							},
							formatNumber: function( ) {
								return this.toLocaleString('en', {useGrouping:true, maximumFractionDigits:0});
							}
					}
					var tableHeader = "<tr><td></td>" + 
					"<td class='first'>1995-2000</td>" +
					"<td class='first'>2000-2005</td>" + 
					"<td class='first'>2005-2010</td>" +
					"</tr>";
					var template = "<div class='row emission-removal'><table class='emission-removal'>" + tableHeader + "{{#data}}<tr><td class='first'>{{label}}</td>{{#.}}<td>{{formatNumber}}</td>{{/.}}</tr>{{/data}}</table></div>"
					erActivities.find('div.emission-removal').remove();
					erActivities.append(mustacheEngine.render(template, table));
 
				}else{
					erActivities.find('div.emission-removal').remove();
					erActivities.append("<div style='overflow-x:auto;' class='row emission-removal'>" + i18n['no-stats-data'] + "</div>");
				}
			}
		
		});
	});
		
	bus.listen( "emission-removal-categories" , function( event, container, feature ){
		var erCategories = $( '<div class="row row-dashbaord-padded info-table lucm-emission-removal-categories"></div>' );
		container.append( erCategories );
		
		var mustacheEngine = mustache;
		
		var infoQueryUrl 	= customization['info.queryUrl'] ;
		var serverUrl 		= customization['info.serverUrl'] ;
		var sameOrigin = StringUtils.startsWith( window.location.origin , serverUrl );	
		if( !sameOrigin ){
			infoQueryUrl 	= "proxy?url=" + encodeURIComponent( infoQueryUrl );
		}
		
		var colHeader = $( '<div class="col-md-12 title"></div>' );
		colHeader.append( i18n[ 'er_categories_uom' ] );
		erCategories.append(  colHeader );
		
		var colFASrc = $( '<div class="col-md-12">' );
		erCategories.append(  colFASrc );
		addSource( colHeader ,  colFASrc , "er_categories_info.html" );
		
		var yearsMenu = $('<div class="col-md-12 period-btns">');
		yearsMenu.append('<button data-year="1995" class="yearsbtn btn btn-default 1995 active">1995-2000</button>');
		yearsMenu.append('<button data-year="2000" class="yearsbtn btn btn-default 2000">2000-2005</button>');
		yearsMenu.append('<button data-year="2005" class="yearsbtn btn btn-default 2005">2005-2010</button>');
		var rowMenu = $('<div class="row">');
		rowMenu.append(yearsMenu);
		erCategories.append(rowMenu);
		
		var yearsBtns = erCategories.find('.yearsbtn');
		
		yearsBtns.click(function(){
			erCategories.find('div.emission-removal').remove();
			var btn = $( this );
			if( !btn.hasClass('active') ){
				yearsBtns.removeClass( 'active' );
				btn.addClass( 'active' );
			}
			
			var zonesArray = {"100":"ecoregion","010":"country","001":"province"};
			var codesArray = {"100":"ecozonecod","010":"1","001":"province_c"};
			var index = ""+(0+feature.isEcoregion)+(0+feature.isCountry)+(0+feature.isProvince);
			
			var statsQueryData = '<AND><ATTRIBUTE><name>zone_type</name><operator>EQUAL_TO</operator><type>STRING</type><value>' + zonesArray[index] + '</value></ATTRIBUTE>';
			statsQueryData += '<ATTRIBUTE><name>zone_id</name><operator>EQUAL_TO</operator><type>STRING</type><value>' + (feature.properties[codesArray[index]]||codesArray[index]) + '</value></ATTRIBUTE>' ;
			statsQueryData += '<ATTRIBUTE><name>start_period</name><operator>EQUAL_TO</operator><type>STRING</type><value>' + erCategories.find('.yearsbtn.active').data('year') + '</value></ATTRIBUTE>' ;
			statsQueryData += '<ATTRIBUTE><name>stats_type</name><operator>EQUAL_TO</operator><type>STRING</type><value>emission-removals-landzone</value></ATTRIBUTE>' ;		
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
					if( data.ResourceList ){
						window['INDEX']=0;
						var table = {
								data : JSON.parse(data.ResourceList.Resource.data.data),
								index: function() {
									return ++window['INDEX']||(window['INDEX']=0);
								},
								tooltipMsg: function(){
									return i18n[ 'nfi-class-' + (window['INDEX']+1) ]
								},
								formatNumber: function( ) {
									return this.toLocaleString('en', {useGrouping:true, maximumFractionDigits:0});
								}
						}
						
						var tableHeader = "<tr><td></td>" + 
											"<td class='first' data-toggle='tooltip' title='" + i18n[ 'nfi-class-1' ] + "'>1</td>" +
											"<td class='first' data-toggle='tooltip' title='" + i18n[ 'nfi-class-2' ] + "'>2</td>" + 
											"<td class='first' data-toggle='tooltip' title='" + i18n[ 'nfi-class-3' ] + "'>3</td>" +
											"<td class='first' data-toggle='tooltip' title='" + i18n[ 'nfi-class-4' ] + "'>4</td>" +
											"<td class='first' data-toggle='tooltip' title='" + i18n[ 'nfi-class-5' ] + "'>5</td>" +
											"<td class='first' data-toggle='tooltip' title='" + i18n[ 'nfi-class-6' ] + "'>6</td>" +
											"<td class='first' data-toggle='tooltip' title='" + i18n[ 'nfi-class-7' ] + "'>7</td>" +
											"<td class='first' data-toggle='tooltip' title='" + i18n[ 'nfi-class-8' ] + "'>8</td>" +
											"<td class='first' data-toggle='tooltip' title='" + i18n[ 'nfi-class-9' ] + "'>9</td>" +
											"<td class='first' data-toggle='tooltip' title='" + i18n[ 'nfi-class-10' ] + "'>10</td>" +
											"<td class='first' data-toggle='tooltip' title='" + i18n[ 'nfi-class-11' ] + "'>11</td>" +
											"<td class='first' data-toggle='tooltip' title='" + i18n[ 'nfi-class-12' ] + "'>12</td>" +
											"<td class='first' data-toggle='tooltip' title='" + i18n[ 'nfi-class-13' ] + "'>13</td>" +
											"<td class='first' data-toggle='tooltip' title='" + i18n[ 'nfi-class-14' ] + "'>14</td>" +
											"<td class='first' data-toggle='tooltip' title='" + i18n[ 'nfi-class-15' ] + "'>15</td>" +
											"<td class='first' data-toggle='tooltip' title='" + i18n[ 'nfi-class-16' ] + "'>16</td>" +
											"<td class='first' data-toggle='tooltip' title='" + i18n[ 'nfi-class-17' ] + "'>17</td>" +
											"</tr>"
						var template1 = "<div style='overflow-x:auto;' class='row emission-removal'><table class='emission-removal'>" +
											tableHeader + 
											"{{#data}}" +
											"<tr>" +
											"<td class='first' data-toggle='tooltip' data-placement='top' title='{{tooltipMsg}}'>{{index}}</td>" +
											"{{#.}}" +
											"<td class='er-value'>{{formatNumber}}</td>" +
											"{{/.}}" +
											"</tr>{{/data}}" +
											"</table>"
						erCategories.append(mustacheEngine.render(template1, table));
						
						var tooltipTemplate = '<div class="tooltip portal-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>';
						$('[data-toggle="tooltip"]').tooltip({
							container: 'body', 
							placement:'left', 
							template:tooltipTemplate , 
							delay: { "show": 0, "hide": 20 }, 
							html:true 
						});
						
						$(".er-value").each(function(){
							var cell = $(this);
							var cellValue = $(this).text(); 
							if(cellValue >= 1000){
								cell.css('background-color','rgba(255, 0, 0, 0.8);')
							}
							if(cellValue >= 1 && cellValue < 1000 ){
								cell.css('background-color','rgba(255, 80, 80, 0.8);')
							}
							if(cellValue > 0 && cellValue < 1 ){
								cell.css('background-color','rgba(255, 200, 200, 0.8);')
							}
							if(cellValue < 0 && cellValue > -1 ){
								cell.css('background-color','rgba(196, 215, 155, 0.8);')
							}
							if(cellValue <= -1 && cellValue > -1000 ){
								cell.css('background-color','rgba(146, 208, 80, 0.8);')
							}
							if(cellValue <= -1000){
								cell.css('background-color','rgba(0, 176, 80, 0.8);')
							}
						});
					}else{
						erCategories.find('div.emission-removal').remove();
						erCategories.append("<div style='overflow-x:auto;' class='row emission-removal'>" + i18n['no-stats-data'] + "</div>");
					}
				}
			
			});
		});
		yearsBtns[0].click();
	});
});