define([ "toolbar", "customization", "i18n", "module","drags" ], function(toolbar, customization, i18n, module) {
	
	
	var config = module.config();
	
	if( config.href ){
		
		var link 	= "static/loc/" + customization.languageCode + "/html/" + config.href;
		
		var col		= $( '<div class="btn-container" />');
		toolbar.append( col );
	
//		var btn 	= $( '<button class="btn tutorial-btn"><i class="fa fa-question-circle"></i>&nbsp;&nbsp;</button>' );
		var btn 	= $( '<button class="btn btn-default tutorial-btn"><i class="fa fa-question-circle"></i>&nbsp;&nbsp;</button>' );
		btn.append( i18n['tutorial-btn'] );
		col.append( btn );
		
		
		var tutorial = $( '<div class="tutorial" />');
		toolbar.append( tutorial );
		
		
		btn.click( function(){
			if( !tutorial.hasClass('opened') ){
				
				if( tutorial.is(':empty') ) {
					// load tutorial into page
					$.ajax({
						url			: link ,
						data		: {bust : (new Date()).getTime()},
						dataType 	: "html" ,
						success		: function(data){
							tutorial.append( data );
							tutorial.drags();
						
							
							// close tutorial
							var close = tutorial.find( '.close-tutorial' );
							close.click( function(){
								tutorial.removeClass( 'opened' );
								tutorial.fadeOut();
							});
							
							var links = $( '.toturial-item-link' );
							links.show();
							
							var back = tutorial.find( '.list-tutorial' );
							back.hide();
							
							// open tutorial links
							links.click(function(e){
								var target = $( this ).attr( 'target' );
								
								links.hide();
								var item = tutorial.find( '.' + target );
								item.fadeIn( 300 );
							
								back.fadeIn();
							});
							
							// back to tutorial links
							back.click( function(){
								tutorial.find( '.toturial-item' ).hide();
								$.each(links,function(i,tutorialLink){
									setTimeout(function(){
										$(tutorialLink).fadeIn();
									}, i*50)
								});
								
								back.hide();
							});
						}
					
					});
				} else {
					// show tutorial links 
					$( '.toturial-item-link' ).show();
					//hide back button
					tutorial.find( '.list-tutorial' ).hide();
					//hide tutorial items
					tutorial.find( '.toturial-item' ).hide();					
				}
			
				
				// show tutorial popup
				tutorial.fadeIn();
				tutorial.addClass( 'opened' );
				
			}
			
			btn.blur();
		});
	}

});
