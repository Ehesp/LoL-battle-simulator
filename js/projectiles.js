projectileDefinitions[ 'bounce' ] = function() {
	
	if( this.passed() ) {
		
		if( typeof this.argument == "undefined" )
			this.argument = 0;
		
		if( this.argument < 5 && distance() < this.range )
			new projectile( this.fun, this.proj, this.target, this.source, this.range, this.vel, this.hitchance, this.argument + 1 );
		
		if( this.hit() )
			this.target.receiveProjectile( this.fun );
		
		return true;
		
	}
	
	return false;		
	
}

projectileDefinitions[ 'linear' ] = function() {
	
	if( this.passed() ) {
		
		if( this.hit() )
			this.target.receiveProjectile( this.fun );
		
		return true;
		
	}
	
	return false;		
	
}

projectileDefinitions[ 'instant' ] = function() {
	
	if( this.hit() )
		this.target.receiveProjectile( this.fun );
	
	return true;
	
}