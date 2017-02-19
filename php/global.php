<?php			
	//Global variables
	//////////////////////////////////////////////////////////////////////////////////////	 			
	if($_SERVER['HTTP_HOST']=='localhost') {		
		$serverDir = 'johncollinson/';
		$production = false;
	} else {
		$serverDir = '';
		$production = true;
	}	

	//Global methods
	//////////////////////////////////////////////////////////////////////////////////////	
	function getIncludeContents($filename) {
		if (is_file($filename)) {
			ob_start();
			include $filename;
			$contents = ob_get_contents();
			ob_end_clean();
			return $contents;
		}
		return false;
	}	
	
	function getScripts($folder, $extension){
		$script = '';				
		foreach (ListFiles($folder) as $key=>$file){
			if(substr($file, (0-strlen($extension)))==$extension) {
				$script.=GetIncludeContents($file);
			}
		} 	
		return $script;	
	}
	
	function listFiles($dir) {
		if($dh = opendir($dir)) {
	
			$files = Array();
			$inner_files = Array();
	
			while($file = readdir($dh)) {
				if($file != "." && $file != ".." && $file[0] != '.') {
					if(is_dir($dir . "/" . $file)) {
						$inner_files = ListFiles($dir . "/" . $file);
						if(is_array($inner_files)) $files = array_merge($files, $inner_files); 
					} else {
						array_push($files, $dir . "/" . $file);
					}
				}
			}
	
			closedir($dh);
			return $files;
		}
	}
?>