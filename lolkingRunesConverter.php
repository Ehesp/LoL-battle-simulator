<?php
	
	$types = array(
		
		'red' => 'mark',
		'yellow' => 'seal',
		'blue' => 'glyph',
		'black' => 'quint'
		
	);
	
	$lolking = unserialize( file_get_contents( 'data/lolking_runes.dat' ) );
	$runes = array();
	
	foreach( $lolking as $rune ) {
		
		$effects = explode( '/', strtolower( $rune->description_enus ), strpos( $rune->description_enus, 'sec' ) === false && strpos( $rune->description_enus, 'level' ) === false ? 2 : 1 );
		
		foreach( $effects as &$effect ) {
			
			$effect = explode( ' ', substr( trim( $effect, ' \t.' ), 1 ), 2 );
			if( substr( $effect[ 0 ], -1 ) == '%' ) {
				$effect[ 1 ] = 'percentage ' . $effect[ 1 ];
				$effect[ 0 ] = ( (float) $effect[ 0 ] ) / 100;
			} else
				$effect[ 0 ] = (float) $effect[ 0 ];
			
		}
		
		array_push( $runes, array( 'name' => $rune->name_enus, 'type' => $types[ $rune->type ], 'tier' => (int) $rune->tier, 'desc' => $rune->description_enus_full, 'effects' => $effects, 'image' => $rune->image ) );
	
	}
	
	file_put_contents( 'js/auto/runes.js', 'var runeDefinitions = ' . json_encode( $runes ) . ';' );
	
	echo 'Rune data succesfully converted';
	
?>