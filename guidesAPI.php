<?php
	
	error_reporting( E_ALL );
	
	set_time_limit( 300 );
	
	require( 'APIconfig.php' );
	require( 'simple_html_dom.php' );
	
	define( 'GUIDE_LIST_SOLOMID', 'http://www.solomid.net/guide?champ=%s&featured=0&submitted=0&sort=1' );
	define( 'GUIDE_LIST_LOLKING', 'http://www.lolking.net/guides/list.php?sort=rating&champion=%s' );
	define( 'FILE_PATH', 'cache/%s' );
	define( 'FILE_EXT', '.dat' );
	
	$runeData = unserialize( file_get_contents( 'data/lolking_runes.dat' ) );
	
	function error( $str ) {
		
		die( json_encode( Array( 'success' => false, 'error' => $str ) ) );
		
	}
	
	function filterNumeric( $arr ) {
		
		$keys = array_filter( array_keys( $arr ), function( $key ) { return is_numeric( $key ); } );
		return array_diff_key( $arr, array_flip( $keys ) );
		
	}
	
	function cleanName( $name ) {
		
		return preg_replace( '/[^a-z]/', '', strtolower( $name ) );
		
	}
	
	function getPage( $url ) {

		$ch = curl_init( $url );
		
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, true );
		curl_setopt( $ch, CURLOPT_USERAGENT, API_USER_AGENT );
		
		$page = curl_exec( $ch );
		$status = curl_getinfo( $ch, CURLINFO_HTTP_CODE );
		$errno = curl_errno( $ch );
		
		curl_close( $ch );
		
		if( $errno )
			error( 'Failed to retrieve data, cURL error number: ' . $errno );		
		
		if( $status == 404 )
			error( 'Invalid champion or guide selected' );
		
		return $page;
		
	}
	
	function getMasteriesSoloMid( $html ) {
		
		$trees = $html->find( 'div.masteries', 0 )->find( 'td.tree' );
		
		$points = array();
		
		foreach( $trees as $tree ) {
			
			$arr = array();
			$masteries = $tree->find( 'span.pos-abs' );
			foreach( $masteries as $mastery ) {
				
				$count = explode( '/', $mastery->plaintext );
				array_push( $arr, (int) $count[ 0 ] );
				
			}
			
			array_push( $points, $arr );
			
		}
		
		return $points;
	
	}
	
	function getMasteriesLoLKing( $html ) {
		
		$trees = $html->find( 'div#masteries-container', 0 )->children();;
		
		$points = array();
		
		foreach( $trees as $tree ) {
			
			$arr = array();
			$masteries = $tree->find( 'div.mastery_rank' );
			foreach( $masteries as $mastery ) {
				
				$count = explode( '/', $mastery->plaintext );
				array_push( $arr, (int) $count[ 0 ] );
				
			}
			
			array_push( $points, $arr );
			
		}
		
		return $points;
		
	
	}
	
	function getGuide( $url ) {
		
		$html = new simple_html_dom();
		
		$plaintext = getPage( $url );
		
		$html->load( $plaintext );
		
		$domain = str_ireplace( 'www.', '', parse_url( strtolower( $url ), PHP_URL_HOST ) );
		preg_match( '/\d+$/', $url, $matches );
		$guideID = $matches[ 0 ];
		
		$file = sprintf( FILE_PATH, 'guides/' . $domain . '/' . $guideID . FILE_EXT );
		
		if( !isset( $_GET[ 'nocache' ] ) && ( time() - filemtime( $file ) ) < 3600 * 24 * 7 ) {
			
			$file = @file_get_contents( $file );
			if( $file !== false )
				return unserialize( $file );
			
		}
		
		$data = array();
		
		// library unpredictable as fuck, so let's just do this
		try {
			
			if( $domain == 'solomid.net' ) {
				
				$data[ 'masterySeason' ] = strpos( $plaintext, 'masteries/4112.png' ) === false ? 3 : 4;
				$data[ 'masteries' ] = getMasteriesSoloMid( $html );
				$data[ 'runes' ] = getRunesSoloMid( $html );
				
			} else if( $domain == 'lolking.net' ) {
				
				preg_match( '/var guide = (.+?\});/ism', $html, $match );
				$guideData = json_decode( $match[ 1 ] );
				
				$data[ 'masterySeason' ] = 4;
				$data[ 'masteries' ] = getMasteriesLoLKing( $html );
				$data[ 'runes' ] = getRunesLoLKing( $guideData );
				
			} else
				error( 'Website is not supported' );
			
		} catch ( Exception $e ) {
			
			error( 'Unable to parse guide' );
			
		}
		
		file_put_contents( $file, serialize( $data ) );
		
		return $data;
		
	}
	
	function getRunesLoLKing( $guide ) {
		
		global $runeData;
		
		$counts = $guide->builds[ 0 ]->runes->data;
		
		$runes = array();
		foreach( $counts as $runeID => $count )
			array_push( $runes, array( $count, $runeData->$runeID->name_enus ) );
		
		return $runes;
		
	}
	
	function getRunesSoloMid( $html ) {
		
		$all = $html->find( 'div.rune' );
		$runes = array();
		
		foreach( $all as $rune )
			array_push( $runes, array( $rune->children( 1 )->plaintext, $rune->children( 2 )->children( 0 )->plaintext ) );
		
		return $runes;
		
	}
	
	function getPopular( $champion ) {
		
		$file = sprintf( FILE_PATH, 'guide-lists/' . cleanName( $champion ) . FILE_EXT );
		
		if( !isset( $_GET[ 'nocache' ] ) && ( time() - filemtime( $file ) ) < 3600 * 24 ) {
			
			$file = @file_get_contents( $file );
			if( $file !== false )
				return unserialize( $file );
			
		}
		
		$guides = array();
		
		$guides[ 'solomid' ] = getPopularSoloMid( $champion );
		$guides[ 'lolking' ] = getPopularLoLKing( $champion );
		
		file_put_contents( $file, serialize( $guides ) );
		
		return $guides;
		
	}
	
	function getPopularSoloMid( $champion ) {
		
		$data = getPage( sprintf( GUIDE_LIST_SOLOMID, cleanName( $champion ) ) );
		
		if( strpos( $data, '<h1>No results for search filter</h1>' ) !== false || cleanName( $champion ) == '' )
			return array();
		
		preg_match_all( "/<a href=\"\/guide\/view\/(?P<id>[\d]+)\">(?P<title>[^<]+)<\/a>.+?<span class=\"font-blue\">(?P<author>[^<]+)<\/span>.+?<span class=\"font-green\">(?P<views>[\d,]+)<\/span> Views, <span class=\"font-green\">(?P<comments>[\d,]+)<\/span> Comments<\/div>.+?<img src='\/resources\/img\/win.png' \/> <span>(?P<like>[\d,]+)<\/span>.+?<img src='\/resources\/img\/lose.png' \/> <span>(?P<dislike>[\d,]+)<\/span>/is", $data, $matches, PREG_SET_ORDER );
		
		return array_map( function( $match ) { $match = filterNumeric( $match ); $match[ 'views' ] = str_replace( ',', '', $match[ 'views' ] ); $match[ 'comments' ] = str_replace( ',', '', $match[ 'comments' ] ); $match[ 'like' ] = str_replace( ',', '', $match[ 'like' ] ); $match[ 'dislike' ] = str_replace( ',', '', $match[ 'dislike' ] ); return $match; }, $matches );
		
	}
	
	function getPopularLoLKing( $champion ) {
		
		$data = getPage( sprintf( GUIDE_LIST_LOLKING, cleanName( $champion ) ) );
		
		if( strpos( $data, '<h3 class="headline">All Guides</h3>' ) !== false || cleanname( $champion ) == '' )
			return array();
		
		preg_match_all( "/<a href=\"\/guides\/(?P<id>[\d]+)\" style=\"color: white; font-family: 'Trebuchet Ms';\">(?P<title>[^<]+)<\/a>.+?<a href=\"\/guides\/list\?author=.*?\" style=\" text-shadow: 0 0 1px #000;\">(?P<author>[^<]+)<\/a>.+?<div style=\"font-size: 14px; color:#54c200; text-shadow: 1px 1px 1px rgba\(0, 0, 0, 0.6\); line-height: 10px;\">(?P<like>[\d,]+)<\/div>.+?<div style=\"font-size: 14px; color:#d90014; text-shadow: 1px 1px 1px rgba\(0, 0, 0, 0.6\); line-height: 10px;\">(?P<dislike>[\d,]+)<\/div>.+?<div style=\"font-size: 16px; color: #DDD; font-weight: bold;\">(?P<views>[\d,]+)<\/div>.+?<div style=\"font-size: 16px; color: #DDD; font-weight: bold;\">(?P<comments>[\d,]+)<\/div>/is", $data, $matches, PREG_SET_ORDER );
		
		return array_map( function( $match ) { $match = filterNumeric( $match ); $match[ 'views' ] = str_replace( ',', '', $match[ 'views' ] ); $match[ 'comments' ] = str_replace( ',', '', $match[ 'comments' ] ); $match[ 'like' ] = str_replace( ',', '', $match[ 'like' ] ); $match[ 'dislike' ] = str_replace( ',', '', $match[ 'dislike' ] ); return $match; }, $matches );
		
		
	}
	
	$result = array();
	$result[ 'success' ] = true;
	$result[ 'query' ] = array();
	
	if( isset( $_GET[ 'champions' ] ) ) {
		
		$result[ 'query' ][ 'guides' ] = array();
		
		foreach( ( $_GET[ 'champions' ] == '' ? array() : explode( '|', $_GET[ 'champions' ] ) ) as $champion )
			$result[ 'query' ][ 'guides' ][ $champion ] = getPopular( $champion );
		
	}
		
	if( isset( $_GET[ 'guides' ] ) ) {
		
		$result[ 'query' ][ 'builds' ] = array();
		
		foreach( ( $_GET[ 'guides' ] == '' ? array() : explode( '|', $_GET[ 'guides' ] ) ) as $guide )
			$result[ 'query' ][ 'builds' ][ $guide ] = getGuide( $guide );
		
	}
	
	echo json_encode( $result );
	
?>