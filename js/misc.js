function damage( magnitude, type ) {
	
	if( typeof magnitude !== "number" )	
		throw 'Invalid damage magnitude'
	
	this.magnitude = magnitude;
	this.type = damageTypes.indexOf( type );
	this.typeName = type;
	
	if( this.type == -1 )
		throw 'Invalid type of damage: ' + type;
	
}

damage.prototype.toText = function() {
	
	return this.magnitude + ' ' + this.typeName + ' damage';
	
}

function distance() {
	
	return Math.abs( champions[ 0 ].position - champions[ 1 ].position );
	
}