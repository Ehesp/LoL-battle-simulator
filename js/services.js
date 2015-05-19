simulator.service( 'champions', function( $window, $rootScope ) {
	
	this.sides = new Array( false, false );
	this.blue = false;
	this.purple = false;
	champions = this.sides;
	
	this.set = function( side, champion ) {
		
		var newChamp = new championInstance( champion, side );
		this.sides[ side ] = newChamp;
		
		if( side )
			this.purple = newChamp;
		else
			this.blue = newChamp;
		
		$rootScope.$broadcast( 'championSelected', side );
		
	}
	
} );

simulator.service( 'items', function( $http ) {
	
	this.list = items;
	this.loaded = false;
	
	var promise;
	var list = new Array();
	
	for( var i in itemDefinitions )
		list.push( i );
	
	var listStr = list.join( '|' );
	
	promise = $http.get( 'wikiAPI.php?items=' + listStr );
	
	promise.success( function( data ) {
		
		if( data.success === false )
			throw data.error;
		
		var item, effect, current, menuItem, trigger, effectList;
		
		for( var i in data.query.items ) {
			
			item = data.query.items[ i ];
			
			current = item;
			current.triggers = new Array();
			
			effectList = new Array();
			if( item.effects )
				effectList = effectList.concat( item.effects );
			if( item.unique )
				effectList = effectList.concat( item.unique );
			
			for( effect in effectList ) {
				
				if( typeof effectList[ effect ] == "string" )
					continue;
				
				if( effectList[ effect ].length == 2 ) {
					
					trigger = this.createTrigger( effectList[ effect ][ 1 ], effectList[ effect ][ 0 ] );
					
				} else {
					
					trigger = this.createTrigger( effectList[ effect ][ 2 ], effectList[ effect ][ 1 ] );
					
					if( effectList[ effect ][ 0 ] )
						if( uniqueNamed[ effectList[ effect ][ 0 ] ] )
							trigger[ 1 ] = uniqueNamed[ effectList[ effect ][ 0 ] ];
						else {
							uniqueNamed[ effectList[ effect ][ 0 ] ] = trigger[ 1 ];
							uniqueTriggers.push( trigger[ 1 ] );
						}
					else
						uniqueTriggers.push( trigger[ 1 ] );
					
				}
				
				if( trigger !== false )
					current.triggers.push( trigger );
				
			}
			
			if( itemDefinitions[ current.name ] !== false )
				current.triggers = current.triggers.concat( itemDefinitions[ current.name ] );
			
			items.push( current );
			
		}
		
		this.loaded = true;
		
	} );
	
} );

simulator.service( 'timer', function( $interval, $window, champions ) {
	
	this.init = function() {
		
		window[ 'alarms' ] = new Array();
		this.steps = 0;
		this.time = 0;
		this.realTime = 0;
		this.running = false;
		this.end = false;
		this.timer = false;
		
	}
	
	this.reset = function() {
		
		this.stop();
		this.init();
		
	}
	
	this.stepFunction = function() {
		
		var time = new Date().getTime();
		var realPassed = time - this.lastTime;
		var passed = realPassed * settings[ 'timeScale' ];
		
		this.realTime += realPassed;
		this.time += passed;
		this.steps++;
		
		try {
			
			var left;
			for( var i = 0; i < alarms.length; i++ ) {
				
				if( alarms[ i ].repeat === false ) {
					
					alarms[ i ].interval -= passed;
					if( ! alarms[ i ].interval > 0 ) {
						
						alarms[ i ].func();
						alarms.splice( i, 1 );
						i--;
						
					}
					
				} else {
					
					if( alarms[ i ].repeat === true )
						alarms[ i ].repeat = alarms[ i ].interval;
					
					left = passed;
					do {
						
						alarms[ i ].repeat -= left;
						if( alarms[ i ].repeat <= 0 ) {
							
							left = -alarms[ i ].repeat;
							
							alarms[ i ].func();
							alarms[ i ].repeat = alarms[ i ].interval;
							
						} else
							left = 0;
						
						
					} while( left );
					
				}
					
				
			}
			
			for( var champion in champions.sides )
				champions.sides[ champion ].step( passed, time );
			
			for( var projectile = 0; projectile < projectiles.length; projectile++ )
				if( projectiles[ projectile ].step( passed, time ) ) {
					
					projectiles.splice( projectile, 1 );
					projectile --;
					
				}
			
		} catch( err ) {
			
			this.stop();
			this.end = true;
			if( err instanceof Error )
				log( 'Simulation end: ' + err + ' ' + err.message + ' at line ' + err.lineNumber + ' in ' + err.fileName );
			else
				log( 'Simulation end: ' + err );
			
		}
		
		this.lastTime = time;
		
	}
	
	this.start = function() {
		
		if( this.running )
			return;
		
		if( this.timer ) {
			
			this.lastTime += new Date().getTime();
			this.timer.start();
			
		} else {
			
			this.startingQueue = new Array();
			
			for( champion in champions.sides ) {
				
				champions.sides[ champion ].target = champions.sides[ champion ^ 1 ];
				champions.sides[ champion ].summon();
				
			}
			
			
			this.lastTime = new Date().getTime();
			this.timer = $interval( this.stepFunction.bind( this ), settings[ 'limitFPS' ] ? 1000 / settings[ 'FPS' ] : 0 );
			
		}
		
		this.running = true;
		
	}
	
	this.stop = function() {
		
		if( !this.running )
			return;
		
		this.timer.stop();
		this.running = false;
		this.lastTime = new Date().getTime() - this.lastTime;
		
	}
	
	window[ 'simulationTime' ] = ( function() { return this.time; } ).bind( this );
	this.init();
	
} );