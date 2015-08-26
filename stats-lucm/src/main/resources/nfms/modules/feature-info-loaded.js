define([ "jquery", "message-bus" , "i18n" ], function($, bus, i18n) {

	Features = {};
	Features.appendLabels = function( data ){
		var data = $( data );

//		data.find( '.province_name' ).append( i18n['province_dien_bien'] );

		data.find( '.btn-drivers' ).append( i18n['btn-drivers'] );
		data.find( '.btn-interventions' ).append( i18n['btn-interventions'] );
		data.find( '.btn-areas' ).append( i18n['btn-areas'] );
		data.find( '.btn-projects' ).append( i18n['btn-projects'] );
		
		data.find( '.national_redd_action_program' ).append( i18n['national_redd_action_program'] );
		data.find( '.province_approved_msg1' ).append( i18n['province_approved_msg1'] );
		data.find( '.province' ).append( i18n['province'] );
		data.find( '.province_approved_msg2' ).append( i18n['province_approved_msg2'] );
		data.find( '.province_deforestation_drivers' ).append( i18n['province_deforestation_drivers'] );
		data.find( '.deforestation_drivers' ).append( i18n['deforestation_drivers'] );
		
		data.find( '.identified' ).append( i18n['identified'] );
		data.find( '.agriculture_expansion_non_subsistence' ).append( i18n['agriculture_expansion_non_subsistence'] );
		data.find( '.coffee' ).append( i18n['coffee'] );
		data.find( '.rubber' ).append( i18n['rubber'] );
		data.find( '.acacia' ).append( i18n['acacia'] );
		data.find( '.tea' ).append( i18n['tea'] );
		data.find( '.cashew' ).append( i18n['cashew'] );
		data.find( '.other' ).append( i18n['other'] );
		data.find( '.agriculture_expansion_subsistence' ).append( i18n['agriculture_expansion_subsistence'] );
		data.find( '.infrastructure_development' ).append( i18n['infrastructure_development'] );
		data.find( '.hydropower' ).append( i18n['hydropower'] );
		data.find( '.transportation_infrastructure' ).append( i18n['transportation_infrastructure'] );
		data.find( '.urban_expansion' ).append( i18n['urban_expansion'] );

		data.find( '.main_interventions' ).append( i18n['main_interventions'] );
		data.find( '.province_main_interventions' ).append( i18n['province_main_interventions'] );
		data.find( '.provinces_for_implementation' ).append( i18n['provinces_for_implementation'] );
		data.find( '.districts_for_implementation' ).append( i18n['districts_for_implementation'] );

		data.find( '.list_districs_redd_agreements' ).append( i18n['list_districs_redd_agreements'] );
		data.find( '.districts_in' ).append( i18n['districts_in'] );
		data.find( '.province_with_siraps' ).append( i18n['province_with_siraps'] );
		
		data.find( '.redd_projects' ).append( i18n['redd_projects'] );
		data.find( '.redd_project_duration' ).append( i18n['redd_project_duration'] );
		data.find( '.redd_project_website' ).append( i18n['redd_project_website'] );
		
		data.find( '.redd_project_1_label' ).append( i18n['redd_project_1_label'] );
		data.find( '.redd_project_2_label' ).append( i18n['redd_project_2_label'] );
		data.find( '.redd_project_3_label' ).append( i18n['redd_project_3_label'] );
		data.find( '.redd_project_4_label' ).append( i18n['redd_project_4_label'] );
		data.find( '.redd_project_5_label' ).append( i18n['redd_project_5_label'] );
		data.find( '.redd_project_6_label' ).append( i18n['redd_project_6_label'] );
		data.find( '.redd_project_7_label' ).append( i18n['redd_project_7_label'] );
		data.find( '.redd_project_8_label' ).append( i18n['redd_project_8_label'] );
		data.find( '.redd_project_9_label' ).append( i18n['redd_project_9_label'] );
		data.find( '.redd_project_10_label' ).append( i18n['redd_project_10_label'] );
		data.find( '.redd_project_11_label' ).append( i18n['redd_project_11_label'] );
		data.find( '.redd_project_12_label' ).append( i18n['redd_project_12_label'] );
		data.find( '.redd_project_13_label' ).append( i18n['redd_project_13_label'] );
		data.find( '.redd_project_14_label' ).append( i18n['redd_project_14_label'] );
		data.find( '.redd_project_15_label' ).append( i18n['redd_project_15_label'] );
		data.find( '.redd_project_16_label' ).append( i18n['redd_project_16_label'] );
		
//		data.find( '.collapsable' ).hide();
//		data.find( '.btn-collapsable' ).click(function(){
//			var btn = $( this );
//			var target = $( '.' + btn.attr( 'data-target' ) );
//			if( target.is(':visible') ){
//				target.slideUp();
//				btn.find( 'i' ).removeClass().addClass( 'fa fa-caret-right' );
//			} else {
//				target.slideDown();
//				btn.find( 'i' ).removeClass().addClass( 'fa fa-caret-down' );
//			}
//		});
		
		var infoTables = data.filter( '.info-table' );
		infoTables.hide();
		
		var btns =  data.filter( '.header-btns' ).find('button');
		btns.click( function(e){
			var btn = $( this );
			if( !btn.hasClass('active') ){
				btns.removeClass( 'active' );
				btn.addClass( 'active' );
				
				infoTables.hide();
				var target = data.filter( '.' + btn.attr( 'data-target' ) );
				target.fadeIn();
			}
		});
		btns[0].click();
	};
	
	Features.processProvince = function( feature , data ){
		data.find( '.province_name' ).append( feature.attributes.name );
		
		var provinceId 	= feature.attributes.province_c;
		var province 	= REDDProjects.provinces[ provinceId ];
		
//		console.log( province );
		if( province.prap ){
			
		} else {
			data.filter('.prap').hide();
		}
		
		if( province.drivers ){
			
		} else {
			data.filter( '.header-btns' ).find('li.drivers').remove();
		}
		

		if (province.interventions) {

		} else {
			data.filter('.header-btns').find('li.interventions').remove();
		}

		if (province.areas) {

		} else {
			data.filter('.header-btns').find('li.areas').remove();
		}
		
		if( province.projects ){
			for( var i in  province.projects ){
				var proj = province.projects[ i ];
//				console.log( proj );
				var table = data.filter( '.info-table.projects' ).find( 'table' );
				table.find( 'tr' ).hide();
				
				for( var p in proj ){
					table.find( 'tr:nth-child('+(p-1)+')' ).show();
				}
			}
		} else {
			data.filter( '.header-btns' ).find('li.projects').remove();
		}
		
		if( data.filter( '.header-btns' ).find('li').length <= 1 ){
			data.filter( '.header-btns' ).hide();
		}
	};
	

});