buffs[ 'baron_buff' ] = {
	
	name: 'Exalted with Baron Nashor',
	
	id: 'baron_buff',
	
	visible: true,
	
	buff: true,
	
	stack: 1,
	
	icon: 'http://images.wikia.com/leagueoflegends/images/0/0c/Null_Sphere.jpg',
	
	triggers: new Array( 
		
		createTrigger( 'ability power', 40 ),
		createTrigger( 'attack damage', 40 ),
		new Array( 'onHealthRegenCalculation', function() { this.stats.healthRegen += this.stats.healthMax * 0.03; } ),
		new Array( 'onManaRegenCalculation', function() { this.stats.manaRegen += this.stats.manaMax * 0.01; } )
		
	)
	
}

buffs[ 'blue_buff' ] = {
	
	name: 'Crest of the Ancient Golem',
	
	id: 'blue_buff',
	
	visible: true,
	
	buff: true,
	
	stack: 1,
	
	icon: 'http://images.wikia.com/leagueoflegends/images/9/9a/Crest_of_the_Ancient_Golem.png',
	
	triggers: new Array( 
		
		createTrigger( 'mana regeneration', 25 ),
		createTrigger( 'cooldown reduction', 0.2 ),
		new Array( 'onManaRegenCalculation', function() { this.stats.manaRegen += this.stats.manaMax * 0.005; } )
		
	)
	
}

buffs[ 'red_buff' ] = {
	
	name: 'Blessing of the Lizard Elder',
	
	id: 'red_buff',
	
	visible: true,
	
	buff: true,
	
	stack: 1,
	
	icon: 'http://images.wikia.com/leagueoflegends/images/f/f1/Blessing_of_the_Lizard_Elder.png',
	
	triggers: new Array( 
		
		createTrigger( 'mana regeneration', 0 )
		
	)
	
}

buffs[ 'emblem_of_valor' ] = {
	
	name: 'Emblem of Valor',
	
	id: 'emblem_of_valor',
	
	visible: true,
	
	buff: true,
	
	stack: 1,
	
	icon: 'http://images.wikia.com/leagueoflegends/images/4/43/Emblem_of_Valor_item.png',
	
	triggers: new Array( 
		
		createTrigger( 'health regeneration', 7 )
		
	)
	
}

buffs[ 'banner_of_command' ] = {
	
	name: 'Banner of Command',
	
	id: 'banner_of_command',
	
	visible: true,
	
	buff: true,
	
	stack: 1,
	
	icon: 'http://images.wikia.com/leagueoflegends/images/9/9e/Banner_of_Command_item.png',
	
	triggers: new Array( 
		
		createTrigger( 'health regeneration', 10 )
		
	)
	
}

buffs[ 'mastery_frenzy' ] = {
	
	name: 'Mastery: Frenzy',
	
	id: 'mastery_frenzy',
	
	visible: true,
	
	buff: true,
	
	stack: 1,
	
	icon: 'http://images.wikia.com/leagueoflegends/images/2/2d/Frenzy_mastery_s3.png',
	
	duration: 2000,
	
	triggers: new Array( 
		
		createTrigger( 'attack speed', 0.10 )
		
	)
	
}