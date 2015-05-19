uniqueNamed[ 'Enhanced Movement' ] = function() {
	
	var speed = 25;
	
	if( this.hasItem( 'Berserker\'s Greaves', 'Ionian Boots of Lucidity', 'Boots of Mobility', 'Mercury\'s Treads', 'Ninja Tabi', 'Sorcerer\'s Shoes' ) )
		speed = 45;
	
	if( this.hasItem( 'Boots of Swiftness' ) )
		speed = 60;
	
	if( this.hasItem( 'Boots of Mobility' ) && ( this.lastCombat === false || this.lastCombat > 5000 ) )
		speed = 105;
	
	this.stats.MS += speed;
	
}

uniqueNamed[ 'Tenacity' ] = function() {
	
	this.stats.tenacity = mul( this.stats.tenacity, 0.35 );
	
}

uniqueNamed[ 'Valor' ] = function() {
	
	var str = 'emblem_of_valor';
	
	if( this.hasItem( 'Banner of Command' ) )
		str = 'emblem_of_valor';
	
	this.applyBuff( new buff( str ) );
	
}

for( var i in uniqueNamed )
	uniqueTriggers.push( uniqueNamed[ i ] );