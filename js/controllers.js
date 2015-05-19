simulator.controller( 'resetCtrl', function( $scope, $rootScope, champions, timer ) {
	
	$scope.reset = function() {
		
		$rootScope.$broadcast( 'reset' );
		
		champions.sides[ 0 ] = false;
		$rootScope.$broadcast( 'championSelected', 0 );
		
		champions.sides[ 1 ] = false;
		$rootScope.$broadcast( 'championSelected', 1 );
		
	}
	
} );

simulator.controller( 'abilityLevelCtrl', function( $scope ) {
	
	$scope.ability = 0;
	
	$scope.maxLevel = function( id ) {
		
		if( typeof id == "undefined" )
			id = $scope.ability;
		
		var count = $scope.champion.abilityMaxLevels[ id ] - $scope.champion.abilityMinLevels[ id ];
		
		count = ( count == 5 ? Math.ceil( $scope.champion.championLevel / 2 ) : count == 3 ? Math.floor( ( $scope.champion.championLevel - 1 ) / 5 ) : 0 );
		count += $scope.champion.abilityMinLevels[ id ];
		
		return count;
		
	}
	
	$scope.maxLevelAvailable = function() {
		
		var available = $scope.champion.championLevel - $scope.champion.abilityLevels.reduce( add, 0 );
		
		if( available < 0 )
			for( var i = 0; i < 4; i ++ )
				if( $scope.ability == i )
					continue;
				else
					available += Math.max( 0, $scope.champion.abilityLevels[ i ] - $scope.maxLevel( i ) );
		
		var max = $scope.maxLevel();
		max += $scope.champion.abilityMinLevels[ $scope.ability ];
		
		max = Math.max( Math.min( max, $scope.getLevel() + available ), $scope.champion.abilityMinLevels[ $scope.ability ] );
		
		return max;
		
	}
	
	$scope.getLevel = function() {
		
		return $scope.champion.abilityLevels[ $scope.ability ];
		
	}
	
	$scope.getMaxLevel = function( level ) {
		
		return $scope.champion.abilityMaxLevels[ $scope.ability ];
		
	}
	
	$scope.setLevel = function( level ) {
		
		$scope.champion.abilityLevels[ $scope.ability ] = Math.min( $scope.champion.abilityMaxLevels[ $scope.ability ], Math.max( $scope.champion.abilityMinLevels[ $scope.ability ], level ) );
		
	}
	
} );

simulator.controller( 'champCtrl', function( $scope, $modal, $timeout, $http, champions, items ) {
	
	$scope.abilityConfigFields = false;
	$scope.champion = false;
	$scope.side = false;
	$scope.selected = false;
	$scope.buffData = buffs;
	$scope.buffs = toggleBuffs;
	
	$scope.$on(	'championSelected', function( event, side ) {
		
		if( $scope.side == side ) {
			
			$scope.champion = champions.sides[ side ];
			$scope.selected = $scope.champion !== false;
			
			if( $scope.champion !== false ) {
				
				var promise = $http.get( 'guidesAPI.php?champions=' + $scope.champion.statData.disp_name );

				promise.success( function( data ) {
					
					$scope.champion.guides = data.query.guides[ $scope.champion.statData.disp_name ];
					
				} );
				
			}
			
			$timeout( triggerReplacements, 0 );
			
		}
		
	});
	
	$scope.removeQueue = function( index ) {
		
		$scope.champion.queue.splice( index, 1 );
		
	}
	
	$scope.toggleBuff = function( str ) {
		
		var index = $scope.champion.summonBuffs.indexOf( str );
		if( index == -1 )
			$scope.champion.summonBuffs.push( str );
		else
			$scope.champion.summonBuffs.splice( index, 1 );
			
	
	}
	
	$scope.hasBuff = function( str ) {
		
		return $scope.champion.summonBuffs.indexOf( str ) != -1;
		
	}
	
	$scope.queue = function( index ) {
		
		if( index === 0 )
			return;
		
		var fields = false;
		
		if( index != -1 )
			fields = $scope.champion.abilityConfigs[ index ];
		
		if( fields === false ) {
			$scope.champion.queue.push( { index: index, fields: false } );
			return;
		}
		
		$scope.abilityConfigFields = angular.copy( champion.abilityConfigs[ index ] );
		$scope.selected = new Array( index, $scope.champion );
		
	}
	
	$scope.addQueue = function() {
		
		var fields = new Array();
		
		for( var field in $scope.abilityConfigFields )
			fields[ field.name ] = field.data;
		
		$scope.abilityConfigFields = false;
			
		$scope.selected[ 1 ].queue.push( { index: $scope.selected[ 0 ], fields: fields } );
		
	}
	
	$scope.channelProcess = function() {
		
		var process = $scope.champion.channelLeft / $scope.champion.channelTime;
		
		if( $scope.champion.channelType == 0 )
			process = 1 - process;
		
		return process * 100;
		
	}
	
	$scope.abilitySign = function( index ) {
		
		return 'APQWER'.charAt( index + 1 );
		
	}
	
	$scope.build = function() {
		
		$modal.open( {
			
			templateUrl: 'tmp/champion-build.html',
			controller: 'champBuildCtrl',
			resolve: {
				
				side: function() { return $scope.side; },
				champion: function() { return $scope.champion; }
				
			}
			
		} );
		
	}
	
	$scope.runes = function() {
		
		var inst = $modal.open( {
			
			templateUrl: 'tmp/runes.html',
			controller: 'runesCtrl',
			resolve: {
				
				side: function() { return $scope.side; },
				champion: function() { return $scope.champion; }
				
			}
			
		} );
		
		inst.result.then( function( runes ) {
			
			$scope.champion.applyRuneSet( runes );
			
		} );
		
	}
	
	$scope.load = function() {
		
		$modal.open( {
			
			templateUrl: 'tmp/data-port.html',
			controller: 'dataPortCtrl',
			resolve: {
				
				side: function() { return $scope.side; },
				champion: function() { return $scope.champion; }
				
			}
			
		} );
		
	}
	
	$scope.masteries = function() {
		
		var inst = $modal.open( {
			
			templateUrl: 'tmp/masteries.html',
			controller: 'masteriesCtrl',
			resolve: {
				
				side: function() { return $scope.side; },
				champion: function() { return $scope.champion; }
				
			}
			
		} );
		
		inst.result.then( function( result ) {
			
			$scope.champion.applyMasteries( result[ 1 ], result[ 0 ] );
			
		} );
		
	}
	
} );

simulator.controller( 'simulationCtrl', function( $scope, $modal, $interval, timer, champions, items ) {
	
	$scope.timer = timer;
	$scope.champions = champions.sides;
	$scope.projectiles = projectiles;
	$scope.Math = Math;
	$scope.logs = window[ 'logs' ];
	
	$scope.logSettings = new Array();
	$scope.logSettings[ 'time' ] = true;
	
	$scope.getLogs = function() {
		
		//$scope.champions.
		
	}
	
	$scope.calc = function() {
		
		var records;
		
		for( var champion in $scope.champions ) {
			
			if( $scope.champions[ champion ] === false )
				$scope.DPS[ champion ] = '-';
			else {
				
				records = $scope.champions[ champion ].statistics.getRecords( 'damageDealt' );
				
				if( records.length == 0 )
					$scope.DPS[ champion ] = 0;
				else
					$scope.DPS[ champion ] = Math.round( _.pluck( records, 1 ).reduce( add, 0 ) * 1000 / timer.time );
				
			}
			
		}
		
		if( $scope.lastStep ) {
			
			$scope.currentFPS = ( $scope.timer.steps - $scope.lastStep ) * 2;
			
		}
			
			
		$scope.lastStep = $scope.timer.steps;
		
	}
	
	$scope.reset = function() {
		
		projectiles.length = 0;
		$scope.timer.reset();
		for( var i in $scope.champions )
			if( $scope.champions[ i ] !== false )
				$scope.champions[ i ].restart();
		
		$scope.init();
		
	}
	
	$scope.init = function() {
		
		$scope.DPS = new Array( '-', '-' );
		$scope.lastStep = false;
		$scope.currentFPS = 0;
		window[ 'logs' ].length = 0;
		log( 'Simulation initialized' );
		
	}
	
	$scope.color = function( type ) {
		
		return type == 0 ? 'blue' : ( type == 1 ? 'purple' : 'system' );
		
	}
	
	$scope.toggleTimer = function() {
		
		if( timer.running )
			timer.stop();
		else
			timer.start();
		
	}
	
	$scope.settings = function() {
		
		var modalInst = $modal.open( {
			
			templateUrl: 'tmp/simulation-settings.html',
			controller: 'simulationSettingsCtrl',
			
		} );
		
		modalInst.result.then( function( data ) {
			
			for( var setting in data ) // maintaining references >_>
				settings[ setting ] = data[ setting ];
			
		} );
		
	}
	
	$interval( $scope.calc.bind( $scope ), 500 );
	$scope.$on( 'reset', $scope.reset );
	$scope.init();
	
} );

simulator.controller( 'simulationSettingsCtrl', function( $scope, $modalInstance, $timeout ) {

	$scope.ok = function () {
		
		$modalInstance.close( $scope.settings );
		
	};

	$scope.cancel = function () {
		
		$modalInstance.dismiss('cancel');
	};
	
	$scope.loadSettings = function() {
		
		$scope.settings = new Array();
		for( var setting in settings )
			$scope.settings[ setting ] = settings[ setting ];
		
	}
	
	$scope.loadSettings();
	$timeout( triggerReplacements, 0 );
	
} );

simulator.controller( 'listCtrl', function( $scope, $window, $http, $timeout, champions ) {
	
	$scope.champions = champions;
	
	var promise;
	var list = new Array();
	
	for( var i in championDefinitions )
		list.push( i );
	
	var listStr = list.join( '|' );
	
	promise = $http.get( 'wikiAPI.php?champions=' + listStr );
	
	promise.success( function( data ) {
		
		$scope.championList = new Array();
		var champion;
		
		for( var i in data.query.champions ) {
			
			champion = data.query.champions[ i ];
			$window[ 'championData' ][ champion.championData.disp_name ] = champion;
			$scope.championList.push( { name: champion.championData.disp_name, icon: champion.championData.image } );
			
		}
		
		$scope.listLoaded = true;
		
		$timeout( setSly, 0 );
		
	} );
	
} );

simulator.controller( 'soundCtrl', function( $scope ) {
	
	$scope.toggleSound = function( volume ) {
		
		if( typeof volume == "undefined" )
			$scope.settings[ 'sound' ] = ( $scope.settings[ 'sound' ] + 1 ) % 3;
		else
			$scope.settings[ 'sound' ] = volume;
		
		for( var sound in sounds )
			soundManager.setVolume( sound, $scope.settings[ 'sound' ] * 50 );
		
	}
	
	$scope.settings = settings;

} );

simulator.controller( 'champBuildCtrl', function( $scope, $modalInstance, $modal, side, champion, items ) {
	
	$scope.ok = function () {
		$modalInstance.close();
	};

	$scope.cancel = function () {
		
		$modalInstance.dismiss('cancel');
	};
	
	$scope.select = function( item ) {
		
		$scope.selected = item;
		$scope.builds = new Array();
		$scope.recipe = new Array();
		
		var tmp;
		
		for( var i in item.builds ) {
			tmp = _.findWhere( $scope.items, { 'name': item.builds[ i ] } );
			if( tmp )
				$scope.builds.push( tmp );
		}
		
		for( var i in item.recipe ) {
			tmp = _.findWhere( $scope.items, { 'name': item.recipe[ i ] } );
			if( tmp )
				$scope.recipe.push( tmp );
		}
		
	}
	
	$scope.cost = function() {
		
		var left = _.reject( $scope.champion.items, function( a ) { return a === false; } );
		
		if( left.length == 0 )
			return 0;
		else
			return _.pluck( left, 'buy' ).reduce( add, 0 );
		
	}
	
	$scope.manageBudget = function() {
		
		var modalInst = $modal.open( {
			
			templateUrl: 'tmp/gold-budget.html',
			controller: 'budgetCtrl',
			
		} );
		
		modalInst.result.then( function( budget ) {
			
			$scope.budget = budget;
			
		} );
		
	}
	
	$scope.menu = new Array(
		new Array( 'Consumables', 'Consumables' ),
		new Array( 'Defense', 'Defense', new Array(
			new Array( 'Maximum Health', 'Health' ),
			new Array( 'Armor', 'Armor' ),
			new Array( 'Magic Resistance', 'Magic Resistance|Magic Resist' ),
			new Array( 'Health Regeneration', 'Health Regeneration|Health Regen' ),
			new Array( 'Tenacity', 'onTenacityCalculation', true )
		) ),
		new Array( 'Attack', 'Attack', new Array(
			new Array( 'Damage', 'Damage' ),
			new Array( 'Attack Speed', 'Attack Speed' ),
			new Array( 'Armor Penetration', 'onArmorPenFlatCalculation|onArmorPenPercCalculation', true ),
			new Array( 'Critical Strike Chance', 'Critical Strike' ),
			new Array( 'Critical Strike Dmg.', 'onCritDamageCalculation', true ),
			new Array( 'Life Steal', 'Life Steal' )
		) ),
		new Array( 'Magic', 'Magic', new Array(
			new Array( 'Ability Power', 'Ability Power' ),
			new Array( 'Magic Penetration', 'onMagicPenFlatCalculation|onMagicPenPercCalculation', true ),
			new Array( 'Cooldown Reduction', 'Cooldown Reduction' ),
			new Array( 'Maximum Mana', 'Mana' ),
			new Array( 'Mana Regeneration', 'Mana Regeneration|Mana Regen' ),
			new Array( 'Spell Vamp', 'onSpellVampCalculation', true )
		) )
	);
	
	$scope.side = side;
	$scope.itemTypeFilter = new Array();
	$scope.itemTriggerFilter = new Array();
	$scope.champion = champion;
	$scope.items = items.list;
	$scope.selected = false;
	$scope.budget = 0;
	
} );

simulator.controller( 'budgetCtrl', function( $scope, $modalInstance ) {
	
	$scope.ok = function () {
		$modalInstance.close();
	};

	$scope.cancel = function () {
		
		$modalInstance.dismiss('cancel');
	};
	
	$scope.update = function() {
		
		$scope.time = $scope.seconds + $scope.minutes * 60;
		
		var time = Math.max( 0, $scope.time - $scope.spawnTime );
		
		$scope.goldPassive = $scope.goldGain * Math.floor( time );
		
		$scope.waves = Math.floor( time / $scope.spawnInterval );
		
		
		$scope.minionsKilled = new Array();
		$scope.goldMinions = 0;
		for( var i in $scope.minions ) {
			
			$scope.minionsKilled[ i ] = Math.floor( $scope.minions[ 0 ] * $scope.waves * $scope.percentage / 100 );
			$scope.goldMinions = $scope.minionsKilled[ i ] * 20
			
		}
		
		$scope.total = $scope.goldBase + $scope.goldPassive + $scope.goldMinions ;
		
		
	}
	
	$scope.value = function( type ) {
		
		return $scope.minions[ type ][ 1 ] + Math.floor( $scope.time / $scope.interval ) * $scope.minions[ type ][ 2 ];
		
	}
	
	$scope.minutes = 0;
	$scope.seconds = 0;
	
	$scope.percentage = 80;
	
	$scope.goldBase = 475;
	$scope.goldGain = 1.6;
	
	$scope.spawnTime = 90;
	$scope.spawnInterval = 30;
	
	$scope.minions = new Array(
		// count per wave, base gold per unit, gold increase per interval
		new Array( 3, 20, 0.5 ), // melee
		new Array( 3, 15, 0.5 ), // caster
		new Array( 1/3, 39, 1 )  // cannon
	);
	
	$scope.interval = 90;
	
	
	$scope.update();
	
} );

simulator.controller( 'runesCtrl', function( $scope, $modalInstance, side, champion ) {
	
	$scope.ok = function () {
		
		$modalInstance.close( $scope.runes );
		
	};

	$scope.cancel = function () {
		
		if( !_.isEqual( $scope.runes, $scope.champion.runes ) && !confirm( 'Discard changes and close?' ) )
			return;
		
		$modalInstance.dismiss();
		
	};
	
	$scope.runeStyle = function( rune ) {
		
		if( rune === false )
			return '';
		else
			return 'background-image: url( \'img/runepage/runes/' + rune.image + '.png\' )';
		
	}
	
	$scope.removeRune = function( type, index ) {
		
		if( $scope.runes[ type ][ index ] === false && confirm( 'Reset all ' + new Array( 'marks', 'seals', 'glyphs', 'quintessences' )[ type ] + '?' ) )
			for( var index in $scope.runes[ type ] )
				$scope.runes[ type ][ index ] = false;
		else
			$scope.runes[ type ][ index ] = false;
		
		$scope.update();
		
	}
	
	$scope.loadRunes = function() {
		
		$scope.runes = new Array();
		for( var type in $scope.champion.runes )
			$scope.runes[ type ] = _.clone( $scope.champion.runes[ type ] );
		
		$scope.update();
		
	}
	
	$scope.reset = function() {
		
		var type, index;
		
		for( type in $scope.runes )
			for( index in $scope.runes[ type ] )
				$scope.runes[ type ][ index ] = false;
		
		$scope.update();
		
	}
	
	$scope.addRune = function( rune, count ) {
		
		var type = new Array( 'mark', 'seal', 'glyph', 'quint' ).indexOf( rune.type );
		
		if( typeof count == "undefined" )
			var count = 1;
		
		for( var i = 0; i < count; i ++ )
			for( var index in $scope.runes[ type ] )
				if( $scope.runes[ type ][ index ] === false ) {
					
					$scope.runes[ type ][ index ] = rune;
					soundManager.play( 'rune_add' );
					$scope.update();
					break;
					
				}
		
		
	}
	
	$scope.filteredRunes = function() {
		
		return _.chain( runeDefinitions).where( { tier: $scope.runeFilter.tier, type: $scope.runeFilter.type } ).filter( function( rune ) { for( var i in rune.effects ) if( _.contains( $scope.cats[ $scope.runeFilter.cat ], rune.effects[ i ][ 1 ] ) ) return true; return false; } ).value();
		
	}
	
	$scope.update = function() {
		
		var type, index, effect, stat, stats = new Array(), statList = new Array(), perc, percPrefix = 'percentage ';
		
		for( type in $scope.runes )
			for( index in $scope.runes[ type ] )
				for( effect in $scope.runes[ type ][ index ].effects )
					if( typeof stats[ $scope.runes[ type ][ index ].effects[ effect ][ 1 ] ] == "undefined" )
						stats[ $scope.runes[ type ][ index ].effects[ effect ][ 1 ] ] = $scope.runes[ type ][ index ].effects[ effect ][ 0 ];
					else
						stats[ $scope.runes[ type ][ index ].effects[ effect ][ 1 ] ] += $scope.runes[ type ][ index ].effects[ effect ][ 0 ];
		
		for( stat in stats ) {
		
			perc = stat.substring( 0, percPrefix.length ) == percPrefix;
			statList.push( { val: perc ? ( stats[ stat ] * 100 ).toFixed( 2 ) + '%' : stats[ stat ].toFixed( 2 ), name: perc ? stat.substring( percPrefix.length ) : stat } );
		
		}
		
		$scope.statistics = statList;
		$scope.empty = _.map( $scope.runes, function( type ) { return _.filter( type, function( rune ) { return rune === false; } ).length; } );
		$scope.empty = _.object( new Array( 'mark', 'seal', 'glyph', 'quint' ), $scope.empty );
		
	}
	
	$scope.cats = new Array( 
		
		new Array( "attack damage", "attack damage per level", "percentage attack speed", "percentage critical damage", "percentage critical chance", "armor penetration", "ability power", "ability power per level", "magic penetration" ),
		new Array( "health", "health per level", "armor", "magic resis", "magic resist per level", "health regen / 5 sec", "armor per level", "health regen / 5 sec. per level", "percentage dodge", "percentage increased health", "percentage health" ),
		new Array( "percentage cooldowns", "mana", "mana per level", "mana regen / 5 sec", "percentage cooldowns per level", "mana regen / 5 sec. per level", "percentage movement speed", "percentage time dead", "gold / 10 sec", "percentage experience gained", "energy regen/5 sec", "energy regen/5 sec per level", "energy", "energy/level", "percentage spellvamp", "percentage lifesteal" )
		
	);
	
	$scope.runeDefinitions = runeDefinitions;
	$scope.champion = champion;
	$scope.loadRunes();
	$scope.runeFilter = { tier: 3, type: 'mark', cat: 0 };
	
} );

simulator.controller( 'masteriesCtrl', function( $scope, $modalInstance, side, champion ) {
	
	$scope.ok = function () {
		
		$modalInstance.close( new Array( $scope.masterySeason, $scope.getPoints() ) );
		
	};

	$scope.cancel = function () {
		
		if( !_.isEqual( $scope.getPoints(), $scope.champion.masteries ) && !confirm( 'Discard changes and close?' ) )
			return;
		
		$modalInstance.dismiss();
		
	};
	
	$scope.getPoints = function() {
		
		return _.map( $scope.trees, function( tree ) { return _.pluck( tree, 'points' ); } );
		
	}
	
	$scope.points = function( tree ) {
		
		if( typeof tree == "undefined" )
			return _.reduce( $scope.trees, function( a, b ) { return $scope.treePoints( a ) + $scope.treePoints( b ) }, 0 );
		else
			return $scope.treePoints( tree );
		
	}
	
	$scope.treePoints = function( tree ) {
		
		if( typeof tree == "number" )
			return tree;
		
		if( _.isEmpty( tree ) )
			return 0;
		
		return _.chain( tree ).pluck( 'points' ).reduce( function( a, b ) { return a + b } ).value();
		
	}
	
	$scope.disabled = function( tree, mastery ) {
		
		if( $scope.points() == $scope.maxPoints )
			return true;
		else
			if( $scope.points( tree ) < mastery.required )
				return true;
			else
				if( typeof mastery.link == "undefined" )
					return false;
				else {
					
					var mast = _.where( tree, { name: mastery.link } )[ 0 ];
					if( mast.points == mast.max )
						return false;
					else
						return true;
					
				}
		
	}
	
	$scope.increase = function( tree, mastery ) {
		
		if( !$scope.disabled( tree, mastery ) && mastery.points != mastery.max ) {
			mastery.points ++;
			soundManager.play( 'mastery_add' );
		}
		
	}
	
	$scope.decrease = function( tree, mastery ) {
		
		if( mastery.points == 0 )
			return;
		
		var points = 0, count = new Array(), flag = true, max = 0;
		
		for( var i in tree ) {
			
			if( i == "$$hashKey" )
				continue;
			
			if( tree[ i ].points != 0 ) {
				
				max = Math.max( tree[ i ].required, max );
				
				if( typeof count[ tree[ i ].required ] == "undefined" )
					count[ tree[ i ].required ] = tree[ i ].points;
				else
					count[ tree[ i ].required ] += tree[ i ].points;
				
			}
			
		}
		
		for( i in count ) {
			
			if( i > mastery.required && points == i) {
				
				flag = false;
				break;
				
			}
			
			points += count[ i ];
			
		}
		
		if( flag ) {
			
			mastery.points--;
			soundManager.play( 'mastery_remove' );
			
		}
		
	}
	
	$scope.reset = function( tree ) {
		
		if( typeof tree == "undefined" )
			var list = $scope.trees;
		else
			var list = new Array( $scope.trees[ tree ] );
		
		for( var i in list )
			for( var mastery in list[ i ] )
				list[ i ][ mastery ].points = 0;
		
		soundManager.play( 'mastery_remove' );
		
	}
	
	$scope.loadMasteries = function() {
		
		if( $scope.masterySeason !== $scope.champion.masterySeason )
			$scope.setMasterySeason( $scope.champion.masterySeason );
		
		for( var tree in $scope.trees )
			for( var mastery in $scope.trees[ tree ] )
					$scope.trees[ tree ][ mastery ].points = $scope.champion.masteries[ tree ][ mastery ];
		
	}
	
	$scope.initMasteries = function() {
		
		$scope.trees = angular.copy( masteryDefinitions[ $scope.masterySeason ] );
		_.each( $scope.trees, function( tree ) { _.each( tree, function( mastery ) { mastery.points = 0; } ); } );
		
	}
	
	$scope.setMasterySeason = function( season ) {
		
		$scope.masterySeason = season;
		$scope.initMasteries();
		
	}
	
	$scope.capitalize = function( str ) {
		
		 return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
		
	}
	
	$scope.treeNames = new Array( 'offensive', 'defensive', 'utility' );
	$scope.masterySeasons = new Array( 3, 4 );
	$scope.maxPoints = 30;
	
	
	$scope.champion = champion;
	$scope.side = side;
	$scope.masterySeason = false;
	$scope.loadMasteries();
	
} );

simulator.controller( 'dataPortCtrl', function( $scope, $modalInstance, $http, side, champion ) {
	
	$scope.cancel = function () {
		
		$modalInstance.dismiss('cancel');
		
	};
	
	$scope.loadDataString = function( str ) {
		
		if( str && str.trim() != $scope.dataString ) {
			
			dataPort.importData( $scope.champion, str.trim() );
			$scope.updateDataString();
			alert( 'Build has been succesfully loaded.' );
			
		} else
			alert( 'Please enter a new data string to load.' );
		
	}
	
	$scope.loadGuide = function( guide ) {
		
		var url = $scope.selected.url.replace( '%s', guide.id ), seasons = new Array( 3, 4 );
		
		var promise = $http.get( 'guidesAPI.php?guides=' + url );

		promise.success( function( data ) {
			
			if( data.success == false ) {
				
				alert( 'Unable to load build from selected guide' );
				throw new Error( data.error );
			
			}
			
			$scope.champion.applyMasteries( data.query.builds[ url ].masteries, seasons.indexOf( data.query.builds[ url ].masterySeason ) );
			$scope.champion.applyRunes( data.query.builds[ url ].runes );
			$scope.updateDataString();
			
			alert( 'Build was loaded succesfully' );
			
		} );
		
		promise.error( function() {
			
			alert( 'Unable to load build from selected guide' );
			
		} );
		
	}
	
	$scope.updateDataString = function() {
		
		$scope.dataString = dataPort.exportData( $scope.champion );
		
	}
	
	$scope.selectSite = function( site ) {
		
		$scope.selected = site;
		
	}
	
	$scope.sites = new Array(
		{ name: 'solomid', title: 'Solomid.net', url: 'http://www.solomid.net/guide/view/%s' },
		{ name: 'lolking', title: 'LoLKing', url: 'http://www.lolking.net/guides/%s' }
	);
	
	$scope.selected = $scope.sites[ 0 ];
	$scope.champion = champion;
	$scope.updateDataString();
	$scope.side = side;
	
} );