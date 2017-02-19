<?php		
	require_once('php/include.php');
	
	//load uri parts into an array
	$uri = array();
	foreach(explode('/', str_replace($serverDir, '', $_SERVER['REQUEST_URI'])) as $uriPart)
	{
		if($uriPart!='')
			array_push($uri, $uriPart);
	};

	// examine array and load page etc
	if(count($uri)==0) {
		//domain/	
		$page = 'aboutme';	
	} else if(count($uri)==1) {
		//domain/page/
		$page = $uri[0];		
		
		if($page=='css') {
			require_once('css/include.php');
			die();
		} else if($page=='js') {
			require_once('js/include.php');
			die();
		} else {
			//work out if the page is valid, if not 404 it
			$valid = scandir('pages');
			if(!in_array($page, $valid)) {	
				$page='404';				
			}
		}
	}

	//include the page
	require_once('pages/head.php');			
	require_once('pages/'. $page .'/page.php');	
	require_once('pages/foot.php');
?>