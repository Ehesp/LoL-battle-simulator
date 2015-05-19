simulator.filter( 'range', function() {
	
	return function( input ) {
		
		if( typeof input[ 1 ] == "undefined" ) {
			
			input[ 1 ] = input[ 0 ];
			input[ 0 ] = 0;
			
		} else
			input[ 1 ] ++;
		
		if( typeof input[ 3 ] == "undefined" )
			input[ 3 ] = 1;
			
		result = new Array();
		for( var i = input[ 0 ]; i < input[ 1 ]; i += input[ 3 ] )
			result.push( i );
		
		return result;
	
	}
	
});

simulator.filter( 'containsMenu', function() {
	
	return function( items, criteria ) {
		
		var result = new Array(), item, criterium, flag, parts, part, menuItem, match;
		criteria = getChecked( criteria );
		
		for( var item in items ) {
			
			flag = true;
				
			for( criterium in criteria ) {
				
				if( criteria[ criterium ] === false )
					continue;
				
				parts = criteria[ criterium ].toLowerCase().split( ':' );
				for( part in parts )
					parts[ part ] = parts[ part ].split( '|' );
				match = false;
				
				for( menuItem in items[ item ].menu ) {
					
					match = true;
					
					for( part in parts ) {
						
						if( parts[ part ].indexOf( items[ item ].menu[ menuItem ][ part ].toLowerCase() ) == -1 ) {
							
							match = false;
							break;
							
						}
						
					}
					
					if( match )
						break;
					
				}
				
				if( match === false ) {
					
					flag = false;
					break;
					
				}
				
			}
			
			if( flag )
				result.push( items[ item ] );
			
		}
		
		return result;
		
	}
	
});

simulator.filter( 'containsTriggerType', function() {
	
	return function( items, criteria ) {
		
		var result = new Array(), item, criterium, flag, trigger, match, parts;
		criteria = getChecked( criteria );
		
		for( var item in items ) {
			
			flag = true;
				
			for( criterium in criteria ) {
				
				if( criteria[ criterium ] === false )
					continue;
				
				parts = criteria[ criterium ].toLowerCase().split( '|' );
				match = false;
				
				if( items[ item ].triggers )
					for( trigger in items[ item ].triggers ) {
						
						if( parts.indexOf( items[ item ].triggers[ trigger ][ 0 ].toLowerCase() ) != -1 ) {
							
							match = true;
							break;
							
						}
						
						
					}
				
				if( match === false ) {
					
					flag = false;
					break;
					
				}
				
			}
			
			if( flag )
				result.push( items[ item ] );
			
		}
		
		return result;
		
	}
	
});

simulator.filter( 'plural', function() {
	
	return function( count ) {
		
		if( count == 1 )
			return '';
		else
			return 's';
		
	}
	
});