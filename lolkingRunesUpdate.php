<?php
	
	$html = file_get_contents( 'http://www.lolking.net/guides/30527' );
	preg_match( '/var all_runes = (.+?\});/ism', $html, $match );
	
	$runes = json_decode( $match[ 1 ] );
	
	if( $runes )
		if( file_put_contents( 'data/lolking_runes.dat', serialize( $runes ) ) )
			echo 'LoLKing rune data has been updated';
		else
			echo 'Unable to save data';
	else
		echo 'Unable to retrieve rune data';
	
	
?>