heroes[ 'lux' ] = {
	
	heroName: 'Lux',
	heroID: 99,
	
	manaBase: 250,
	manaLevel: 50,
	
	manaRegenBase: 6,
	manaRegenLevel: 0.6,
	
	healthBase: 345,
	healthLevel: 79,
	
	healthRegenBase: 4.5,
	healthRegenLevel: 0.55,
	
	ADBase: 50,
	ADLevel: 3.3,
	
	ASBase: 0.625,
	ASLevel: 0.0136,
	
	armorBase: 8,
	armorLevel: 4,
	
	MRBase: 30,
	MRLevel: 0,
	
	MSBase: 315,
	
	melee: false,
	
	abilityCosts: new Array( new Array( 50, 60, 70, 80, 90 ), new Array( 60, 60, 60, 60, 60 ), new Array( 70, 85, 100, 115, 130 ), new Array( 100, 100, 100 ) ),
	abilityCooldowns: new Array( new Array( 15000, 14000, 13000, 12000, 11000 ), new Array( 14000, 13000, 12000, 11000, 10000 ), new Array( 10000, 10000, 10000, 10000, 10000 ), new Array( 80000, 60000, 40000 ) ),
	abilityCastTime: new Array( false, false, false, 500 ),
	
	ability_0: function() {
		
		this.target.applyBuff( new buff( 'lux_snare' ) );
		this.target.applyBuff( new buff( 'lux_illumination' ) );
		this.dealDamage( new Array( 0, new Array( 60, 110, 160, 210, 260 )[ this.abilityLevels[ 0 ] - 1 ] + this.AP * 0.7, 0 ), 0 );
		
	},
	
	ability_1: function() {
		
		var strength = new Array( 80, 105, 130, 155, 180 )[ this.abilityLevels[ 1 ] - 1 ] + this.AP * 0.35;
		this.applyBuff( new buff( 'lux_barrier', strength ) );
		setTimeout( this.champVar + '.applyBuff( new buff( \'lux_barrier\', ' + strength + ' ) );', 1500 );
		
	},
	
	ability_2: function() {
		
		this.target.applyBuff( new buff( 'lux_illumination' ) );
		this.dealDamage( new Array( 0, new Array( 60, 105, 150, 195, 240 )[ this.abilityLevels[ 2 ] - 1 ] + this.AP * 0.6, 0 ), 2 );
		
	},
	
	ability_3: function() {
		
		this.dealDamage( new Array( 0, new Array( 300, 400, 500 )[ this.abilityLevels[ 3 ] - 1 ] + this.AP * 0.75, 0 ), 3 );
		this.target.applyBuff( new buff( 'lux_illumination' ) );
		
	}
	
}

buffs[ 'lux_illumination' ] = {
	
	name: 'Illumination Flare',
	
	id: 'lux_illumination',
	
	buff: false,
	
	visible: true,
	
	stack: 1,
	
	length: 6000,
	
	icon: spellIconPath + '99-5.png',
	
	triggers: new Array(
		'onDamageReceived',
		function( champion ) {
		
			if( champion.target.heroID != 99 )
				return;
			
			if( champion.receivedAA === false && champion.receivedSpell != 3 )
				return;
			
			setTimeout( champion.champVar + '.receiveDamage( new Array( 0, ' + ( 10 + 10 * champion.target.championLevel ) + ', 0 ), 4 );', 0 );
			champion.removeBuff( 'lux_illumination' );
			
		}
	),
	
}

buffs[ 'lux_barrier' ] = {
	
	name: 'Stardust Barrier',
	
	id: 'lux_barrier',
	
	buff: true,
	
	visible: true,
	
	stack: 1,
	
	length: 3000,
	
	icon: spellIconPath + '99-2.png',
	
	triggers: new Array(
		'onDamageReceivedHealthCost',
		function( champion ) {
			
			var buff = champion.getBuff( 'lux_barrier' );
			
			buff.strength -= champion.healthCost;
			
			if( buff.strength < 0 ) {
				champion.healthCost = -buff.strength;
				champion.removeBuff( buff.id );
			} else
				champion.healthCost = 0;
			
		}
	),
	
	
	onApply: function() {
		
		this.strength = this.argument;
		
	},
	
}

buffs[ 'lux_snare' ] = {
	
	name: 'Snared',
	
	id: 'lux_snare',
	
	buff: false,
	
	cc: true,
	
	visible: true,
	
	stack: 1,
	
	length: 2000,
	
	icon: spellIconPath + '99-1.png',
	
	triggers: new Array( 'onCCCalculation',	function( champion ) { champion.CC.push( 'snare' ); } )
	
}