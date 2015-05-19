function championInstance( name, id ) {
	
	this.champID = id;
	this.target = false;
	
	this.trigger = new triggerHandler( this );
	
	var data = championData[ name ];
	this.statData = data.championData;
	this.abilityData = data.abilityData;
	
	this.guides = false;
	
	this.resource = ( typeof this.statData.resource == "undefined" ? 'mana' : this.statData.resource.tolowerCase() );
	this.melee = ( this.statData.rangetype == "Melee" );
	
	this.abilityMaxLevels = new Array( 5, 5, 5, 3 );
	this.abilityMinLevels = new Array( 0, 0, 0, 0 );
	
	championDefinitions[ name ].apply( this );
	
	this.newRunes();
	this.masteryTriggers = new Array();
	
	this.reset();
	
	this.settings = new Array();
	this.settings[ 'moveAbility' ] = true;
	this.settings[ 'moveAA' ] = true;
	this.settings[ 'idleAA' ] = true;
	this.settings[ 'keepRange' ] = true;
	this.settings[ 'rangeToKeep' ] = 400;
	
}

championInstance.prototype.reset = function() {
	
	this.championLevel = 1;
	this.abilityLevels = this.abilityMinLevels.slice( 0 );
	
	this.clearRunes();
	this.newMasteries();
	
	this.summonTriggers = new Array();
	this.summonBuffs = new Array();
	this.resetItems();
	
	this.restart();
	setTimeout( triggerReplacements, 0 );
	
}

championInstance.prototype.newMasteries = function() {
	
	if( this.masteryTriggers.length != 0 )
		this.trigger.remove( this.masteryTriggers );
	
	this.masterySeason = masteryDefinitions.length - 1;
	
	this.masteries = masteryDefinitions[ this.masterySeason ].map( function( tree ) { return tree.map( function( mastery ) { return 0; } ); } );
	this.masteriesShort = new Array( 0, 0, 0 );
	
}

championInstance.prototype.newRunes = function( rune, index ) {
	
	this.runes = new Array(), counts = new Array( 9, 9, 9, 3 );
	
	for( var i, type = 0; type < 4; type ++ ) {
		
		this.runes[ type ] = new Array();
		
		for( i = 0; i < counts[ type ]; i ++ )
			this.runes[ type ].push( false );
		
	}
	
}

championInstance.prototype.addRune = function( rune, index ) {
	
	var flag = false, type = new Array( 'mark', 'seal', 'glyph', 'quint' ).indexOf( rune.type );
	
	if( typeof index == "undefined" ) {
		
		for( var i in this.runes[ type ] )
			if( this.runes[ type ][ i ] === false ) {
				
				this.runes[ type ][ i ] = rune;
				flag = true;
				break;
				
			}
		
		if( flag === false )
			return;
		
	} else {
		
		if( this.runes[ type ][ index ] === false )
			this.runes[ type ][ index ] = rune;
		else
			return;
	
	}
	
	if( rune.triggers )
		this.trigger.add( rune.triggers );
	
	this.updateStats();
	
}

championInstance.prototype.addRunes = function( runes ) {
	
	var i, rune;
	
	for( rune in runes ) {
		
		if( typeof runes[ rune ][ 1 ] != 'object' )
			runes[ rune ][ 1 ] = _.findWhere( runeDefinitions, { 'name': runes[ rune ][ 1 ] } );
			
		for( i = 0; i < runes[ rune ][ 0 ]; i ++ )
			this.addRune( runes[ rune ][ 1 ] );
		
	}
	
}

championInstance.prototype.removeRune = function( type, index ) {
	
	if( typeof type == 'object' )
		type = type.type;
	
	if( this.runes[ type ][ index ].triggers )
		this.trigger.remove( this.runes[ type ][ index ].triggers );
	
	this.runes[ type ][ index ] = false;
	
}

championInstance.prototype.clearRunes = function() {
	
	var type, rune;
	
	for( type in this.runes )
		for( rune in this.runes[ type ] )
			if( this.runes[ type ][ rune ] !== false )
				this.removeRune( type, rune );
	
}

championInstance.prototype.applyRunes = function( runes ) {
	
	this.clearRunes();
	this.addRunes( runes );
	
	
}

championInstance.prototype.applyRuneSet = function( runeSet ) {
	
	this.clearRunes();
	
	var type, index;
	
	for( type in runeSet )
		for( index in runeSet[ type ] )
			if( runeSet[ type ][ index ] !== false )
				this.addRune( runeSet[ type ][ index ], index );
	
	
}

championInstance.prototype.hasItem = function( arr ) {
	
	if( !( arr instanceof Array ) )
		arr = new Array( arr );
	
	for( var i in this.items )
		if( arr.indexOf( this.items[ i ].name ) != -1 )
			return true;
	
	return false;
	
}

championInstance.prototype.resetItems = function() {
	
	if( this.items ) {
		for( var i in this.items )
			if( this.items[ i ] !== false )
				this.removeItem( i );
	} else
		this.items = new Array( false, false, false, false, false, false );
	
}

championInstance.prototype.newScope = function( fun ) {
	
	this.scopes.push( this.scope );
	this.scope = new Array();
	this.scope = this.scopes.pop();
	
}

championInstance.prototype.restart = function() {
	
	this.position = this.champID * 200;
	
	this.queue = new Array();
	
	this.stats = new Array();
	
	this.abilityCooldown = new Array( false, false, false, false, false );
	
	this.AAState = 0;
	this.AACooldown = false;
	this.AAForced = false;
	
	this.dead = false;
	
	this.movement = false;
	
	this.channelTime = false;
	this.channelLeft = false;
	this.channelFunction = false;
	this.channelType = false;
	
	for( var buff in this.buffs )
		this.removeBuff( this.buffs[ buff ].id );
		
	this.buffs = new Array();
	this.shields = new Array();
	
	this.statistics = new statistics();
	this.logs = new Array();
	
	this.scopes = new Array();
	this.scope = new Array();
	
	this.updateStats();
	
	if( this.stats.manaMax )
		createAlarm( this.regenMana.bind( this ), 500, true );
	createAlarm( this.regenHealth.bind( this ), 500, true );
	
}

championInstance.prototype.applyMasteries = function( distribution, season ) {
	
	if( this.masteryTriggers.length != 0 )
		this.trigger.remove( this.masteryTriggers );
	
	if( typeof season != "undefined" )
		this.masterySeason = season;
	
	this.masteriesShort = new Array( 0, 0, 0 );
	this.masteryTriggers = new Array();
	
	for( var tree in masteryDefinitions[ season ] )
		for( var mastery in masteryDefinitions[ season ][ tree ] ) {
			
			if( typeof masteryDefinitions[ season ][ tree ][ mastery ].trigger != "undefined" && distribution[ tree ][ mastery ] != 0 )
				this.masteryTriggers.push( new Array( masteryDefinitions[ season ][ tree ][ mastery ].trigger[ 0 ], ( function( mastery, points ) { return function() { mastery.trigger[ 1 ].call( this, points ) } } )( masteryDefinitions[ season ][ tree ][ mastery ], distribution[ tree ][ mastery ] ) ) );
			
			this.masteriesShort[ tree ] += distribution[ tree ][ mastery ];
			
		}
	
	this.trigger.add( this.masteryTriggers );
	
	this.masteries = distribution;
	
	this.updateStats();
	
}

championInstance.prototype.applyItems = function( itemList ) {
	
	for( var i in this.items ) {
		
		this.removeItem( i );
		this.addItem( itemList[ i ], i );
		
	}
	
}

championInstance.prototype.summon = function() {
	
	this.trigger.add( this.summonTriggers );
	for( var i in this.summonBuffs )
		this.applyBuff( new buff( this.summonBuffs[ i ] ) );
	
	this.trigger.event( 'onSummon' );
	
}

championInstance.prototype.inCombat = function() {
	
	return this.lastCombat === false || this.lastCombat > 5000;
	
}
	
championInstance.prototype.canTarget = function() {
	
	return this.target.targetable && this.targetVisible();
	
}

championInstance.prototype.targetVisible = function() {
	
	return !this.target.stealthed;
	
}

championInstance.prototype.abilityCostType = function( id ) {
	
	var type = this.getAbility( id ).costtype;
	
	if( typeof type == "undefined" )
		return false;
	
	type = type.toLowerCase();
	
	return type == 'no cost' ? false : type;
	
}

championInstance.prototype.step = function( passed, time ) {
	
	for( var buff in this.buffs )
		this.buffs[ buff ].step( passed, time );
	
	for( var ability in this.abilityCooldown ) {
		
		if( this.abilityCooldown[ ability ] === false )
			continue;
		
		this.abilityCooldown[ ability ] -= passed;
		if( this.abilityCooldown[ ability ] <= 0 )
			this.abilityCooldown[ ability ] = false;
		
	}
	
	if( this.AACooldown !== false ) {
		
		this.AACooldown -= passed;
		if( this.AACooldown <= 0 )
			this.AACooldown = false;
		
	}
	
	if( this.lastCombat !== false )
		this.lastCombat += passed;
	
	if( this.channelLeft !== false ) {
		
		this.channelLeft -= passed;
		if( this.channelLeft <= 0 ) {
			
			var func = this.channelFunction;
			this.channelLeft = this.channelCancelFunction = this.channelFunction = this.channelTime = this.channelType = false;
			func();
			
		} else {
			this.scope = new Array();
			return;
		}
		
	}
	
	if( this.movement !== false ) {
		
		var distance = this.stats.MS * passed / 1000;
		
		if( this.movement > 0 )
			this.position += Math.min( distance, this.movement );
		else
			this.position += Math.max( -distance, this.movement );
		
		this.movement = false;
		
		this.trigger.event( 'onMovement' );
		
	}
	
	if( this.handleQueue() ) {
	
	} else if( this.settings[ 'idleAA' ] && ( this.inrange( -1 ) || this.settings[ 'moveAA' ] ) ) {
		
		if( this.inrange( -1 ) && this.AAStatus )
			this.performAA();
		else
			this.move( this.statData.range );
		
	} else if( this.settings[ 'keepRange' ] ) {
		
		this.move( this.settings[ 'rangeToKeep' ] );
		
	}
	
	
	this.scope = new Array();
	
}

championInstance.prototype.move = function( distance ) {
	
	this.cancelChannel();
	this.movement = this.target.position - this.position;
	if( this.position > this.target.position )
		this.movement += distance;
	else
		this.movement -= distance;
	
}

championInstance.prototype.handleQueue = function() {
	
	if( typeof this.queue[ 0 ] == "undefined" )
		return false;
	
	var item;
	for( var i in this.queue ) {
		
		item = this.queue[ i ];
		
		if( item.index == -1 ) {
			
			if( this.AAStatus ) {
				
				if( this.inrange( -1 ) ) {
					
					this.queue.shift();
					this.performAA( true );
					
				} else
					this.move( this.statData.range );
				
				return true;
				
			}
			
		} else if( this.abilityStatus[ item.index ] ) {
			
			if( this.inrange( item.index ) ) {
				
				this.queue.shift();
				this.ability( item.index, item.fields );
				
			} else
				this.move( this.abilityData[ item.index ].range );
			
			return true;
			
		}
		
		break;
		
	}
	
	return false;
	
}

championInstance.prototype.inrange = function( id ) {
	
	if( id == -1 )
		return distance() <= this.statData.range;
	
	if( this.getAbility( id ).range )
		return distance() <= this.getAbility( id ).range;
	
	return true;
	
}

championInstance.prototype.setChampionLevel = function( i ) {
	
	while( this.championLevel !== i )
		if( this.championLevel > i )
			this.lowerLevel();
		else
			this.addLevel();
	
}

championInstance.prototype.setAbilityLevels = function( arr ) {
	
	for( var i in arr )
		this.abilityLevels[ i ] = arr[ i ];
	
}

championInstance.prototype.addLevel = function() {
	
	if( this.championLevel != 18 )
		this.championLevel ++;
	
	this.stats.health += this.statData.hp_lvl;
	this.stats.mana += this.statData.mp_lvl;
	
	this.updateStats();
	
}

championInstance.prototype.lowerLevel = function() {
	
	if( this.championLevel != 1 )
		this.championLevel--;
	
	this.updateStats();
	
}

championInstance.prototype.updateStats = function() {
	
	var time = new Date().getTime();
	
	if( typeof this.statData.mp_base != "undefined" ) {
		
		var oldMana = Math.max( 0, typeof this.stats.manaMax == "undefined" ? 0 : this.stats.manaMax );
		
		this.stats.manaMaxBase = this.statData.mp_base + this.statData.mp_lvl * this.championLevel;
		this.stats.manaMax = this.stats.manaMaxBase;
		this.trigger.event( 'onMaxManaCalculation' );
		
		if( typeof this.stats.mana == "undefined" )
			this.stats.mana = 0;
		
		this.stats.mana = Math.min( this.stats.mana + this.stats.manaMax - oldMana, this.stats.manaMax );
		
	}
	
	var oldHealth = Math.max( 0, typeof this.stats.healthMax == "undefined" ? 0 : this.stats.healthMax );
	
	this.stats.healthMaxBase = this.statData.hp_base + this.statData.hp_lvl * this.championLevel;
	this.stats.healthMax = this.stats.healthMaxBase;
	this.trigger.event( 'onMaxHealthCalculation' );
	this.trigger.event( 'onMaxHealthPercCalculation' );
	
	if( typeof this.stats.health == "undefined" )
		this.stats.health = 0;
	
	this.stats.health = Math.min( this.stats.health + this.stats.healthMax - oldHealth, this.stats.healthMax );
		
	this.stats.healthRegenBase = this.statData.hp5_base + this.statData.hp5_lvl * this.championLevel;
	this.stats.healthRegen = this.stats.healthRegenBase;
	this.trigger.event( 'onHealthRegenCalculation' );
	this.trigger.event( 'onHealthRegenPercCalculation' );
	
	this.stats.manaRegenBase = this.statData.mp5_base + this.statData.mp5_lvl * this.championLevel;
	this.stats.manaRegen = this.stats.manaRegenBase;
	this.trigger.event( 'onManaRegenCalculation' );
	this.trigger.event( 'onManaRegenPercCalculation' );
	
	this.stats.ASBase = this.statData.as_base * ( 1 + this.statData.as_lvl / 100 * this.championLevel );
	this.stats.AS = this.stats.ASBase;
	this.trigger.event( 'onASCalculation' );
	this.stats.AS = Math.min( 2.5, this.stats.AS );
	
	this.stats.ADBase = this.statData.dam_base + this.statData.dam_lvl * this.championLevel;
	this.stats.AD = this.stats.ADBase;
	this.trigger.event( 'onADCalculation' );
	
	this.stats.armorBase = this.statData.arm_base + ( this.statData.arm_lvl ? this.statData.arm_lvl * this.championLevel : 0 );
	this.stats.armor = this.stats.armorBase;
	this.trigger.event( 'onArmorCalculation' );
	this.trigger.event( 'afterArmorCalculation' );
	
	this.stats.MRBase = this.statData.mr_base + ( this.statData.mr_lvl ? this.statData.mr_lvl * this.championLevel : 0 );
	this.stats.MR = this.stats.MRBase;
	this.trigger.event( 'onMRCalculation' );
	this.trigger.event( 'afterMRCalculation' );
	
	this.stats.MSBase = this.statData.ms;
	this.stats.MS = this.stats.MSBase;
	this.trigger.event( 'onMSCalculation' );
	this.trigger.event( 'onMSPercCalculation' );
	
	this.stats.AP = 0;
	this.trigger.event( 'onAPCalculation' );
	this.trigger.event( 'onAPPercCalculation' );
	
	this.stats.tenacity = 0;
	this.trigger.event( 'onTenacityCalculation' );
	
	this.stats.magicPenFlat = 0;
	this.trigger.event( 'onMagicPenFlatCalculation' );
	
	this.stats.magicPenPerc = 0;
	this.trigger.event( 'onMagicPenPercCalculation' );
	
	this.stats.armorPenFlat = 0;
	this.trigger.event( 'onArmorPenFlatCalculation' );
	
	this.stats.armorPenPerc = 0;
	this.trigger.event( 'onArmorPenPercCalculation' );
	
	this.stats.critChance = 0;
	this.trigger.event( 'onCritChanceCalculation' );
	this.stats.critChance = Math.min( 1, this.stats.critChance );
	
	this.stats.critDamage = 2;
	this.trigger.event( 'onCritDamageCalculation' );
	
	this.stats.CDR = 0;
	this.trigger.event( 'onCDRCalculation' );
	this.stats.CDR = Math.min( 0.4, this.stats.CDR );
	
	this.stats.spellVamp = 0;
	this.trigger.event( 'onSpellVampCalculation' );
	
	this.stats.lifeSteal = 0;
	this.trigger.event( 'onLifeStealCalculation' );
	
	this.stats.GP10 = 0;
	this.trigger.event( 'onGP10Calculation' );
		
	this.stats.startingGold = 475;
	this.trigger.event( 'onStartingGoldCalculation' );
	
	this.CC = new Array();
	this.trigger.event( 'onCCCalculation' );
	
	this.stealthed = false;
	this.trigger.event( 'onStealthedCheck' );
	
	this.targetable = true;
	this.trigger.event( 'onTargetableCheck' );
	
	this.lastCombat = false;
	
	this.abilityStatus = new Array( true, true, true, true, true );
	this.AAStatus = ( this.AACooldown === false );
	
	var abilitiesBlocked = false;
	for( var i in abilityBlockCC )
		abilitiesBlocked |= this.CC.indexOf( abilityBlockCC[ i ] ) !== -1;
	
	var movementBlocked = false;
	for( var i in abilityBlockCC )
		movementBlocked |= this.CC.indexOf( immobilityCC[ i ] ) !== -1;
	
	if( this.abilityCooldown[ 0 ] !== false )
		this.abilityStatus[ 0 ] = false;
	
	for( i = 1; i < 5; i++ ) {
		if(
			this.abilityLevels[ i - 1 ] == 0 ||
			( ( this.abilityCostType( i ) == 'mana' || this.abilityCostType( i ) == 'energy' ) && this.getValue( this.getAbility( i ).cost, i ) > this.stats.mana ) ||
			( abilitiesBlocked === true && ( !this.abilityUnblockable || this.abilityUnblockable[ i ] === false ) ) ||
			this.abilityCooldown[ i ] !== false ||
			( this.abilityMovement && this.abilityMovement[ i ] === true && this.movementBlocked )
		)
			this.abilityStatus[ i ] = false;
			
	}
	
}

championInstance.prototype.getValue = function( val, ability ) {
	
	if( Object.prototype.toString.call( val ) === '[object Array]' )
		return val[ this.abilityLevels[ ability - 1 ] - 1 ];
	else
		if( typeof val == "string" )
			return val.toLowerCase();
		else
			return val;
	
}

championInstance.prototype.getAbility = function( ability ) {
	
	if( typeof this.form != "undefined" )
		return this.abilityData[ ability ][ form ];
	else
		return this.abilityData[ ability ];
	
}

championInstance.prototype.getDamage = function( arr, id ) {
	
	var amount, val;
	
	if( typeof id == "undefined" )
		amount = arr[ 'amount' ];
	else
		amount = arr[ 'amount' ][ this.abilityLevels[ id  - 1 ] - 1 ];
	
	if( arr[ 'ability scaling' ] ) {
		
		for( var i in arr[ 'ability scaling' ] ) {
			
			switch( arr[ 'ability scaling' ][ i ][ 1 ] ) {
				
				case 'AP':
					val = this.stats.AP;
					break;
				case 'max MP':
					val = this.stats.manaMax;
					break;
				default:
					throw 'Unknown scaling statistic';
					break;
				
			}
			
			amount += val * arr[ 'ability scaling' ][ i ][ 0 ];
			
		}
		
	}
	
	return amount;
	
}

championInstance.prototype.log = function( str ) {
	
	log( str, this.champID );

}

championInstance.prototype.addItem = function( item, slot ) {
	
	if( typeof slot == "undefined" )
		for( var slot in this.items )
			if( this.items[ slot ] === false )
				break;
	
	if( this.items[ slot ] !== false )
		return;
	
	this.items[ slot ] = item;
	if( item.triggers )
		this.trigger.add( item.triggers );
	
	this.updateStats();
	
}

championInstance.prototype.removeItem = function( slot ) {
	
	if( !this.items[ slot ] )
		return;
	
	if( this.items[ slot ].triggers )
		this.trigger.remove( this.items[ slot ].triggers );
	this.items[ slot ] = false;
	
	this.updateStats();
	
}

championInstance.prototype.applyBuff = function( buff ) {
	
	this.log( 'Received ' + ( buff.buff ? '' : 'de' ) + 'buff \'' + buff.name + '\'' );
	
	for( var i in this.buffs )
		if( this.buffs[ i ].id == buff.id ) {
			
			if( this.buffs[ i ].stacks < this.buffs[ i ].stack )
				this.buffs[ i ].stacks ++;
			
			this.buffs[ i ].apply();
			this.updateStats();
			
			return;
		}
	
	
	buff.apply( this );
	this.buffs.push( buff );
	
	this.updateStats();
	
}

championInstance.prototype.removeBuff = function( id ) {
	
	for( var buff in this.buffs )
		if( this.buffs[ buff ].id == id ) {
			
			this.buffs[ buff ].remove();
			this.buffs.splice( buff, 1 );
			
		}
	
	this.updateStats();
	
}

championInstance.prototype.getBuff = function( id ) {
	
	for( var buff in this.buffs )
		if( this.buffs[ buff ].id == id )
			return this.buffs[ buff ]
	
	return false;
	
}

championInstance.prototype.regenMana = function() {
	
	this.scope.manaRegenerated = this.stats.manaRegen / 10;
	this.trigger.event( 'onManaRegen' );
	
	this.receiveMana( this.scope.manaRegenerated );

}

championInstance.prototype.receiveMana = function( amount ) {
	
	this.scope.manaAmount = amount;
	this.trigger.event( 'onManaReceived' );
	
	this.stats.mana += this.scope.manaAmount;
	
	this.updateStats();
	
}

championInstance.prototype.regenHealth = function() {
	
	this.scope.healthRegenerated = this.stats.healthRegen / 10;
	this.trigger.event( 'onHealthRegen' );
	
	this.heal( this.scope.healthRegenerated );
	
}

championInstance.prototype.heal = function( amount ) {
	
	this.scope.healAmount = amount;
	this.trigger.event( 'onHeal' );
	this.statistics.addRecord( 'healthGained', this.scope.healAmount );
	this.stats.health += this.scope.healAmount;
	
	if( this.scope.healAmount > this.stats.healthMax * 0.01 )
		this.log( 'Healed for ' + Math.round( this.scope.healAmount ) + ' points' );
	
	this.updateStats();
	
}

championInstance.prototype.dealDamage = function( damage, source ) {
	
	this.scope.damageDealt = damage;
	this.scope.damageSource = source;
	
	this.trigger.event( 'onDamageDealt' );
	
	this.target.receiveDamage( this.scope.damageDealt, this.scope.damageSource );
	
}

championInstance.prototype.receiveProjectile = function( fun ) {
	
	fun.call( this );
	
}

championInstance.prototype.receiveDamage = function( damage, source ) {
	
	if( typeof source == "undefined" )
		source = false;
	
	this.scope.receivedDamage = damage;
	
	this.scope.receivedAA = false;
	this.scope.receivedSpell = false
	this.scope.allowSpellVamp = false;
	this.scope.allowLifeSteal = false;
	
	if( source !== false ) {
		
		if( source == -1 ) {
			
			this.scope.receivedAA = true;
			this.scope.allowLifeSteal = true;
			
		} else if( source != 4 ) {
			
			this.scope.receivedSpell = source;
			this.scope.allowSpellVamp = true;
			
		}
	}
	
	this.trigger.event( 'onDamageReceived' );
	
	if( this.scope.receivedAA )
		this.trigger.event( 'onAAReceived' );
	
	if( this.scope.receivedSpell )
		this.trigger.event( 'onSpellReceived' );
	
	if( source !== false ) {
		
		this.target.statistics.addDamageRecord( 'damageDealt', this.scope.receivedDamage, source );
		this.target.log( "Dealt " + Math.round( this.scope.receivedDamage.magnitude ) + " " + this.scope.receivedDamage.typeName + " damage" );
		
	}
	
	this.trigger.event( 'onDamageReceivedReductionCalculation' );
	if( this.scope.receivedDamage.typeName == 'physical' ) {
		
		this.scope.effectiveArmor = this.stats.armor;
		if( this.scope.effectiveArmor > 0 ) {
			
			this.scope.effectiveArmor *= 1 - this.target.stats.armorPenPerc;
			this.scope.effectiveArmor -= this.target.stats.armorPenFlat;
			this.scope.effectiveArmor = Math.max( 0, this.scope.effectiveArmor );
			
		}
		
		if( this.scope.effectiveArmor > 0 )
			this.scope.receivedDamage.magnitude *= ( 100 / ( 100 + this.scope.effectiveArmor ) );
		else
			this.scope.receivedDamage.magnitude *= ( 2 - 100 / ( 100 - this.scope.effectiveArmor ) );
		
		this.trigger.event( 'onDamageReceivedPhysicalCalculation' );
		
	} else if( this.scope.receivedDamage.typeName == 'magic' ) {
		
		this.scope.effectiveMR = this.stats.MR;
		if( this.scope.effectiveMR > 0 ) {
			
			this.scope.effectiveMR *= 1 - this.target.stats.magicPenPerc;
			this.scope.effectiveMR -= this.target.stats.magicPenFlat;
			this.scope.effectiveMR = Math.max( 0, this.scope.effectiveMR );
			
		}
		
		if( this.scope.effectiveMR > 0 )
			this.scope.receivedDamage.magnitude *= ( 100 / ( 100 + this.scope.effectiveMR ) );
		else
			this.scope.receivedDamage.magnitude *= ( 2 - 100 / ( 100 - this.scope.effectiveMR ) );
		
		this.trigger.event( 'onDamageReceivedMagicCalculation' );
		
	} else if( this.scope.receivedDamage.typeName == 'true' ) {
		
		this.trigger.event( 'onDamageReceivedTrueCalculation' );
	
	}
	
	this.trigger.event( 'afterDamageReceivedCalculation' );
	
	if( this.scope.allowLifeSteal )
		this.target.heal( this.scope.receivedDamage.magnitude * this.target.stats.lifeSteal );
	else if( this.scope.allowSpellVamp )
		this.target.heal( this.scope.receivedDamage.magnitude * this.target.stats.spellVamp );
	
	if( source !== false ) {
		this.statistics.addDamageRecord( 'damageReceived', this.scope.receivedDamage, source );
		this.log( "Received " + Math.round( this.scope.receivedDamage.magnitude ) + " " + this.scope.receivedDamage.typeName + " damage" );
	}
	
	this.damage( this.scope.receivedDamage.magnitude );
	
	this.updateStats();
	
	
}

championInstance.prototype.damage = function( amount ) {
	
	this.scope.healthCost = amount;
	this.trigger.event( 'onHealthCostCalculation' );
	
	this.stats.health -= this.scope.healthCost;
	this.statistics.addRecord( 'healthLost', this.scope.healthCost );
	
	if( this.stats.health < 0 ) {
		this.dead = true;
		throw ( this.champID == 0 ? 'Blue' : 'Purple' ) + ' side has been slain';
	}
	
}

championInstance.prototype.setCooldown = function( ability, time, newTime ) {
	
	if( newTime )
		this.abilityCooldownUntil[ ability ] = time;
	else {
		if( this.abilityCooldownUntil[ ability ] )
			this.abilityCooldownUntil[ ability ] += time;
		else
			return;
	}
	
	if( this.abilityCooldownTimer[ ability ] )
		clearTimeout( this.abilityCooldownTimer[ ability ] );
	
	this.abilityCooldownTimer[ ability ] = setTimeout( this.champVar + '.updateStats();', Math.max( 0, this.abilityCooldownUntil[ ability ] - new Date().getTime() ) );
	
}

championInstance.prototype.ability = function( id, fields ) {
	
	this.scope.abilityId = id;
	
	if( this.abilities[ id ] === false )
		return false;
	
	this.trigger.event( 'onAbilityCast' );
	
	this.stats.mana -= this.getValue( this.getAbility( id ).cost, id );
	

	
	this.channel( (function() { if( fields ) this.abilities[ id ].call( this, fields ); else this.abilities[ id ].call( this ); }).bind( this ), this.abilityChannel && this.abilityChannel[ id ] ? this.abilityChannel[ id ] : 200, 0, false );
	
	this.abilityCooldown[ id ] = this.getValue( this.getAbility( id ).cooldown ) * 1000 * ( 1 - this.stats.CDR );
	
	this.updateStats();
	
}

championInstance.prototype.performAA = function( forced ) {
	
	if( this.AACooldown !== false )
		return false;
	
	if( this.AAState == 0 ) {
		this.AAForced = typeof forced == "undefined" ? false : forced;
		var channelTime = 300 / this.stats.AS; // wind-up
	} else if( this.AAState == 1 ) {
		var channelTime = 200 / this.stats.AS; // wind-down
		this.AACooldown = 700 / this.stats.AS;
		this.autoAttack();
	} else {
		this.AAState = 0;
		return true;
	}
	
	this.AAState++;
	this.channel( this.performAA.bind( this ), channelTime, 2, false );
	
	return true;
	
}

championInstance.prototype.cancelChannel = function() {
	
	if( this.channelType == 0 )
		return false;
	
	if( this.channelType == 2 )
		this.AAState = 0;
	else if( this.channelCancelFunction )
		var func = this.channelCancelFunction();
	
	this.channelLeft = this.channelCancelFunction = this.channelFunction = this.channelTime = this.channelType = false;
	
	if( func )
		func();
	
	return true;
	
}

championInstance.prototype.channel = function( channelFunction, channelTime, channelType, cancelFunction ) {
	
	this.trigger.event( 'onChannel' );
	
	this.cancelChannel();
	
	this.channelTime = channelTime;
	this.channelLeft = channelTime;
	this.channelType = channelType;
	this.channelFunction = channelFunction;
	this.channelCancelFunction = cancelFunction;
	
}

championInstance.prototype.autoAttack = function() {
	
	if( this.target === false )
		return;
	
	this.scope.AACrit = Math.random() < this.stats.critChance;
	this.trigger.event( 'onAACritChanceCalculation' );
	
	this.scope.AAdamage = this.stats.AD;
	this.trigger.event( 'onAADamageCalculation' );
	
	this.scope.AAbonusDamage = 0;
	this.trigger.event( 'onAABonusCalculation' );
	
	if( this.scope.AACrit ) {
		
		this.scope.AAdamage *= this.stats.critDamage;
		this.trigger.event( 'onAACritDamageCalculation' );
		
	}
	
	this.scope.AAdamage += this.scope.AAbonusDamage;
	this.trigger.event( 'onAATotalDamageCalculation' );
	
	this.dealDamage( new damage( this.scope.AAdamage, 'physical' ), -1 );
	
}