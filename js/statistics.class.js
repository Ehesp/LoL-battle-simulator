function statistics() {
	
	this.data = new Array();
	
}

statistics.prototype.getStatVar = function( stat ) {
	
	var statVar = this.data;

	if( Object.prototype.toString.call( stat ) === '[object Array]' )
		while( stat.length ) {
			
			if( typeof statVar[ stat[ 0 ] ] == "undefined" )
				statVar[ stat[ 0 ] ] = new Array();
			
			statVar = statVar[ stat.shift() ];
			
		}
	else {
		if( typeof statVar[ stat ] == "undefined" )
			statVar[ stat ] = new Array();
			
		statVar = statVar[ stat ];
	}
	
	return statVar;
	
}

statistics.prototype.addRecord = function( stat, data ) {
	
	var statVar = this.getStatVar( stat );
	
	statVar.push( new Array( simulationTime(), data ) );
	
}

statistics.prototype.addDamageRecord = function( stat, damage, source ) {
	
	stat = new Array( stat );
	if( source == -1 )
		stat.push( 'AA' );
	else
		stat.push( 'abilities', source );
	stat.push( damage.type );
	
	this.addRecord( stat, damage.magnitude );
	
}

statistics.prototype.getRecords = function( statVar, flag ) {
	
	if( typeof flag == "undefined" )
		statVar = this.getStatVar( statVar );
	
	var tmp = new Array(), empty = new Array();
	
	for( var stat in statVar ) {
		
		if( !_.isEqual( statVar[ stat ], empty ) && ( typeof statVar[ stat ][ 0 ] == "undefined" || typeof statVar[ stat ][ 0 ][ 0 ] != "number" || typeof statVar[ stat ][ 0 ][ 1 ] != "number" ) )
			tmp = tmp.concat( this.getRecords( statVar[ stat ], true ) );
		else
			tmp = tmp.concat( statVar[ stat ] );
		
	}
	
	return tmp;
	
}