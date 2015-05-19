simulator.directive('ngRightClick', function( $parse ) {
	
    return function( scope, element, attrs ) {
		
        var fn = $parse( attrs.ngRightClick );
		
        element.bind( 'contextmenu', function( event ) {
			
            scope.$apply( function() {
				
                event.preventDefault();
                fn( scope, { $event:event } );
				
            });
        });
		
    };
	
});

simulator.directive( 'highlightOnChange', function() {
	
	return {
		
		link : function( scope, element, attrs ) {
			
			attrs.$observe( 'highlightOnChange', function ( val ) {
				
				if( typeof element.init == "undefined" )
					element.init = true;
				else
					setTimeout( function() { $( element ).stop( true, true ).effect( { effect: 'highlight', duration: 2000 } ) } );
				
			});
		}
		
	};
	
});