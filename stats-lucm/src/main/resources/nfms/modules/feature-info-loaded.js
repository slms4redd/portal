define([ "jquery", "message-bus" , "i18n" ], function($, bus, i18n) {

	
	bus.listen( "feature-info-loaded", function( event, data ){
		var data = $( data );
		
		data.find( '.national_redd_action_program' ).append( i18n['national_redd_action_program'] );
		data.find( '.province_approved_msg1' ).append( i18n['province_approved_msg1'] );
		data.find( '.province_name' ).append( i18n['province_dien_bien'] );
		data.find( '.province' ).append( i18n['province'] );
		data.find( '.province_approved_msg2' ).append( i18n['province_approved_msg2'] );
		data.find( '.province_deforestation_drivers' ).append( i18n['province_deforestation_drivers'] );
		
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
		data.find( '.districts_for_implementation' ).append( i18n['districts_for_implementation'] );

		data.find( '.list_districs_redd_agreements' ).append( i18n['list_districs_redd_agreements'] );
		data.find( '.districts_in' ).append( i18n['districts_in'] );
		data.find( '.province_with_siraps' ).append( i18n['province_with_siraps'] );
		
		
		
		data.find( '.collapsable' ).hide();
		data.find( '.btn-collapsable' ).click(function(){
			var btn = $( this );
			var target = $( '.' + btn.attr( 'data-target' ) );
			if( target.is(':visible') ){
				target.slideUp();
				btn.find( 'i' ).removeClass().addClass( 'fa fa-caret-right' );
			} else {
				target.slideDown();
				btn.find( 'i' ).removeClass().addClass( 'fa fa-caret-down' );
			}
		});
	
	});
	

});