<?php
	$js = '';
	$js .= getIncludeContents('js/jquery/jquery-1.7.1.min.js');		
	$js .= getIncludeContents('js/jquery/jquery-ui-1.8.17.custom.min.js');		
	
	if ($production) {
		$js .= getIncludeContents('js/global.min.js');	
	} else {
		$js .= getIncludeContents('js/global.js');	
	}
	
	//$js .= getScripts('pages', '.js');	

	//output javascript
	header("Content-Type: text/javascript");
	echo trim($js);
?>	
