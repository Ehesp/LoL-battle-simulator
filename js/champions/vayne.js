championDefinitions[ 'Vayne' ] = function() {
	
	this.abilities = new Array(
		
		false,
		
		function() {
			
			
			
		},
		
		false,
		
		function() {
			
			
			
		},
		
		function() {
			
			this.applyBuff( new buff( 'vayne_ult' ) );
			
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

buffs[ 'vayne_stealth' ] = {
	
	name: 'Stealth',
	
	id: 'vayne_stealth',
	
	desc: 'Vayne is stealthed.',
	
	buff: true,
	
	visible: true,
	
	duration: 1000,
	
	stack: 1,
	
	icon: 'img/stealthed.jpg',
	
	triggers: new Array(
		new Array(
			'onStealthedCheck',
			function() { this.stealthed = true; }
		),
		new Array(
			'onChannel',
			function() { this.removeBuff( 'vayne_stealth' ); }
		)
	),
	
}

buffs[ 'vayne_ult' ] = {
	
	name: 'Final Hour',
	
	id: 'vayne_ult',
	
	buff: true,
	
	visible: true,
	
	stack: 1,
	
	icon: 'http://images2.wikia.nocookie.net/__cb20110511114430/leagueoflegends/images/c/c0/Final_Hour.jpg',
	
	triggers: new Array(
		new Array(
			'onADCalculation',
			function() { this.stats.AD += this.getValue( this.getAbility( 4 ).leveling[ 'bonus attack damage' ].amount, 4 ) }
		),
		new Array(
			'onAbilityCast',
			function() { if( this.current.abilityId == 1 ) this.applyBuff( new buff( 'vayne_stealth' ) ); }
		)
	),
	
	onApply: function() {
	
		this.timeLeft = this.champion.getValue( this.champion.getAbility( 4 ).leveling[ 'duration' ].amount, 4 ) * 1000;
		
	}
	
}
