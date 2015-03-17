define([ "layout", "jquery" ], function(layout) {

	var toolbarRow = $( '<div class="row no-margin no-padding" />' );
	layout.container.append( toolbarRow );
	
	var toolbar = $( '<div class="col-md-12 no-padding toolbar" />' );
	toolbarRow.append( toolbar );
	//	var divToolbar = $("<div/>").attr("id", "toolbar");
//	layout.header.append(divToolbar);
//
//	return divToolbar;
	
	return toolbar;
});
