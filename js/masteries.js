var masteryDefinitions = new Array(
	
	new Array( // Season 3
		
		new Array( // Offense
			
			{ image: 'summoners-wrath.jpg', description: 'Improves the following Summoner Spells:<br/><font color="#FFCC00">Exhaust:</font> Reduces target\'s Magic Resist and Armor by 10<br/><font color="#FFCC00">Ignite:</font> Increases Ability Power and Attack Damage by 5 while on cooldown<br/><font color="#FFCC00">Ghost:</font> Increases Movement Speed bonus to 35%<br/><font color="#FFCC00">Garrison:</font> Allied Garrisoned turrets deal 50% splash damage', name: 'Summoner\'s Wrath', x: 1, y: 1, required: 0, max: 1 },
			{ image: 'fury.jpg', description: 'Grants 1 / 2 / 3 / 4% attack speed.', name: 'Fury', x: 2, y: 1, required: 0, max: 4, trigger: new Array( 'onASCalculation', function( points ) { this.stats.AS *= 1 + new Array( 0, 0.01, 0.02, 0.03, 0.04 )[ points ]; } ) },
			{ image: 'sorcery.jpg', description: 'Grants 1 / 2 / 3 / 4% cooldown reduction.', name: 'Sorcery', x: 3, y: 1, required: 0, max: 4, trigger: new Array( 'onCDRCalculation', function( points ) { this.stats.CDR += new Array( 0, 0.01, 0.02, 0.03, 0.04 )[ points ]; } ) },
			{ image: 'butcher.jpg', description: 'Basic attacks deal 2 / 4 bonus physical damage to minions and monsters.', name: 'Butcher', x: 4, y: 1, required: 0, max: 2 },
			{ image: 'deadliness.jpg', description: 'Grants 0.17 / 0.33 / 0.5 / 0.67 attack damage per level (3 / 6 / 9 / 12 at level 18).', name: 'Deadliness', x: 2, y: 2, required: 4, max: 4, trigger: new Array( 'onADCalculation', function( points ) { this.stats.AD += new Array( 0, 0.17, 0.33, 0.5, 0.67 )[ points ] * this.championLevel; } ) },
			{ image: 'blast.jpg', description: 'Grants 0.25 / 0.5 / 0.75 / 1 ability power per level (4.5 / 9 / 13.5 / 18 at level 18).', name: 'Blast', x: 3, y: 2, required: 4, max: 4, trigger: new Array( 'onAPCalculation', function( points ) { this.stats.AP += new Array( 0, 0.25, 0.5, 0.75, 1 )[ points ] * this.championLevel; } ) },
			{ image: 'destruction.jpg', description: 'Increases damage to turrets by 5%.', name: 'Destruction', x: 4, y: 2, required: 4, max: 1 },
			{ image: 'havoc.jpg', description: 'Increases damage dealt by 0.67 / 1.33 / 2%.', name: 'Havoc', x: 1, y: 3, required: 8, max: 3 },
			{ image: 'weapon-expertise.jpg', description: 'Grants 8% armor penetration.', name: 'Weapon Expertise', x: 2, y: 3, required: 8, max: 1, link: 'Deadliness', trigger: new Array( 'onArmorPenPercCalculation', function( points ) { this.stats.armorPenPerc = mul( this.stats.armorPenPerc, 0.08 * points ); } ) },
			{ image: 'arcane-knowledge.jpg', description: 'Grants 8% magic penetration.', name: 'Arcane Knowledge', x: 3, y: 3, required: 8, max: 1, link: 'Blast', trigger: new Array( 'onMagicPenPercCalculation', function( points ) { this.stats.magicPenPerc = mul( this.stats.magicPenPerc, 0.08 * points ); } ) },
			{ image: 'lethality.jpg', description: 'Grants 2.5 / 5% critical strike damage, doubled to 5 / 10% on melee champions.', name: 'Lethality', x: 1, y: 4, required: 12, max: 2, trigger: new Array( 'onCritDamageCalculation', function( points ) { this.stats.critDamage += ( 1 + this.melee ) * new Array( 0, 0.025, 0.05 )[ points ]; } ) },
			{ image: 'brute-force.jpg', description: 'Grants 1.5 / 3 attack damage.', name: 'Brute Force', x: 2, y: 4, required: 12, max: 2, trigger: new Array( 'onADCalculation', function( points ) { this.stats.AD += new Array( 0, 1.5, 3 )[ points ]; } ) },
			{ image: 'mental-force.jpg', description: 'Grants 2 / 4 / 6 ability power.', name: 'Mental Force', x: 3, y: 4, required: 12, max: 3, trigger: new Array( 'onAPCalculation', function( points ) { this.stats.AD += new Array( 0, 2, 4, 6 )[ points ]; } ) },
			{ image: 'spellsword.jpg', description: 'Your basic attacks deal bonus magic damage equal to 5% of your ability power.', name: 'Spellsword', x: 4, y: 4, required: 12, max: 1 },
			{ image: 'frenzy.jpg', description: 'Grants a 10% attack speed buff for 2 seconds after landing a critical strike.', name: 'Frenzy', x: 1, y: 5, required: 16, max: 1, link: 'Lethality', trigger: new Array( 'onAACritDamageCalculation', function( points ) { this.applyBuff( new buff( 'mastery_frenzy' ) ); } ) },
			{ image: 'sunder.jpg', description: 'Grants 2 / 3.5 / 5 armor penetration .', name: 'Sunder', x: 2, y: 5, required: 16, max: 3, trigger: new Array( 'onArmorPenFlatCalculation', function( points ) { this.stats.armorPenFlat += new Array( 0, 2, 3.5, 5 )[ points ]; } ) },
			{ image: 'archmage.jpg', description: 'Increases ability power by 1.25 / 2.5 / 3.75 / 5%.', name: 'Archmage', x: 3, y: 5, required: 16, max: 4, trigger: new Array( 'onAPPercCalculation', function( points ) { this.stats.AP *= 1 + new Array( 0, 0.0125, 0.025, 0.0375, 0.05 )[ points ]; } ) },
			{ image: 'executioner.jpg', description: 'Increases damage by 5% against targets below 50% health.', name: 'Executioner', x: 2, y: 6, required: 20, max: 1 }
			
		),
		
		new Array( // Defense
			
			{ image: 'summoners-resolve.jpg', description: 'Improves the following Summoner Spells:<br/><font color="#FFCC00">Cleanse:</font> Increases duration of disable reduction by 1 second<br/><font color="#FFCC00">Heal:</font> Passively increases Health by 5 per level<br/><font color="#FFCC00">Smite:</font> Grants 10 bonus gold on use<br/><font color="#FFCC00">Barrier:</font> Increases shield amount by 20', name: 'Summoners Resolve', x: 1, y: 1, required: 0, max: 1 },
			{ image: 'perseverance.jpg', description: 'Grants up to 2 / 4 / 6 health regen per 5 seconds based on missing health (caps at 10% health).', name: 'Perseverance', x: 2, y: 1, required: 0, max: 3, trigger: new Array( 'onHealthRegenCalculation', function( points ) { this.stats.healthRegen += Math.min( ( this.stats.healthMax - this.stats.health ) / ( this.stats.healthMax * 0.9 ), 1 ) * new Array( 0, 2, 4, 6 )[ points ]; } ) },
			{ image: 'durability.jpg', description: 'Grants 1.5 / 3 / 4.5 / 6 health per level (27 / 54 / 81 / 108 health at level 18).', name: 'Durability', x: 3, y: 1, required: 0, max: 4, trigger: new Array( 'onMaxHealthCalculation', function( points ) { this.stats.healthMax += new Array( 0, 1.5, 3, 4.5, 6 )[ points ] * this.championLevel; } ) },
			{ image: 'tough-skin.jpg', description: 'Reduces damage from monsters by 1 / 2.', name: 'Tough Skin', x: 4, y: 1, required: 0, max: 2 },
			{ image: 'hardiness.jpg', description: 'Grants 2 / 3.5 / 5 armor.', name: 'Hardiness', x: 1, y: 2, required: 3, max: 3, trigger: new Array( 'onArmorCalculation', function( points ) { this.stats.armor += new Array( 0, 2, 3.5, 5 )[ points ]; } ) },
			{ image: 'resistance.jpg', description: 'Grants 2 / 3.5 / 5 magic resistance.', name: 'Resistance', x: 2, y: 2, required: 3, max: 3, trigger: new Array( 'onMRCalculation', function( points ) { this.stats.MR += new Array( 0, 2, 3.5, 5 )[ points ]; } ) },
			{ image: 'bladed-armor.jpg', description: 'Deals 6 true damage to any minion or monster that attacks you.', name: 'Bladed Armor', x: 4, y: 2, required: 4, max: 1, link: 'Tough Skin' },
			{ image: 'unyielding.jpg', description: 'Reduces damage from champions by 1 / 2.', name: 'Unyielding', x: 1, y: 3, required: 8, max: 2, trigger: new Array( 'onDamageReceived', function( points ) { if( this.scope.receivedDamage.typeName != 'true' ) this.scope.receivedDamage.magnitude -= new Array( 0, 1, 2 )[ points ]; } ) },
			{ image: 'relentless.jpg', description: 'Reduces the potency of movement slows by 7.5% / 15%.', name: 'Relentless', x: 2, y: 3, required: 8, max: 2, trigger: new Array( 'onSlowResistCalculation', function( points ) { this.stats.slowResist = mul( this.stats.slowResist, new Array( 0, 0.075, 0.15 )[ points ] ); } ) },
			{ image: 'veterans-scars.jpg', description: 'Grants 30 health.', name: 'Veteran\'s Scars', x: 3, y: 3, required: 8, max: 1, link: 'Durability', trigger: new Array( 'onMaxHealthCalculation', function( points ) { this.stats.healthMax += 30 * points; } ) },
			{ image: 'safeguard.jpg', description: 'Reduces damage taken from turrets by 5%.', name: 'Safeguard', x: 4, y: 3, required: 8, max: 1 },
			{ image: 'block.jpg', description: 'Block damage from champion basic attacks by 3.', name: 'Block', x: 1, y: 4, required: 12, max: 1, link: 'Unyielding', trigger: new Array( 'onDamageReceived', function( points ) { if( this.scope.receivedDamage.typeName != 'true' && this.scope.receivedAA ) this.scope.receivedDamage.magnitude -= 3 * points; } ) },
			{ image: 'tenacious.jpg', description: 'Reduces the duration of crowd control effects by 5% / 10% / 15%.', name: 'Tenacious', x: 2, y: 4, required: 12, max: 3, trigger: new Array( 'onTenacityCalculation', function( points ) { this.stats.tenacity = mul( this.stats.tenacity, new Array( 0, 0.05, 0.10, 0.15 )[ points ] ); } ) },
			{ image: 'juggernaut.jpg', description: 'Increases your maximum health by 1.5 / 2.75 / 4%.', name: 'Juggernaut', x: 3, y: 4, required: 12, max: 3, trigger: new Array( 'onMaxHealthPercCalculation', function( points ) { this.stats.healthMax *= 1 + new Array( 0, 0.015, 0.0275, 0.04 )[ points ]; } ) },
			{ image: 'defender.jpg', description: 'Grants 1 bonus armor and magic resistance for every nearby enemy champion.', name: 'Defender', x: 1, y: 5, required: 16, max: 1, trigger: new Array( 'onMRCalculation', function( points ) { if( this.targetVisible() && Math.abs( this.position - this.target.position ) < 700 ) { this.stats.MR += 1; this.stats.armor += 1; } } ) },
			{ image: 'legendary-armor.jpg', description: 'Increases bonus armor and magic resistance by 2 / 3.5 / 5%.', name: 'Legendary Armor', x: 2, y: 5, required: 16, max: 3, trigger: new Array( 'afterMRCalculation', function( points ) { this.stats.MR += ( this.stats.MR - this.stats.MRBase ) * new Array( 0, 0.02, 0.035, 0.05 )[ points ]; this.stats.armor += ( this.stats.armor - this.stats.armorBase ) * new Array( 0, 0.02, 0.035, 0.05 )[ points ]; } ) },
			{ image: 'good-hands.jpg', description: 'Reduces the time spent dead by 10%.', name: 'Good Hands', x: 3, y: 5, required: 16, max: 1 },
			{ image: 'reinforced-armor.jpg', description: 'Reduces damage taken from critical strikes by 10%.', name: 'Reinforced Armor', x: 4, y: 5, required: 16, max: 1 },
			{ image: 'honor-guard.jpg', description: 'Reduces damage taken from all sources by 3%.', name: 'Honor Guard', x: 2, y: 6, required: 20, max: 1, trigger: new Array( 'onDamageReceived', function( points ) { if( this.scope.receivedDamage.typeName != 'true' ) this.scope.receivedDamage.magnitude *= 1 - ( 0.03 * points ); } ) }
			
		),
		
		new Array( // Utility
			
			{ image: 'summoners-insight.jpg', description: 'Improves the following Summoner Spells:<br/><font color="#FFCC00">Revive:</font> Grants bonus Health for 2 minutes upon reviving<br/><font color="#FFCC00">Teleport:</font> Reduces cast time by 0.5 seconds<br/><font color="#FFCC00">Flash:</font> Reduces cooldown by 15 seconds<br/><font color="#FFCC00">Clarity:</font> Increases Mana restored by 25%<br/><font color="#FFCC00">Clairvoyance:</font> Grants lingering vision of enemy champions revealed', name: 'Summoner\'s Insight', x: 1, y: 1, required: 0, max: 1 },
			{ image: 'wanderer.jpg', description: 'Grants 0.66 / 1.33 / 2% bonus movement speed when out of combat.', name: 'Wanderer', x: 2, y: 1, required: 0, max: 3, trigger: new Array( 'onMSPercCalculation', function( points ) { if( !this.inCombat() ) this.MS *= 1 + new Array( 0, 0.66, 1.33, 2 )[ points ]; } ) },
			{ image: 'meditation.jpg', description: 'Grants 1 / 2 / 3 mana regeneration per 5 seconds.', name: 'Meditation', x: 3, y: 1, required: 0, max: 3, trigger: new Array( 'onManaRegenCalculation', function( points ) { this.manaRegen += new Array( 0, 1, 2, 3 )[ points ]; } ) },
			{ image: 'improved-recall.jpg', description: 'Reduces the cast time of Recall by 1 second and Enhanced Recall by 0.5 seconds.', name: 'Improved Recall', x: 4, y: 1, required: 0, max: 1 },
			{ image: 'scout.jpg', description: 'Wards gain 25% increased vision range for the first 5 seconds after placing them.', name: 'Scout', x: 1, y: 2, required: 4, max: 1 },
			{ image: 'mastermind.jpg', description: 'Reduces the cooldown of Summoner Spells by 4% / 7% / 10%.', name: 'Mastermind', x: 2, y: 2, required: 4, max: 3 },
			{ image: 'expanded-mind.jpg', description: 'Grants 4 / 7 / 10 additional maximum mana per level (72 / 126 / 180 mana at level 18).', name: 'Expanded Mind', x: 3, y: 2, required: 4, max: 3, trigger: new Array( 'onMaxManaCalculation', function( points ) { this.stats.manaMax += new Array( 0, 4, 7, 10 )[ points ] * this.championLevel; } ) },
			{ image: 'artificer.jpg', description: 'Reduces the cooldown of item active effects by 7.5 / 15%.', name: 'Artificer', x: 4, y: 2, required: 4, max: 2 },
			{ image: 'greed.jpg', description: 'Grants 0.5 / 1 / 1.5 / 2 gold per 10 seconds.', name: 'Greed', x: 1, y: 3, required: 8, max: 4, trigger: new Array( 'onGP10Calculation', function( points ) { this.stats.GP10 += new Array( 0, 0.5, 1, 1.5, 2 )[ points ]; } ) },
			{ image: 'runic-affinity.jpg', description: 'Increases shrine, relic, quest and neutral monster buff durations by 20%. (Does not include Exalted with Baron Nashor.)', name: 'Runic Affinity', x: 2, y: 3, required: 8, max: 1 },
			{ image: 'vampirism.jpg', description: 'Grants 1 / 2 / 3% spell vamp and life steal.', name: 'Vampirism', x: 3, y: 3, required: 8, max: 3, trigger: new Array( 'onLifeStealCalculation', function( points ) { this.stats.spellVamp += new Array( 0, 0.01, 0.02, 0.03 )[ points ]; this.stats.lifeSteal += new Array( 0, 0.01, 0.02, 0.03 )[ points ]; } ) },
			{ image: 'biscuiteer.jpg', description: 'You start the game with a Total Biscuit of Rejuvenation that restores 80 health and 50 mana over 10 seconds.', name: 'Biscuiteer', x: 4, y: 3, required: 8, max: 1 },
			{ image: 'wealth.jpg', description: 'You start the game with 25 / 50 bonus gold.', name: 'Wealth', x: 1, y: 4, required: 12, max: 2, link: 'Greed', trigger: new Array( 'onStartingGoldCalculation', function( points ) { this.stats.startingGold += new Array( 0, 25, 50 )[ points ]; } ) },
			{ image: 'awareness.jpg', description: 'Increases experienced gained by 1.25 / 2.5 / 3.75 / 5%.', name: 'Awareness', x: 2, y: 4, required: 12, max: 4 },
			{ image: 'strength-of-spirit.jpg', description: 'Grants 1 / 2 / 3 bonus health regeneration per 5 seconds for every 400 maximum mana points.', name: 'Strength of Spirit', x: 3, y: 4, required: 12, max: 4, trigger: new Array( 'onHealthRegenCalculation', function( points ) { this.stats.healthRegen += new Array( 0, 0.0025, 0.0050, 0.0075 )[ points ] * this.stats.manaMax; } ) },
			{ image: 'explorer.jpg', description: 'On Summoner\'s Rift: You start the game with an Explorer\'s Ward, which places an invisible ward that lasts 60 seconds. On other maps: You start the game with 25 bonus gold.', name: 'Explorer', x: 4, y: 4, required: 12, max: 1, link: 'Biscuiteer' },
			{ image: 'pickpocket.jpg', description: 'Your basic attacks against enemy champions grant 3 gold for ranged attacks and 5 gold for melee attacks, on a 5 second cooldown.', name: 'Pickpocket', x: 1, y: 5, required: 16, max: 1 },
			{ image: 'intelligence.jpg', description: 'Grants 2 / 4 / 6% cooldown reduction.', name: 'Intelligence ', x: 2, y: 5, required: 16, max: 3, trigger: new Array( 'onCDRCalculation', function( points ) { this.stats.CDR += new Array( 0, 0.02, 0.04, 0.06 )[ points ]; } ) },
			{ image: 'nimble.jpg', description: 'Grants 3% movement speed.', name: 'Nimble', x: 2, y: 6, required: 20, max: 1, trigger: new Array( 'onMSPercCalculation', function( points ) { this.stats.MS *= 1 + 0.03 * points; } ) }
			
		)
	),
	
	new Array( // Season 4
		
		new Array( // Offense
			
			{ image: '../s3/executioner.jpg', description: 'Melee champions: You deal 2% increase damage from all sources, but take 1% increase damage from all sources.<br/>Ranged champions: You deal and take 1.5% increased damage from all sources.', name: 'Double-Edged Sword', x: 1, y: 1, required: 0, max: 1 },
			{ image: 'fury.png', description: 'Increases champion attack speed by 1.25 / 2.5 / 3.75 / 5%.', name: 'Fury', x: 2, y: 1, required: 0, max: 4, trigger: new Array( 'onASCalculation', function( points ) { this.stats.AS *= 1 + new Array( 0, 0.0125, 0.025, 0.0375, 0.05 )[ points ]; } ) },
			{ image: 'sorcery.png', description: 'Increases cooldown reduction by 1.25 / 2.5 / 3.75 / 5%.', name: 'Sorcery', x: 3, y: 1, required: 0, max: 4, trigger: new Array( 'onCDRCalculation', function( points ) { this.stats.CDR += new Array( 0, 0.0125, 0.025, 0.0375, 0.05 )[ points ]; } ) },
			{ image: 'butcher.png', description: 'Basic attacks and single target abilities do 2 bonus damage to minions and monsters.', name: 'Butcher', x: 4, y: 1, required: 0, max: 1 },
			{ image: '../s3/arcane-knowledge.jpg', description: 'Your damaging abilities debuff enemy champions for 3 seconds, increasing the damage they take from allied champions by 1%.', name: 'Expose Weakness', x: 1, y: 2, required: 4, max: 1 }
			
		),
		
		new Array( // Defense
			
			
			
		),
		
		new Array( // Utility
			
			
			
		)
		
	)
	
);