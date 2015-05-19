championDefinitions[ 'Ryze' ] = function() {
	
	this.trigger.add(
		'onCDRCalculation',
		function() {
			
			if( this.abilityLevels[ 0 ] == 0 )
				return;
			
			this.stats.CDR += this.getValue( this.getAbility( 1 ).leveling[ 'cooldown reduction' ].amount, 1 );
			
		}
	);
	
	this.trigger.add(
		'onAbilityCast',
		function() {
			
			for( var i in this.abilityCooldown )
				this.abilityCooldown[ i ] -= 1000;
			
		}
	);
	
	this.abilities = new Array(
		
		false,
		
		function() {
			
			var amount = this.getDamage( this.getAbility( 1 ).leveling[ 'magic damage' ], 1 );
			
			new projectile(
				function() {
					this.receiveDamage( new damage( amount, 'magic' ), 1 );
				},
				'linear',
				this,
				this,
				this.getAbility( 1 ).range,
				this.getAbility( 1 ).description[ 'projectile speed' ]
			);
			
		},
		
		function() {
			
			var amount = this.getDamage( this.getAbility( 2 ).leveling[ 'magic damage' ], 2 );
			new projectile(
				function() {
					this.receiveDamage( new damage( amount, 'magic' ), 2 );
					this.applyBuff( new buff( 'ryze_snare' ) );
				},
				'instant',
				this,
				this
			);
		},
		
		function() {
			
			var amount = this.getDamage( this.getAbility( 3 ).leveling[ 'magic damage' ], 3 );
			var self = this;
			new projectile(
				function() {
					if( self != this ) {
						this.receiveDamage( new damage( amount, 'magic' ), 3 );
						this.applyBuff( new buff( 'ryze_flux' ) );
					}
				},
				'bounce',
				this,
				this,
				this.getAbility( 3 ).range,
				this.getAbility( 3 ).description[ 'projectile speed' ]
			);
			
		},
		
		function() {
			
			this.applyBuff( new buff( 'ryze_ult' ) );
			
		}
	
	);
	
	this.abilityConfigs = new Array(
		
		false,
		false,
		false,
		false,
		false
		
	);
	
};

buffs[ 'ryze_snare' ] = {
	
	name: 'Snared',
	
	id: 'ryze_snare',
	
	buff: false,
	
	cc: true,
	
	visible: true,
	
	stack: 1,
	
	icon: 'http://images1.wikia.nocookie.net/__cb20091221172845/leagueoflegends/images/f/fa/Rune_Prison.jpg',
	
	triggers: new Array( 'onCCCalculation',	function() { this.CC.push( 'snare' ); } ),
	
	onApply: function() {
	
		this.timeLeft = this.champion.target.getValue( this.champion.target.getAbility( 2 ).leveling[ 'snare duration' ].amount, 2 ) * 1000;
		
	}
	
}

buffs[ 'ryze_flux' ] = {
	
	name: 'Spell Flux',
	
	id: 'ryze_flux',
	
	buff: false,
	
	desc: 'This unit\'s magic resistance has been reduced',
	
	visible: true,
	
	duration: 5000,
	
	icon: 'http://images1.wikia.nocookie.net/__cb20091221172826/leagueoflegends/images/d/d5/Spell_Flux.jpg',
	
	triggers: new Array( 'onMRCalculation',	function() { this.stats.MR -= this.target.getValue( this.target.getAbility( 3 ).leveling[ 'magic resist reduction' ].amount, 3 ); } ),
	
}

buffs[ 'ryze_ult' ] = {
	
	name: 'Desperate Power',
	
	id: 'ryze_ult',
	
	buff: true,
	
	visible: true,
	
	stack: 1,
	
	icon: 'http://images1.wikia.nocookie.net/__cb20091221172807/leagueoflegends/images/9/9f/Desperate_Power.jpg',
	
	triggers: new Array(
		new Array(
			'onSpellVampCalculation',
			function() { this.stats.spellVamp += this.getValue( this.getAbility( 4 ).leveling[ 'spell vamp' ].amount, 4 ) }
		),
		new Array(
			'onMSFlatCalculation',
			function() { this.stats.MSFlat += this.getValue( this.getAbility( 4 ).leveling[ 'movement speed' ].amount, 4 ) }
		)
	),
	
	onApply: function() {
	
		this.timeLeft = this.champion.getValue( this.champion.getAbility( 4 ).leveling[ 'duration' ].amount, 4 ) * 1000;
		
	}
	
}