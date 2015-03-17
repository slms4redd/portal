define([ "toolbar", "customization", "mustache" ], function(toolbar, customization, mustache) {
	
	var col	= $( '<div class="lang-buttons" />');
	toolbar.append( col );

	var view = {
		langs : customization.languages,
		selectedClass : function() {
			return this.code == customization.languageCode ? "selected" : "";
		}
	};

	var template = '{{#langs}}<a class="lang-button {{selectedClass}}" href="?lang={{code}}" id="button_{{code}}">{{name}}</a>{{/langs}}';
	var output = mustache.render( template, view );
	col.append( $(output) );
});
