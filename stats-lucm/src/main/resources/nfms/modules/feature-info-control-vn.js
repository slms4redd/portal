/**
 * 
 */
define([ "module", "jquery", "message-bus", "map", "i18n", "features" ], 
		function(module, $, bus, map, i18n ) {
	
	OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
        defaultHandlerOptions: {
            'single': true,
            'double': false,
            'pixelTolerance': 0,
            'stopSingle': false,
            'stopDouble': false
        },
        initialize: function(options) {
            this.handlerOptions = OpenLayers.Util.extend(
                {}, this.defaultHandlerOptions
            );
            OpenLayers.Control.prototype.initialize.apply(
                this, arguments
            ); 
            this.handler = new OpenLayers.Handler.Click(
                this, {
                    'click': this.onClick,
                    'dblclick': this.onDblclick 
                }, this.handlerOptions
            );
        }, 
        onClick: function(e) {
        	console.log( map.getExtent().toBBOX() );
			Features.getFeatureInfo(  
				true,
				'unredd:country,unredd:province', 
				'(name,area,info_file)(name,area,info_file,province_c)',
				e.xy.x ,   e.xy.y , map.size.h , map.size.w ,
				 map.getExtent().toBBOX()
			);
        },
        onDblclick: function(e) {  
        }   
    });
	
	bus.listen('layers-loaded', function(e){
		
		Features.getFeatureInfo( false,  'unredd:country', 'name,area,info_file', 291, 154 , 801 , 1031 ,"10815463.885992,921454.138336,13186287.946754,2763384.37371" );
		
		var control = new OpenLayers.Control.Click({
            handlerOptions: {
                "single": true
            }
        });
		
		map.addControl( control );
		control.activate();
		

	});	
	
});
	
