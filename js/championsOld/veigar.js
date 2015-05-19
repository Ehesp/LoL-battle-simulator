heroes[ 'veigar' ] = {
	
	heroName: 'Veigar',
	heroID: 45,
	
	manaBase: 250,
	manaLevel: 55,
	
	manaRegenBase: 6,
	manaRegenLevel: 0.6,
	
	healthBase: 355,
	healthLevel: 82,
	
	healthRegenBase: 4.5,
	healthRegenLevel: 0.55,
	
	ADBase: 48.3,
	ADLevel: 2.625,
	
	ASBase: 0.625,
	ASLevel: 0.0224,
	
	armorBase: 12.25,
	armorLevel: 3.75,
	
	MRBase: 30,
	MRLevel: 0,
	
	MSBase: 340,
	
	melee: false,
	
	abilityCosts: new Array( new Array( 60, 65, 70, 75, 80 ), new Array( 70, 80, 90, 100, 110 ), new Array( 80, 90, 100, 110, 120 ), new Array( 125, 175, 225 ) ),
	abilityCooldowns: new Array( new Array( 8000, 7000, 6000, 5000, 4000 ), new Array( 10000, 10000, 10000, 10000, 10000 ), new Array( 20000, 19000, 18000, 17000, 16000 ), new Array( 130000, 110000, 90000 ) ),
	
	onSummon: function() {
		
		this.addTrigger(
			new Array(
				'afterManaRegenCalculation',
				function( champion ) { champion.manaRegen *= 1 + ( champion.manaMax - champion.mana ) / champion.manaMax; }
			)
		);
		
	},
	
	ability_0: function() {
		
		this.dealDamage( new Array( 0, new Array( 80, 125, 170, 215, 260 )[ this.abilityLevels[ 0 ] - 1 ] + this.AP * 0.6, 0 ), 0 );
		
	},
	
	ability_1: function() {
		
		setTimeout( this.champVar + '.dealDamage( new Array( 0, ' + ( new Array( 120, 170, 220, 270, 320 )[ this.abilityLevels[ 1 ] - 1 ] + this.AP * 1 ) + ', 0 ), 1 );', 500 );
		
	},
	
	ability_2: function() {
		
		this.target.applyBuff( new buff( 'stun', new Array( 1500, 1750, 2000, 2250, 2500 )[ this.abilityLevels[ 2 ] - 1 ] ) );
		
	},
	
	ability_3: function() {
		
		this.dealDamage( new Array( 0, new Array( 250, 375, 500 )[ this.abilityLevels[ 3 ] - 1 ] + this.AP * 1.2 + this.target.AP * 0.8, 0 ), 3 );
		
	}
	
}