/* jQuery
**********/
jQuery(function ($) {
  
	// Champion List Options
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

	// Bootstrap Tooltip
	// Assign element rel="tooltip"
	$("[rel='tooltip']").tooltip();
	
	$("[rel='slider']").slider();
  
});

/* Angular.js
**************/

var simulator = angular.module( 'simulator', [ 'ngAnimate' ] );

simulator.controller( 'champList', function( $scope ) {
	
	$scope.champions = new Array( { name: 'Ryze', icon: 'http://images.wikia.com/leagueoflegends/images/2/28/RyzeSquare.png' }, { name: 'Ahri', icon: 'http://images2.wikia.nocookie.net/__cb20111213211754/leagueoflegends/images/1/18/AhriSquare.png' }, { name: 'Aatrox', icon: 'http://images1.wikia.nocookie.net/__cb20130523165517/leagueoflegends/images/c/cc/AatroxSquare.png' } );
	
	for( var i = 0; i < 3; i ++ )
		$scope.champions = $scope.champions.concat( $scope.champions );
		
	$scope.changed = function() {
		
		
		
	}
	
} );