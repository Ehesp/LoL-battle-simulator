var base = {

    _Symbols: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-",
	
    toInt: function( str, radix ) {
		
		var result = 0;
		
		for ( var i = 0; i < str.length; i ++ )
			result = ( result * radix ) + this._Symbols.indexOf( str.charAt( i ) );
		
		return result;
		
    },

    toString: function( N, radix ) {
		
		var result = "", Q = Math.floor( Math.abs( N ) ), R;
		
		while( true ) {
			
			R = Q % radix;
			result = this._Symbols.charAt( R ) + result;
			Q = ( Q - R ) / radix; 
			
			if ( Q == 0 )
				break;
			
		}
		
		return ( N < 0 ) ? "-" + result : result;
		
	}
	
}

var dataPort = {
	
	_DataOrder: new Array( 'Levels', 'Buffs', 'Items', 'Masteries', 'Runes' ),
	
	_ByteSize: 64,
	
	_Error: function( e ) {
		
		this._Reset();
		
		alert( 'The data string is corrupt and cannot be loaded.' );
		throw( e );
		
	},
	
	_Parse: function( radix ) {
		
		if( typeof radix != "number" )
			this._Error( new Error( 'Invalid radix supplied at byte ' + this.pointer + ', bit ' + this.radii.length ) );
		
		var radii, left;
		if( typeof this.current == "undefined" ) {
			
			this.current = base.toInt( this.data.charAt( 0 ), this._ByteSize );
			this.radii = new Array();
			this.pointer = 0;
			
		}
		
		do {
			
			radii = this.radii.reduce( multiply, 1 );
			left = Math.floor( this._ByteSize / radii );
			
			if( left == 1 ) {
				
				if( this.pointer == this.data.length - 1 )
					this._Error( new Error( 'Unexpected EOD while parsing' ) );
				
				if( this.current != 0 )
					this._Error( new Error( 'Oversaturated byte at byte ' + this.pointer ) );
				
				this.current = base.toInt( this.data.charAt( ++this.pointer ), 64 );
				if( this.current < 0 )
					this._Error(  new Error( 'Invalid symbol at byte ' + this.pointer ) );
				
				this.radii.length = 0;
				
			} else
				break;
			
		} while( true )
		
		
		if( left >= radix ) {
			
			var i = this.current % radix;
			this.current = Math.floor( this.current / radix );
			this.radii.push( radix );
			
		} else {
			
			var factor = Math.ceil( radix / left );
			
			var i = this.current * factor;
			this.current = Math.floor( this.current / left );
			this.radii.push( left );
			
			i += this._Parse( factor );
			
		}
		
		// if( arguments.callee != arguments.callee.caller ) console.log( i, radix );
		
		return i;

	},
	
	_Build: function( i, radix ) {
		
		if( typeof radix != "number" || radix < 2 )
			this._Error( new Error( 'Invalid radix supplied at byte ' + this.pointer + ', bit ' + this.radii.length ) );
		
		if( typeof i != "number" )
			this._Error( new Error( 'Invalid integer supplied at byte ' + this.pointer + ', bit ' + this.radii.length ) );
		
		if( i >= radix )
			this._Error( new Error( 'Radix size does not fit supplied integer at byte ' + this.pointer + ', bit ' + this.radii.length ) );
		
		// if( arguments.callee != arguments.callee.caller ) console.log( i, radix );
		
		var radii, left;
		if( typeof this.current == "undefined" )
			this.current = 0;
		
		do {
		
			radii = this.radii.reduce( multiply, 1 );
			left = Math.floor( this._ByteSize / radii );
			
			if( left < 2 ) {
				
				this.data += base.toString( this.current, this._ByteSize );
				this.current = 0;
				this.radii.length = 0;
				
			} else
				break;
			
		} while( true )
		
		
		if( left >= radix ) {
			
			this.current += radii * i;
			this.radii.push( radix );
			
		} else {
			
			var factor = Math.ceil( radix / left );
			
			this.current += radii * Math.floor( i / factor );
			this.radii.push( left );
			
			this._Build( i % factor, factor );
			
		}
		
	},
	
	_Reset: function() {
		
		delete this.data;
		delete this.current;
		delete this.radii;
		
	},
	
	importData: function( champion, str ) {
		
		this.data = str;
		
		var data = new Array();
		for( var item in this._DataOrder )
			data[ this._DataOrder[ item ].toLowerCase() ] = this[ '_Import' + this._DataOrder[ item ] ]();
		
		if( this.data.length - 1 > this.pointer || this.current != 0 )
			this._Error( new Error( 'Unexpected data after parsing' ) );
		
		champion.setChampionLevel( data[ 'levels' ].shift() );
		champion.setAbilityLevels( data[ 'levels' ]	);
		champion.summonBuffs = data[ 'buffs' ];
		champion.applyItems( data[ 'items' ] );
		champion.applyMasteries( data[ 'masteries' ][ 1 ], data[ 'masteries' ][ 0 ] );
		champion.applyRuneSet( data[ 'runes' ] );
		
		this._Reset();
		
		setTimeout( triggerReplacements, 0 );
		
	},
	
	exportData: function( champion ) {
		
		this.data = '';
		this.radii = new Array();
		
		for( var item in this._DataOrder )
			this[ '_Export' + this._DataOrder[ item ] ]( champion );
		
		if( this.radii.length != 0 )
			this.data += base.toString( this.current, 64 );
		
		var data = this.data;
		this._Reset();
		
		return data;
		
	},
	
	_ImportLevels: function() {
		
		// fuck you JS, for not letting me use my beloved array constructor here
		var arr = [ this._Parse( 18 ) + 1 ];
		
		for( var i = 0; i < 4; i ++ )
			arr.push( this._Parse( 6 ) );
		
		return arr;
		
	},
	
	_ImportBuffs: function() {
		
		var summonBuffs = new Array();
		
		for( var i in toggleBuffs )
			if( this._Parse( 2 ) == 1 )
				summonBuffs.push( toggleBuffs[ i ] );
		
		return summonBuffs;
		
	},
	
	_ImportMasteries: function() {
		
		var masteries = new Array( new Array(), new Array(), new Array() );
		var mastery, pointer = 0, total = 0, all = 0, season = this._Parse( 2 );
		
		while( true ) {
			
			if( masteryDefinitions[ season ][ pointer ].length == masteries[ pointer ].length ) {
				
				if( pointer == masteries.length - 1 )
					break;
				
				pointer ++;
				total = 0;
				continue;
				
			}
			
			mastery = masteryDefinitions[ season ][ pointer ][ masteries[ pointer ].length ];
			
			if( mastery.required > total || all == 30 )
				i = 0;
			else
				i = this._Parse( mastery.max + 1 );
			
			masteries[ pointer ].push( i );
			total += i;
			all += i
			
		}
		
		return new Array( season, masteries );
		
	},
	
	_ImportItems: function() {
		
		
		var current, itemList = new Array();
		
		for( var i = 0; i < 6; i ++ ) {
			
			current = this._Parse( 70 );
			
			if( current == 0 )
				itemList.push( false );
			else {
				if( items[ current - 1 ] )
					itemList.push( items[ current - 1 ] );
				else
					this._Error( new Error( 'Invalid item ID' ) );
			}
			
		}
		
		return itemList;
		
	},
	
	_ImportRunes: function() {
		
		var i, type = 0, total = 0, count, counts = new Array( 9, 9, 9, 3 ), rune, runes = new Array( new Array(), new Array(), new Array(), new Array() );
		
		var runeTypes = new Array(
			_.where( runeDefinitions, { type: 'mark' } ),
			_.where( runeDefinitions, { type: 'seal' } ),
			_.where( runeDefinitions, { type: 'glyph' } ),
			_.where( runeDefinitions, { type: 'quint' } )
		);
		
		while( type < 4 ) {
			
			count = this._Parse( counts[ type ] ) + 1;
			rune = this._Parse( runeTypes[ type ].length + 1 );
			
			if( rune == 0 )
				rune = false;
			else
				rune = runeTypes[ type ][ rune - 1 ];
			
			for( i = 0; i < count; i ++ )
				runes[ type ].push( rune );
			
			total += count;
			
			if( total == counts[ type ] ) {
				
				total = 0;
				type ++;
				
			}
			
		}
		
		return runes;
		
	},
	
	_ExportRunes: function( champion ) {
		
		var type, index, count, counts = new Array( 9, 9, 9, 3 ), current, currentCount;
		
		var runeTypes = new Array(
			_.where( runeDefinitions, { type: 'mark' } ),
			_.where( runeDefinitions, { type: 'seal' } ),
			_.where( runeDefinitions, { type: 'glyph' } ),
			_.where( runeDefinitions, { type: 'quint' } )
		);
		
		for( type in champion.runes ) {
			
			count = 0;
			current = champion.runes[ type ][ 0 ];
			currentCount = 0;
			
			for( index in champion.runes[ type ] ) {
				
				if( champion.runes[ type ][ index ] == current )
					currentCount ++;
				else {
					
					this._Build( currentCount - 1, counts[ type ] );
					this._Build( current === false ? 0 : runeTypes[ type ].indexOf( current ) + 1, runeTypes[ type ].length + 1 );
					
					current = champion.runes[ type ][ index ];
					currentCount = 1;
					
				}
				
			}
			
			this._Build( currentCount - 1, counts[ type ] );
			this._Build( current === false ? 0 : runeTypes[ type ].indexOf( current ) + 1, runeTypes[ type ].length + 1 );			
			
		}
		
	},
	
	_ExportBuffs: function( champion ) {
		
		for( var i in toggleBuffs )
			this._Build( +( champion.summonBuffs.indexOf( toggleBuffs[ i ] ) != -1 ), 2 );
		
	},

	_ExportMasteries: function( champion ) {
		
		var tree, mastery, total, all = 0;
		
		this._Build( champion.masterySeason, 2 );
		
		for( tree in champion.masteries ) {
			
			total = 0;
			
			for( mastery in champion.masteries[ tree ] )
				if( total >= masteryDefinitions[ champion.masterySeason ][ tree ][ mastery ].required && all < 30 ) {
					
					this._Build( champion.masteries[ tree ][ mastery ], masteryDefinitions[ champion.masterySeason ][ tree ][ mastery ].max + 1 );
					total += champion.masteries[ tree ][ mastery ];
					all += champion.masteries[ tree ][ mastery ];
					
				}
		
		}
		
	},
	
	_ExportItems: function( champion ) {
		
		for( var item in champion.items ) {
			
			if( champion.items[ item ] === false )
				this._Build( 0, 70 );
			else
				this._Build( items.indexOf( champion.items[ item ] ) + 1, 70 );
			
		}
		
	},
	
	_ExportLevels: function( champion ) {
		
		this._Build( champion.championLevel - 1, 18 );
		for( var i in champion.abilityLevels )
			this._Build( champion.abilityLevels[ i ], 6 );
		
	}
	
	
	
}