<?php
	require_once('../php/include.php');
	
	// Get the POST
	$name = $_POST['name'];
	$email = $_POST['email'];
	$message = $_POST['message'];
	
	// Do some validation
	if((strlen($name)<=50) && (strlen($email)<=80) && (strlen($message)<=5000)) {
		$to='jonthebaptist2001@gmail.com';
		$subject='Email from '.$email;
		$body='Message from '.$name.' ('.$email.'):           '.$message;
		
		try {
			if (mail($to, $subject, $body)) {
			   $ret='Thankyou, your message has been sent.';
			} else {
			   $ret='error';
			}
		} catch(Exception $ex) {
			$ret='error';
		}
	} else {
		$ret='error';	
	}
	
	echo($ret);
?>