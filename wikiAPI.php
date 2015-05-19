<?php
	
	error_reporting( E_ALL );
	
	set_time_limit( 300 );
	
	require( 'APIconfig.php' );
	
	define( 'URL_BASE', 'http://leagueoflegends.wikia.com/' );
	define( 'URL_API', URL_BASE . 'api.php' );
	define( 'URL_VARS', '?action=query&prop=revisions&format=xml&rvprop=content&rvlimit=1&rvgeneratexml=&redirects&titles=%s' );
	define( 'URL_LIST_VARS', '?action=query&format=xml&list=categorymembers&cmlimit=max&cmtitle=Category:%s' );
	define( 'URL_IMG_VARS', '?action=query&prop=imageinfo&format=xml&iiprop=url&redirects=&iilimit=1&titles=%s' );
	define( 'PAGE_CHAMPION', '%s' );
	define( 'PAGE_ITEM', '%s' );
	define( 'PAGE_FILE', 'File:%s' );
	define( 'PAGE_FILE_ITEM', '%s.png' );
	define( 'PAGE_TEMPLATE', 'Template:%s' );
	define( 'PAGE_DATA', sprintf( PAGE_TEMPLATE, 'Data %s' ) );
	define( 'FILE_PATH', 'cache/%s' );
	define( 'FILE_EXT', '.dat' );
	
	header( 'Content-Type:application/json; charset=utf-8' );
	
	$images = array();
	
	function getXML( $url ) {
		
		$page = getPage( $url );
		
		$xml = simplexml_load_string( $page );
		
		return $xml;
		
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
			error( 'Invalid champion selected' );
		
		return $page;
	}
	
	function fileName( $str ) {
		
		return preg_replace( '/[^a-z]/', '', strtolower( $str ) );
		
	}
	
	function toVal( $val, $stat = false ) {
		
		$val = (string) $val;
		$val = str_replace( '(estimate)', '', $val );
		$val = trim( $val );
		
		if( is_numeric( $val ) )
			return (float) $val;
		
		if( is_bool( $val ) )
			return (bool) $val;
		
		if( $stat && preg_match( '/\(?\s*\+?\s*([0-9.]+)%\s*([a-z][a-z\s]*[a-z])\s*\)?/i', $val, $matches ) && count( $matches ) == 3 )
			return array( $matches[ 1 ] / 100, strpos( $matches[ 2 ], 'max mana' ) !== false || strpos( $matches[ 2 ], 'maximum mana' ) !== false ? 'max MP' : ( strpos( $matches[ 2 ], 'max health' ) !== false || strpos( $matches[ 2 ], 'maximum health' ) !== false ? 'max HP' : $matches[ 2 ] ) );
		
		if( substr( $val, -1 ) == ':' )
			return substr( $val, 0, -1 );
			
		$val = preg_replace( '/\[\[(?:[a-z_# ]+\|)*([a-z_# ]+)\]\]/i', '\1', $val );
		
		return $val;
		
	}
	
	function error( $str ) {
		
		die( json_encode( Array( 'success' => false, 'error' => $str ) ) );
		
	}
	
	function parsePart( $part, &$arr ) {
		
		$name = trim( (string) $part->name );
		$value = toVal( (string) $part->value );
		
		if( isset( $part->name[ 'index' ] ) ) {
			
			if( $part->name[ 'index' ] == 1 ) {
				
				$value = abilityID( $value );
				$name = 'ability';
				
			} else
				return;
			
		} else if( $name == 'icon' || $name == 'image' ) {
			
			$arr[ $name ] = &imageURL( $value );
			return;
			
		} else if( $part->value->template ) {
			
			$value = array();
			
			foreach( $part->value->children() as $node ) {
				
				if( $node->getName() == 'text' ) {
					
					$value[ $var ] = toVal( $node );
					continue;
					
				}
				
				if( $node->title == 'lc' ) {
					
					if( $node->part->value ) {
						$var = strtolower( (string) $node->part->value );
						$value[ $var ] = array();
					} else
						$var = false;
					
					continue;
					
				}
				
				$val = array();
				
				foreach( $node->part as $subVal )
					array_push( $val, toVal( $subVal->value, true ) );
				
				if( substr( end( $val ), -1 ) == '%' )
					$val = array_map( function( $x ) { return intval( $x ) / 100; }, $val );
				
				if( count( $val ) == 1 )
					$val = $val[ 0 ];
				
				$subVar = strtolower( (string) $node->title );
				
				switch( $subVar ) {
					
					case 'as':
						$subVar = 'ability scaling';
						break;
					case 'ap':
						$subVar = 'amount';
						break;
					case 'fd':
						$subVar = 'amount';
						break;				}
				
				if( $node->title == 'sbc' )
					$var = strtolower( $val );
				else if( $var == '' )
					$value[ $subVar ] = $val;
				else if( isset( $value[ $var ][ $subVar ] ) )
					$value[ $var ][ $subVar ] = array( $value[ $var ][ $subVar ], $val );
				else
					$value[ $var ][ $subVar ] = $val;
				
			}
			
		}
		
		if( ( $name == 'cooldown' || $name == 'cost' || $name == 'range' ) && is_array( $value ) )
			$value = array_pop( $value );
		
		if( isset( $arr[ $main = substr( $name, 0, -1 ) ] ) )
			$arr[ $main ] = array_merge( $arr[ $main ], $value );
		else
			$arr[ $name ] = $value;
		
	}
	
	function &imageURL( $image ) {
		
		global $images;
		
		array_push( $images, $image );
		
		end( $images );
		
		return $images[ key( $images ) ]; 
		
	}
	
	function resolveImages() {
		
		global $images;
		
		$var = array_map( function( &$item ) { return sprintf( PAGE_FILE, $item ); }, $images );
		$var = implode( '|', $var );
		
		$xml = getXML( URL_API . sprintf( URL_IMG_VARS, rawurlencode( $var ) ) );
		
		foreach( $xml->query->pages->children() as $page ) {
			
			$key = (string) $page['title'];
			
			foreach( $xml->query->redirects->r as $redirect )
				if( (string) $redirect[ 'to' ] == $key )
					$key = (string) $redirect[ 'from' ];
			
			$key = array_search( substr( $key, 5 ), $images );
			
			if( !isset( $page[ 'missing' ] ) && $page->imageinfo)
				$images[ $key ] = (string) $page->imageinfo->ii[ 'url' ];
			
		}
		
	}
	
	function abilityID( $id ) {
		
		return strpos( 'IQWER', $id );
		
	}
	
	function getParseTree( $xml ) {
		
		$tree = $xml->query->pages->page->revisions->rev[ 'parsetree' ];
	
		$tree = preg_replace( '/>\s*([^\s<][^<]*?)\s*<(\t*[^\/])/', '><text>\1</text><\2', $tree ); // fix text appearing in front of opening tags
		$tree = preg_replace( '/<(\t*\/[^>]*)>\s*([^\s<][^<]*?)\s*</', '<\1><text>\2</text><', $tree ); // fix text appearing behind closing tags
		
		$tree = preg_replace( '/\'\'\'(.*?)\'\'\'/', '&lt;b&gt;\1&lt;/b&gt;', $tree ); // resolve heavy stuff
		$tree = preg_replace( '/\'\'(.*?)\'\'/', '&lt;i&gt;\1&lt;/i&gt;', $tree ); // resolve curvy stuff
		
		if( isset( $_GET['tree'] ) )
			die( $tree );
		
		return $tree;
		
	}
	
	function getChampion( $name ) {
		
		$file = sprintf( FILE_PATH, 'champions/' . fileName( $name ) . FILE_EXT );
		
		if( !isset( $_GET[ 'nocache' ] ) && ( time() - filemtime( $file ) ) < 3600 * 24 * 365 * 99 ) {
			
			$file = @file_get_contents( $file );
			if( $file !== false )
				return unserialize( $file );
			
		}
		
		$xml = getXML( URL_API . sprintf( URL_VARS, rawurlencode( sprintf( PAGE_CHAMPION, $name ) ) ) );
		
		if( isset( $xml->query->pages->page[ 'missing' ] ) )
			error( 'Invalid champion selected' );
		
		$champion = toVal( $xml->query->pages->page[ 'title' ] );
		
		$tree = getParseTree( $xml );
		
		$xml = simplexml_load_string( $tree );
		
		$flag = false;
		foreach( $xml->template as $node ) {
			
			if( !isset( $node->title ) || strtolower( $node->title ) != 'champion info' )
				continue;
			
			$flag = true;
			break;
			
		}
		
		if( $flag === false )
			error( 'Invalid champion selected' );
		
		$abilities = Array();
		
		foreach( $xml->children() as $ability ) {
			
			if( !isset( $ability->title ) )
				continue;
			
			if( strtolower( trim( $ability->title ) ) == 'ability' ) {
				
				$parts = array();
				
				foreach( $ability->part as $part )
					parsePart( $part, $parts );
				
				$abilities[ $parts[ 'ability' ] ] = $parts;
				
			} else if( strtolower( trim( $ability->title ) ) == 'ability frame' ) {
				
				$key = abilityID( (string) $ability->part->value );			
				
				$abilities[ $key ] = array();
				
				for( $i = 0; $i < $ability->part[1]->value->template->count(); $i++ ) {
					
					$parts = array();
					
					foreach( $ability->part[1]->value->template[ $i ]->part as $part )
						parsePart( $part, $parts );
					
					$abilities[ $key ][ $i ] = $parts;
					
				}
				
				if( count( $abilities[ $key ] ) == 1 )
					$abilities[ $key ] = $abilities[ $key ][ 0 ];
				
			}
			
		}
		
		$xml = getXML( URL_API . sprintf( URL_VARS, rawurlencode( sprintf( PAGE_DATA, $champion ) ) ) );
		
		$tree = getParseTree( $xml );
		$xml = simplexml_load_string( $tree );
		
		$stats = array();
		
		foreach( $xml->template->part as $part ) {
			
			if( (string) $part->name && (string) $part->value )
				parsePart( $part, $stats );
		}
		
		resolveImages();
		
		$data = array( 'championData' => $stats, 'abilityData' => $abilities );
		
		file_put_contents( $file, serialize( $data ) );
		
		return $data;
		
	}
	
	function getItem( $name ) {
		
		$file = sprintf( FILE_PATH, 'items/' . fileName( $name ) . FILE_EXT );
		
		if( !isset( $_GET[ 'nocache' ] ) && ( time() - filemtime( $file ) ) < 3600 * 24 * 365 ) {
			
			$file = @file_get_contents( $file );
			if( $file !== false )
				return unserialize( $file );
			
		}
		
		$xml = getXML( URL_API . sprintf( URL_VARS, rawurlencode( sprintf( PAGE_ITEM, $name ) ) ) );
		
		$item = toVal( $xml->query->pages->page[ 'title' ] );
		
		$tree = getParseTree( $xml );
		$xml = simplexml_load_string( $tree );
		
		if( !isset( $xml->template ) )
			error( 'Invalid item selected' );
		
		$infobox = false;
		
		for( $i = 0; $i < $xml->template->count(); $i++ )
			if( isset( $xml->template[ $i ]->title ) && strtolower( trim( $xml->template[ $i ]->title ) ) == 'infobox item' )
				$infobox = $xml->template[ $i ];
		
		if( $infobox === false )
			error( 'Invalid item selected' );
		
		$data = array();
		foreach( $infobox->part as $part ) {
		
			$name = strtolower( trim( $part->name ) );
			$value = toVal( $part->value );
			
			if( isset( $part->value->template, $part->value->template->title ) && $part->value->template->title == 'PAGENAME' )
				$value = $item;
			
			if( preg_match( '/(<br\s*\/?\s*>|\n)/i', $value ) )
				$value = array_map( 'trim', preg_split( '/(<br\s*\/?\s*>|\n)/i', $value ) );
			
			if( $name == 'effects' ) {
				
				$value = (array) $value;
				foreach( $value as &$effect ) {
					if( !preg_match( '/\+([0-9]+%?)\s*(.*)/i', $effect, $match ) )
						continue;
					
					$perc = substr( $match[ 1 ], -1 ) == '%';
					
					$effect = array( $perc ? intval( $match[ 1 ] ) / 100 : intval( $match[ 1 ] ), ( $perc ? 'percentage ' : '' ) . strtolower( $match[ 2 ] ) );
					
				}
				
				
			} else if( $name == 'passive' ) {
				
				$name = 'unique';
				$value = (array) $value;
				foreach( $value as &$effect ) {
					
					$parts = explode( ':', $effect, 2 );
					if( count( $parts ) != 2 || ( strpos( $parts[ 0 ], '–' ) === false && strpos( $parts[ 0 ], '-' ) === false && strpos( $parts[ 0 ], '&ndash;' ) === false ) )
						$uniqueName = false;
					else {
						
						preg_match( '/[a-z\s]+$/i', $parts[ 0 ], $uniqueName );
						$uniqueName = trim( $uniqueName[ 0 ] );
						
					}
					
					if( !preg_match( '/\+([0-9]+%?)\s*([^\.]*).*?/i', trim( $parts[ 1 ], ". \t\n\r\0\x0B" ), $match ) )
						continue;
					
					$perc = substr( $match[ 1 ], -1 ) == '%';
					
					$effect = array( $uniqueName, $perc ? intval( $match[ 1 ] ) / 100 : intval( $match[ 1 ] ), ( $perc ? 'percentage ' : '' ) . strtolower( $match[ 2 ] ) );
					
				}
				
				
			} else if( $name == 'menu' ) {
				
				$value = (array) $value;
				foreach( $value as &$cat )
					$cat = explode( ' > ', $cat );
				
			} else if( $name == 'buy' ) {
				
				if( preg_match( '/([0-9]+)g\s*\(([0-9]+)g\)/', $value, $match ) ) {
					
					$value = (int) $match[ 1 ];
					$data[ 'upgrade' ] = (int) $match[ 2 ];
					
				} else {
					
					$value = intval( $value );
					$data[ 'upgrade' ] = false;
					
				}
				
				
			} else if( $name == 'sell' ) {
				
				$value = intval( $value );
				
			}
			
			if( !isset( $data[ 'name' ] ) )
				$data[ 'name' ] = $item;
			
			$data[ $name ] = $value;
			
		}
		
		$type = false;
		$recipe = array();
		$builds = array();
		
		foreach( $xml->children() as $node ) {
			
			if( $node->getName() == 'h' ) {
				$type = $node;
				continue;
			}
			
			if( !isset( $node->title ) || $node->title != 'ii' )
				continue;
			
			if( strtolower( $type ) == '== recipe ==' )
				array_push( $recipe, (string) $node->part->value );
			
			if( strtolower( $type ) == '== builds into ==' )
				array_push( $builds, (string) $node->part->value );
			
		}
		
		if( !empty( $recipe ) )
			$data[ 'recipe' ] = array_unique( $recipe );
		
		if( !empty( $builds ) )
			$data[ 'builds' ] = $builds;
		
		$data[ 'image' ] = &imageURL( sprintf( PAGE_FILE_ITEM, $data[ 'name' ] ) );
		
		resolveImages();
		
		file_put_contents( $file, serialize( $data ) );
		
		return $data;
		
	}
	
	function getChampionList() {
		
		$xml = getXML( URL_API . sprintf( URL_LIST_VARS, 'Data_templates' ) );

		
		$pre = 'Template:Data ';
		$length = strlen( $pre );
		
		$champions = array();
		foreach( $xml->query->categorymembers->cm as $member )
			if( substr( $member[ 'title' ], 0, $length ) == $pre )
				array_push( $champions, substr( $member[ 'title' ], $length ) );
		
		return $champions;
		
	}
	
	function getItemList() {
		
		$xml = getXML( URL_API . sprintf( URL_VARS, rawurlencode( sprintf( PAGE_TEMPLATE, 'Items' ) ) ) );
		$tree = getParseTree( $xml );
		$xml = simplexml_load_string( $tree );
		
		$items = array();
		foreach( $xml->template as $template )
			if( isset( $template->title, $template->part, $template->part->value ) && $template->title == 'iio' && !in_array( $template->part->value, $items ) )
				array_push( $items, toVal( $template->part->value ) );
		
		return $items;
		
	}
	
	function getItemListByType() {
		
		$xml = getXML( URL_API . sprintf( URL_VARS, rawurlencode( sprintf( PAGE_TEMPLATE, 'Items' ) ) ) );
		$tree = getParseTree( $xml );
		$xml = simplexml_load_string( $tree );
		
		$items = array();
		
		foreach( $xml->children() as $node )
			if( $node->getName() == 'text' )
				
				if( ( $pos = strpos( $node, 'Maps' ) ) !== false && preg_match_all( '/\[\[(.*?)\]\]/', substr( $node, $pos ), $categories ) ) {
					
					preg_match( '/"width: 12%;"\|\[\[(?:.+?\|)+(.+?)\]\]/', $node, $type );
					$type = array_pop( $type );
					$items[ $type ] = array();
					
					$categories = array_pop( $categories );
					foreach( $categories as $category )
						$items[ $type ][ $category ] = array();
					
					$pointer = 0;
					
				} else {
					
					if( preg_match( '/\|-\s*!(?:\[\[)?([^\]\s]+)/', $node, $match ) ) {
					
						array_push( $categories, $match[ 1 ] );
						$items[ $type ][ $match[ 1 ] ] = array();
					
					}
					
					$pointer++;
					
				}
				
			else if( $node->getName() == 'template' && isset( $node->title, $node->part, $node->part->value ) && $node->title == 'iio' )
				array_push( $items[ $type ][ $categories[ $pointer ] ], toVal( $node->part->value ) );
		
		return $items;
		
	}
	
	$result = array();
	$result[ 'success' ] = true;
	$result[ 'query' ] = array();
	
	if( isset( $_GET[ 'champions' ] ) ) {
		
		$result[ 'query' ][ 'champions' ] = array();
		
		foreach( ( $_GET[ 'champions' ] == '' ? array() : explode( '|', $_GET[ 'champions' ] ) ) as $champion )
			array_push( $result[ 'query' ][ 'champions' ], getChampion( $champion ) );
		
	}
	
	if( isset( $_GET[ 'items' ] ) ) {
		
		$result[ 'query' ][ 'items' ] = array();
		
		foreach( ( $_GET[ 'items' ] == '' ? array() : explode( '|', $_GET[ 'items' ] ) ) as $item )
			array_push( $result[ 'query' ][ 'items' ], getItem( $item ) );
		
	}
	
	if( isset( $_GET[ 'championList' ] ) )
		$result[ 'query' ][ 'championList' ] = getChampionList();
	
	if( isset( $_GET[ 'itemList' ] ) )
		$result[ 'query' ][ 'itemList' ] = getItemList();
	
	if( isset( $_GET[ 'itemListByType' ] ) )
		$result[ 'query' ][ 'itemListByType' ] = getItemListByType();
	
	echo json_encode( $result );
	
?>