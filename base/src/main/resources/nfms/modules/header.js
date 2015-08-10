define([ "jquery", "layout", "i18n", "message-bus", "module" ], function($, layout, i18n, bus, module) {

	var config = module.config();

	var header = $( '<div class="row header" />' );
	layout.container.append( header );
	
	var headerContainer = $( '<div class="col-md-12" />' );
	header.append( headerContainer );
	
	if( config.logo ){
		var row = $( '<div class="row" />' );
		headerContainer.append( row );
		var col = $( '<div class="col-md-12" style="padding-left: 20px"/>' );
		row.append( col );
		
		var img = $( '<img /> ');
		img.attr( 'src' , config.logo );
		col.append( img );
	}
	
//	if (!config["hide"]) {
//		var divBanner = $("<div/>").attr("id", "banner");
//		layout.header.prepend(divBanner);
//
//		if (config["show-flag"]) {
//			$("<div/>").attr("id", "flag").appendTo(divBanner);
//		}
//		if (config["show-logos"]) {
//			$("<div/>").attr("id", "logos").appendTo(divBanner);
//		}
//		$("<span/>").attr("id", "title").html(i18n["title"]).appendTo(divBanner);
//		$("<div/>").attr("id", "banner-izq").appendTo(divBanner);
//	}
});
