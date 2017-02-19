<?php
	$css = '';					
	$css .= getIncludeContents('css/global.css');
	//$css .= getScripts('pages', '.css');		
		
	//reduce the css string	
	$css = preg_replace( '#\s+#', ' ', $css );
	$css = preg_replace( '#/\*.*?\*/#s', '', $css );
	$css = str_replace( '; ', ';', $css );
	$css = str_replace( ': ', ':', $css );
	$css = str_replace( ' {', '{', $css );
	$css = str_replace( '{ ', '{', $css );
	$css = str_replace( ', ', ',', $css );
	$css = str_replace( '} ', '}', $css );
	$css = str_replace( ';}', '}', $css );

	//output content
	header("Content-Type: text/css");
	echo trim($css);
?>	