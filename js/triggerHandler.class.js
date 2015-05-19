function triggerHandler( scope ) {
	
	this.scope = scope;
	this.triggers = new Array();
	
}

triggerHandler.prototype.add = function( triggers, func ) {
	
	if( triggers === false )
		return;
	
	if( typeof func != "undefined" )
		triggers = new Array( new Array( triggers, func ) );
	else if( !( triggers[ 0 ] instanceof Array ) )
		triggers = new Array( triggers );
	
	for( var i in triggers ) {
		
		if( triggers[ i ] === false )
			continue;
		
		if( !this.triggers[ triggers[ i ][ 0 ] ] )
			this.triggers[ triggers[ i ][ 0 ] ] = new Array();
		
		this.triggers[ triggers[ i ][ 0 ] ].push( triggers[ i ][ 1 ] );
		
	}
	
}

triggerHandler.prototype.remove = function( triggers, func ) {
	
	if( triggers === false )
		return;
	
	if( typeof func != "undefined" )
		triggers = new Array( new Array( triggers, func ) );
	else if( !( triggers[ 0 ] instanceof Array ) )
		triggers = new Array( triggers );
	
	for( var i in triggers ) {
		
		if( triggers[ i ] === false )
			continue;
		
		this.triggers[ triggers[ i ][ 0 ] ].splice( this.triggers[ triggers[ i ][ 0 ] ].indexOf( triggers[ i ][ 1 ] ), 1 );
		
	}
	
}

triggerHandler.prototype.event = function( id ) {
	
	var unique = uniqueTriggers.slice(), blocked = new Array();
	
	if( !this.triggers[ id ] )
		return;
	
	for( var i in this.triggers[ id ] )
		if( blocked.indexOf( this.triggers[ id ][ i ] ) == -1 ) {
		
			if( unique.indexOf( this.triggers[ id ][ i ] ) != -1 )
				blocked.push( this.triggers[ id ][ i ] );
			
			this.triggers[ id ][ i ].call( this.scope );
			
		}
	
}