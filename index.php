<!DOCTYPE html>
<html data-ng-app="simulator">
<head>
	
	<meta charset="UTF-8"/>
	
	<title>LoL Battle Simulator</title>
	<link rel="icon" type="image/png" href="img/favicon.png">
	
	<!-- Style Sheets -->
	
	<link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
	<link rel="stylesheet" href="css/font-awesome.min.css">
	<!--[if IE 7]>
		<link rel="stylesheet" href="css/font-awesome-ie7.min.css">
	<![endif]-->
	
	<link href="css/custom.css" rel="stylesheet" media="screen">
	
	<!-- Scripts -->
	<script type="text/javascript" src="http://code.angularjs.org/1.2.0-rc.2/angular.min.js" ></script>
	<script type="text/javascript" src="js/interval.js" ></script>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.0/jquery-ui.min.js"></script>
	<script type="text/javascript" src="http://angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.6.0.min.js"></script>
	<script type="text/javascript" src="js/soundmanager2-jsmin.js"></script>
	<script type="text/javascript" src="js/bootstrap-slider.js"></script>
	<script type="text/javascript" src="js/sly.min.js"></script>
	<script type="text/javascript" src="js/jquery.qtip.min.js"></script>
	<script type="text/javascript" src="js/underscore.min.js"></script>
	<script type="text/javascript" src="https://www.google.com/jsapi" ></script>
	<script type="text/javascript">
		
		google.load( 'visualization', '1', { packages: [ 'corechart' ] } );
		
	</script>
	
	<script type="text/javascript" src="js/math.js" ></script>
	<script type="text/javascript" src="js/main.js" ></script>
	<script type="text/javascript" src="js/misc.js" ></script>
	<script type="text/javascript" src="js/custom.js"></script>
	<script type="text/javascript" src="js/export.js"></script>
	
	<script type="text/javascript" src="js/champion.class.js" ></script>
	<script type="text/javascript" src="js/buff.class.js" ></script>
	<script type="text/javascript" src="js/statistics.class.js" ></script>
	<script type="text/javascript" src="js/triggerHandler.class.js" ></script>
	<script type="text/javascript" src="js/projectile.class.js" ></script>
	
	<script type="text/javascript" src="js/triggers.js" ></script>
	<script type="text/javascript" src="js/projectiles.js" ></script>
	<script type="text/javascript" src="js/items.js" ></script>
	<script type="text/javascript" src="js/buffs.js" ></script>
	<script type="text/javascript" src="js/masteries.js" ></script>
	<script type="text/javascript" src="js/auto/runes.js" ></script>
	
	<script type="text/javascript" src="js/champions/ryze.js" ></script>
	<script type="text/javascript" src="js/champions/vayne.js" ></script>
	
	<script type="text/javascript" src="js/controllers.js" ></script>
	<script type="text/javascript" src="js/services.js" ></script>
	<script type="text/javascript" src="js/directives.js" ></script>
	<script type="text/javascript" src="js/filters.js" ></script>
	
	<script type="text/ng-template" src="tmp/ability-levels.html"></script>
	<script type="text/ng-template" src="tmp/champion-build.html"></script>
	<script type="text/ng-template" src="tmp/simulation-settings.html"></script>
	<script type="text/ng-template" src="tmp/masteries.html"></script>
	<script type="text/ng-template" src="tmp/runes.html"></script>
	<script type="text/ng-template" src="tmp/data-port.html"></script>
	
	<!-- Temp Champ List CSS -->
	<style type="text/css">
		
		.animate-repeat.ng-enter,
		.animate-repeat.ng-leave,
		.animate-repeat.ng-move {
			
			-webkit-transition:all linear 0.5s;
			-moz-transition:all linear 0.5s;
			-o-transition:all linear 0.5s;
			transition:all linear 0.5s;

		}
		 
		.animate-repeat.ng-enter {
			
			opacity:0;
			
		}
		
		.animate-repeat.ng-leave.ng-leave-active {
			
			opacity:0;
			
		}
		
		.animate-repeat.ng-enter.ng-enter-active {
			
			opacity:1;
			
		}
		
		.animate-repeat.ng-leave {
			
			opacity:1;
			
		}
		
		.my-repeat-animation.ng-move {
			
			
			
		}
		.my-repeat-animation.ng-move.ng-move-active {
			
			
			
		}

		
	</style>
</head>
<body>
	<div id="wrap" class="ng-cloak" data-ng-cloak>
		<header>
			<div id="header-content">
				<a href="index.php">
					<img id="logo" class="block" src="img/logo.png" alt="Logo" />
				</a>
				<div id="steps">
					<div class="step">
						<i class="step-icons icon-collapse icon-light"></i>
						<span>Select your champions!</span>
					</div>
					<div class="step">
						<i class="step-icons icon-cogs icon-light"></i>
						<span>Customise your builds!</span>
					</div>
					<div class="step">
						<i class="step-icons icon-bolt icon-light"></i>
						<span>Battle your champions!</span>
					</div>
					<div class="clearfix"></div>
				</div>
			</div>
		</header>	
		<section id="champion-select">
			<div class="bcenter custom-border full-width" data-ng-controller="listCtrl">
				<div id="search">
					<div class="input-group displayfloat">
						<input type="text" class="form-control" placeholder="Filter champions" data-ng-model="championFilter.name">
					</div>
					<div class="scrollbar displayfloat">
						<div class="handle">
							<div class="mousearea"></div>
						</div>
					</div>
					<div class="btn-toolbar displayfloatright">
						<button data-ng-controller="resetCtrl" data-ng-click="reset()" type="button" rel="tooltip" class="btn btn-default" data-toggle="tooltip" data-placement="top" title="" tooltip="Reset">
							<i class="icon-retweet"></i>
						</button>
					</div>
				</div>
				<div class="clearfix"></div>
				<div id="frame" class="frame">
					<ul class="slide">
						<li data-ng-repeat="champion in championList | filter:championFilter track by $index">
							<div class="hover_block block_sides">
								<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" width="100" height="100" alt="{{champion.name}}" data-ng-src="{{champion.icon}}" />
								<div class="bottom_left" data-champion="{{champion.name}}" data-side="blue" data-ng-click="champions.set( 0, champion.name );"></div>
								<div class="top_right" data-champion="{{champion.name}}" data-side="purple" data-ng-click="champions.set( 1, champion.name );"></div>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="arrow_box"></div>
		</section><!-- End Champion Select Section -->
		<section id="battle-area">
			<div class="bcenter full-width">
			
				<!--
					*** 				 	***
					***		Blue Champion	***
					***						***
				<!--							-->
				
				<div data-ng-controller="champCtrl" data-ng-init="side = 0" data-ng-switch on="selected">
					<div id="blue-champion" class="tleft champion-area displayfloat" data-ng-switch-when="true">
						<h2 class="blue-text">{{champion.statData.disp_name}}</h2>
						<div class="champion-stats">
							<div class="champion-avatar displayfloat">
								<img class="img-thumbnail" data-ng-class="{ 'champion-low': champion.dead === false && ( champion.stats.health < champion.stats.healthMax * 0.1 || champion.stats.health < 100 ) }" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" data-ng-src="{{champion.statData.image}}" alt="{{champion.statData.disp_name}}" />
								<div class="dead-overlay" data-ng-class="{ 'champion-dead': champion.dead }"></div>
							</div>
							<div class="champion-statistics displayfloat">
								<div class="progress progress-striped active" data-placement="top" title="" data-tooltip="Attack Power: {{champion.statData.attack}}" title="">
									<div class="progress-bar progress-bar-danger"  role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" style="width: {{champion.statData.attack*10}}%"></div>
								</div>
								<div class="progress progress-striped active" data-placement="top" title="" data-tooltip="Defense Power: {{champion.statData.health}}">
									<div class="progress-bar progress-bar-success"  role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: {{champion.statData.health*10}}%"></div>
								</div>
								<div class="progress progress-striped active" data-placement="top" title="" data-tooltip="Ability Power: {{champion.statData.spells}}">
									<div class="progress-bar progress-bar-info"  role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: {{champion.statData.spells*10}}%"></div>
								</div>
								<div class="progress progress-striped active" data-placement="top" title="" data-tooltip="Difficulty: {{champion.statData.difficulty}}">
									<div class="progress-bar progress-bar-difficulty"  role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: {{champion.statData.difficulty*10}}%"></div>
								</div>
							</div>
						</div>
						<div class="clearfix"></div>
						<div class="champion-level">
							<input class="champion-level" rel="slider" type="text" data-ng-model="champion.championLevel" data-slider-min="1" data-slider-max="18" data-slider-step="1" data-slider-value="1" data-slider-orientation="horizontal" data-slider-selection="before" data-slider-tooltip="show" data-selector="#blue-champion">
						</div>
						<div class="clearfix"></div>
						<div class="champion-queue">
							<div class="auto-attack displayfloattable" data-placement="top" data-ng-click="queue( -1 )" title="" data-tooltip="Auto Attack">
								<img src="img/autoattack.png" alt="Auto Attack" class="img-thumbnail" />
							</div>
							<div class="input-group queue-holder" data-placement="top" title="" data-tooltip="Ability Queue">
								<span class="input-group-addon">
									<i class="glyphicon glyphicon-arrow-right"></i>
								</span>
								<div data-ng-show="champion.channelLeft !== false && ( champion.channelType == 0 || champion.channelType == 1 )" style="background-color: lightblue; width: {{channelProcess()}}%; height: 100%; position: absolute;"></div>
								<div class="queue no-highlight">
									<span class="no-highlight" ng-repeat="item in champion.queue track by $index" data-ng-click="removeQueue( $index )">{{ abilitySign( item.index ) }}</span>
								</div>
								<span class="clear" data-ng-click="champion.queue.length = 0"></span>
							</div>
						</div>
						<div class="clearfix"></div>
						<div class="champion-skills">
							<div class="skill skill-passive displayfloat">
								<div class="skill-key"></div>
								<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" data-ng-src="{{champion.abilityData[ 0 ].icon}}" width="50" height="50" alt="" />
								<button type="button" class="btn btn-default">
									<i class="icon-cog"></i>
								</button>			
							</div>
							<div class="skill displayfloat">
								<div class="skill-key"></div>
								<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" data-ng-src="{{champion.abilityData[ 1 ].icon}}" data-ng-click="queue( 1 )" width="50" height="50" alt="" />
								
								<button type="button" class="btn btn-default cst-tt">
									<i class="icon-cog"></i>
								</button>
								<div class="cst-tt-content">Something</div>
								<div class="skill-level skill-normal tcenter" data-ng-include="'tmp/ability-levels.html'" data-ng-controller="abilityLevelCtrl" data-ng-init="ability = 0"></div>
							</div>
							<div class="skill displayfloat">
								<div class="skill-key"></div>
								<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" data-ng-src="{{champion.abilityData[ 2 ].icon}}" data-ng-click="queue( 2 )" width="50" height="50" alt="" />
								<button type="button" class="btn btn-default">
									<i class="icon-cog"></i>
								</button>
								<div class="skill-level skill-normal tcenter" data-ng-include="'tmp/ability-levels.html'" data-ng-controller="abilityLevelCtrl" data-ng-init="ability = 1"></div>
							</div>
							<div class="skill displayfloat">
								<div class="skill-key"></div>
								<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" data-ng-src="{{champion.abilityData[ 3 ].icon}}" data-ng-click="queue( 3 )" width="50" height="50" alt="" />
								<button type="button" class="btn btn-default">
									<i class="icon-cog"></i>
								</button>
								<div class="skill-level skill-normal tcenter" data-ng-include="'tmp/ability-levels.html'" data-ng-controller="abilityLevelCtrl" data-ng-init="ability = 2"></div>
							</div>
							<div class="skill displayfloat">
								<div class="skill-key"></div>
								<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" data-ng-src="{{champion.abilityData[ 4 ].icon}}" data-ng-click="queue( 4 )" width="50" height="50" alt="" />
								<button type="button" class="btn btn-default">
									<i class="icon-cog"></i>
								</button>
								<div class="skill-level skill-normal tcenter" data-ng-include="'tmp/ability-levels.html'" data-ng-controller="abilityLevelCtrl" data-ng-init="ability = 3"></div>
							</div>
						</div>
						<div class="clearfix"></div>
						<div class="champion-utility">
							<div class="champion-buffs displayfloat">
								<img data-ng-repeat="buff in buffs" data-placement="top" title="" data-ng-click="toggleBuff( buff )" data-tooltip="{{ buffData[ buff ].name }}" data-ng-class="{ disabled: !hasBuff( buff ) }" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" data-ng-src="{{ buffData[ buff ].icon }}" alt="{{ buffData[ buff ].name }}" />
							</div>
							<div class="champion-runes-masteries displayfloatright">
								<img data-placement="top" title="" data-ng-click="masteries()" data-tooltip="Change Masteries {{champion.masteriesShort.join( ' / ' )}}" class="mastery" src="http://images4.wikia.nocookie.net/__cb20091125013240/leagueoflegends/images/f/f6/Offense_Mastery.png" alt="" />
								<img data-placement="top" title="" data-ng-click="runes()" data-tooltip="Change Runes" class="rune" src="http://images1.wikia.nocookie.net/__cb20110208184143/leagueoflegends/images/f/fc/Quintessences_%282%29.png" alt="" />
							</div>
						</div>
						<div class="clearfix"></div>
						<div class="champion-build">
							<div class="champion-items displayfloat">
								<div class="champion-item" data-ng-class="{ 'no-item': item === false, 'item': item !== false }" data-ng-repeat="item in champion.items track by $index" >
									<div data-ng-show="item === false" class="no-item-inner"></div>
									<img data-ng-hide="item === false" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" data-ng-src="{{item.image}}" class="img-thumbnail">
								</div>
							</div>
							<div class="build-options displayfloat tcenter">
								<button type="button" class="customise btn btn-default" data-placement="top" title="" data-tooltip="Customise Build" ng-click="build()">
									<i class="icon-cogs"></i>
								</button>
								<button type="button" class="refresh btn btn-default" data-placement="top" title="" data-tooltip="Reset Build" ng-click="champion.reset()">
									<i class="icon-retweet"></i>
								</button>
								<button type="button" class="refresh btn btn-default" data-placement="top" title="" data-tooltip="Save or Load Build" ng-click="load()">
									<i class="icon-folder-open"></i>
								</button>
							</div>
						</div>
						<div class="clearfix"></div>
					</div>
					<div id="blue-champion-placeholder" class="champion-area champion-placeholder displayfloat tcenter" data-ng-switch-when="false">
						<i class="icon-question"></i>
					</div>
				</div>
				
				<!--
					*** 				 	***
					***		Battle log		***
					***						***
				<!--							-->
				
				<div class="tcenter battlelog displayfloat" data-ng-controller="simulationCtrl">
					<div class="battlelog-settings">
						<div class="displayfloat">
							<div class="btn-group-sm displayfloat">
								<button type="button" class="btn btn-default start-stop" data-ng-click="toggleTimer();" data-ng-disabled="champions[ 0 ] === false || champions[ 1 ] === false || timer.end "><i data-ng-class="{ 'icon-play': !timer.running, 'icon-pause': timer.running }"></i></button>
							</div>
							<div id="timer-reset" class="btn-group-sm displayfloat">
								<button type="button" class="btn btn-default" data-placement="top" title="" data-tooltip="Reset simulation" data-ng-click="reset()">
									<i class="icon-mail-reply-all"></i>
								</button>
							</div>
							<div id="timer" class="input-group input-group-sm displayfloattable" data-placement="top" title="" data-tooltip="Simulation time" >
								<span class="input-group-addon">
									<i class="glyphicon glyphicon-time"></i>
								</span>
								<input type="text" disabled="disabled" class="form-control" value="{{timer.time / 1000 | number: 1}}"/>
							</div>
							<div id="FPS" class="input-group input-group-sm displayfloattable" data-placement="top" title="" data-tooltip="Current FPS" >
								<span class="input-group-addon">
									<i class="glyphicon glyphicon-dashboard"></i>
								</span>
								<input type="text" disabled="disabled" class="form-control" data-ng-model="currentFPS"/>
							</div>
						</div>
						<div class="displayfloatright">
							<div class="btn-group-sm">
								<button type="button" class="btn btn-default" data-placement="top" title="" data-tooltip="Switch Views">
									<i class="icon-random"></i>
								</button>
								<button type="button" class="btn btn-default" data-placement="top" title="" data-tooltip="Simulator Settings" data-ng-click="settings()">
									<i class="icon-wrench"></i>
								</button>
							</div>
						</div>
						<div class="clearfix"></div>
					</div>
					<div class="clearfix"></div>
					
					<!-- yeah, you can kill me for coding this :3 -->
					<div style="width: 100%; background-color: lightgray; height: 13px;">
						<div style="width: 13px; height: 13px; border-radius: 50%; position: relative; left: {{ ( projectile.position - champions[ 0 ].position ) / ( champions[ 1 ].position - champions[ 0 ].position ) * 100 }}%; background-color: {{color(projectile.source.champID)}}; float: left;" data-ng-repeat="projectile in projectiles"></div>
						<span style="font-size: 100%;">{{Math.abs( champions[0].position - champions[1].position ) | number:0}}</span>
					</div>
					
					<div class="battlelog-panel panel panel-default">
						<div class="panel-body">
							<div class="battle-log-stats">
								<table id="statistics" class="table table-condensed">
									
									<!-- ugly Pablo stuff -->
									<tr style="height: 30px;">
										<td>
											<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" style="height: 30px;" data-ng-repeat="buff in champions[ 0 ].buffs" data-ng-src="{{buff.icon}}" data-tooltip="{{buff.name}}"/>
										</td>
										<td></td>
										<td>
											<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" style="height: 30px;" data-ng-repeat="buff in champions[ 1 ].buffs" data-ng-src="{{buff.icon}}" data-tooltip="{{buff.name}}"/>
										</td>
									</tr>
									
									<tr class="statistics-health">
										<td class="blue health-blue">
											<div class="progress">
												<div class="progress-bar progress-bar-success" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: {{champions[0].stats.health/champions[0].stats.healthMax*100}}%"></div>
											</div>
											<div class="sr-only">{{champions[0].stats.health|number:0}}/{{champions[0].stats.healthMax|number:0}}</div>
										</td>
										<td class="text">Health</td>
										<td class="purple health-purple">
											
											<div class="progress">
												<div class="progress-bar progress-bar-success" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: {{champions[1].stats.health/champions[1].stats.healthMax*100}}%"></div>
											</div>
											<div class="sr-only">{{champions[1].stats.health|number:0}}/{{champions[1].stats.healthMax|number:0}}</div>
										</td>
									</tr>
									<tr class="statistics-resource">
										<td class="blue resource-blue">
											<div class="progress">
												<div class="progress-bar" data-resource-type="{{champions[0].resource}}" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: {{champions[0].stats.mana/champions[0].stats.manaMax*100}}%"></div>
											</div>
											<div class="sr-only">{{champions[0].stats.mana|number:0}}/{{champions[0].stats.manaMax|number:0}}</div>
										</td>
										<td class="text">Resource</td>
										<td class="purple resource-purple">
											<div class="progress">
												<div class="progress-bar" data-resource-type="{{champions[1].resource}}" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: {{champions[1].stats.mana/champions[1].stats.manaMax*100}}%"></div>
											</div>
											<div class="sr-only">{{champions[1].stats.mana|number:0}}/{{champions[1].stats.manaMax|number:0}}</div>
										</td>
									</tr>
									<tr>
										<td data-ng-bind="DPS[ 0 ]"></td>
										<td class="text">DPS</td>
										<td data-ng-bind="DPS[ 1 ]"></td>
									</tr>
								</table>
							</div>
							
							<div class="btn-group-sm displayfloat">
								<button type="button" class="btn btn-default" data-placement="top" title="" data-tooltip="Toggle time" data-ng-click="logSettings[ 'time' ] = !logSettings[ 'time' ]">
									<i class="glyphicon glyphicon-time"></i>
								</button>
								<button type="button" class="btn btn-default" data-placement="top" title="" data-tooltip="Export Results">
									<i class="icon-external-link-sign"></i>
								</button>
							</div>
							
							<div class="battle-console text-left">
								<div data-ng-repeat="log in logs" class="{{ color( log[ 1 ] ) }}"><span data-ng-show="logSettings[ 'time' ]">[{{ ( '0' + Math.floor( log[ 0 ] / 60000 ) ).slice( - 2 ) }}:{{ ( '0' + ( Math.floor( log[ 0 ] / 1000 ) % 60 ) ).slice( -2 ) }}:{{ ( '0' + ( Math.floor( log[ 0 ] / 10 ) % 100 ) ).slice( -2 ) }}] </span>{{log[2]}}</div>
							</div>
						</div>
					</div>
				</div>
				
				<!--
					*** 				 	***
					***	  Purple Champion	***
					***						***
				<!--							-->
				<div data-ng-controller="champCtrl" data-ng-init="side = 1" data-ng-switch on="selected">
					<div id="purple-champion" class="tright champion-area displayfloat" data-ng-switch-when="true">
						<h2 class="purple-text">{{champion.statData.disp_name}}</h2>
						<div class="champion-stats">
							<div class="champion-avatar displayfloatright">
								<img class="img-thumbnail" data-ng-class="{ 'champion-low': champion.dead === false && ( champion.stats.health < champion.stats.healthMax * 0.2 || champion.stats.health < 100 ) }" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" data-ng-src="{{champion.statData.image}}" alt="{{champion.statData.disp_name}}" />
								<div class="dead-overlay" data-ng-class="{ 'champion-dead': champion.dead }"></div>
							</div>
							<div class="champion-statistics displayfloatright">
								<div class="progress progress-striped active" data-placement="top" title="" data-tooltip="Attack Power: {{champion.statData.attack}}">
									<div class="progress-bar progress-bar-danger"  role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: {{champion.statData.attack*10}}%"></div>
								</div>
								<div class="progress progress-striped active" data-placement="top" title="" data-tooltip="Defense Power: {{champion.statData.health}}">
									<div class="progress-bar progress-bar-success"  role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: {{champion.statData.health*10}}%"></div>
								</div>
								<div class="progress progress-striped active" data-placement="top" title="" data-tooltip="Ability Power: {{champion.statData.spells}}">
									<div class="progress-bar progress-bar-info"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: {{champion.statData.spells*10}}%"></div>
								</div>
								<div class="progress progress-striped active" data-placement="top" title="" data-tooltip="Difficulty: {{champion.statData.difficulty}}">
									<div class="progress-bar progress-bar-difficulty"  role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" style="width: {{champion.statData.difficulty*10}}%"></div>
								</div>
							</div>
						</div>
						<div class="clearfix"></div>
						<div class="champion-level">
							<input class="champion-level" rel="slider" type="text" data-ng-model="champion.championLevel" data-slider-reversed="true" data-slider-min="1" data-slider-max="18" data-slider-step="1" data-slider-value="1" data-slider-orientation="horizontal" data-slider-selection="before" data-slider-tooltip="show" data-selector="#purple-champion">
						</div>
						<div class="clearfix"></div>
						<div class="champion-queue">
							<div class="auto-attack displayfloattable" data-placement="top" title="" data-ng-click="queue( -1 )" data-tooltip="Auto Attack">
								<img src="img/autoattack.png" alt="Auto Attack" class="img-thumbnail" />
							</div>
							<div class="input-group queue-holder" data-placement="top" title="" data-tooltip="Ability Queue">
								<span class="input-group-addon">
									<i class="glyphicon glyphicon-arrow-right"></i>
								</span>
								<div data-ng-show="champion.channelLeft !== false && ( champion.channelType == 0 || champion.channelType == 1 )" style="background-color: lightblue; width: {{channelProcess()}}%; height: 100%; position: absolute;"></div>
								<div class="queue no-highlight">
									<span ng-repeat="item in champion.queue track by $index" data-ng-click="removeQueue( $index )">{{ abilitySign( item.index ) }}</span>
								</div>
								<span class="clear" data-ng-click="champion.queue.length = 0"></span>
							</div>
						</div>
						<div class="clearfix"></div>
						<div class="champion-skills tleft">
							<div class="skill skill-passive displayfloat">
								<div class="skill-key"></div>
								<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" data-ng-src="{{champion.abilityData[ 0 ].icon}}" width="50" height="50" alt="" />
								<button type="button" class="btn btn-default">
									<i class="icon-cog"></i>
								</button>
							</div>
							<div class="skill displayfloat">
								<div class="skill-key"></div>
								<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" data-ng-src="{{champion.abilityData[ 1 ].icon}}" data-ng-click="queue( 1 )" width="50" height="50" alt="" />
								<button type="button" class="btn btn-default">
									<i class="icon-cog"></i>
								</button>
								<div class="skill-level skill-normal tcenter" data-ng-include="'tmp/ability-levels.html'" data-ng-controller="abilityLevelCtrl" data-ng-init="ability = 0"></div>
							</div>
							<div class="skill displayfloat">
								<div class="skill-key"></div>
								<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" data-ng-src="{{champion.abilityData[ 2 ].icon}}" data-ng-click="queue( 2 )" width="50" height="50" alt="" />
								<button type="button" class="btn btn-default">
									<i class="icon-cog"></i>
								</button>
								<div class="skill-level skill-normal tcenter" data-ng-include="'tmp/ability-levels.html'" data-ng-controller="abilityLevelCtrl" data-ng-init="ability = 1"></div>
							</div>
							<div class="skill displayfloat">
								<div class="skill-key"></div>
								<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" data-ng-src="{{champion.abilityData[ 3 ].icon}}" data-ng-click="queue( 3 )" width="50" height="50" alt="" />
								<button type="button" class="btn btn-default">
									<i class="icon-cog"></i>
								</button>
								<div class="skill-level skill-normal tcenter" data-ng-include="'tmp/ability-levels.html'" data-ng-controller="abilityLevelCtrl" data-ng-init="ability = 2"></div>
							</div>
							<div class="skill displayfloat">
								<div class="skill-key"></div>
								<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" data-ng-src="{{champion.abilityData[ 4 ].icon}}" data-ng-click="queue( 4 )" width="50" height="50" alt="" />
								<button type="button" class="btn btn-default">
									<i class="icon-cog"></i>
								</button>
								<div class="skill-level skill-normal tcenter" data-ng-include="'tmp/ability-levels.html'" data-ng-controller="abilityLevelCtrl" data-ng-init="ability = 3"></div>
							</div>
						</div>
						<div class="clearfix"></div>
						<div class="champion-utility">
							<div class="champion-buffs displayfloat">
								<img data-ng-repeat="buff in buffs" data-placement="top" title="" data-ng-click="toggleBuff( buff )" data-tooltip="{{ buffData[ buff ].name }}" data-ng-class="{ disabled: !hasBuff( buff ) }" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" data-ng-src="{{ buffData[ buff ].icon }}" alt="{{ buffData[ buff ].name }}" />
							</div>
							<div class="champion-runes-masteries displayfloatright">
								<img data-placement="top" title="" data-ng-click="masteries()" data-tooltip="Change Masteries" class="mastery" src="http://images4.wikia.nocookie.net/__cb20091125013240/leagueoflegends/images/f/f6/Offense_Mastery.png" alt="" />
								<img data-placement="top" title="" data-ng-click="runes()" data-tooltip="Change Runes" class="rune" src="http://images1.wikia.nocookie.net/__cb20110208184143/leagueoflegends/images/f/fc/Quintessences_%282%29.png" alt="" />
							</div>
						</div>
						<div class="clearfix"></div>
						<div class="champion-build">
							<div class="champion-items displayfloatright">
								<div class="champion-item" data-ng-class="{ 'no-item': item === false, 'item': item !== false }" data-ng-repeat="item in champion.items track by $index" >
									<div data-ng-show="item === false" class="no-item-inner"></div>
									<img data-ng-hide="item === false" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" data-ng-src="{{item.image}}" class="img-thumbnail">
								</div>
							</div>
							<div class="build-options displayfloattight tcenter">
								<button type="button" class="customise btn btn-default" data-placement="top" title="" data-tooltip="Customise Build" data-ng-click="build()">
									<i class="icon-cogs"></i>
								</button>
								<button type="button" class="refresh btn btn-default" data-placement="top" title="" data-tooltip="Reset Build" ng-click="champion.reset()">
									<i class="icon-retweet"></i>
								</button>
								<button type="button" class="refresh btn btn-default" data-placement="top" title="" data-tooltip="Save or Load Build" ng-click="load()">
									<i class="icon-folder-open"></i>
								</button>
							</div>
						</div>
						<div class="clearfix"></div>
					</div>
					<div id="purple-champion-placeholder" class="champion-area champion-placeholder displayfloat tcenter" data-ng-switch-when="false">
						<i class="icon-question"></i>
					</div>
				</div>
			</div>
			<div class="clearfix"></div>
		</section>
	</div><!-- End Wrapper -->
	<footer class="footer">
		<div class="footer-container bcenter no-highlight">
			<div class="displayfloat tleft no-highlight-text">League of Legends Battle Simulator &copy; 2013 - Pablo Kebees &amp; <a href="http://elliothesp.co.uk" target="_blank">Elliot Hesp</a></div>
			<div class="displayfloatright tright no-highlight-text">F.A.Q</div>
			<div class="displayfloatright tcenter sound-control" data-ng-click="toggleSound()" data-ng-controller="soundCtrl"><i data-ng-class="{ 'glyphicon glyphicon-volume-up': settings[ 'sound' ] == 2, 'glyphicon glyphicon-volume-down': settings[ 'sound' ] == 1,'glyphicon glyphicon-volume-off': settings[ 'sound' ] == 0}"></i></div>
	</footer>
</body>
</html>