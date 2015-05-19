<?php
	
	$html = file_get_contents( 'http://www.lolking.net/guides/30527' );
	preg_match( '/var guide = (.+?\});/ism', $html, $match );
	die($match[1]);
	$guide = json_decode( $match[ 1 ] );
	
	var_dump($guide);
	
	
?>