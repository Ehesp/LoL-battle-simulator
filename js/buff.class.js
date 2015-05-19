function buff( id, arg ) {
	
	this.stacks = 1;
	this.id = id;
	this.champion = false;
	this.source = false;
	this.appliedTriggers = false;
	
	if( typeof arg == "undefined")
		this.argument = false;
	else
		this.argument = arg;
	
	for( var attr in buffs[ id ] )
		this[ attr ] = buffs[ id ][ attr ];
	
}

buff.prototype.apply = function( champion ) {
	
	if( champion )
		this.champion = champion;
	
	if( this.duration )
		this.timeLeft = this.duration;
	
	if( this.triggers && this.appliedTriggers === false ) {
		this.champion.trigger.add( this.triggers );
		this.appliedTriggers = true;
	}
	
	if( this.onApply )
		this.onApply();
	
}

buff.prototype.remove = function() {
	
	if( this.triggers )
		this.champion.trigger.remove( this.triggers );
	
	if( this.onRemove )
		this.onRemove();
	
}

buff.prototype.step = function( passed, time ) {
	
	if( typeof this.timeLeft !== "undefined" ) {
		
		this.timeLeft -= passed;
		
		if( this.timeLeft <= 0 )
			this.champion.removeBuff( this.id );
		
	}
	
}