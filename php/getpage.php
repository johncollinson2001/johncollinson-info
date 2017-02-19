<?php
	require_once('../php/include.php');
	
	// Get the page from POST
	$page = $_POST['page'];
	
	// Work out if the page is valid
	$valid = scandir('../pages');
	if(!in_array($page, $valid)) {
		echo('Oops, the page you\'ve requested cannot be found.');
		die();
	}
	
	// Get the page and echo it to the response
	$response = getIncludeContents('../pages/'. $page .'/page.php');
	echo($response);
?>