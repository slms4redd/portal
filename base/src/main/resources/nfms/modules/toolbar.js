define([ "layout", "jquery" ], function(layout) {

	var toolbarRow = $( '<div class="row" />' );
	layout.container.append( toolbarRow );
	
	var toolbar = $( '<div class="col-md-12 toolbar" />' );
	toolbarRow.append( toolbar );
	
	return toolbar;
});
