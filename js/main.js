"use strict";

var simulator = angular.module( 'simulator', [ 'interval', 'ui.bootstrap' ] );

var champions = new Array();
var championDefinitions = new Array();
var championData = new Array();
var buffs = new Array();
var items = new Array();
var itemDefinitions = new Array();
var itemEffects = new Array();
var projectiles = new Array();
var projectileDefinitions = new Array();
var logs = new Array();

var toggleBuffs = new Array( 'baron_buff', 'blue_buff', 'red_buff' );

var settings = new Array();
settings[ 'limitFPS' ] = true;
settings[ 'FPS' ] = 30;
settings[ 'timeScale' ] = 1;
settings[ 'sound' ] = 0;

var alarms = new Array();

var uniqueTriggers = new Array();
var uniqueNamed = new Array();

var CC = new Array( 'airborne', 'forced', 'stun', 'suppression', 'blind', 'entangle', 'pacify', 'silence', 'slow', 'snare' )
var disruptionCC = new Array( 'airborne', 'forced', 'pacify', 'silence', 'stun', 'suppression' );
var abilityBlockCC = disruptionCC.concat( 'entangle' );
var immobilityCC = new Array( 'airborne', 'forced', 'stun', 'suppression', 'snare', 'entangle' );
var AABlockCC = new Array( 'airborne', 'forced', 'stun', 'suppression', 'pacify', 'entangle' );

var damageTypes = new Array( 'physical', 'magic', 'true' );

var sounds = new Array();
sounds[ 'rune_add' ] = 'air_event_runedrop_1.mp3';
sounds[ 'mastery_add' ] = 'masteries_sfx_addpoint.mp3';
sounds[ 'mastery_remove' ] = 'masteries_sfx_removepoint.mp3';

soundManager.setup( {
	
	url: 'swf/',
	
	debugMode: false,
	
	onready: function() {
		
		for( var sound in sounds )
			soundManager.createSound( { id: sound, url: 'snd/' + sounds[ sound ], volume: 0 } );
		
	}
	
} );

window.onload = function() {
	
	var effect, i;
	for( i in runeDefinitions ) {
		
		runeDefinitions[ i ].triggers = new Array();
		for( effect in runeDefinitions[ i ].effects )
			runeDefinitions[ i ].triggers.push( createTrigger( runeDefinitions[ i ].effects[ effect ] ) );
		
	}
	
}

function log( str, type ) {
	
	logs.push( new Array( simulationTime(), typeof type == "undefined" ? 2 : type, str ) );
	
}

function createTrigger( stat, val ) {
	
	if( typeof val == "undefined" ) {
		
		val = stat[ 0 ];
		stat = stat[ 1 ];
		
	}
	
	switch( stat ) {
		
		case 'attack damage':
			return new Array( 'onADCalculation', ( function( value ) { return function() { this.stats.AD += value; } } )( val ) );
					
		case 'attack damage per level':
			return new Array( 'onADCalculation', ( function( value ) { return function() { this.stats.AD += value * this.championLevel; } } )( val ) );
			
		case 'armor penetration':
				return new Array( 'onArmorPenFlatCalculation', ( function( value ) { return function() { this.stats.armorPenFlat += value; } } )( val ) );
		
		case 'percentage armor penetration':
				return new Array( 'onArmorPenPercCalculation', ( function( value ) { return function() { this.stats.armorPenPerc = mul( this.stats.armorPenPerc, value ); } } )( val ) );
		
		case 'magic penetration':
				return new Array( 'onMagicPenFlatCalculation', ( function( value ) { return function() { this.stats.magicPenFlat += value; } } )( val ) );
		
		case 'percentage magic penetration':
				return new Array( 'onMagicPenPercCalculation', ( function( value ) { return function() { this.stats.magicPenPerc = mul( this.stats.magicPenPerc, value ); } } )( val ) );
		
		case 'ability power':
				return new Array( 'onAPCalculation', ( function( value ) { return function() { this.stats.AP += value; } } )( val ) );
		
		case 'percentage ability power':
				return new Array( 'onAPPercCalculation', ( function( value ) { return function() { this.stats.AP *= 1 + value; } } )( val ) );
		
		case 'ability power per level':
			return new Array( 'onAPCalculation', ( function( value ) { return function() { this.stats.AP += value * this.championLevel; } } )( val ) );
			
		case 'percentage cooldown reduction':
		case 'cooldown reduction':
		case 'percentage cooldowns':
			return new Array( 'onCDRCalculation', ( function( value ) { return function() { this.stats.CDR += value; } } )( val ) );
		
		case 'percentage cooldowns per level':
			return new Array( 'onCDRCalculation', ( function( value ) { return function() { this.stats.CDR += value * this.championLevel; } } )( val ) );
			
		case 'armor':
			return new Array( 'onArmorCalculation', ( function( value ) { return function() { this.stats.armor += value; } } )( val ) );
			
		case 'armor per level':
			return new Array( 'onArmorCalculation', ( function( value ) { return function() { this.stats.armor += value * this.championLevel; } } )( val ) );
			
		case 'magic resistance':
		case 'magic resist':
		case 'magic resis':
			return new Array( 'onMRCalculation', ( function( value ) { return function() { this.stats.MR += value; } } )( val ) );
			
		case 'magic resist per level':
			return new Array( 'onMRCalculation', ( function( value ) { return function() { this.stats.MR += value * this.championLevel; } } )( val ) );
			
		case 'percentage spell vamp':
		case 'spell vamp':
		case 'percentage spellvamp':
			return new Array( 'onSpellVampCalculation', ( function( value ) { return function() { this.stats.spellVamp += value; } } )( val ) );
			
		case 'percentage lifesteal':
		case 'life steal':
		case 'percentage life steal':
			return new Array( 'onLifeStealCalculation', ( function( value ) { return function() { this.stats.lifeSteal += value; } } )( val ) );
			
		case 'percentage critical strike chance':
		case 'critical strike chance':
		case 'percentage critical chance':
		case 'critical chance':
			return new Array( 'onCritChanceCalculation', ( function( value ) { return function() { this.stats.critChance += value; } } )( val ) );
				
		case 'critical strike damage':
		case 'percentage critical damage':
		case 'critical damage':
			return new Array( 'onCritDamageCalculation', ( function( value ) { return function() { this.stats.critDamage += value; } } )( val ) );
			
		case 'attack speed':
		case 'percentage attack speed':
			return new Array( 'onASCalculation', ( function( value ) { return function() { this.stats.AS *= ( 1 + value ); } } )( val ) );
			
		case 'health regen per 5 seconds':
		case 'health regen / 5 sec':
		case 'health regeneration':
			return new Array( 'onHealthRegenCalculation', ( function( value ) { return function() { this.stats.healthRegen += value; } } )( val ) );
			
		case 'health regen / 5 sec. per level':
			return new Array( 'onHealthRegenCalculation', ( function( value ) { return function() { this.stats.healthRegen += value; } } )( val ) );
			
		case 'mana regen per 5 seconds':
		case 'mana regen / 5 sec':
		case 'mana regeneration':
		case 'energy regen/5 sec':
			return new Array( 'onManaRegenCalculation', ( function( value ) { return function() { this.stats.manaRegen += value; } } )( val ) );
		
		case 'mana regen / 5 sec. per level':
		case 'energy regen/5 sec per level':
			return new Array( 'onManaRegenCalculation', ( function( value ) { return function() { this.stats.manaRegen += value * this.championLevel; } } )( val ) );
		
		case 'health':
			return new Array( 'onMaxHealthCalculation', ( function( value ) { return function() { this.stats.healthMax += value; } } )( val ) );
		
		case 'percentage increased health':
		case 'percentage health':
			return new Array( 'onMaxHealthPercCalculation', ( function( value ) { return function() { this.stats.healthMax *= 1 + value / 100; } } )( val ) );
		
		case 'health per level':
			return new Array( 'onMaxHealthCalculation', ( function( value ) { return function() { this.stats.healthMax += value * this.championLevel; } } )( val ) );
			
		case 'mana':
		case 'energy':
			return new Array( 'onMaxManaCalculation', ( function( value ) { return function() { this.stats.manaMax += value; } } )( val ) );
				
		case 'mana per level':
		case 'energy/level':
			return new Array( 'onMaxManaCalculation', ( function( value ) { return function() { this.stats.manaMax += value * this.championLevel; } } )( val ) );
			
		case 'movement speed':
				return new Array( 'onMSCalculation', ( function( value ) { return function() { this.stats.MS += value; } } )( val ) );
			
		case 'percentage movement speed':
				return new Array( 'onMSPercCalculation', ( function( value ) { return function() { this.stats.MS *= 1 + value; } } )( val ) );
		
		case 'percentage dodge':
			return false;
		
		case 'percentage time dead':
			return false;
		
		case 'percentage experience gained':
			return false;
		
		case 'gold every 10 seconds':
		case 'additional gold every 10 seconds':
		case 'gold / 10 sec':
		case 'gold generation':
			return false;
		
		default:
			throw 'Unknown item effect \'' + stat + '\' ';
			
	}
	
}

function addUnique( triggers ) {
	
	uniqueTriggers.push( triggers[ 1 ] );
	
}

function getChecked( obj ) {
	
	var checked = [];
	for(var key in obj) if(obj[key]) checked.push(key);
	return checked
	
}

function createAlarm( func, interval, repeat ) {
	
	var alarm = { func: func, interval: interval, repeat: typeof repeat == "undefined" ? false : repeat };
	alarms.push( alarm );
	
	return alarm;
	
}

function removeAlarm( alarm ) {
	
	alarms.splice( alarms.indexOf( alarm ), 1 );
	
}

function stopSimulation() {
	
	throw "Simulation end"
	
}

function setGraphSettings() {
	
	var form = document.getElementById( 'graphSettings' );
	for( var i = 0; i < form.elements.length; i++ )
		if( form.elements[ i ].onclick )
			form.elements[ i ].onclick();
	
}

function buildGraphSettings() {
	
	var damageOptions = new Array( 'merge', 'physical', 'magical', 'true' );
	var damageStats = new Array( 'damageDealt', 'damageReceived' );
	
	var option, ability;
	
	var graphSettings = new Array();
	graphSettings[ 'healthGained' ] = false;
	graphSettings[ 'healthLost' ] = false;
	
	for( var stat in damageStats ) {
	
		graphSettings[ damageStats[ stat ] ] = new Array();
		graphSettings[ damageStats[ stat ] ][ 'merge' ] = false;
		
		graphSettings[ damageStats[ stat ] ][ 'AA' ] = new Array();
		for( option in damageOptions )
			graphSettings[ damageStats[ stat ] ][ 'AA' ][ damageOptions[ option ] ] = false;
			
		graphSettings[ damageStats[ stat ] ][ 'abilities' ] = new Array();
		graphSettings[ damageStats[ stat ] ][ 'abilities' ][ 'merge' ] = false;
		for( ability = 0; ability < 5; ability ++ ) {
			graphSettings[ damageStats[ stat ] ][ 'abilities' ][ ability ] = new Array();
			for( option in damageOptions )
				graphSettings[ damageStats[ stat ] ][ 'abilities' ][ ability ][ damageOptions[ option ] ] = false;
		}
		
	}
	
	return graphSettings;
	
}

function getGraphSettings() {
	
	settings[ 'graph' ] = new Array();
	settings[ 'graphTimeScale' ] = document.getElementById( 'graph_timeScale' );
	
	for( var champion in champions )
		settings[ 'graph' ][ champion ] = fillGraphSettings( 'champion_' + champion + '_graph_', buildGraphSettings() );
	
}

function fillGraphSettings( graphVar, graphSettings ) {
	
	var flag = false;
	
	for( var setting in graphSettings ) {
		
		if( Object.prototype.toString.call( graphSettings[ setting ] ) === '[object Array]' )
			
			if( document.getElementById( graphVar + setting ).checked )
				graphSettings[ setting ] = fillGraphSettings( graphVar + setting + '_', graphSettings[ setting ] );
			else
				graphSettings[ setting ] = false
			
		else
			graphSettings[ setting ] = document.getElementById( graphVar + setting ).checked;
		
		flag |= graphSettings[ setting ];
		
	}
	
	if( flag )
		return graphSettings;
			
	return false
	
}

function retrieveStatistics() {
	
	var champion, graphSettingsStat, stat, entry, side;
	var statistics = new Array();
	var statNames = new Array();
	var damageType;
	statNames[ 'damageReceived' ] = 'damage suffered';
	statNames[ 'damageDealt' ] = 'raw damage dealt';
	statNames[ 'healthLost' ] = 'health lost';
	statNames[ 'healthGained' ] = 'health gained';
	
	
	for( champion in champions ) {
		
		if( settings[ 'graph' ][ champion ] === false )
			continue;
		
		side = champion == 0 ? 'Blue' : 'Purple';
		graphSettings = settings[ 'graph' ][ champion ];
		
		for( graphSettingsStat in graphSettings ) {
			
			setting = graphSettings[ graphSettingsStat ];
			
			if( setting === false )
				continue;
			
			stat = champions[ champion ].stats[ graphSettingsStat ];
			
			if( graphSettingsStat == 'damageDealt' || graphSettingsStat == 'damageReceived' ) {
				
			} else {
				
				statistics[ side + ' ' + statNames[ graphSettingsStat ] ] = new Array();
				for( entry in stat )
					statistics[ side + ' ' + statNames[ graphSettingsStat ] ].push( new Array( stat[ entry ][ 0 ] - simulationStart, stat[ entry ][ 1 ] ) );
				
			}
		}
	}
	
	return statistics;
}
 
function generateGraph() {
	
	getGraphSettings();
	var statistics = retrieveStatistics();
	var graphArray = new Array();
	var row = new Array();
	var value, entry;
	
	row.push( 'Time' );
	for( var statistic in statistics )
		row.push( statistic );
	
	graphArray.push( row );
	
	for( var time = 0; time < simulationTime; time += settings[ 'graphTimeScale' ] ) {
		
		row = new Array();
		row.push( Math.min( time + settings[ 'graphTimeScale' ], simulationTime ) );
		
		for( statistic in statistics ) {
			value = 0;
			for( entry in statistics[ statistic ] )
				if( statistics[ statistic ][ entry ][ 0 ] < ( time + settings[ 'graphTimeScale' ] ) )
					value += statistics[ statistic ].splice( entry, 1 )[ 0 ][ 1 ];
		
			row.push( value );
		}
		
		graphArray.push( row );
		
	}
	
	var chart = new google.visualization.LineChart( document.getElementById( 'graph' ) );
	chart.draw( google.visualization.arrayToDataTable( graphArray ), { title: 'Statistics' } );
	
}

// As specified in ECMA-262, 5th edition. For browsers that may be homosexual.
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}