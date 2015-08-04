define([ "i18n" ], function(i18n) {
	

	i18nUtils = {};
	
	i18nUtils.message = function( key ){
		return i18n[ key ];
	}
});