function projectile( fun, proj, champ, source, range, vel, hitchance, argument ) {
	
	if( typeof projectileDefinitions[ proj ] == "undefined" )
		throw "Unknown projectile type";
	
	projectiles.push( this );
	
	this.fun = fun;
	this.range = range;
	this.vel = ( typeof vel == "undefined" || vel === false ? 1000 : vel );
	if( champ.position > champ.target.position )
		this.vel *= -1;
	this.position = champ.position;
	this.target = champ.target;
	this.source = source;
	this.hitchance = ( typeof hitchance == "undefined" ? 1 : hitchance );
	this.proj = proj;
	this.argument = argument;
	
}

projectile.prototype.passed = function() {
	
	return this.position == this.target.position;
	
}

projectile.prototype.hit = function() {
	
	return Math.random() < this.hitchance;
	
}

projectile.prototype.step = function( passed, time ) {
	
	this.position += this.vel * passed / 1000;
	if( this.vel > 0 )
		this.position = Math.min( this.position, this.target.position );
	else
		this.position = Math.max( this.position, this.target.position );
	
	return projectileDefinitions[ this.proj ].call( this );
	
}