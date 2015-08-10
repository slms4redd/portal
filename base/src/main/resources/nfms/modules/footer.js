define([ "jquery", "layout", "i18n", "message-bus", "module" ], function($, layout, i18n, bus, module) {

	var config = module.config();

	var footer = $( '<div class="row footer" />' );
	layout.container.append( footer );
	
	var footerContainer = $( '<div class="col-md-12" />' );
	footer.append( footerContainer );
	
	if( config.link1 ){
		var row = $( '<div class="row" />' );
		footerContainer.append( row );
		var col = $( '<div class="col-md-12" style="padding-left: 20px"/>' );
		row.append( col );
		
		var link = $( '<a /> ');
		link.attr( 'href' , config.link1 );
		var descr = $("em").attr("attr1");
		$("a").text(descr);
		
		col.append( link );
	}
	
	/*if( config.link1 ){
		var row = $( '<div class="row" />' );
		footerContainer.append( row );
		var col = $( '<div class="col-md-12" style="padding-left: 20px"/>' );
		row.append( col );
		
		var a = $( '<a /> ');
		img.attr( 'href' , config.link1 );
		col.append( img );
	}*/
	
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
