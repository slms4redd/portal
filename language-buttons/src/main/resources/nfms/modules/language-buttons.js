define([ "toolbar", "customization", "mustache" ], function(toolbar, customization, mustache) {
	// TODO remove mustache
	var col	= $( '<div class="lang-buttons" />');
	toolbar.append( col );

	var view = {
		langs : customization.languages,
		selectedClass : function() {
			return this.code == customization.languageCode ? "active" : "";
		}
	};

	var template = '{{#langs}}<a class="btn-default {{selectedClass}}" href="?lang={{code}}" id="button_{{code}}">{{name}}</a>{{/langs}}';
	var output = mustache.render( template, view );
	col.append( $(output) );
});
