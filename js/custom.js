/* jQuery
**********/
function triggerReplacements() {
	
	$("[rel='slider']").slider().on( 'slideStop', function( ev ) {
		
		angular.element( $( ev.target.getAttribute( 'data-selector' ) ) ).scope().$apply( function( $scope ) {
			
			$scope.champion.setChampionLevel( ev.value );
			
		} );
		
	} );
	
	$('.cst-tt').each(function() {
    $(this).qtip({
		hide: { fixed: true, delay: 300 },
        content: { text: $(this).next('div.cst-tt-content') }
    });
	});	
	
}

function setSly() {
	
	$('#frame').sly({
		horizontal: 1,
		itemNav: 'basic',
		scrollBy: 1,
		clickBar: 1,
		dragHandle: 1,
		dragging: 1,
		speed: 200,
		scrollBar: $('.scrollbar')
	});
	
}

jQuery(function ($) {

	triggerReplacements();
  
});