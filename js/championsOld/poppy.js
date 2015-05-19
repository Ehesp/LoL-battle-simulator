heroes[ 'poppy' ] = {
	
	heroName: 'Poppy',
	heroID: 78,
	
	manaBase: 185,
	manaLevel: 30 ,
	
	manaRegenBase: 6.4,
	manaRegenLevel: 0.45,
	
	healthBase: 423,
	healthLevel: 81,
	
	healthRegenBase: 7.45,
	healthRegenLevel: 0.55,
	
	ADBase: 56.3,
	ADLevel: 3.375,
	
	ASBase: 0.638,
	ASLevel: 0.0335,
	
	armorBase: 18,
	armorLevel: 4,
	
	MRBase: 30,
	MRLevel: 0,
	
	MSBase: 320,
	
	melee: true,
	
	onSummon: function() {
		
		this.addTrigger(
			'onDamageReceivedPhysicalCalculation',
			function( champion ) {
				
				var reduction = ( champion.receivedPhysical - ( champion.health * 0.1 ) ) * 0.5;
				
				if( reduction > 0 )
					champion.receivedPhysical -= reduction;
				
			}
		)
		
		this.addTrigger(
			'onDamageReceivedMagicalCalculation',
			function( champion ) {
				
				var reduction = ( champion.receivedMagical - ( champion.health * 0.1 ) ) * 0.5;
				if( reduction > 0 )
					champion.receivedMagical -= reduction;
				
			}
		)
		
		var shieldTrigger = function( champion ) {
		
			if( champion.abilityLevels[ 1 ] == 0 )
				return;
			
			champion.applyBuff( new buff( 'poppy_shield' ) );
			
		}
		
		this.addTrigger( 'onDamageReceived', shieldTrigger );
		this.addTrigger( 'onDamageDealt', shieldTrigger );
		
	},
	
	abilityCosts: new Array( new Array( 55, 55, 55, 55, 55 ), new Array( 70, 75, 80, 85, 90 ), new Array( 60, 65, 70, 75, 80 ), new Array( 100, 100, 100 ) ),
	abilityCooldowns: new Array( new Array( 8000, 7000, 6000, 5000, 4000 ), new Array( 12000, 12000, 12000, 12000, 12000 ), new Array( 12000, 11000, 10000, 9000, 8000  ), new Array( 140000, 120000, 100000 ) ),
	abilityMovement: new Array( false, false, true, false ),
	
	ability_0: function() {
		
		this.applyBuff( new buff( 'poppy_devestating_blow' ) );
		
	},
	
	ability_1: function() {
		
		this.applyBuff( new buff( 'poppy_shield' ) );
		this.getBuff( 'poppy_shield' ).stacks = 10;
		this.updateStats();
		
	},
	
	ability_2: function() {
		
		var damage = new Array( 50, 75, 100, 125, 150 )[ this.abilityLevels[ 2 ] - 1 ] + this.AP * 0.4;
		damage += new Array( 75, 125, 175, 225, 275 )[ this.abilityLevels[ 2 ] - 1 ] + this.AP * 0.4;
		this.target.applyBuff( new buff( 'stun', 1500 ) );
		this.dealDamage( new Array( 0, damage, 0 ), 2 );
		
	},
	
	ability_3: function() {
		
		this.target.applyBuff( new buff( 'poppy_ult' ) );
		
	}
	
}

buffs[ 'poppy_devestating_blow' ] = {
	
	name: 'Devastating Blow',
	
	id: 'poppy_devestating_blow',
	
	buff: true,
	
	visible: true,
	
	stack: 1,
	
	length: 10000,
	
	icon: spellIconPath + '78-1.png',
	
	triggers: new Array( 
		'onAATotalDamageCalculation',
		function( champion ) {
			
			var bonus = Math.min( new Array( 75, 150, 225, 300, 375 )[ champion.abilityLevels[ 0 ] - 1 ], champion.target.healthMax * 0.08 );
			bonus += new Array( 20, 40, 60, 80, 100 )[ champion.abilityLevels[ 0 ] - 1 ] + champion.AP * 0.6;
			
			champion.AATotalDamage[ 1 ] = champion.AATotalDamage[ 0 ] + bonus;
			champion.AATotalDamage[ 0 ] = 0;
			
			champion.removeBuff( 'poppy_devestating_blow' );
			
		}
	),
	
}

buffs[ 'poppy_shield' ] = {
	
	name: 'Paragon of Demacia',
	
	id: 'poppy_shield',
	
	buff: true,
	
	visible: true,
	
	stack: 10,
	
	length: 5000,
	
	icon: 'http://na.leagueoflegends.com/sites/default/files/game_data/1.0.0.144/content/spell/78-2.png',
	
	triggers: new Array(
		
		new Array(
			'onADCalculation',
			function( champion ) { champion.AD += new Array( 1.5, 2, 2.5, 3, 3.5 )[ champion.abilityLevels[ 1 ] - 1 ] * champion.getBuff( 'poppy_shield' ).stacks; }
		),
		
		new Array(
			'onArmorCalculation',
			function( champion ) { champion.armor += new Array( 1.5, 2, 2.5, 3, 3.5 )[ champion.abilityLevels[ 1 ] - 1 ] * champion.getBuff( 'poppy_shield' ).stacks; }
		)
		
	)
	
}

buffs[ 'poppy_ult' ] = {
	
	name: 'Diplomatic Immunity',
	
	id: 'poppy_ult',
	
	buff: false,
	
	visible: true,
	
	stack: 1,
	
	length: 0,
	
	icon: spellIconPath + '78-4.png',
	
	triggers: new Array(
		'onDamageReceived',
		function( champion ) {
	
			if( champion.target.heroID != 78 )
				return;
			
			for( var i in champion.receivedDamage )
				champion.receivedDamage[ i ] *= new Array( 1.20, 1.30, 1.40 )[ champion.target.abilityLevels[ 3 ] - 1 ];
			
		}
	),
	
	onApply: function() {
	
		this.setRemoveTimer( new Array( 6000, 7000, 8000 )[ this.champion.target.abilityLevels[ 3 ] - 1 ] );
		
	}
	
}