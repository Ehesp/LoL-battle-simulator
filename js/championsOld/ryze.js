champions[ 'ryze' ] = {
	
	heroName: 'Ryze',
	heroID: 13,
	
	manaBase: 250,
	manaLevel: 55,
	
	manaRegenBase: 7,
	manaRegenLevel: 0.6,
	
	healthBase: 360,
	healthLevel: 86,
	
	healthRegenBase: 4.35,
	healthRegenLevel: 0.55,
	
	ADBase: 52,
	ADLevel: 3,
	
	ASBase: 0.625,
	ASLevel: 0.0211,
	
	armorBase: 11,
	armorLevel: 3.9,
	
	MRBase: 30,
	MRLevel: 0,
	
	MSBase: 335,
	
	melee: false,
	
	onSummon: function() {
		
		this.addTrigger(
			'onCDRCalculation',
			function( this ) {
				
				if( this.abilityLevels[ 0 ] == 0 )
					return;
				
				this.CDR += new Array( 2, 4, 6, 8, 10 )[ this.abilityLevels[ 0 ] - 1 ];
				
			}
		);
		
		this.addTrigger(
			'onAbilityCast',
			function() {
				
				for( var i in this.abilityCooldownUntil )
					this.setCooldown( i, -1000 );
				
			}
		);
	
	},
	
	abilityCosts: new Array( new Array( 60, 60, 60, 60, 60 ), new Array( 80, 90, 100, 110, 120 ), new Array( 60, 70, 80, 90, 100 ), new Array( 0, 0, 0 ) ),
	abilityCooldowns: new Array( new Array( 3500, 3500, 3500, 3500, 3500 ), new Array( 14000, 14000, 14000, 14000, 14000 ), new Array( 14000, 14000, 14000, 14000, 14000 ), new Array( 70000, 60000, 50000 ) ),
	
	ability_0: function() {
		
		this.dealDamage( new damage( new Array( 60, 85, 110, 135, 160 )[ this.abilityLevels[ 0 ] - 1 ] + this.AP * 0.4 + this.manaMax * 0.065, 'magic' ), 0 );
		
	},
	
	ability_1: function() {
		
		this.dealDamage( new damage( 0, new Array( 60 , 95 , 130 , 165 , 200 )[ this.abilityLevels[ 1 ] - 1 ] + this.AP * 0.6 + this.manaMax * 0.045, 'magic' ), 0 );
		this.target.applyBuff( new buff( 'ryze_snare' ) );
		
	},
	
	ability_2: function() {
		
		
		
	},
	
	ability_3: function() {
		
		this.applyBuff( new buff( 'ryze_ult' ) );
		
	}
	
}

buffs[ 'ryze_snare' ] = {
	
	name: 'Snared',
	
	id: 'ryze_snare',
	
	buff: false,
	
	cc: true,
	
	visible: true,
	
	stack: 1,
	
	icon: 'http://na.leagueoflegends.com/sites/default/files/game_data/1.0.0.144/content/spell/13-2.png',
	
	triggers: new Array( 'onCCCalculation',	function( champion ) { champion.CC.push( 'snare' ); } ),
	
	onApply: function() {
	
		this.setRemoveTimer( new Array( 750, 1000, 1250, 1500, 1750 )[ this.champion.target.abilityLevels[ 1 ] - 1 ] );
		
	}
	
}

buffs[ 'ryze_ult' ] = {
	
	name: 'Desperate Power',
	
	id: 'ryze_ult',
	
	buff: true,
	
	visible: true,
	
	stack: 1,
	
	icon: 'http://na.leagueoflegends.com/sites/default/files/game_data/1.0.0.144/content/spell/13-4.png',
	
	triggers: new Array(
		new Array(
			'onSpellVampCalculation',
			function( champion ) { champion.spellVamp += new Array( 0.15, 0.20, 0.25 )[ champion.abilityLevels[ 3 ] - 1 ] } 
		),
		new Array(
			'onMSCalculation',
			function( champion ) { champion.MS += new Array( 35, 45, 55 )[ champion.abilityLevels[ 3 ] - 1 ] }
		)
	),
	
	onApply: function() {
	
		this.setRemoveTimer( new Array( 5000, 6000, 7000 )[ this.champion.abilityLevels[ 3 ] - 1 ] );
		
	}
	
}